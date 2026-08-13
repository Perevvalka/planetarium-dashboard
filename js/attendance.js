// Стрики посещений Планетария.
// Строка — человек, точки — встречи, линия — непрерывность (стрик).
// Сверху строка «все» — суммарная посещаемость каждой недели.
// Данные — из единой базы js/db.js (PlanetariumDB), показываем с февраля 2026.

(() => {
  "use strict";

  const DB = window.PlanetariumDB;
  if (!DB) {
    console.error("PlanetariumDB не загружена. Подключите js/db.js перед attendance.js");
    return;
  }

  // Отсечка: всё, что раньше февраля 2026, в визуализацию не попадает
  const CUTOFF = "2026-02-01";

  const personById = Object.fromEntries(DB.persons.map((p) => [p.id, p]));
  const projectById = Object.fromEntries(DB.projects.map((p) => [p.id, p]));

  const weekly = DB.meetings
    .filter((m) => m.type === "weekly" && m.date >= CUTOFF)
    .slice()
    .sort((a, b) => a.date.localeCompare(b.date));

  const weeklyDates = new Set(weekly.map((m) => m.date));
  const streamDates = [
    ...new Set([
      ...DB.meetings.filter((m) => m.type === "stream").map((m) => m.date),
      ...DB.demos.map((d) => d.meeting),
    ]),
  ]
    .filter((date) => date >= CUTOFF && !weeklyDates.has(date))
    .sort((a, b) => a.localeCompare(b));

  const MEETINGS = weekly.map((m) => ({
    date: m.date,
    people: [
      ...new Set(
        DB.attendance
          .filter((a) => a.meeting === m.date)
          .map((a) => personById[a.person]?.name)
          .filter(Boolean)
      ),
    ],
  }));

  const DEMO_STREAMS = streamDates
    .map((date) => ({
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
    }))
    .filter((s) => s.demos.length);

  const dates = MEETINGS.map((m) => m.date);
  const n = dates.length;
  const counts = MEETINGS.map((m) => m.people.length);

  // Заглушка посещаемости демо-эфиров: вокруг среднего по weekly, ±3.
  // Стабильный «рандом» от даты, чтобы не прыгало при перезагрузке.
  const avgWeekly =
    counts.length ? Math.round(counts.reduce((s, c) => s + c, 0) / counts.length) : 10;
  const stubFromDate = (iso) => {
    let h = 0;
    for (let i = 0; i < iso.length; i++) h = (h * 31 + iso.charCodeAt(i)) >>> 0;
    return Math.max(3, avgWeekly - 3 + (h % 7));
  };
  const demoCounts = DEMO_STREAMS.map((s) => stubFromDate(s.date));

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
    stream.demos.forEach((d) => {
      const name = d.person;
      if (!demosByPerson.has(name)) demosByPerson.set(name, []);
      demosByPerson.get(name).push({ ...d, date: stream.date, streamIdx });
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

  // Хронологическая сортировка «свежести»: посещения читаем как двоичное число,
  // где самая свежая встреча — старший разряд. Кто был на последней встрече,
  // тот выше; при равенстве решает предыдущая встреча, и так далее.
  // В сумме получается градиент: правый верхний угол — ходят сейчас,
  // левый нижний — ходили раньше.
  function cmpRecency(a, b) {
    for (let i = n - 1; i >= 0; i--) {
      const av = a.set.has(i);
      const bv = b.set.has(i);
      if (av !== bv) return av ? -1 : 1;
    }
    return a.name.localeCompare(b.name, "ru");
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
    .sort(cmpRecency);

  const MONTHS_SHORT = {
    "2026-01": "янв",
    "2026-02": "фев",
    "2026-03": "мар",
    "2026-04": "апр",
    "2026-05": "май",
    "2026-06": "июн",
    "2026-07": "июл",
    "2026-08": "авг",
    "2026-09": "сен",
    "2026-10": "окт",
    "2026-11": "ноя",
    "2026-12": "дек",
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

  const plural = (k) => {
    if (k % 10 === 1 && k % 100 !== 11) return "человек";
    if (k % 10 >= 2 && k % 10 <= 4 && (k % 100 < 12 || k % 100 > 14)) return "человека";
    return "человек";
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

  // Недельная арифметика для календарного режима (неделя начинается с понедельника)
  const weekStart = (iso) => {
    const d = new Date(iso + "T00:00:00Z");
    const day = (d.getUTCDay() + 6) % 7;
    d.setUTCDate(d.getUTCDate() - day);
    return d.toISOString().slice(0, 10);
  };
  const addDays = (iso, k) => {
    const d = new Date(iso + "T00:00:00Z");
    d.setUTCDate(d.getUTCDate() + k);
    return d.toISOString().slice(0, 10);
  };

  // Две версии оси X:
  //  ordinal  — слот на каждую состоявшуюся встречу/эфир (порядковый номер четверга)
  //  calendar — слот на каждую календарную неделю, пропущенные недели пустые
  function buildAxis(mode) {
    if (mode === "ordinal") {
      const timeline = [
        ...MEETINGS.map((m, i) => ({ date: m.date, kind: "meeting", i })),
        ...DEMO_STREAMS.map((s, j) => ({ date: s.date, kind: "stream", j })),
      ].sort((a, b) => a.date.localeCompare(b.date));
      const meetingSlot = new Array(n);
      const streamSlot = new Array(DEMO_STREAMS.length);
      timeline.forEach((s, idx) => {
        if (s.kind === "meeting") meetingSlot[s.i] = idx;
        else streamSlot[s.j] = idx;
      });
      return {
        L: timeline.length,
        meetingSlot,
        streamSlot,
        slotMonths: timeline.map((s) => s.date.slice(0, 7)),
      };
    }
    const all = [...dates, ...DEMO_STREAMS.map((s) => s.date)].sort();
    const lastWeek = weekStart(all[all.length - 1]);
    const weeks = [];
    for (let w = weekStart(all[0]); w <= lastWeek; w = addDays(w, 7)) weeks.push(w);
    const weekIdx = new Map(weeks.map((w, i) => [w, i]));
    return {
      L: weeks.length,
      meetingSlot: dates.map((d) => weekIdx.get(weekStart(d))),
      streamSlot: DEMO_STREAMS.map((s) => weekIdx.get(weekStart(s.date))),
      // месяц недели определяем по её четвергу
      slotMonths: weeks.map((w) => addDays(w, 3).slice(0, 7)),
    };
  }

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

  const INFO_DEFAULT =
    "Кликните по строке — визиты и стрики. Клик по точке с обводкой — проект с эфира (ссылка кликабельна).";

  let mode = "ordinal";

  function render() {
    const el = document.getElementById("plviz-streak");
    if (!el) return;

    const axis = buildAxis(mode);
    const L = axis.L;
    const slotW = 100 / L;
    const pct = (s) => ((s + 0.5) / L) * 100;
    const slotLeft = (s) => (s / L) * 100;
    const spanMeetings = (m0, m1) => {
      const left = pct(axis.meetingSlot[m0]);
      return { left, width: pct(axis.meetingSlot[m1]) - left };
    };

    // Месяцы как периоды: подпись + линия тянутся на все слоты месяца
    const monthSpans = [];
    axis.slotMonths.forEach((key, i) => {
      const lastSpan = monthSpans[monthSpans.length - 1];
      if (lastSpan && lastSpan.key === key) lastSpan.s1 = i;
      else monthSpans.push({ key, s0: i, s1: i });
    });

    const monthsHTML = monthSpans
      .map(
        ({ key, s0, s1 }) =>
          `<div class="plviz-streak-month" style="left:${slotLeft(s0).toFixed(2)}%;` +
          `width:calc(${((s1 - s0 + 1) * slotW).toFixed(2)}% - 0.5em)">${MONTHS_SHORT[key] || key}</div>`
      )
      .join("");

    const vlines = monthSpans
      .slice(1)
      .map(({ s0 }) => `<div class="plviz-streak-vline" style="left:${slotLeft(s0).toFixed(2)}%"></div>`)
      .join("");

    // Строка «все»: квадратик недели — это все личные квадратики с прозрачностью 0.1,
    // наложенные друг на друга; итоговая непрозрачность 1 − 0.9^k
    const cellW = (slotW * 0.72).toFixed(2);
    const cellHtml = (slot, c, label, tipExtra) => {
      const alpha = ((1 - Math.pow(0.9, c)) * 100).toFixed(1);
      return (
        `<span class="plviz-streak-cell" style="left:${pct(slot).toFixed(2)}%;width:${cellW}%;` +
        `background:color-mix(in srgb, var(--ids__link) ${alpha}%, transparent)" ` +
        `data-tip="<b>все</b><br>${label} — ${c} ${plural(c)}${tipExtra || ""}"></span>`
      );
    };
    const totalCells =
      MEETINGS.map((m, i) => cellHtml(axis.meetingSlot[i], counts[i], fmtDate(dates[i]))).join("") +
      DEMO_STREAMS.map((s, j) =>
        cellHtml(
          axis.streamSlot[j],
          demoCounts[j],
          `демо-эфир ${fmtDate(s.date)}`,
          " · заглушка"
        )
      ).join("");

    const totalRow =
      `<div class="plviz-streak-row plviz-streak-total" data-total>` +
      `<div class="plviz-streak-name">все</div>` +
      `<div class="plviz-streak-track">${totalCells}</div>` +
      `</div>`;

    let popupId = 0;
    const popups = new Map();
    const rowsHTML = rows
      .map((r, idx) => {
        const lines = r.streaks
          .filter((s) => s.len >= 2)
          .map((s) => {
            const { left, width } = spanMeetings(s.start, s.end);
            return (
              `<div class="plviz-streak-line" ` +
              `style="left:${left.toFixed(2)}%;width:${width.toFixed(2)}%" ` +
              `data-tip="<b>${escTip(r.name)}</b><br>стрик ${s.len} · ${fmtDate(dates[s.start])} — ${fmtDate(dates[s.end])}"></div>`
            );
          })
          .join("");

        const dots = [...r.set]
          .map((i) => {
            return (
              `<span class="plviz-streak-dot" style="left:${pct(axis.meetingSlot[i]).toFixed(2)}%" ` +
              `data-tip="<b>${escTip(r.name)}</b><br>${fmtDate(dates[i])}"></span>`
            );
          })
          .join("");

        const demoDots = r.demos
          .map((d) => {
            const id = String(++popupId);
            popups.set(id, demoPopupHtml(d));
            return (
              `<span class="plviz-streak-dot plviz-streak-demo" style="left:${pct(axis.streamSlot[d.streamIdx]).toFixed(2)}%" ` +
              `data-popup-id="${id}"></span>`
            );
          })
          .join("");

        return (
          `<div class="plviz-streak-row" data-idx="${idx}">` +
          `<div class="plviz-streak-name">${r.name}</div>` +
          `<div class="plviz-streak-track">${lines}${dots}${demoDots}</div>` +
          `</div>`
        );
      })
      .join("");

    el.innerHTML =
      `<div class="plviz-mode">` +
      `<button type="button" data-mode="ordinal" class="${mode === "ordinal" ? "active" : ""}">четверги подряд</button>` +
      `<button type="button" data-mode="calendar" class="${mode === "calendar" ? "active" : ""}">календарь</button>` +
      `</div>` +
      `<div class="plviz-streak-chart">` +
      totalRow +
      rowsHTML +
      `<div class="plviz-streak-axis">${vlines}${monthsHTML}</div>` +
      `</div>` +
      `<div class="plviz-legend">` +
      `<span class="plviz-legend-item static"><i class="plviz-streak-swatch s2"></i>визит</span>` +
      `<span class="plviz-legend-item static"><i class="plviz-streak-swatch demo"></i>демо-эфир</span>` +
      `<span class="plviz-legend-item static"><i class="plviz-streak-swatch all"></i>«все»: гуще цвет — больше людей</span>` +
      `</div>` +
      `<p class="plviz-info" id="plviz-streak-info">${INFO_DEFAULT}</p>`;

    el.querySelectorAll(".plviz-mode button").forEach((btn) => {
      btn.addEventListener("click", () => {
        if (btn.dataset.mode === mode) return;
        mode = btn.dataset.mode;
        hideTip();
        render();
      });
    });

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
    const deactivate = () => {
      el.querySelectorAll(".plviz-streak-row").forEach((x) => x.classList.remove("active"));
    };

    el.querySelector("[data-total]").addEventListener("click", function () {
      const on = this.classList.contains("active");
      deactivate();
      if (on) {
        info.textContent = INFO_DEFAULT;
        return;
      }
      this.classList.add("active");
      const avg = counts.reduce((s, c) => s + c, 0) / (n || 1);
      const max = Math.max(...counts);
      const maxDate = dates[counts.indexOf(max)];
      info.innerHTML =
        `<b>Все</b> — ${n} встреч с февраля 2026, ${rows.length} участников; ` +
        `в среднем ${avg.toFixed(1).replace(".", ",")} ${plural(Math.round(avg))} на встрече; ` +
        `максимум ${max} (${fmtDate(maxDate)}).`;
    });

    el.querySelectorAll(".plviz-streak-row[data-idx]").forEach((row) => {
      row.addEventListener("click", () => {
        const on = row.classList.contains("active");
        deactivate();
        if (on) {
          info.textContent = INFO_DEFAULT;
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
