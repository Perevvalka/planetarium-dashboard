// Данные для дашборда посещаемости Планетария.
// Чистые функции без DOM — копия модели с сайта, чтобы локальный дашборд
// показывал ровно то же, что увидит сайт после загрузки JSON.
// Правки нужно переносить в оба места: здесь и в dashboard-data.js на сайте.
// Валидации нет: локально база приходит готовым объектом из js/db.js.

(() => {
  "use strict";

  const CUTOFF = "2026-03-01";

  /** Состояния ячейки «участник × встреча» */
  const MISSED = 0;
  const VISIT = 1;
  const DEMO = 2;
  /** Показывал демо, но не выбранного формата */
  const DEMO_OTHER = 3;

  /** Коды формата демо в базе */
  const FORMATS = {
    1: "На словах",
    2: "Шер экрана",
    3: "Слайды",
    4: "Ссылка на работающую штуку",
  };

  /** Подписи форматов для переключателя на дашборде (слайды не показываем) */
  const FORMAT_FILTER = [
    [1, "на словах"],
    [2, "с экрана"],
    [4, "по ссылке"],
    [0, "любое"],
  ];

  const MONTHS_SHORT = ["янв", "фев", "мар", "апр", "май", "июн", "июл", "авг", "сен", "окт", "ноя", "дек"];
  const MONTHS_GEN = [
    "января",
    "февраля",
    "марта",
    "апреля",
    "мая",
    "июня",
    "июля",
    "августа",
    "сентября",
    "октября",
    "ноября",
    "декабря",
  ];

  const plural = (k, one, few, many) => {
    if (k % 10 === 1 && k % 100 !== 11) return one;
    if (k % 10 >= 2 && k % 10 <= 4 && (k % 100 < 12 || k % 100 > 14)) return few;
    return many;
  };

  // «7 марта» из ISO-даты. Год дописывается только у прошлых лет: «7 марта 2026».
  const fmtDate = (iso, currentYear = new Date().getFullYear()) => {
    const day = +iso.slice(8, 10);
    const year = +iso.slice(0, 4);
    const month = MONTHS_GEN[+iso.slice(5, 7) - 1];
    return year < currentYear ? `${day}\u00a0${month}\u00a0${year}` : `${day}\u00a0${month}`;
  };

  // Вес встречи: каждая следующая в 1.1 раза весомее предыдущей.
  const score = (row) => {
    let sum = 0;
    let weight = 1;
    for (const state of row) {
      if (state !== MISSED) sum += weight;
      weight *= 1.1;
    }
    return sum;
  };

  /** Есть ли в базе вообще признак активной подписки */
  const hasActiveFlags = (db) => db.persons.some((p) => p.active !== undefined);

  const buildDashboard = (db, filters = {}) => {
    const activeOnly = Boolean(filters.activeOnly) && hasActiveFlags(db);
    const persons = activeOnly ? db.persons.filter((p) => p.active) : db.persons;
    const personById = Object.fromEntries(persons.map((p) => [p.id, p]));
    const projectById = Object.fromEntries((db.projects || []).map((p) => [p.id, p]));
    const attendance = db.attendance || {};
    const formatCode = (d) => (projectById[d.project]?.url ? 4 : d.format);
    const matches = (d) => !filters.format || formatCode(d) === filters.format;
    const demos = db.demos.filter((d) => d.presenters.some((id) => personById[id]));

    const dates = db.meetings
      .filter((m) => m.type === "weekly" && m.date >= CUTOFF && attendance[m.date]?.length)
      .map((m) => m.date)
      .sort();
    const n = dates.length;
    const slotOf = Object.fromEntries(dates.map((d, i) => [d, i]));
    const minutesOf = Object.fromEntries(db.meetings.map((m) => [m.date, m.minutes || 0]));

    const demosAt = dates.map(() => []);
    for (const demo of demos) {
      const slot = slotOf[demo.meeting];
      if (slot !== undefined) demosAt[slot].push(demo);
    }

    const rows = {};
    const rowOf = (id) => (rows[id] ??= new Array(n).fill(MISSED));

    for (const [date, ids] of Object.entries(attendance)) {
      const slot = slotOf[date];
      if (slot === undefined) continue;
      for (const id of ids) {
        if (!personById[id]) continue;
        const row = rowOf(id);
        if (row[slot] === MISSED) row[slot] = VISIT;
      }
    }
    demosAt.forEach((demos, slot) => {
      for (const demo of demos) {
        const state = matches(demo) ? DEMO : DEMO_OTHER;
        for (const id of demo.presenters) {
          if (!personById[id]) continue;
          const row = rowOf(id);
          // Выбранный формат важнее: если у человека несколько демо, зелёное побеждает
          if (row[slot] !== DEMO) row[slot] = state;
        }
      }
    });

    const people = Object.entries(rows).map(([id, row]) => ({ id, name: personById[id].name, row }));
    people.sort((a, b) => score(b.row) - score(a.row) || a.name.localeCompare(b.name, "ru"));

    const peopleAt = dates.map((_, i) => people.filter((p) => p.row[i] !== MISSED));

    let firstDemo = null;

    const demoStart =
      dates.find((date) => db.demos.some((d) => d.meeting === date && (d.minutes ?? 0) > 0)) ?? null;

    const meetings = dates.map((date, i) => {
      const demos = demosAt[i];
      const bars = demos
        .filter((d) => (d.minutes ?? 0) > 0)
        .sort((a, b) => (b.minutes ?? 0) - (a.minutes ?? 0) || a.id.localeCompare(b.id));
      const demoMinutes = bars.reduce((s, d) => s + (d.minutes ?? 0), 0);
      if (demoMinutes > 0 && !firstDemo) firstDemo = date;
      const minutes = minutesOf[date];
      const talk = Math.max(0, minutes - demoMinutes);
      const prev = dates[i - 1];

      return {
        date,
        day: String(+date.slice(8, 10)),
        month: !prev || prev.slice(0, 7) !== date.slice(0, 7) ? MONTHS_SHORT[+date.slice(5, 7) - 1] : null,
        minutes,
        demos,
        bars,
        demoMinutes,
        talk,
        people: peopleAt[i].length,
      };
    });

    const maxMinutes = Math.max(
      0,
      ...meetings.map((m) => m.bars.reduce((s, d) => s + (d.minutes ?? 0), 0) + m.talk)
    );

    return {
      n,
      meetings,
      people,
      personById: Object.fromEntries(people.map((p) => [p.id, p])),
      projectById,
      namesAt: peopleAt.map((list) => list.map((p) => p.name).sort((a, b) => a.localeCompare(b, "ru"))),
      maxMinutes,
      demoTotal: demosAt.reduce((s, list) => s + list.length, 0),
      firstDemo,
      demoStart,
    };
  };

  // ---------------------------------------------------------------
  // Панель сбоку
  // ---------------------------------------------------------------

  const mins = (m) => (m ? `${m} мин` : "");

  const compact = (rows) => rows.filter((r) => r.head || r.lines.some(Boolean));

  const namesLines = (names) => names.map((name, i) => (i < names.length - 1 ? `${name},` : name));

  // Список демо: заголовок «N демо», дальше каждое демо отдельной строкой с малым отступом.
  const demoRows = (lines, empty) => {
    if (!lines.length) return empty ? [{ label: "Демо", lines: [empty] }] : [];
    return [
      { label: `${lines.length} демо`, lines: [], head: true },
      ...lines.map((line) => ({ sub: true, lines: [line] })),
    ];
  };

  // Код формата демо: проект со ссылкой — всегда «ссылка на работающую штуку».
  const demoFormatCode = (m, demo) => (m.projectById[demo.project]?.url ? 4 : demo.format);

  const demoFormat = (m, demo) => {
    const code = demoFormatCode(m, demo);
    return code ? FORMATS[code] || "" : "";
  };

  const demoTitle = (m, demo) => m.projectById[demo.project]?.title || demo.project;

  const allMeetingsPanel = (m) => {
    const { meetings, n } = m;
    return {
      title: "Все встречи",
      rows: compact([
        { label: "Период", lines: n ? [`${fmtDate(meetings[0].date)} —`, fmtDate(meetings[n - 1].date)] : [] },
        { label: "Встреч", lines: [String(n)] },
        { label: "Участников", lines: [String(m.people.length)] },
        { label: "Демо", lines: [String(m.demoTotal)] },
      ]),
    };
  };

  const meetingPanel = (m, i) => {
    const meeting = m.meetings[i];
    const names = m.namesAt[i];
    const demos = meeting.demos;
    const rows = [
      { lines: [`${meeting.people} ${plural(meeting.people, "человек", "человека", "человек")}:`] },
      { sub: true, lines: namesLines(names) },
      ...demoRows(
        demos.map((d) => demoTitle(m, d)),
        "Не фиксировались"
      ),
      { label: "Продолжительность", lines: [mins(meeting.minutes)] },
    ];
    return { title: fmtDate(meeting.date), rows: compact(rows) };
  };

  const demoPanel = (m, i, demoId) => {
    const meeting = m.meetings[i];
    const demo = meeting.demos.find((d) => d.id === demoId);
    if (!demo) return meetingPanel(m, i);
    const presenters = demo.presenters.map((id) => m.personById[id]?.name).filter(Boolean);
    return {
      title: "Демо",
      rows: compact([
        { lines: namesLines(presenters) },
        { label: "Проект", lines: [demoTitle(m, demo)] },
        { label: "Формат", lines: [demoFormat(m, demo)] },
        { label: "Дата", lines: [fmtDate(meeting.date)] },
        { label: "Продолжительность", lines: [mins(demo.minutes)] },
      ]),
    };
  };

  // Весь человек: на каких встречах был, какие демо показывал. Панель приглушена,
  // подсвечивается дата встречи под курсором и его демо на ней (если есть).
  const personSummaryPanel = (m, personId, i) => {
    const person = m.personById[personId];
    if (!person) return allMeetingsPanel(m);
    const hovered = i === undefined ? null : m.meetings[i];
    const visited = m.meetings.filter((_, k) => person.row[k] !== MISSED);
    const own = m.meetings.flatMap((meeting) =>
      meeting.demos.filter((d) => d.presenters.includes(personId)).map((d) => ({ meeting, d }))
    );
    const hotDate = visited.findIndex((meeting) => meeting === hovered);
    const rows = demoRows(own.map(({ d }) => demoTitle(m, d)));
    own.forEach(({ meeting }, j) => {
      // rows[0] — заголовок «N демо»
      if (meeting === hovered) rows[j + 1].hot = [0];
    });
    return {
      title: person.name,
      dimmed: true,
      rows: compact([
        { lines: [`${visited.length} ${plural(visited.length, "встреча", "встречи", "встреч")}:`] },
        {
          sub: true,
          lines: visited.map((meeting, j) => fmtDate(meeting.date) + (j < visited.length - 1 ? "," : "")),
          hot: hotDate >= 0 ? [hotDate] : [],
        },
        ...rows,
      ]),
    };
  };

  const panelFor = (m, target) => {
    switch (target.kind) {
      case "meeting":
        return meetingPanel(m, target.i);
      case "talk":
        return meetingPanel(m, target.i);
      case "demo":
        return demoPanel(m, target.i, target.demoId);
      case "person":
        return personSummaryPanel(m, target.personId, target.i);
      case "personAll":
        return personSummaryPanel(m, target.personId);
      default:
        return allMeetingsPanel(m);
    }
  };

  const api = {
    CUTOFF,
    MISSED,
    VISIT,
    DEMO,
    DEMO_OTHER,
    FORMATS,
    FORMAT_FILTER,
    plural,
    fmtDate,
    score,
    hasActiveFlags,
    buildDashboard,
    demoFormatCode,
    allMeetingsPanel,
    meetingPanel,
    demoPanel,
    personSummaryPanel,
    panelFor,
  };

  if (typeof window !== "undefined") window.PlanetariumDashboardData = api;
  if (typeof module !== "undefined" && module.exports) module.exports = api;
})();
