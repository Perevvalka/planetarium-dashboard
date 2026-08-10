// Стрики посещений Планетария.
// Строка — человек, точки — встречи, линия — непрерывность (стрик).
// Данные — из единой базы js/db.js (PlanetariumDB).

(() => {
  "use strict";

  const DB = window.PlanetariumDB;
  if (!DB) {
    console.error("PlanetariumDB не загружена. Подключите js/db.js перед attendance.js");
    return;
  }

  const personById = Object.fromEntries(DB.persons.map((p) => [p.id, p]));
  const projectById = Object.fromEntries(DB.projects.map((p) => [p.id, p]));

  const weekly = DB.meetings
    .filter((m) => m.type === "weekly")
    .slice()
    .sort((a, b) => a.date.localeCompare(b.date));

  const weeklyDates = new Set(weekly.map((m) => m.date));
  const streamDates = [
    ...new Set([
      ...DB.meetings.filter((m) => m.type === "stream").map((m) => m.date),
      ...DB.demos.map((d) => d.meeting),
    ]),
  ]
    .filter((date) => !weeklyDates.has(date))
    .sort((a, b) => a.localeCompare(b));

  const MEETINGS = weekly.map((m) => ({
    date: m.date,
    people: DB.attendance
      .filter((a) => a.meeting === m.date)
      .map((a) => personById[a.person]?.name)
      .filter(Boolean),
  }));

  const DEMO_STREAMS = streamDates.map((date) => ({
    date,
    demos: DB.demos
      .filter((d) => d.meeting === date)
      .map((d) => {
        const project = projectById[d.project];
        const presenter = personById[d.presenters[0]];
        return {
          person: presenter?.name || d.presenters[0],
          project: project?.title || d.project,
          url: project?.url || null,
        };
      }),
  })).filter((s) => s.demos.length);

  const dates = MEETINGS.map((m) => m.date);
  const n = dates.length;

  // Общая ось: встречи + демо-эфиры по хронологии
  const timeline = [
    ...MEETINGS.map((m, meetingIdx) => ({ date: m.date, type: "meeting", meetingIdx })),
    ...DEMO_STREAMS.map((s, streamIdx) => ({ date: s.date, type: "demo", streamIdx })),
  ].sort((a, b) => a.date.localeCompare(b.date));

  const tLen = timeline.length;
  const meetingSlot = MEETINGS.map((_, i) => timeline.findIndex((s) => s.type === "meeting" && s.meetingIdx === i));

  const attendance = new Map(); // name → Set of meeting indices
  MEETINGS.forEach((m, i) => {
    m.people.forEach((name) => {
      if (!attendance.has(name)) attendance.set(name, new Set());
      attendance.get(name).add(i);
    });
  });

  // name → демо на эфирах
  const demosByPerson = new Map();
  DEMO_STREAMS.forEach((stream, streamIdx) => {
    const slot = timeline.findIndex((s) => s.type === "demo" && s.streamIdx === streamIdx);
    stream.demos.forEach((d) => {
      const name = d.person;
      if (!demosByPerson.has(name)) demosByPerson.set(name, []);
      demosByPerson.get(name).push({ ...d, person: name, date: stream.date, slot });
      if (!attendance.has(name)) attendance.set(name, new Set());
    });
  });
  // Стрик = подряд идущие встречи из списка (не календарные недели, не эфиры)
  function streaksOf(indices) {
    const sorted = [...indices].sort((a, b) => a - b);
    const streaks = [];
    if (!sorted.length) return streaks;
    let start = sorted[0];
    let prev = sorted[0];
    for (let k = 1; k < sorted.length; k++) {
      if (sorted[k] === prev + 1) {
        prev = sorted[k];
      } else {
        streaks.push({ start, end: prev, len: prev - start + 1 });
        start = sorted[k];
        prev = sorted[k];
      }
    }
    streaks.push({ start, end: prev, len: prev - start + 1 });
    return streaks;
  }

  const rows = [...attendance.entries()]
    .map(([name, set]) => {
      const streaks = streaksOf(set);
      const longest = streaks.reduce((m, s) => Math.max(m, s.len), 0);
      const last = set.size ? [...set].sort((a, b) => a - b).at(-1) : -1;
      const current =
        last === n - 1 ? streaks.find((s) => s.end === n - 1)?.len || 0 : 0;
      return {
        name,
        set,
        streaks,
        longest,
        current,
        total: set.size,
        demos: demosByPerson.get(name) || [],
      };
    })
    .sort((a, b) => b.longest - a.longest || b.total - a.total || a.name.localeCompare(b.name, "ru"));

  const MONTHS_SHORT = {
    "2025-08": "авг",
    "2025-09": "сен",
    "2025-10": "окт",
    "2025-11": "ноя",
    "2025-12": "дек",
    "2026-01": "янв",
    "2026-02": "фев",
    "2026-03": "мар",
    "2026-04": "апр",
    "2026-05": "май",
    "2026-06": "июн",
    "2026-07": "июл",
  };
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

  const fmtDate = (iso) => {
    const d = +iso.slice(8, 10);
    const m = +iso.slice(5, 7);
    const y = iso.slice(2, 4);
    return `${d} ${MONTHS_GEN[m - 1]} ’${y}`;
  };

  const escTip = (s) => String(s).replace(/&/g, "&amp;").replace(/"/g, "&quot;");
  const escHtml = (s) =>
    String(s)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");

  // Название = URL (как stopfires.org), а не отдельный заголовок
  const projectIsUrlLabel = (project, url) => {
    if (!url) return false;
    const strip = (s) => s.replace(/^https?:\/\//i, "").replace(/\/$/, "");
    return strip(project) === strip(url) || strip(url) === project;
  };

  const demoPopupHtml = (d) => {
    const meta = `${escHtml(d.person)} · демо-эфир ${fmtDate(d.date)}`;
    if (!d.url) {
      return `<b>${escHtml(d.project)}</b><br>${meta}<br>ссылки нет`;
    }
    if (projectIsUrlLabel(d.project, d.url)) {
      return `<a href="${escTip(d.url)}" target="_blank" rel="noopener">${escHtml(d.url)}</a><br>${meta}`;
    }
    return (
      `<b><a href="${escTip(d.url)}" target="_blank" rel="noopener">${escHtml(d.project)}</a></b><br>${meta}`
    );
  };

  // Равномерные слоты по общей оси
  const pct = (slot) => ((slot + 0.5) / tLen) * 100;
  const spanMeetings = (m0, m1) => {
    const left = pct(meetingSlot[m0]);
    const right = pct(meetingSlot[m1]);
    return { left, width: right - left };
  };

  const tip = document.createElement("div");
  tip.className = "plviz-tip";
  document.body.appendChild(tip);

  const placeTip = (clientX, clientY) => {
    const pad = 14;
    const r = tip.getBoundingClientRect();
    let x = clientX + pad;
    let y = clientY + pad;
    if (x + r.width > innerWidth - 8) x = clientX - r.width - pad;
    if (y + r.height > innerHeight - 8) y = clientY - r.height - pad;
    tip.style.left = Math.max(8, x) + "px";
    tip.style.top = Math.max(8, y) + "px";
  };

  const hideTip = () => {
    tip.classList.remove("visible", "pinned");
    tip.innerHTML = "";
  };

  const showHoverTip = (html, clientX, clientY) => {
    if (tip.classList.contains("pinned")) return;
    tip.classList.remove("pinned");
    tip.innerHTML = html;
    tip.classList.add("visible");
    placeTip(clientX, clientY);
  };

  const showPinnedTip = (html, clientX, clientY) => {
    tip.innerHTML = html;
    tip.classList.add("visible", "pinned");
    placeTip(clientX, clientY);
    // пересчитать после отрисовки (размер мог измениться)
    requestAnimationFrame(() => placeTip(clientX, clientY));
  };

  document.addEventListener("pointermove", (e) => {
    if (tip.classList.contains("pinned")) return;
    if (e.target.closest(".plviz-streak-demo")) {
      tip.classList.remove("visible");
      return;
    }
    const t = e.target.closest("[data-tip]");
    if (!t) {
      tip.classList.remove("visible");
      return;
    }
    showHoverTip(t.dataset.tip, e.clientX, e.clientY);
  });

  document.addEventListener("click", (e) => {
    if (e.target.closest(".plviz-tip.pinned")) return;
    if (e.target.closest(".plviz-streak-demo")) return;
    if (tip.classList.contains("pinned")) hideTip();
  });

  function streakClass(len) {
    if (len >= 10) return "s5";
    if (len >= 7) return "s4";
    if (len >= 4) return "s3";
    if (len >= 2) return "s2";
    return "s1";
  }

  function render() {
    const el = document.getElementById("plviz-streak");
    if (!el) return;

    const monthMarks = [];
    let prevKey = "";
    timeline.forEach((slot, i) => {
      const key = slot.date.slice(0, 7);
      if (key !== prevKey) {
        monthMarks.push({ i, label: MONTHS_SHORT[key] || key });
        prevKey = key;
      }
    });

    const bandW = ((100 / tLen) * 0.55).toFixed(2);
    const demoBands = timeline
      .map((slot, i) =>
        slot.type === "demo"
          ? `<div class="plviz-streak-band" style="left:${pct(i)}%;width:${bandW}%"></div>`
          : ""
      )
      .join("");

    const vlines = monthMarks
      .map((m) => {
        const nudge = m.label === "авг" ? "translateX(calc(-50% - 0.55em))" : "translateX(-50%)";
        return (
          `<div class="plviz-streak-vline" style="left:${pct(m.i)}%"></div>` +
          `<div class="plviz-streak-month" style="left:${pct(m.i)}%;transform:${nudge}">${m.label}</div>`
        );
      })
      .join("");

    let popupId = 0;
    const popups = new Map();
    const rowsHTML = rows
      .map((r, idx) => {
        const lines = r.streaks
          .filter((s) => s.len >= 2)
          .map((s) => {
            const { left, width } = spanMeetings(s.start, s.end);
            return (
              `<div class="plviz-streak-line ${streakClass(s.len)}" ` +
              `style="left:${left.toFixed(2)}%;width:${width.toFixed(2)}%" ` +
              `data-tip="<b>${escTip(r.name)}</b><br>стрик ${s.len} · ${fmtDate(dates[s.start])} — ${fmtDate(dates[s.end])}"></div>`
            );
          })
          .join("");

        const dots = [...r.set]
          .map((i) => {
            const streak = r.streaks.find((s) => i >= s.start && i <= s.end);
            const cls = streakClass(streak?.len || 1);
            return (
              `<span class="plviz-streak-dot ${cls}" style="left:${pct(meetingSlot[i]).toFixed(2)}%" ` +
              `data-tip="<b>${escTip(r.name)}</b><br>${fmtDate(dates[i])}"></span>`
            );
          })
          .join("");

        const demoDots = r.demos
          .map((d) => {
            const id = String(++popupId);
            popups.set(id, demoPopupHtml(d));
            return (
              `<span class="plviz-streak-dot plviz-streak-demo" style="left:${pct(d.slot).toFixed(2)}%" ` +
              `data-popup-id="${id}"></span>`
            );
          })
          .join("");

        return (
          `<div class="plviz-streak-row" data-idx="${idx}">` +
          `<div class="plviz-streak-name">${r.name}</div>` +
          `<div class="plviz-streak-track">${lines}${dots}${demoDots}</div>` +
          `<div class="plviz-streak-stat">${r.longest}</div>` +
          `</div>`
        );
      })
      .join("");

    el.innerHTML =
      `<div class="plviz-streak-chart">` +
      `<div class="plviz-streak-stat-h">макс</div>` +
      rowsHTML +
      `<div class="plviz-streak-axis">${demoBands}${vlines}</div>` +
      `</div>` +
      `<div class="plviz-legend">` +
      `<span class="plviz-legend-item static"><i class="plviz-streak-swatch s1"></i>1</span>` +
      `<span class="plviz-legend-item static"><i class="plviz-streak-swatch s2"></i>2–3</span>` +
      `<span class="plviz-legend-item static"><i class="plviz-streak-swatch s3"></i>4–7</span>` +
      `<span class="plviz-legend-item static"><i class="plviz-streak-swatch s4"></i>7–10</span>` +
      `<span class="plviz-legend-item static"><i class="plviz-streak-swatch s5"></i>10+</span>` +
      `<span class="plviz-legend-item static"><i class="plviz-streak-swatch demo"></i>демо-эфир</span>` +
      `</div>` +
      `<p class="plviz-info" id="plviz-streak-info">Кликните по строке — визиты и стрики. Клик по фиолетовой точке — проект с эфира (ссылка кликабельна).</p>`;

    // клик по демо-точке — закреплённый попап со ссылкой
    el.querySelectorAll(".plviz-streak-demo").forEach((demo) => {
      demo.addEventListener("click", (e) => {
        e.preventDefault();
        e.stopPropagation();
        const id = demo.dataset.popupId;
        const html = popups.get(id);
        if (tip.classList.contains("pinned") && tip.dataset.anchor === id) {
          hideTip();
          return;
        }
        tip.dataset.anchor = id;
        showPinnedTip(html, e.clientX, e.clientY);
      });
    });

    const info = el.querySelector("#plviz-streak-info");
    el.querySelectorAll(".plviz-streak-row").forEach((row) => {
      row.addEventListener("click", () => {
        const on = row.classList.contains("active");
        el.querySelectorAll(".plviz-streak-row").forEach((x) => x.classList.remove("active"));
        if (on) {
          info.textContent =
            "Кликните по строке — визиты и стрики. Клик по фиолетовой точке — проект с эфира (ссылка кликабельна).";
          return;
        }
        row.classList.add("active");
        const r = rows[+row.dataset.idx];
        const parts = r.streaks
          .filter((s) => s.len >= 2)
          .map((s) => `${s.len} (${fmtDate(dates[s.start])} — ${fmtDate(dates[s.end])})`);
        const streakText = parts.length
          ? `стрики: ${parts.join("; ")}`
          : "стриков нет (только разовые визиты)";
        const cur =
          r.current > 0
            ? `текущий стрик: ${r.current}`
            : "текущий стрик: 0 (пропуск последней встречи)";
        const demosText = r.demos.length
          ? ` Демо-эфиры: ${r.demos.map((d) => d.project).join("; ")}.`
          : "";
        info.innerHTML =
          `<b>${r.name}</b> — ${r.total} из ${n} встреч; ` +
          `максимум подряд: ${r.longest}; ${cur}. ${streakText}.${demosText}`;
      });
    });
  }

  render();
})();
