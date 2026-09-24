// Дашборд явки Планетария — локальная копия дашборда с сайта.
// Строка — человек, клетка — встреча: пропуск тёмный, был — синий, показывал — зелёный.
// Сверху столбики длительности: зелёные сегменты — демо от длинного к короткому,
// синий снизу — обсуждение. Высота считается от самой долгой встречи, как на сайте.
// Модель данных — js/dashboard-data.js, база — js/db.js.

(() => {
  "use strict";

  const DB = window.PlanetariumDB;
  const D = window.PlanetariumDashboardData;
  if (!DB) {
    console.error("PlanetariumDB не загружена. Подключите js/db.js перед dashboard.js");
    return;
  }
  if (!D) {
    console.error("Модель не загружена. Подключите js/dashboard-data.js перед dashboard.js");
    return;
  }

  const { MISSED, VISIT, DEMO, DEMO_OTHER, FORMAT_FILTER } = D;

  const AUDIENCE = [
    [true, "Активные подписчики"],
    [false, "вся история"],
  ];

  const board = document.getElementById("plviz-dashboard");
  const panelBox = document.getElementById("plviz-panel");
  if (!board) return;

  const esc = (s) =>
    String(s)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");

  let activeOnly = true;
  let format = 0;
  let model = null;

  // Что под курсором. Совпадает с Target на сайте.
  let target = { kind: "all" };
  let hotCol = -1;
  let hotRow = "";

  // Ссылки на узлы, которые подсвечиваются без перерисовки.
  let colCells = [];
  let colSegs = [];
  let rowEls = {};
  let cellAt = {};
  let demoLabels = [];

  // ---------------------------------------------------------------
  // Панель сбоку
  // ---------------------------------------------------------------

  const panelHtml = (panel) => {
    const rows = panel.rows
      .map((row) => {
        const label = row.label ? `<div class="plviz-panel-label">${esc(row.label)}</div>` : "";
        const value = row.lines.length
          ? `<div class="plviz-panel-value">` +
            row.lines
              .map((line, j) => {
                const hot = row.hot && row.hot.includes(j);
                return (j > 0 ? "<br>" : "") + `<span${hot ? ' class="hot"' : ""}>${esc(line)}</span>`;
              })
              .join("") +
            `</div>`
          : "";
        return `<div class="plviz-panel-row${row.sub ? " sub" : ""}">${label}${value}</div>`;
      })
      .join("");
    return (
      `<div class="plviz-panel-inner${panel.dimmed ? " dimmed" : ""}">` +
      `<p class="plviz-panel-title">${esc(panel.title)}</p>` +
      rows +
      `</div>`
    );
  };

  const renderPanel = () => {
    if (!panelBox || !model) return;
    panelBox.innerHTML = panelHtml(D.panelFor(model, target));
  };

  // ---------------------------------------------------------------
  // Подсветка
  // ---------------------------------------------------------------

  // Подпись над зелёной частью: сумма демо или длительность наведённого демо.
  const demoLabelValue = (meeting, i) => {
    if (target.kind === "demo" && target.i === i) {
      const own = meeting.bars.find((d) => d.id === target.demoId);
      if (own) return own.minutes ?? 0;
    }
    return meeting.demoMinutes;
  };

  const refreshDemoLabel = (i) => {
    const label = demoLabels[i];
    if (label) label.textContent = String(demoLabelValue(model.meetings[i], i));
  };

  const applyHighlight = () => {
    const col = "i" in target ? target.i : -1;
    if (col !== hotCol) {
      const toggle = (i, on) => {
        if (i < 0) return;
        (colCells[i] || []).forEach((el) => el.classList.toggle("hot", on));
        (colSegs[i] || []).forEach((el) => el.classList.toggle("hot", on));
      };
      toggle(hotCol, false);
      toggle(col, true);
      hotCol = col;
    }
    if (hotRow) {
      rowEls[hotRow]?.classList.remove("hot");
      board.querySelectorAll(".plviz-cell.self").forEach((el) => el.classList.remove("self"));
    }
    hotRow = target.kind === "person" || target.kind === "personAll" ? target.personId : "";
    if (hotRow) {
      rowEls[hotRow]?.classList.add("hot");
      cellAt[hotRow]?.[col]?.classList.add("self");
    }
  };

  const setTarget = (next) => {
    const prev = target;
    target = next;
    applyHighlight();
    // Подпись меняется только у столбика, с которого ушли или на который навели.
    const cols = new Set();
    if ("i" in prev) cols.add(prev.i);
    if ("i" in next) cols.add(next.i);
    cols.forEach(refreshDemoLabel);
    renderPanel();
  };

  // ---------------------------------------------------------------
  // Разметка
  // ---------------------------------------------------------------

  const filtersHtml = () => {
    const segmented = (label, items, current, action) =>
      `<div class="plviz-segmented" role="radiogroup" aria-label="${esc(label)}">` +
      items
        .map(
          ([value, text]) =>
            `<button type="button" role="radio" aria-checked="${current === value}"` +
            `${current === value ? ' class="active"' : ""} data-${action}="${value}">${esc(text)}</button>`
        )
        .join("") +
      `</div>`;

    const audience = D.hasActiveFlags(DB)
      ? segmented("Участники", AUDIENCE, activeOnly, "audience")
      : "";
    const formats =
      `<div class="plviz-filter-group">` +
      `<span class="plviz-filter-caption">Демо</span>` +
      segmented("Формат демо", FORMAT_FILTER, format, "format") +
      `</div>`;
    return `<div class="plviz-filters">${audience}${formats}</div>`;
  };

  const barsHtml = () =>
    `<div class="plviz-bars">` +
    model.meetings
      .map((m, i) => {
        const minutesLabel =
          m.minutes > 0
            ? `<span class="plviz-label talk">${m.minutes}` +
              (i === 0 ? `<span class="plviz-unit">&nbsp;мин</span>` : "") +
              `</span>`
            : "";
        const caption =
          m.date === model.demoStart
            ? `<span class="plviz-caption">В августе начали фиксировать демо</span>`
            : "";
        const talk =
          m.talk > 0
            ? `<span class="plviz-seg talk" data-i="${i}" data-talk style="--minutes:${m.talk}"></span>`
            : "";
        const demos = m.bars.length
          ? `<div class="plviz-demos">` +
            `<span class="plviz-label demo"><span data-demo-label="${i}">${demoLabelValue(m, i)}</span>` +
            (m.date === model.firstDemo ? `<span class="plviz-unit">&nbsp;мин</span>` : "") +
            `</span>` +
            m.bars
              .map((d) => {
                const dim = format && D.demoFormatCode(model, d) !== format ? " dim" : "";
                return (
                  `<span class="plviz-seg demo${dim}" data-i="${i}" data-demo="${esc(d.id)}"` +
                  ` style="--minutes:${d.minutes}"></span>`
                );
              })
              .join("") +
            `</div>`
          : "";
        return `<div class="plviz-bar" data-i="${i}" data-talk>${minutesLabel}${caption}${talk}${demos}</div>`;
      })
      .join("") +
    `</div>`;

  const datesHtml = () =>
    `<div class="plviz-dates">` +
    model.meetings
      .map(
        (m) =>
          `<div class="plviz-date${m.month ? " has-month" : ""}">${m.day}` +
          (m.month ? `<span class="plviz-month">${m.month}</span>` : "") +
          `</div>`
      )
      .join("") +
    `</div>`;

  const matrixHtml = () => {
    const rows = model.people
      .map((person, r) => {
        const cells = person.row
          .map((state, i) => {
            const cls =
              state === VISIT ? " visit" : state === DEMO ? " demo" : state === DEMO_OTHER ? " dim" : "";
            return `<span class="plviz-cell${cls}" data-i="${i}" data-row="${esc(person.id)}"></span>`;
          })
          .join("");
        const last = r === model.people.length - 1 ? " last" : "";
        return (
          `<div class="plviz-row${last}" data-row="${esc(person.id)}">` +
          `<span class="plviz-name">${esc(person.name)}</span>${cells}</div>`
        );
      })
      .join("");

    // Зоны ховера совпадают с изначально видимыми полосками строк и не зависят от того,
    // какая строка сейчас поднята. Последняя строка видна целиком — у неё две полоски.
    const stripes = [...model.people, model.people[model.people.length - 1]]
      .filter(Boolean)
      .map((person) =>
        person.row
          .map((state, i) =>
            state === MISSED
              ? `<span data-i="${i}" data-all data-row="${esc(person.id)}"></span>`
              : `<span data-i="${i}" data-person="${esc(person.id)}" data-row="${esc(person.id)}"></span>`
          )
          .join("")
      )
      .join("");

    return (
      `<div class="plviz-matrix ids__rounded" style="--rows:${model.people.length}">` +
      rows +
      `<div class="plviz-hits">${stripes}</div>` +
      `</div>`
    );
  };

  const render = () => {
    model = D.buildDashboard(DB, { activeOnly, format });
    target = { kind: "all" };
    hotCol = -1;
    hotRow = "";

    if (!model.n) {
      board.innerHTML = filtersHtml() + `<p>Встреч с марта 2026 в базе пока нет.</p>`;
      board.style.removeProperty("--n");
      if (panelBox) panelBox.innerHTML = "";
      return;
    }

    board.style.setProperty("--n", String(model.n));
    board.style.setProperty("--max-minutes", String(Math.max(1, model.maxMinutes)));
    board.innerHTML = filtersHtml() + barsHtml() + datesHtml() + matrixHtml();

    colCells = model.meetings.map(() => []);
    colSegs = model.meetings.map(() => []);
    rowEls = {};
    cellAt = {};
    demoLabels = model.meetings.map((_, i) => board.querySelector(`[data-demo-label="${i}"]`));

    board.querySelectorAll(".plviz-seg").forEach((el) => colSegs[+el.dataset.i].push(el));
    board.querySelectorAll(".plviz-row").forEach((row) => {
      const id = row.dataset.row;
      rowEls[id] = row;
      cellAt[id] = [];
      row.querySelectorAll(".plviz-cell").forEach((cell) => {
        const i = +cell.dataset.i;
        cellAt[id][i] = cell;
        colCells[i].push(cell);
      });
    });

    renderPanel();
  };

  // ---------------------------------------------------------------
  // Ховер и фильтры
  // ---------------------------------------------------------------

  board.addEventListener("pointerover", (e) => {
    const el = e.target.closest("[data-i]");
    if (!el || !model) return;
    const i = Number(el.dataset.i);
    const { demo, person, talk, row, all } = el.dataset;
    if (demo) setTarget({ kind: "demo", i, demoId: demo });
    else if (all !== undefined && row) setTarget({ kind: "personAll", i, personId: row });
    else if (talk !== undefined) setTarget({ kind: "talk", i });
    else if (person) setTarget({ kind: "person", i, personId: person });
    else setTarget({ kind: "meeting", i });
  });

  const shell = board.closest(".plviz-shell") || board;
  shell.addEventListener("pointerleave", () => {
    if (model) setTarget({ kind: "all" });
  });

  board.addEventListener("click", (e) => {
    const audience = e.target.closest("[data-audience]");
    if (audience) {
      activeOnly = audience.dataset.audience === "true";
      render();
      return;
    }
    const fmt = e.target.closest("[data-format]");
    if (fmt) {
      format = Number(fmt.dataset.format);
      render();
    }
  });

  render();
})();
