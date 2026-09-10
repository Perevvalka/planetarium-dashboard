// Дашборд явки Планетария.
// Строка — человек, квадратик — встреча. Квадратики стык в стык, как в тетрадке.
// Был — голубой, показывал — зелёный, не был — пусто.
// Сверху столбики длительности: зелёные блоки — демо от длинного к короткому,
// голубой сверху — обсуждение. Ширина как у квадратика, 60 мин ≈ 4 клетки.
// Данные — из js/db.js, с декабря 2025.

(() => {
  "use strict";

  const DB = window.PlanetariumDB;
  if (!DB) {
    console.error("PlanetariumDB не загружена. Подключите js/db.js перед dashboard.js");
    return;
  }

  const CUTOFF = "2025-12-01";
  // 60 минут ≈ 4 квадратика в высоту; ширина столбика = квадратик.
  const BAR_GAP = 3;

  const MISSED = 0;
  const VISIT = 1;
  const DEMO = 2;

  const FORMATS = {
    1: "рассказывал",
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

  const rows = Object.keys(states)
    .map((id) => {
      const row = states[id];
      let visits = 0;
      row.forEach((v) => {
        if (v !== MISSED) visits++;
      });
      return {
        id,
        name: personById[id].name,
        row,
        visits,
        last: row[n - 1] !== MISSED,
      };
    })
    .sort((a, b) => {
      if (a.last !== b.last) return a.last ? -1 : 1;
      if (a.visits !== b.visits) return b.visits - a.visits;
      return a.name.localeCompare(b.name, "ru");
    });

  const totals = dates.map((_, i) => {
    let people = 0;
    let demos = 0;
    rows.forEach((r) => {
      const v = r.row[i];
      if (v === MISSED) return;
      people++;
      if (v === DEMO) demos++;
    });
    return { people, demos };
  });

  const summaryLayers = (i) => {
    let html = "";
    rows.forEach((r) => {
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
    rows.filter((r) => r.row[i] !== MISSED).map((r) => r.name)
  );

  const panelHtml = (title, entries, note) => {
    const rowsHtml = entries
      .filter(([, v]) => v != null && v !== "")
      .map(([k, v]) => `<dt>${esc(k)}</dt><dd>${v}</dd>`)
      .join("");
    return (
      `<p class="plviz-panel-title">${esc(title)}</p>` +
      `<dl class="plviz-dl">${rowsHtml}</dl>` +
      (note ? `<p class="plviz-panel-note">${note}</p>` : "")
    );
  };

  const defaultPanel = () =>
    panelHtml(
      "Все встречи",
      [
        ["период", `${fmtDate(dates[0])} — ${fmtDate(dates[n - 1])}`],
        ["встреч", String(n)],
        ["участников", String(rows.length)],
        ["демо", String(demosAt.reduce((s, list) => s + list.length, 0))],
      ],
      "Наведите на квадратик или столбик — здесь появятся детали."
    );

  const meetingPanel = (i) => {
    const t = totals[i];
    const b = barAt[i];
    const shown = demosAt[i];
    const meeting = DB.meetings.find((m) => m.date === dates[i]);
    const demoLineHtml = shown.length
      ? shown.map(demoLine).join("<br>")
      : "нет";
    return panelHtml(
      `Встреча №${i + 1}`,
      [
        ["дата", fmtDate(dates[i])],
        ["длительность", b.total ? `${b.total} мин` : ""],
        [
          "были",
          t.people
            ? `${t.people} ${plural(t.people, "человек", "человека", "человек")}: ${esc(peopleAt[i].join(", "))}`
            : "данных о явке нет",
        ],
        ["демо", t.demos ? `${t.demos}<br>${demoLineHtml}` : demoLineHtml],
        ["обсуждение", b.talk ? `${b.talk} мин` : ""],
      ],
      meeting?.generated
        ? "Длительность и демо до августа сгенерированы по образцу августа 2026."
        : undefined
    );
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

  const demoPanel = (d, i) => {
    const names = d.presenters
      .map((id) => personById[id] && personById[id].name)
      .filter(Boolean)
      .join(", ");
    return panelHtml("Демо", [
      ["встреча", `№${i + 1} · ${fmtDate(dates[i])}`],
      ...demoFields(d),
      ["показывал", esc(names)],
    ]);
  };

  const personPanel = (r, i) => {
    const own = demosAt[i].filter((d) => d.presenters.indexOf(r.id) >= 0);
    const extra = own.flatMap(demoFields);
    return panelHtml(r.name, [["встреча", `№${i + 1} · ${fmtDate(dates[i])}`], ...extra]);
  };

  const el = document.getElementById("plviz-dashboard");
  const box = document.getElementById("plviz-panel");
  if (!el) return;

  if (!n) {
    el.innerHTML = `<p>Встреч с декабря 2025 в базе пока нет.</p>`;
    return;
  }

  const monthSpans = [];
  dates.forEach((d, i) => {
    const key = d.slice(0, 7);
    const last = monthSpans[monthSpans.length - 1];
    if (last && last.key === key) last.len++;
    else monthSpans.push({ key, len: 1, start: i });
  });

  const barStack = (b) => {
    const parts = b.demos.length + (b.talk > 0 ? 1 : 0);
    const mins = b.demos.reduce((s, d) => s + d.minutes, 0) + b.talk;
    return { mins, gaps: Math.max(0, parts - 1) };
  };
  const tallest = barAt.reduce(
    (max, b) => {
      const s = barStack(b);
      return s.mins > max.mins ? s : max;
    },
    { mins: 0, gaps: 0 }
  );
  const minH = (minutes) => `calc(${minutes} * var(--cell) * 4 / 60)`;

  const barsHtml = barAt
    .map((b, i) => {
      const segs = b.demos.map(
        (d) =>
          `<span class="plviz-seg demo ids__hover-dot" data-i="${i}" data-demo="${esc(d.id)}" style="height:${minH(d.minutes)}"></span>`
      );
      if (b.talk > 0) {
        segs.push(
          `<span class="plviz-seg talk ids__hover-dot" data-i="${i}" style="height:${minH(b.talk)}"></span>`
        );
      }
      return (
        `<span class="plviz-bar" data-i="${i}" data-row="sum" style="grid-row:1;grid-column:${i + 1}">` +
        segs.join("") +
        `</span>`
      );
    })
    .join("");

  const monthsHtml = monthSpans
    .map((m) => {
      const label = MONTHS_SHORT[+m.key.slice(5, 7) - 1];
      const col = m.start + 1;
      return `<div class="plviz-month" style="grid-row:2;grid-column:${col} / ${col + m.len}">${label}</div>`;
    })
    .join("");

  const headHtml = dates
    .map(
      (d, i) =>
        `<span class="plviz-cell sum-cell ids__hover-dot" data-i="${i}" data-row="sum">${summaryLayers(i)}</span>`
    )
    .join("");

  const rowsHtml = rows
    .map((r) =>
      r.row
        .map((v, i) => {
          if (v === MISSED) return `<span class="plviz-cell"></span>`;
          if (v === VISIT)
            return `<span class="plviz-cell visit ids__hover-dot" data-i="${i}" data-row="${esc(r.id)}"></span>`;
          return `<span class="plviz-cell demo ids__hover-dot" data-i="${i}" data-row="${esc(r.id)}"></span>`;
        })
        .join("")
    )
    .join("");

  const namesHtml =
    `<div class="plviz-names">` +
    `<div class="plviz-name"></div>` +
    `<div class="plviz-name"></div>` +
    `<div class="plviz-name plviz-name-all">все</div>` +
    rows.map((r) => `<div class="plviz-name">${esc(r.name)}</div>`).join("") +
    `</div>`;

  el.innerHTML =
    `<div class="plviz-chart" style="--n:${n};--bar-mins:${tallest.mins};--bar-gap-count:${tallest.gaps};--bar-gap:${BAR_GAP}px">` +
    namesHtml +
    `<div class="plviz-grid">` +
    barsHtml +
    monthsHtml +
    `<div class="plviz-head" style="display:contents">${headHtml}</div>` +
    rowsHtml +
    `</div></div>` +
    `<div class="plviz-legend">` +
    `<span><i class="visit"></i>был / обсуждение</span>` +
    `<span><i class="demo"></i>показывал / демо</span>` +
    `</div>`;

  const rowById = Object.fromEntries(rows.map((r) => [r.id, r]));

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
        box.innerHTML = meetingPanel(i);
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

  const chart = el.querySelector(".plviz-chart");
  const board = el.closest(".plviz-board") || el;
  const fit = () => {
    if (!chart || !n) return;
    const w = board.clientWidth;
    if (!w) return;
    chart.style.setProperty("--cell", `${w / n}px`);
  };
  fit();
  if (typeof ResizeObserver !== "undefined") new ResizeObserver(fit).observe(board);
})();
