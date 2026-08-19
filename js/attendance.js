// Посещаемость Планетария — «температурная карта» по мотивам планёрки 18.08.2026.
// Сущность — встреча. Строка — человек, квадратик — встреча (без гэпов и скруглений).
// Три состояния квадратика: пустой — не был; синий — пришёл; зелёный — пришёл и показал демо.
// Верхняя строка — наложение всех полупрозрачных строчек: насыщенность = людность,
// оттенок (синий → зелёный) = доля показывавших.
// Ось X — порядковый номер встречи; месяцы подписаны как дополнительная информация.
// Детали — в панельке под графиком (не в тултипах за курсором).

(() => {
  "use strict";

  const DB = window.PlanetariumDB;
  if (!DB) {
    console.error("PlanetariumDB не загружена. Подключите js/db.js перед attendance.js");
    return;
  }

  const personById = Object.fromEntries(DB.persons.map((p) => [p.id, p]));
  const projectById = Object.fromEntries(DB.projects.map((p) => [p.id, p]));

  // Все встречи по хронологии, порядковый номер = индекс + 1.
  const meetings = DB.meetings.slice().sort((a, b) => a.date.localeCompare(b.date));
  const n = meetings.length;
  const idxByDate = new Map(meetings.map((m, i) => [m.date, i]));

  // Явка: person id → Set индексов встреч.
  const attended = new Map();
  const mark = (pid, date) => {
    const i = idxByDate.get(date);
    if (i == null) return;
    if (!attended.has(pid)) attended.set(pid, new Set());
    attended.get(pid).add(i);
  };
  DB.attendance.forEach((a) => mark(a.person, a.meeting));

  // Демо — разновидность явки: показывал → значит был.
  // person id → Map(индекс встречи → [названия проектов])
  const demoed = new Map();
  DB.demos.forEach((d) => {
    const i = idxByDate.get(d.meeting);
    if (i == null) return;
    const title = projectById[d.project]?.title || d.project;
    d.presenters.forEach((pid) => {
      mark(pid, d.meeting);
      if (!demoed.has(pid)) demoed.set(pid, new Map());
      const byMeeting = demoed.get(pid);
      if (!byMeeting.has(i)) byMeeting.set(i, []);
      byMeeting.get(i).push(title);
    });
  });

  const rows = [...attended.entries()]
    .map(([pid, set]) => ({
      name: personById[pid]?.name || pid,
      set,
      demos: demoed.get(pid) || new Map(),
      total: set.size,
    }))
    .sort((a, b) => b.total - a.total || a.name.localeCompare(b.name, "ru"));

  // Суммарная строка: k — сколько было людей, d — сколько из них показывали.
  const totals = meetings.map((_, i) => {
    let k = 0;
    let d = 0;
    rows.forEach((r) => {
      if (r.set.has(i)) {
        k++;
        if (r.demos.has(i)) d++;
      }
    });
    return { k, d };
  });

  const MONTHS_SHORT = ["янв", "фев", "мар", "апр", "май", "июн", "июл", "авг", "сен", "окт", "ноя", "дек"];
  const MONTHS_GEN = ["января", "февраля", "марта", "апреля", "мая", "июня", "июля", "августа", "сентября", "октября", "ноября", "декабря"];
  const fmtDate = (iso) => `${+iso.slice(8, 10)} ${MONTHS_GEN[+iso.slice(5, 7) - 1]} ’${iso.slice(2, 4)}`;

  const escHtml = (s) =>
    String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

  // Цвета из палитры IDS (синий link / зелёный success), подбираются под тему.
  const palette = () =>
    document.documentElement.classList.contains("dark")
      ? { blue: [60, 130, 250], green: [40, 200, 70] }
      : { blue: [0, 100, 240], green: [30, 170, 60] };

  // Вклад одного человека в суммарную строку. Наложение k слоёв даёт
  // непрозрачность 1 − (1 − a)^k: чем больше людей, тем насыщеннее.
  const LAYER_ALPHA = 0.16;
  const PERSON_ALPHA = 0.6;

  const mix = (a, b, t) => a.map((v, i) => Math.round(v + (b[i] - v) * t));
  const rgba = (rgb, a) => `rgba(${rgb[0]},${rgb[1]},${rgb[2]},${a.toFixed(3)})`;

  const DEFAULT_INFO = () => {
    const people = rows.length;
    const demosTotal = DB.demos.length;
    return (
      `${n} встреч с ${fmtDate(meetings[0].date)}, ${people} участников, ${demosTotal} демо. ` +
      `Наведите на квадратик — детали здесь.`
    );
  };

  function render() {
    const el = document.getElementById("plviz-attend");
    if (!el) return;
    const C = palette();

    // Подписи месяцев занимают все встречи месяца; между соседними — зазор 0.4em.
    const monthSpans = [];
    meetings.forEach((m, i) => {
      const key = m.date.slice(0, 7);
      if (!monthSpans.length || monthSpans.at(-1).key !== key) {
        monthSpans.push({ key, start: i, label: MONTHS_SHORT[+key.slice(5) - 1] });
      }
    });
    monthSpans.forEach((s, j) => {
      s.end = monthSpans[j + 1]?.start ?? n;
    });

    const monthMarksHtml = (() => {
      let html = "";
      let i = 0;
      while (i < monthSpans.length) {
        const width = monthSpans[i].end - monthSpans[i].start;
        if (width === 1) {
          let j = i;
          while (j < monthSpans.length && monthSpans[j].end - monthSpans[j].start === 1) j++;
          const pack = monthSpans.slice(i, j);
          html +=
            `<div class="sqviz-mark sqviz-mark-pack" style="grid-column: span ${pack.length}">` +
            pack.map((s) => `<span>${s.label}</span>`).join("") +
            `</div>`;
          i = j;
        } else {
          html += `<div class="sqviz-mark" style="grid-column: span ${width}">${monthSpans[i].label}</div>`;
          i++;
        }
      }
      return html;
    })();

    const trackCells = (cellsHtml) => `<div class="sqviz-track">${cellsHtml}</div>`;

    const monthsRow =
      `<div class="sqviz-row sqviz-marks"><div class="sqviz-label"></div>` +
      trackCells(monthMarksHtml) +
      `</div>`;

    const sumCells = totals
      .map(({ k, d }, i) => {
        const bg = k ? rgba(mix(C.blue, C.green, d / k), 1 - Math.pow(1 - LAYER_ALPHA, k)) : "transparent";
        return `<div class="sqviz-cell" data-i="${i}" data-row="sum" style="background:${bg}"></div>`;
      })
      .join("");
    const sumRow =
      `<div class="sqviz-row sqviz-sum"><div class="sqviz-label">Все вместе</div>` +
      trackCells(sumCells) +
      `</div>`;

    const personRows = rows
      .map((r, ri) => {
        const cells = meetings
          .map((_, i) => {
            let bg = "transparent";
            if (r.set.has(i)) bg = rgba(r.demos.has(i) ? C.green : C.blue, PERSON_ALPHA);
            return `<div class="sqviz-cell" data-i="${i}" data-row="${ri}" style="background:${bg}"></div>`;
          })
          .join("");
        return (
          `<div class="sqviz-row"><div class="sqviz-label">${escHtml(r.name)}</div>` +
          trackCells(cells) +
          `</div>`
        );
      })
      .join("");

    // Порядковые номера: 1 и каждый пятый.
    const numsRow =
      `<div class="sqviz-row sqviz-marks"><div class="sqviz-label"></div>` +
      trackCells(
        meetings
          .map((_, i) => {
            const num = i + 1;
            const show = num === 1 || num % 5 === 0;
            return `<div class="sqviz-mark sqviz-num">${show ? num : ""}</div>`;
          })
          .join("")
      ) +
      `</div>`;

    const legend =
      `<div class="sqviz-legend">` +
      `<span class="sqviz-legend-item"><i style="background:${rgba(C.blue, PERSON_ALPHA)}"></i>пришёл</span>` +
      `<span class="sqviz-legend-item"><i style="background:${rgba(C.green, PERSON_ALPHA)}"></i>пришёл и показал демо</span>` +
      `<span class="sqviz-legend-item">верхняя строка: темнее — больше людей, зеленее — больше демо</span>` +
      `</div>`;

    el.innerHTML =
      `<div class="sqviz">${monthsRow}${sumRow}${personRows}${numsRow}</div>` +
      legend +
      `<p class="sqviz-info" id="sqviz-info">${DEFAULT_INFO()}</p>`;

    const info = el.querySelector("#sqviz-info");

    const meetingLabel = (i) => {
      const m = meetings[i];
      const kind = m.type === "stream" ? "эфир" : "встреча";
      return `${kind} №${i + 1} · ${fmtDate(m.date)}`;
    };

    el.addEventListener("pointerover", (e) => {
      const cell = e.target.closest(".sqviz-cell");
      if (!cell) return;
      const i = +cell.dataset.i;
      if (cell.dataset.row === "sum") {
        const { k, d } = totals[i];
        info.innerHTML = k
          ? `<b>${meetingLabel(i)}</b> — ${k} чел., демо: ${d}`
          : `<b>${meetingLabel(i)}</b> — данных о явке нет`;
        return;
      }
      const r = rows[+cell.dataset.row];
      if (!r.set.has(i)) {
        info.innerHTML = `<b>${escHtml(r.name)}</b> — не было (${meetingLabel(i)})`;
      } else if (r.demos.has(i)) {
        info.innerHTML = `<b>${escHtml(r.name)}</b> — показывал(а): ${escHtml(r.demos.get(i).join("; "))} (${meetingLabel(i)})`;
      } else {
        info.innerHTML = `<b>${escHtml(r.name)}</b> — был(а) (${meetingLabel(i)})`;
      }
    });

    el.addEventListener("pointerleave", () => {
      info.innerHTML = DEFAULT_INFO();
    });
  }

  render();

  // Перерисовка при переключении темы (цвета считаются в JS).
  new MutationObserver(render).observe(document.documentElement, {
    attributes: true,
    attributeFilter: ["class"],
  });
})();
