// Дашборд явки Планетария.
// Строка — человек, квадратик — встреча. Квадратики стык в стык, как в тетрадке.
// Был — голубой, показывал — зелёный, не был — пусто.
// Данные — из js/db.js, с декабря 2025.

(() => {
  "use strict";

  const DB = window.PlanetariumDB;
  if (!DB) {
    console.error("PlanetariumDB не загружена. Подключите js/db.js перед dashboard.js");
    return;
  }

  const CUTOFF = "2025-12-01";
  const CELL = 44;
  const NAME = "18em";

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
    `${+iso.slice(8, 10)} ${MONTHS_GEN[+iso.slice(5, 7) - 1]} ’${iso.slice(2, 4)}`;

  const meetingTip = (i) => {
    const t = totals[i];
    const shown = demosAt[i];
    const who =
      `${t.people} ${plural(t.people, "человек", "человека", "человек")}` +
      (t.demos ? `, ${t.demos} с демо` : "");
    if (!shown.length) return `${fmtDate(dates[i])}<br>${who}`;
    return `${fmtDate(dates[i])}<br>${who}<br>` + shown.map(demoLine).join("<br>");
  };

  const personTip = (r, i) => {
    let body = `<b>${esc(r.name)}</b><br>${fmtDate(dates[i])}`;
    const own = demosAt[i].filter((d) => d.presenters.indexOf(r.id) >= 0);
    if (own.length) body += `<br>` + own.map(demoLine).join("<br>");
    return body;
  };

  const tip = document.createElement("div");
  tip.className = "plviz-tip";
  document.body.appendChild(tip);

  document.addEventListener("pointermove", (e) => {
    const t = e.target.closest ? e.target.closest("[data-tip]") : null;
    if (!t) {
      tip.className = "plviz-tip";
      return;
    }
    tip.innerHTML = t.getAttribute("data-tip");
    tip.className = "plviz-tip visible";
    const box = tip.getBoundingClientRect();
    let x = e.clientX + 14;
    let y = e.clientY + 14;
    if (x + box.width > window.innerWidth - 8) x = e.clientX - box.width - 14;
    if (y + box.height > window.innerHeight - 8) y = e.clientY - box.height - 14;
    tip.style.left = Math.max(8, x) + "px";
    tip.style.top = Math.max(8, y) + "px";
  });

  const el = document.getElementById("plviz-dashboard");
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

  const monthsHtml =
    `<div class="plviz-name plviz-corner" style="grid-row:1;grid-column:1"></div>` +
    monthSpans
      .map((m) => {
        const label = MONTHS_SHORT[+m.key.slice(5, 7) - 1];
        const col = m.start + 2;
        return (
          `<div class="plviz-month" style="grid-row:1;grid-column:${col} / ${col + m.len}">${label}</div>`
        );
      })
      .join("");

  const headHtml =
    `<div class="plviz-name">все</div>` +
    dates
      .map(
        (d, i) =>
          `<span class="plviz-cell sum-cell" data-tip="${meetingTip(i)}">${summaryLayers(i)}</span>`
      )
      .join("");

  const rowsHtml = rows
    .map((r) => {
      const cells = r.row
        .map((v, i) => {
          if (v === MISSED) return `<span class="plviz-cell"></span>`;
          const kind = v === DEMO ? "demo" : "visit";
          return `<span class="plviz-cell ${kind}" data-tip="${personTip(r, i)}"></span>`;
        })
        .join("");
      return `<div class="plviz-name">${esc(r.name)}</div>${cells}`;
    })
    .join("");

  el.innerHTML =
    `<div class="plviz-chart" style="--cell:${CELL}px;grid-template-columns:${NAME} repeat(${n}, ${CELL}px)">` +
    monthsHtml +
    `<div class="plviz-head" style="display:contents">${headHtml}</div>` +
    rowsHtml +
    `</div>` +
    `<div class="plviz-legend">` +
    `<span><i class="visit"></i>был</span>` +
    `<span><i class="demo"></i>показывал</span>` +
    `</div>`;
})();
