// Дашборд явки Планетария.
// Строка — человек, клетка — встреча. Клетки стык в стык; ширина — доля контейнера.
// Был — голубой, показывал — зелёный, не был — пусто.
// Сверху столбики длительности: зелёные блоки — демо от длинного к короткому,
// голубой сверху — обсуждение. Ширина как у клетки, 60 мин ≈ 4 строки.
// Строки: Σ 1.1ⁿ по визитам, каждая следующая встреча на 10% весомее.
// Данные — из js/db.js, с марта 2026.

(() => {
  "use strict";

  const DB = window.PlanetariumDB;
  if (!DB) {
    console.error("PlanetariumDB не загружена. Подключите js/db.js перед dashboard.js");
    return;
  }

  const CUTOFF = "2026-03-01";

  const MISSED = 0;
  const VISIT = 1;
  const DEMO = 2;

  const FORMATS = {
    1: "рассказ",
    2: "экран",
    3: "слайды",
    4: "ссылка",
  };

  const MONTHS_SHORT = ["янв", "фев", "мар", "апр", "май", "июн", "июл", "авг", "сен", "окт", "ноя", "дек"];
  const MONTHS_GEN = [
    "января", "февраля", "марта", "апреля", "мая", "июня",
    "июля", "августа", "сентября", "октября", "ноября", "декабря",
  ];

  const personById = Object.fromEntries(DB.persons.map((p) => [p.id, p]));
  const projectById = Object.fromEntries(DB.projects.map((p) => [p.id, p]));

  const dates = DB.meetings
    .filter((m) => m.type === "weekly" && m.date >= CUTOFF)
    .map((m) => m.date)
    .sort();
  const n = dates.length;
  const slotOf = {};
  dates.forEach((d, i) => (slotOf[d] = i));
  const meetingMin = Object.fromEntries(
    DB.meetings.map((m) => [m.date, m.minutes || 0])
  );

  const esc = (s) =>
    String(s)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");

  const formatOf = (d) => {
    const project = projectById[d.project];
    if (project && project.url) return 4;
    return d.format;
  };

  const demoLine = (d) => {
    const project = projectById[d.project];
    const title = project ? project.title : d.project;
    const parts = [esc(title)];
    const fmt = FORMATS[formatOf(d)];
    if (fmt) parts.push(fmt);
    if (d.minutes) parts.push(`${d.minutes} мин`);
    return parts.join(" · ");
  };

  const demosAt = dates.map(() => []);
  DB.demos.forEach((d) => {
    const slot = slotOf[d.meeting];
    if (slot === undefined) return;
    demosAt[slot].push(d);
  });

  const barAt = dates.map((date, i) => {
    const demos = demosAt[i]
      .filter((d) => d.minutes > 0)
      .slice()
      .sort((a, b) => b.minutes - a.minutes || a.id.localeCompare(b.id));
    const demoMin = demos.reduce((s, d) => s + d.minutes, 0);
    const total = meetingMin[date] || 0;
    const talk = Math.max(0, total - demoMin);
    return { total, demos, talk };
  });

  const states = {};
  const trackOf = (id) => {
    if (!states[id]) {
      states[id] = [];
      for (let i = 0; i < n; i++) states[id].push(MISSED);
    }
    return states[id];
  };

  DB.attendance.forEach((a) => {
    const slot = slotOf[a.meeting];
    if (slot === undefined || !personById[a.person]) return;
    const row = trackOf(a.person);
    if (row[slot] === MISSED) row[slot] = VISIT;
  });

  DB.demos.forEach((d) => {
    const slot = slotOf[d.meeting];
    if (slot === undefined) return;
    d.presenters.forEach((id) => {
      if (!personById[id]) return;
      trackOf(id)[slot] = DEMO;
    });
  });

  const people = Object.keys(states)
    .map((id) => ({
      id,
      name: personById[id].name,
      row: states[id],
    }));

  // Каждая следующая встреча на 10% весомее предыдущей.
  const score = (row) => {
    let s = 0;
    let w = 1;
    row.forEach((v) => {
      if (v !== MISSED) s += w;
      w *= 1.1;
    });
    return s;
  };

  people.sort((a, b) => {
    const d = score(b.row) - score(a.row);
    if (d) return d;
    return a.name.localeCompare(b.name, "ru");
  });

  const totals = dates.map((_, i) => {
    let peopleN = 0;
    let demos = 0;
    people.forEach((r) => {
      const v = r.row[i];
      if (v === MISSED) return;
      peopleN++;
      if (v === DEMO) demos++;
    });
    return { people: peopleN, demos };
  });

  const summaryLayers = (i) => {
    let html = "";
    people.forEach((r) => {
      const v = r.row[i];
      if (v === VISIT) html += `<i class="sum visit"></i>`;
      else if (v === DEMO) html += `<i class="sum demo"></i>`;
    });
    return html;
  };

  const plural = (k, one, few, many) => {
    if (k % 10 === 1 && k % 100 !== 11) return one;
    if (k % 10 >= 2 && k % 10 <= 4 && (k % 100 < 12 || k % 100 > 14)) return few;
    return many;
  };

  const fmtDate = (iso) =>
    `${+iso.slice(8, 10)}\u00a0${MONTHS_GEN[+iso.slice(5, 7) - 1]}\u00a0’${iso.slice(2, 4)}`;

  const peopleAt = dates.map((_, i) =>
    people
      .filter((r) => r.row[i] !== MISSED)
      .map((r) => r.name)
      .sort((a, b) => a.localeCompare(b, "ru"))
  );

  const cap = (s) => (s ? s.charAt(0).toUpperCase() + s.slice(1) : s);

  const panelHtml = (title, entries, note) => {
    const fields = entries
      .filter(([, v]) => v != null && v !== "")
      .map(([k, v]) => {
        const label = k
          ? `<div class="plviz-field-label">${esc(/^\d/.test(k) || k === "демо" ? k : cap(k))}</div>`
          : "";
        return `<div class="plviz-field">${label}<div class="plviz-field-value">${v}</div></div>`;
      })
      .join("");
    return (
      (title ? `<p class="plviz-panel-title">${esc(title)}</p>` : "") +
      fields +
      (note ? `<p class="plviz-panel-note">${note}</p>` : "")
    );
  };

  const defaultPanel = () =>
    panelHtml("Все встречи", [
      ["период", `${fmtDate(dates[0])} — ${fmtDate(dates[n - 1])}`],
      ["встреч", String(n)],
      ["участников", String(people.length)],
      ["демо", String(demosAt.reduce((s, list) => s + list.length, 0))],
    ]);

  const namesLines = (names) =>
    names
      .map((name, i) => esc(name) + (i < names.length - 1 ? "," : ""))
      .join("<br>");

  const meetingPanel = (i) => {
    const t = totals[i];
    const b = barAt[i];
    const shown = demosAt[i];
    const hasDemos = shown.length > 0;
    const demoValue = hasDemos
      ? shown.map(demoLine).join("<br>")
      : "Не фиксировались";
    const were = t.people
      ? `${t.people} ${plural(t.people, "человек", "человека", "человек")}:<br>${namesLines(peopleAt[i])}`
      : "данных о явке нет";
    const fields = [
      ["", b.total ? `${b.total} мин` : ""],
      ["", were],
      [hasDemos ? `${shown.length} демо` : "демо", demoValue],
    ];
    if (hasDemos) fields.push(["обсуждение", b.talk ? `${b.talk} мин` : ""]);
    return panelHtml(fmtDate(dates[i]), fields);
  };

  const demoFields = (d) => {
    const project = projectById[d.project];
    const title = project ? project.title : d.project;
    const fmt = FORMATS[formatOf(d)];
    return [
      ["проект", esc(title)],
      ["формат", fmt || ""],
      ["длительность", d.minutes ? `${d.minutes} мин` : ""],
    ];
  };

  const talkPanel = (i) =>
    panelHtml(fmtDate(dates[i]), [
      ["обсуждение", barAt[i].talk ? `${barAt[i].talk} мин` : ""],
    ]);

  const demoPanel = (d, i) => {
    const project = projectById[d.project];
    const title = project ? project.title : d.project;
    const names = d.presenters
      .map((id) => personById[id] && personById[id].name)
      .filter(Boolean);
    const head = [fmtDate(dates[i])];
    if (d.minutes) head.push(`${d.minutes} мин`);
    return panelHtml("Демо", [
      ["", head.join(" · ")],
      ["проект", esc(title)],
      ["", namesLines(names)],
      ["формат", FORMATS[formatOf(d)] || ""],
    ]);
  };

  const personPanel = (r, i) => {
    const own = demosAt[i].filter((d) => d.presenters.indexOf(r.id) >= 0);
    const extra = own.flatMap(demoFields);
    return panelHtml(r.name, [["", fmtDate(dates[i])], ...extra]);
  };

  const el = document.getElementById("plviz-dashboard");
  const box = document.getElementById("plviz-panel");
  if (!el) return;

  if (!n) {
    el.innerHTML = `<p>Встреч с марта 2026 в базе пока нет.</p>`;
    return;
  }

  const maxBarMins = Math.max(
    0,
    ...barAt.map((b) => b.demos.reduce((s, d) => s + d.minutes, 0) + b.talk)
  );
  const minH = (minutes) => `calc(${minutes} * var(--plviz-bar-row) * 4 / 60)`;

  const datesHtml = dates
    .map((d, i) => {
      const day = String(+d.slice(8, 10));
      const prev = dates[i - 1];
      const isNewMonth = !prev || prev.slice(0, 7) !== d.slice(0, 7);
      const month = isNewMonth
        ? `<span class="plviz-date-month">${MONTHS_SHORT[+d.slice(5, 7) - 1]}</span>`
        : "";
      const cls = isNewMonth ? "plviz-date has-month" : "plviz-date";
      return `<div class="${cls}">${day}${month}</div>`;
    })
    .join("");

  const barsHtml = barAt
    .map((b, i) => {
      const segs = b.demos.map(
        (d) =>
          `<span class="plviz-seg demo" data-i="${i}" data-demo="${esc(d.id)}" style="height:${minH(d.minutes)}"></span>`
      );
      if (b.talk > 0) {
        segs.push(
          `<span class="plviz-seg talk" data-i="${i}" style="height:${minH(b.talk)}"></span>`
        );
      }
      return (
        `<span class="plviz-bar" data-i="${i}" data-row="sum">` +
        segs.join("") +
        `</span>`
      );
    })
    .join("");

  const headHtml = dates
    .map(
      (d, i) =>
        `<span class="plviz-cell sum-cell" data-i="${i}" data-row="sum">${summaryLayers(i)}</span>`
    )
    .join("");

  const cellsHtml = (list) =>
    list
      .map((r) =>
        r.row
          .map((v, i) => {
            if (v === MISSED) return `<span class="plviz-cell"></span>`;
            if (v === VISIT)
              return `<span class="plviz-cell visit" data-i="${i}" data-row="${esc(r.id)}"></span>`;
            return `<span class="plviz-cell demo" data-i="${i}" data-row="${esc(r.id)}"></span>`;
          })
          .join("")
      )
      .join("");

  const namesHtml = (list) =>
    `<div class="plviz-names">` +
    list.map((r) => `<div class="plviz-name">${esc(r.name)}</div>`).join("") +
    `</div>`;

  el.innerHTML =
    `<div class="plviz-chart" style="--n:${n};--bar-mins:${maxBarMins}">` +
    `<div class="plviz-timeline">${datesHtml}</div>` +
    `<div class="plviz-bars">${barsHtml}</div>` +
    `<div class="plviz-summary">` +
    `<div class="plviz-name plviz-name-all">Все участники</div>` +
    `<div class="plviz-summary-grid">${headHtml}</div>` +
    `</div>` +
    `<div class="plviz-matrix">${namesHtml(people)}<div class="plviz-grid">${cellsHtml(people)}</div></div></div>` +
    `<div class="plviz-legend">` +
    `<span><i class="visit"></i>был / обсуждение</span>` +
    `<span><i class="demo"></i>показывал / демо</span>` +
    `</div>`;

  const rowById = Object.fromEntries(people.map((r) => [r.id, r]));

  const showDefault = () => {
    if (box) box.innerHTML = defaultPanel();
  };

  const shell = el.closest(".plviz-shell") || el;
  shell.addEventListener("pointerover", (e) => {
    if (!box) return;
    const seg = e.target.closest(".plviz-seg");
    if (seg && seg.dataset.i != null) {
      const i = +seg.dataset.i;
      if (seg.dataset.demo) {
        const d = barAt[i].demos.find((x) => x.id === seg.dataset.demo);
        box.innerHTML = d ? demoPanel(d, i) : meetingPanel(i);
      } else {
        box.innerHTML = talkPanel(i);
      }
      return;
    }
    const bar = e.target.closest(".plviz-bar");
    if (bar && bar.dataset.i != null) {
      box.innerHTML = meetingPanel(+bar.dataset.i);
      return;
    }
    const cell = e.target.closest(".plviz-cell");
    if (!cell || cell.dataset.i == null) return;
    const i = +cell.dataset.i;
    if (cell.dataset.row === "sum") box.innerHTML = meetingPanel(i);
    else box.innerHTML = personPanel(rowById[cell.dataset.row], i);
  });
  shell.addEventListener("pointerleave", showDefault);
  showDefault();
})();
