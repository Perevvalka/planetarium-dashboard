// Стрики посещений Планетария.
// Строка — человек, точки — встречи, линия — непрерывность (стрик).

(() => {
  "use strict";

  // Нормализация опечаток в исходных списках
  const ALIAS = {
    "Кристина Мареченко": "Кристина Марченко",
  };

  const MEETINGS = [
    {
      date: "2025-10-10",
      people: [
        "Полина Перевалова",
        "Женя Арутюнов",
        "Кристина Мареченко",
        "Руслан Мамедов",
        "Адам Арутюнов",
        "Кристина Дунина",
        "Владимир Трифонов",
        "Виктор Тимофеев",
      ],
    },
    {
      date: "2025-10-16",
      people: [
        "Кристина Мареченко",
        "Полина Перевалова",
        "Кристина Дунина",
        "Виктор Тимофеев",
        "Артём Ермолаев",
        "Руслан Мамедов",
        "Рустам Мушраипов",
        "Лёша Никитин",
        "Марат Хабибулин",
      ],
    },
    {
      date: "2025-11-07",
      people: [
        "Женя Арутюнов",
        "Руслан Мамедов",
        "Артём Ермолаев",
        "Кристина Мареченко",
        "Ольга Пермякова",
        "Екатерина Лакутина",
        "Глеб Тиидт",
        "Кирилл Олейниченко",
        "Кристина Дунина",
        "Виктор Тимофеев",
        "Далер Алиёров",
        "Рустам Мушраипов",
        "Марат Хабибулин",
        "Полина Перевалова",
      ],
    },
    {
      date: "2025-11-14",
      people: [
        "Женя Арутюнов",
        "Кирилл Олейниченко",
        "Кристина Дунина",
        "Елена Чаусова",
        "Полина Перевалова",
        "Расул Штибеков",
        "Лёша Никитин",
        "Кристина Марченко",
        "Глеб Тиидт",
        "Руслан Мамедов",
        "Далер Алиёров",
        "Артём Ермолаев",
        "Адам Арутюнов",
        "Марат Хабибулин",
        "Виктор Тимофеев",
        "Ася Драгун",
        "Рустам Мушраипов",
      ],
    },
    {
      date: "2025-11-21",
      people: [
        "Женя Арутюнов",
        "Лора Гуранина",
        "Кирилл Мышкин",
        "Елена Чаусова",
        "Кирилл Олейниченко",
        "Полина Перевалова",
        "Ася Драгун",
        "Кристина Марченко",
        "Руслан Мамедов",
        "Татьяна Кашина",
        "Дмитрий Сивухин",
        "Виктор Тимофеев",
        "Рустам Мушраипов",
      ],
    },
    {
      date: "2025-12-05",
      people: [
        "Полина Перевалова",
        "Ася Драгун",
        "Женя Арутюнов",
        "Кирилл Мышкин",
        "Кристина Дунина",
        "Кристина Марченко",
        "Лёша Никитин",
        "Маша Троицкая",
        "Руслан Мамедов",
        "Татьяна Кашина",
        "Рустам Мушраипов",
      ],
    },
    {
      date: "2025-12-12",
      people: [
        "Полина Перевалова",
        "Анна Сафка",
        "Артём Ермолаев",
        "Дмитрий Сивухин",
        "Женя Арутюнов",
        "Кирилл Мышкин",
        "Кристина Марченко",
        "Руслан Мамедов",
        "Лёша Никитин",
        "Рустам Мушраипов",
        "Татьяна Кашина",
      ],
    },
    {
      date: "2026-01-16",
      people: [
        "Полина Перевалова",
        "Алёна Гришковец",
        "Вика Герман",
        "Женя Арутюнов",
        "Ася Драгун",
        "Рамиль Каримов",
        "Кирилл Чернов",
        "Кристина Марченко",
        "Кристина Дунина",
        "Лёша Никитин",
        "Маша Троицкая",
        "Руслан Мамедов",
        "Рустам Мушраипов",
        "Татьяна Кашина",
      ],
    },
    {
      date: "2026-01-23",
      people: [
        "Полина Перевалова",
        "Алёна Гришковец",
        "Вика Герман",
        "Кирилл Олейниченко",
        "Кристина Марченко",
        "Руслан Мамедов",
        "Рустам Мушраипов",
      ],
    },
    {
      date: "2026-01-29",
      people: [
        "Кристина Марченко",
        "Рустам Мушраипов",
        "Лёша Никитин",
        "Руслан Мамедов",
        "Татьяна Кашина",
        "Женя Арутюнов",
      ],
    },
    {
      date: "2026-02-06",
      people: [
        "Георгий Мишуровский",
        "Алёна Гришковец",
        "Ася Драгун",
        "Дмитрий Сивухин",
        "Лёша Никитин",
        "Кристина Марченко",
        "Кирилл Мышкин",
        "Руслан Мамедов",
        "Рустам Мушраипов",
        "Маша Троицкая",
        "Ольга Пермякова",
        "Полина Перевалова",
        "Женя Арутюнов",
      ],
    },
    {
      date: "2026-02-21",
      people: [
        "Алёна Гришковец",
        "Георгий Мишуровский",
        "Дмитрий Сивухин",
        "Кирилл Мышкин",
        "Кристина Марченко",
        "Лёша Никитин",
        "Маша Троицкая",
        "Рустам Мушраипов",
        "Женя Арутюнов",
        "Полина Перевалова",
      ],
    },
    {
      date: "2026-02-27",
      people: [
        "Алёна Гришковец",
        "Далер Алиёров",
        "Кристина Марченко",
        "Дмитрий Сивухин",
        "Рустам Мушраипов",
        "Руслан Мамедов",
        "Женя Арутюнов",
        "Полина Перевалова",
      ],
    },
    {
      date: "2026-03-07",
      people: [
        "Алёна Гришковец",
        "Георгий Мишуровский",
        "Кристина Дунина",
        "Кристина Марченко",
        "Настя Тулаева",
        "Лёша Никитин",
        "Маша Троицкая",
        "Рустам Мушраипов",
        "Руслан Мамедов",
        "Влад",
        "Гоша",
        "Рома Кужель",
        "Женя Арутюнов",
        "Полина Перевалова",
      ],
    },
    {
      date: "2026-03-12",
      people: [
        "Георгий Мишуровский",
        "Алёна Гришковец",
        "Дарья Дегтярева",
        "Жанна Белоусова",
        "Дмитрий Сивухин",
        "Лёша Никитин",
        "Кристина Марченко",
        "Кирилл Мышкин",
        "Магомед Вагабов",
        "Маша Троицкая",
        "Рустам Мушраипов",
        "Татьяна Кашина",
        "Женя Арутюнов",
      ],
    },
    {
      date: "2026-03-20",
      people: [
        "Алёна Гришковец",
        "Гоша",
        "Дмитрий Сивухин",
        "Кирилл Мышкин",
        "Кристина Марченко",
        "Магомед Вагабов",
        "Маша Троицкая",
        "Рома Кужель",
        "Рустам Мушраипов",
        "Женя Арутюнов",
        "Полина Перевалова",
      ],
    },
    {
      date: "2026-03-28",
      people: [
        "Адам Арутюнов",
        "Артём Ермолаев",
        "Илья Наринский",
        "Марат Хабибулин",
        "Дмитрий Сивухин",
        "Кирилл Мышкин",
        "Костя Григорьев",
        "Кристина Марченко",
        "Кристина Дунина",
        "Маша Троицкая",
        "Магомед Вагабов",
        "Лёша Никитин",
        "Рустам Мушраипов",
        "Женя Арутюнов",
      ],
    },
    {
      date: "2026-04-02",
      people: [
        "Даня Самойленко",
        "Евгений Смирнов",
        "Егор Веселов",
        "Ринат Еникеев",
        "Ольга Пермякова",
        "Кристина Марченко",
        "Кирилл Мышкин",
        "Дмитрий Сивухин",
        "Рустам Мушраипов",
        "Лёша Никитин",
        "Полина Перевалова",
      ],
    },
    {
      date: "2026-04-09",
      people: [
        "Адам Арутюнов",
        "Женя Сарнецкий",
        "Кирилл Мышкин",
        "Гоша",
        "Кристина Марченко",
        "Дмитрий Сивухин",
        "Евгений Смирнов",
        "Лёша Крам",
        "Лёша Никитин",
        "Магомед Вагабов",
        "Рустам Мушраипов",
        "Света",
        "Юля Кутьенко",
        "Валерия Романова",
        "Женя Арутюнов",
      ],
    },
    {
      date: "2026-04-17",
      people: [
        "Ася Драгун",
        "Влад",
        "Магомед Вагабов",
        "Кирилл Мышкин",
        "Евгений Смирнов",
        "Дмитрий Сивухин",
        "Кристина Марченко",
        "Лёша Крам",
        "Рамиль Каримов",
        "Руслан Мамедов",
        "Рустам Мушраипов",
        "Полина Перевалова",
        "Женя Арутюнов",
      ],
    },
    {
      date: "2026-04-24",
      people: [
        "Дмитрий Сивухин",
        "Евгений Смирнов",
        "Артём Ермолаев",
        "Женя Сарнецкий",
        "Магомед Вагабов",
        "Кристина Марченко",
        "Лёша Никитин",
        "Кирилл Мышкин",
        "Маша Троицкая",
        "Марат Хабибулин",
        "Рустам Мушраипов",
        "Руслан Мамедов",
        "Ринат Еникеев",
        "Рамиль Каримов",
        "Кирилл Чернов",
        "Александр Лисо…?",
        "Полина Перевалова",
        "Женя Арутюнов",
      ],
    },
    {
      date: "2026-05-01",
      people: [
        "Адам Арутюнов",
        "Дана",
        "Дмитрий Сивухин",
        "Кристина Марченко",
        "Лёша Никитин",
        "Рустам Мушраипов",
        "Руслан Мамедов",
        "Магомед Вагабов",
        "Полина Перевалова",
      ],
    },
    {
      date: "2026-05-15",
      people: [
        "Артём Ермолаев",
        "Руслан Мамедов",
        "Дмитрий Сивухин",
        "Евгений Смирнов",
        "Кристина Марченко",
        "Маша Троицкая",
        "Ринат Еникеев",
        "Рустам Мушраипов",
        "Женя Арутюнов",
        "Полина Перевалова",
      ],
    },
    {
      date: "2026-06-05",
      people: [
        "Вова",
        "Дмитрий Сивухин",
        "Евгений Смирнов",
        "Кирилл Мышкин",
        "Кристина Марченко",
        "Лёша Никитин",
        "Рустам Мушраипов",
        "Руслан Мамедов",
        "Магомед Вагабов",
        "Женя Арутюнов",
        "Полина Перевалова",
      ],
    },
    {
      date: "2026-06-12",
      people: [
        "Артём Ермолаев",
        "Дмитрий Сивухин",
        "Евгений Смирнов",
        "Кристина Марченко",
        "Лёша Никитин",
        "Ольга Пермякова",
        "Руслан Мамедов",
        "Рустам Мушраипов",
        "Виталий",
        "Анастасия Фомина",
        "Надя Ткачева",
        "Полина Перевалова",
        "Женя Арутюнов",
      ],
    },
    {
      date: "2026-07-03",
      people: [
        "Дмитрий Сивухин",
        "Евгений Смирнов",
        "Кристина Марченко",
        "Лёша Никитин",
        "Маша Троицкая",
        "Ольга Пермякова",
        "Рустам Мушраипов",
        "Зоя",
        "Женя Арутюнов",
        "Полина Перевалова",
      ],
    },
  ];

  const norm = (name) => ALIAS[name.trim()] || name.trim();

  const dates = MEETINGS.map((m) => m.date);
  const n = dates.length;

  const attendance = new Map(); // name → Set of date indices
  MEETINGS.forEach((m, i) => {
    m.people.forEach((raw) => {
      const name = norm(raw);
      if (!attendance.has(name)) attendance.set(name, new Set());
      attendance.get(name).add(i);
    });
  });

  // Стрик = подряд идущие встречи из списка (не календарные недели)
  function streaksOf(indices) {
    const sorted = [...indices].sort((a, b) => a - b);
    const streaks = [];
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
    if (sorted.length) streaks.push({ start, end: prev, len: prev - start + 1 });
    return streaks;
  }

  const rows = [...attendance.entries()]
    .map(([name, set]) => {
      const streaks = streaksOf(set);
      const longest = streaks.reduce((m, s) => Math.max(m, s.len), 0);
      const last = [...set].sort((a, b) => a - b).at(-1);
      const current =
        last === n - 1 ? streaks.find((s) => s.end === n - 1)?.len || 0 : 0;
      return { name, set, streaks, longest, current, total: set.size };
    })
    .sort((a, b) => b.longest - a.longest || b.total - a.total || a.name.localeCompare(b.name, "ru"));

  const MONTHS_SHORT = {
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

  // Равномерные слоты по встречам — стрик читается как непрерывность посещений
  const pct = (i) => ((i + 0.5) / n) * 100;
  const span = (i0, i1) => {
    const left = pct(i0);
    const right = pct(i1);
    return { left, width: right - left };
  };

  const tip = document.createElement("div");
  tip.className = "plviz-tip";
  document.body.appendChild(tip);

  const moveTip = (e) => {
    const pad = 14;
    const r = tip.getBoundingClientRect();
    let x = e.clientX + pad;
    let y = e.clientY + pad;
    if (x + r.width > innerWidth - 8) x = e.clientX - r.width - pad;
    if (y + r.height > innerHeight - 8) y = e.clientY - r.height - pad;
    tip.style.left = x + "px";
    tip.style.top = y + "px";
  };

  document.addEventListener("pointermove", (e) => {
    const t = e.target.closest("[data-tip]");
    if (!t) {
      tip.classList.remove("visible");
      return;
    }
    tip.innerHTML = t.dataset.tip;
    tip.classList.add("visible");
    moveTip(e);
  });

  function streakClass(len) {
    if (len >= 5) return "long";
    if (len >= 3) return "mid";
    return "short";
  }

  function render() {
    const el = document.getElementById("plviz-streak");
    if (!el) return;

    // Подписи месяцев — первая встреча каждого месяца
    const monthMarks = [];
    let prevKey = "";
    dates.forEach((iso, i) => {
      const key = iso.slice(0, 7);
      if (key !== prevKey) {
        monthMarks.push({ i, label: MONTHS_SHORT[key] || key });
        prevKey = key;
      }
    });

    const vlines = monthMarks
      .map(
        (m) =>
          `<div class="plviz-streak-vline" style="left:${pct(m.i)}%"></div>` +
          `<div class="plviz-streak-month" style="left:${pct(m.i)}%">${m.label}</div>`
      )
      .join("");

    const rowsHTML = rows
      .map((r, idx) => {
        const lines = r.streaks
          .filter((s) => s.len >= 2)
          .map((s) => {
            const { left, width } = span(s.start, s.end);
            return (
              `<div class="plviz-streak-line ${streakClass(s.len)}" ` +
              `style="left:${left.toFixed(2)}%;width:${width.toFixed(2)}%" ` +
              `data-tip="<b>${r.name}</b><br>стрик ${s.len} · ${fmtDate(dates[s.start])} — ${fmtDate(dates[s.end])}"></div>`
            );
          })
          .join("");

        const dots = [...r.set]
          .map((i) => {
            const streak = r.streaks.find((s) => i >= s.start && i <= s.end);
            const cls = streakClass(streak?.len || 1);
            return (
              `<span class="plviz-streak-dot ${cls}" style="left:${pct(i).toFixed(2)}%" ` +
              `data-tip="<b>${r.name}</b><br>${fmtDate(dates[i])}"></span>`
            );
          })
          .join("");

        return (
          `<div class="plviz-streak-row" data-idx="${idx}">` +
          `<div class="plviz-streak-name">${r.name}</div>` +
          `<div class="plviz-streak-track">${lines}${dots}</div>` +
          `<div class="plviz-streak-stat">${r.longest}</div>` +
          `</div>`
        );
      })
      .join("");

    el.innerHTML =
      `<div class="plviz-streak-chart">` +
      `<div class="plviz-streak-axis">${vlines}</div>` +
      `<div class="plviz-streak-stat-h">макс</div>` +
      rowsHTML +
      `</div>` +
      `<div class="plviz-legend">` +
      `<span class="plviz-legend-item static"><i class="plviz-streak-swatch short"></i>1–2 подряд</span>` +
      `<span class="plviz-legend-item static"><i class="plviz-streak-swatch mid"></i>3–4 подряд</span>` +
      `<span class="plviz-legend-item static"><i class="plviz-streak-swatch long"></i>5+ подряд</span>` +
      `</div>` +
      `<p class="plviz-info" id="plviz-streak-info">Кликните по строке — покажем визиты и стрики.</p>`;
    const info = el.querySelector("#plviz-streak-info");
    el.querySelectorAll(".plviz-streak-row").forEach((row) => {
      row.addEventListener("click", () => {
        const on = row.classList.contains("active");
        el.querySelectorAll(".plviz-streak-row").forEach((x) => x.classList.remove("active"));
        if (on) {
          info.textContent = "Кликните по строке — покажем визиты и стрики.";
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
        info.innerHTML =
          `<b>${r.name}</b> — ${r.total} из ${n} встреч; ` +
          `максимум подряд: ${r.longest}; ${cur}. ${streakText}.`;
      });
    });
  }

  render();
})();
