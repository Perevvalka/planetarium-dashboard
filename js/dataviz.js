// Датавиз Планетария — пять эскизов визуализаций по алгоритму Δλ.
// Частица данных — демо. Все метрики вычисляются из мини-БД ниже, ничего не хранится.
// Данные придуманы (январь–июль 2026) и правятся прямо здесь.

(() => {
  "use strict";

  // ---------------------------------------------------------------
  // Мини-БД
  // ---------------------------------------------------------------

  const DB = {
    // Норма длительности демо, минуты: короче — до 5, в норме — 5–7, длиннее — больше 7
    norm: { min: 5, max: 7 },

    persons: [
      { id: "zhenya", name: "Женя Арутюнов" },
      { id: "polina", name: "Полина Перевалова" },
      { id: "asya", name: "Ася Драгун" },
      { id: "danya", name: "Даня Самойленко" },
      { id: "alena", name: "Алёна Гришковец" },
      { id: "olya", name: "Оля Пермякова" },
      { id: "ruslan", name: "Руслан Мамедов" },
      { id: "kirill", name: "Кирилл Мышкин" },
      { id: "kristina", name: "Кристина Марченко" },
      { id: "lora", name: "Лора Гуранина" },
      { id: "marat", name: "Марат Хабибулин" },
      { id: "artem", name: "Артём Ермолаев" },
    ],

    // published — дата появления ссылки; с этого дня формат демо проекта
    // автоматически становится «4 — опубликованный продукт»
    projects: [
      { id: "tgchannel", title: "Телеграм-канал про дизайн", authors: ["alena"], published: "2026-02-12" },
      { id: "gencover", title: "Генеративные обложки", authors: ["polina", "zhenya"], published: "2026-03-19" },
      { id: "ermolaev", title: "ermolaev.space", authors: ["artem"], published: "2026-05-14" },
      { id: "aside", title: "aside — куда пойти прямо сейчас", authors: ["danya"], published: "2026-06-04" },
      { id: "mark2", title: "Свой сайт Mark II", authors: ["kristina"] },
      { id: "pinterest", title: "Прокачка Пинтереста", authors: ["olya"] },
      { id: "portfolio", title: "Портфолио на Симбарусе", authors: ["ruslan"] },
      { id: "letmejoin", title: "Летмиджойн", authors: ["kirill"] },
      { id: "zine", title: "Зин про шрифты", authors: ["lora"] },
      { id: "stol", title: "Стол", authors: ["marat", "artem"] },
      { id: "rest", title: "Канал для душевного отдыха", authors: ["asya"] },
      { id: "dashboard", title: "Дашборд Планетария", authors: ["polina"] },
      { id: "course", title: "Лендинг курса о вёрстке", authors: ["zhenya"] },
      { id: "photobook", title: "Фотокнига о городе", authors: ["asya", "lora"] },
    ],

    // Четверги с 8 января по 30 июля 2026; 30 апреля и 11 июня Планетарий пропустил
    meetings: [
      { date: "2026-01-08", minutes: 57 },
      { date: "2026-01-15", minutes: 65 },
      { date: "2026-01-22", minutes: 55 },
      { date: "2026-01-29", minutes: 63 },
      { date: "2026-02-05", minutes: 58 },
      { date: "2026-02-12", minutes: 68 },
      { date: "2026-02-19", minutes: 58 },
      { date: "2026-02-26", minutes: 55 },
      { date: "2026-03-05", minutes: 59 },
      { date: "2026-03-12", minutes: 59 },
      { date: "2026-03-19", minutes: 63 },
      { date: "2026-03-26", minutes: 69 },
      { date: "2026-04-02", minutes: 68 },
      { date: "2026-04-09", minutes: 62 },
      { date: "2026-04-16", minutes: 68 },
      { date: "2026-04-23", minutes: 55 },
      { date: "2026-05-07", minutes: 69 },
      { date: "2026-05-14", minutes: 63 },
      { date: "2026-05-21", minutes: 57 },
      { date: "2026-05-28", minutes: 70 },
      { date: "2026-06-04", minutes: 57 },
      { date: "2026-06-18", minutes: 66 },
      { date: "2026-06-25", minutes: 66 },
      { date: "2026-07-02", minutes: 70 },
      { date: "2026-07-09", minutes: 67 },
      { date: "2026-07-16", minutes: 67 },
      { date: "2026-07-23", minutes: 67 },
      { date: "2026-07-30", minutes: 66 },
    ],

    // format — ручной ввод админа (1 рассказ / 2 экран / 3 слайды);
    // «4 продукт» не хранится, а вычисляется по дате публикации проекта
    demos: [
      { meeting: "2026-01-08", project: "gencover", presenters: ["polina", "zhenya"], minutes: 5, format: 2 },
      { meeting: "2026-01-08", project: "mark2", presenters: ["kristina"], minutes: 9, format: 1 },
      { meeting: "2026-01-15", project: "gencover", presenters: ["polina", "zhenya"], minutes: 5, format: 3 },
      { meeting: "2026-01-15", project: "mark2", presenters: ["kristina"], minutes: 12, format: 3 },
      { meeting: "2026-01-22", project: "ermolaev", presenters: ["artem"], minutes: 9, format: 1 },
      { meeting: "2026-01-22", project: "mark2", presenters: ["kristina"], minutes: 7, format: 2 },
      { meeting: "2026-01-29", project: "ermolaev", presenters: ["artem"], minutes: 6, format: 2 },
      { meeting: "2026-01-29", project: "ermolaev", presenters: ["artem"], minutes: 6, format: 2 },
      { meeting: "2026-01-29", project: "tgchannel", presenters: ["alena"], minutes: 5, format: 3 },
      { meeting: "2026-02-05", project: "gencover", presenters: ["polina", "zhenya"], minutes: 5, format: 2 },
      { meeting: "2026-02-05", project: "mark2", presenters: ["kristina"], minutes: 8, format: 3 },
      { meeting: "2026-02-12", project: "gencover", presenters: ["polina", "zhenya"], minutes: 7, format: 2 },
      { meeting: "2026-02-12", project: "pinterest", presenters: ["olya"], minutes: 7, format: 3 },
      { meeting: "2026-02-19", project: "ermolaev", presenters: ["artem"], minutes: 3, format: 3 },
      { meeting: "2026-02-19", project: "ermolaev", presenters: ["artem"], minutes: 8, format: 1 },
      { meeting: "2026-02-19", project: "tgchannel", presenters: ["alena"], minutes: 7, format: 2 },
      { meeting: "2026-02-26", project: "mark2", presenters: ["kristina"], minutes: 4, format: 2 },
      { meeting: "2026-02-26", project: "mark2", presenters: ["kristina"], minutes: 9, format: 2 },
      { meeting: "2026-03-05", project: "gencover", presenters: ["polina", "zhenya"], minutes: 3, format: 2 },
      { meeting: "2026-03-05", project: "portfolio", presenters: ["ruslan"], minutes: 5, format: 3 },
      { meeting: "2026-03-12", project: "mark2", presenters: ["kristina"], minutes: 6, format: 2 },
      { meeting: "2026-03-12", project: "rest", presenters: ["asya"], minutes: 3, format: 2 },
      { meeting: "2026-03-19", project: "ermolaev", presenters: ["artem"], minutes: 11, format: 2 },
      { meeting: "2026-03-19", project: "mark2", presenters: ["kristina"], minutes: 3, format: 2 },
      { meeting: "2026-03-19", project: "pinterest", presenters: ["olya"], minutes: 13, format: 2 },
      { meeting: "2026-03-26", project: "gencover", presenters: ["polina", "zhenya"], minutes: 2, format: 2 },
      { meeting: "2026-03-26", project: "portfolio", presenters: ["ruslan"], minutes: 11, format: 2 },
      { meeting: "2026-04-02", project: "mark2", presenters: ["kristina"], minutes: 4, format: 3 },
      { meeting: "2026-04-02", project: "portfolio", presenters: ["ruslan"], minutes: 4, format: 2 },
      { meeting: "2026-04-02", project: "rest", presenters: ["asya"], minutes: 5, format: 2 },
      { meeting: "2026-04-09", project: "letmejoin", presenters: ["kirill"], minutes: 7, format: 1 },
      { meeting: "2026-04-09", project: "pinterest", presenters: ["olya"], minutes: 8, format: 2 },
      { meeting: "2026-04-16", project: "ermolaev", presenters: ["artem"], minutes: 5, format: 2 },
      { meeting: "2026-04-16", project: "ermolaev", presenters: ["artem"], minutes: 13, format: 2 },
      { meeting: "2026-04-23", project: "aside", presenters: ["danya"], minutes: 5, format: 2 },
      { meeting: "2026-04-23", project: "aside", presenters: ["danya"], minutes: 2, format: 1 },
      { meeting: "2026-05-07", project: "ermolaev", presenters: ["artem"], minutes: 9, format: 2 },
      { meeting: "2026-05-07", project: "stol", presenters: ["marat", "artem"], minutes: 2, format: 2 },
      { meeting: "2026-05-14", project: "aside", presenters: ["danya"], minutes: 12, format: 2 },
      { meeting: "2026-05-14", project: "course", presenters: ["zhenya"], minutes: 8, format: 2 },
      { meeting: "2026-05-14", project: "dashboard", presenters: ["polina"], minutes: 7, format: 2 },
      { meeting: "2026-05-21", project: "letmejoin", presenters: ["kirill"], minutes: 5, format: 2 },
      { meeting: "2026-05-21", project: "mark2", presenters: ["kristina"], minutes: 4, format: 3 },
      { meeting: "2026-05-21", project: "pinterest", presenters: ["olya"], minutes: 10, format: 1 },
      { meeting: "2026-05-21", project: "zine", presenters: ["lora"], minutes: 3, format: 3 },
      { meeting: "2026-05-28", project: "ermolaev", presenters: ["artem"], minutes: 5, format: 3 },
      { meeting: "2026-05-28", project: "stol", presenters: ["marat", "artem"], minutes: 6, format: 1 },
      { meeting: "2026-06-04", project: "aside", presenters: ["danya"], minutes: 7, format: 2 },
      { meeting: "2026-06-04", project: "letmejoin", presenters: ["kirill"], minutes: 7, format: 3 },
      { meeting: "2026-06-04", project: "mark2", presenters: ["kristina"], minutes: 5, format: 2 },
      { meeting: "2026-06-04", project: "photobook", presenters: ["asya", "lora"], minutes: 12, format: 3 },
      { meeting: "2026-06-18", project: "stol", presenters: ["marat", "artem"], minutes: 6, format: 2 },
      { meeting: "2026-06-18", project: "zine", presenters: ["lora"], minutes: 14, format: 2 },
      { meeting: "2026-06-25", project: "course", presenters: ["zhenya"], minutes: 6, format: 3 },
      { meeting: "2026-06-25", project: "dashboard", presenters: ["polina"], minutes: 8, format: 2 },
      { meeting: "2026-06-25", project: "photobook", presenters: ["asya", "lora"], minutes: 7, format: 2 },
      { meeting: "2026-06-25", project: "stol", presenters: ["marat", "artem"], minutes: 9, format: 2 },
      { meeting: "2026-07-02", project: "mark2", presenters: ["kristina"], minutes: 7, format: 2 },
      { meeting: "2026-07-02", project: "photobook", presenters: ["lora"], minutes: 6, format: 2 },
      { meeting: "2026-07-09", project: "course", presenters: ["zhenya"], minutes: 8, format: 2 },
      { meeting: "2026-07-09", project: "mark2", presenters: ["kristina"], minutes: 6, format: 2 },
      { meeting: "2026-07-09", project: "pinterest", presenters: ["olya"], minutes: 5, format: 2 },
      { meeting: "2026-07-09", project: "stol", presenters: ["marat", "artem"], minutes: 9, format: 2 },
      { meeting: "2026-07-16", project: "dashboard", presenters: ["polina"], minutes: 6, format: 3 },
      { meeting: "2026-07-16", project: "stol", presenters: ["marat", "artem"], minutes: 5, format: 2 },
      { meeting: "2026-07-23", project: "photobook", presenters: ["asya", "lora"], minutes: 7, format: 2 },
      { meeting: "2026-07-23", project: "photobook", presenters: ["lora"], minutes: 2, format: 2 },
      { meeting: "2026-07-30", project: "photobook", presenters: ["asya", "lora"], minutes: 3, format: 3 },
      { meeting: "2026-07-30", project: "pinterest", presenters: ["olya"], minutes: 8, format: 1 },
    ],
  };

  // ---------------------------------------------------------------
  // Справочники и хелперы
  // ---------------------------------------------------------------

  const FORMATS = {
    1: {
      label: "просто рассказывает",
      short: "рассказ",
      color: "color-mix(in srgb, var(--ids__success) 28%, var(--ids__background))",
    },
    2: {
      label: "демонстрирует экран или камеру",
      short: "экран",
      color: "color-mix(in srgb, var(--ids__success) 52%, var(--ids__background))",
    },
    3: {
      label: "презентация со слайдами",
      short: "слайды",
      color: "color-mix(in srgb, var(--ids__success) 78%, var(--ids__background))",
    },
    4: { label: "опубликованный продукт", short: "продукт", color: "var(--ids__success)" },
  };

  const personById = Object.fromEntries(DB.persons.map((p) => [p.id, p]));
  const projectById = Object.fromEntries(DB.projects.map((p) => [p.id, p]));

  // Категориальные цвета проектов (для полос минут): равномерные оттенки по кругу
  const projectColor = {};
  DB.projects.forEach((p, i) => {
    projectColor[p.id] = `oklch(0.72 0.14 ${Math.round((i * 360) / DB.projects.length)})`;
  });

  const MONTHS = ["январь", "февраль", "март", "апрель", "май", "июнь", "июль"];
  const MONTHS_GEN = ["января", "февраля", "марта", "апреля", "мая", "июня", "июля"];
  const MONTHS_PREP = ["январе", "феврале", "марте", "апреле", "мае", "июне", "июле"];

  const monthOf = (iso) => +iso.slice(5, 7); // 1..7
  const dayOf = (iso) => +iso.slice(8, 10);
  const dnum = (iso) => Date.UTC(+iso.slice(0, 4), +iso.slice(5, 7) - 1, +iso.slice(8, 10));
  const fmtDate = (iso) => `${dayOf(iso)} ${MONTHS_GEN[monthOf(iso) - 1]}`;

  // Формат демо с учётом гибридного источника: после публикации проекта — всегда «4»
  const demoFormat = (d) => {
    const pub = projectById[d.project].published;
    return pub && d.meeting >= pub ? 4 : d.format;
  };

  const presenterNames = (d) => d.presenters.map((id) => personById[id].name.split(" ")[0]).join(", ");
  const authorNames = (p) => p.authors.map((id) => personById[id].name).join(", ");
  const durZone = (min) => (min < DB.norm.min ? "short" : min > DB.norm.max ? "long" : "norm");

  const median = (arr) => {
    if (!arr.length) return 0;
    const s = arr.slice().sort((a, b) => a - b);
    const m = s.length >> 1;
    return s.length % 2 ? s[m] : (s[m - 1] + s[m]) / 2;
  };

  // Стандартный тултип демо
  const demoTip = (d) => {
    const f = FORMATS[demoFormat(d)];
    return (
      `<b>${projectById[d.project].title}</b><br>` +
      `${presenterNames(d)} · ${fmtDate(d.meeting)}<br>` +
      `${d.minutes} мин · ${f.short}`
    );
  };

  // ---------------------------------------------------------------
  // Тултип (один на все графики, показывается у курсора)
  // ---------------------------------------------------------------

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

  // Показ ведётся по pointermove: так тултип не гаснет, когда элементы
  // смещаются под неподвижным курсором (например, столбик разъезжается на блоки)
  const updateTip = (e) => {
    const t = e.target.closest?.("[data-tip]");
    if (!t) {
      tip.classList.remove("visible");
      return;
    }
    const html = t.getAttribute("data-tip");
    if (tip.getAttribute("data-for") !== html) {
      tip.innerHTML = html;
      tip.setAttribute("data-for", html);
    }
    tip.classList.add("visible");
    moveTip(e);
  };
  document.addEventListener("pointermove", updateTip);
  document.addEventListener("pointerover", updateTip);
  document.addEventListener("pointerout", (e) => {
    if (!e.relatedTarget) tip.classList.remove("visible");
  });

  // ---------------------------------------------------------------
  // 1. Проекты в работе по месяцам
  // ---------------------------------------------------------------

  function renderViz1() {
    const el = document.getElementById("plviz1");
    if (!el) return;

    // проект «в работе» в месяце = принёс хотя бы одно демо
    const byMonth = MONTHS.map((_, i) => {
      const ids = [...new Set(DB.demos.filter((d) => monthOf(d.meeting) === i + 1).map((d) => d.project))];
      return ids.map((id) => ({
        project: projectById[id],
        demos: DB.demos.filter((d) => monthOf(d.meeting) === i + 1 && d.project === id).length,
      })).sort((a, b) => a.project.title.localeCompare(b.project.title, "ru"));
    });

    const cols = byMonth
      .map((items, i) => {
        const blocks = items
          .map(
            (it, j) =>
              `<div class="plviz1-block" data-month="${i}" data-idx="${j}" ` +
              `data-tip="<b>${it.project.title}</b><br>${authorNames(it.project)}"></div>`
          )
          .join("");
        return (
          `<div class="plviz1-col">` +
          `<div class="plviz1-count">${items.length}</div>` +
          `<div class="plviz1-stack">${blocks}</div>` +
          `<div class="plviz1-label">${MONTHS[i]}</div>` +
          `</div>`
        );
      })
      .join("");

    el.innerHTML =
      `<div class="plviz1-chart">${cols}</div>` +
      `<p class="plviz-info" id="plviz1-info">Наведите на столбик — он разобьётся на проекты. Клик по блоку покажет проект и авторов.</p>`;

    const info = el.querySelector("#plviz1-info");
    el.querySelectorAll(".plviz1-block").forEach((b) => {
      b.addEventListener("click", () => {
        el.querySelectorAll(".plviz1-block.selected").forEach((x) => x.classList.remove("selected"));
        b.classList.add("selected");
        const it = byMonth[+b.dataset.month][+b.dataset.idx];
        info.innerHTML =
          `<b>${it.project.title}</b> — ${authorNames(it.project)}. ` +
          `В ${MONTHS_PREP[+b.dataset.month]} — ` +
          `${it.demos} демо${it.project.published ? `, проект опубликован ${fmtDate(it.project.published)}` : ""}.`;
      });
    });
  }

  // ---------------------------------------------------------------
  // 2. Лента демо по встречам
  // ---------------------------------------------------------------

  function renderViz2() {
    const el = document.getElementById("plviz2");
    if (!el) return;

    let seenMonth = 0;
    const cols = DB.meetings
      .map((m, idx) => {
        const demos = DB.demos.filter((d) => d.meeting === m.date);
        const squares = demos
          .map((d) => {
            const f = demoFormat(d);
            return `<div class="plviz2-sq" data-format="${f}" style="background:${FORMATS[f].color}" data-tip="${demoTip(d)}"></div>`;
          })
          .join("");
        const mo = monthOf(m.date);
        const monthStart = mo !== seenMonth;
        const label = monthStart ? MONTHS[mo - 1].slice(0, 3) : "";
        seenMonth = mo;
        const monthClass = monthStart && idx > 0 ? " plviz2-col--month" : "";
        return (
          `<div class="plviz2-col${monthClass}" data-tip="Встреча ${fmtDate(m.date)} · ${m.minutes} мин · ${demos.length} демо">` +
          `<div class="plviz2-stack">${squares}</div>` +
          `<div class="plviz2-label">${label}</div>` +
          `</div>`
        );
      })
      .join("");

    const legendEl = document.getElementById("plviz2-legend");
    const legend = [1, 2, 3, 4]
      .map(
        (f) =>
          `<button class="plviz-legend-item" data-format="${f}">` +
          `<i style="background:${FORMATS[f].color}"></i>${FORMATS[f].label}</button>`
      )
      .join("");

    if (legendEl) legendEl.innerHTML = legend;
    el.innerHTML = `<div class="plviz-scroll"><div class="plviz2-chart">${cols}</div></div>`;

    let active = null;
    const legendRoot = legendEl || el;
    legendRoot.querySelectorAll(".plviz-legend-item").forEach((btn) => {
      btn.addEventListener("click", () => {
        active = active === btn.dataset.format ? null : btn.dataset.format;
        legendRoot.querySelectorAll(".plviz-legend-item").forEach((x) =>
          x.classList.toggle("off", active !== null && x.dataset.format !== active)
        );
        el.querySelectorAll(".plviz2-sq").forEach((sq) =>
          sq.classList.toggle("dim", active !== null && sq.dataset.format !== active)
        );
      });
    });
  }

  // ---------------------------------------------------------------
  // 3. Разброс длительностей демо
  // ---------------------------------------------------------------

  function renderViz3() {
    const el = document.getElementById("plviz3");
    if (!el) return;

    const PERIODS = {
      all: { label: "Всё время", from: "2026-01-01" },
      quarter: { label: "Квартал", from: "2026-05-01" },
      month: { label: "Месяц", from: "2026-07-01" },
    };
    const ZONES = {
      short: { label: "короче нормы", color: "var(--ids__code)" },
      norm: { label: "в норме 5–7 минут", color: "var(--ids__success)" },
      long: { label: "длиннее нормы", color: "var(--ids__accent)" },
    };

    const W = 720, H = 260, padL = 34, padR = 12, padT = 12, padB = 28;
    const innerW = W - padL - padR, innerH = H - padT - padB;
    const MAXMIN = 15;
    const yOf = (v) => padT + (1 - v / MAXMIN) * innerH;

    let period = "all";

    function draw() {
      const from = PERIODS[period].from;
      const t0 = dnum(from), t1 = dnum("2026-08-01");
      const xOf = (iso) => padL + ((dnum(iso) - t0) / (t1 - t0)) * innerW;

      const demos = DB.demos.filter((d) => d.meeting >= from);

      // разводим точки одной встречи с одинаковыми минутами, чтобы не слипались
      const seen = {};
      const dots = demos
        .map((d) => {
          const key = d.meeting + "|" + d.minutes;
          const k = (seen[key] = (seen[key] || 0) + 1) - 1;
          const zone = durZone(d.minutes);
          return (
            `<circle cx="${(xOf(d.meeting) + k * 7).toFixed(1)}" cy="${yOf(d.minutes).toFixed(1)}" r="5" ` +
            `fill="${ZONES[zone].color}" fill-opacity="0.85" data-tip="${demoTip(d)}"/>`
          );
        })
        .join("");

      // сетка: 0, 5, 7, 10, 15 минут
      const grid = [0, 5, 7, 10, 15]
        .map(
          (v) =>
            `<line x1="${padL}" y1="${yOf(v)}" x2="${W - padR}" y2="${yOf(v)}" class="plviz3-grid"/>` +
            `<text x="${padL - 7}" y="${yOf(v) + 4}" class="plviz3-tick" text-anchor="end">${v}</text>`
        )
        .join("");

      // подписи месяцев в выбранном периоде
      const monthTicks = MONTHS.map((name, i) => {
        const iso = `2026-0${i + 1}-01`;
        if (dnum(iso) < t0) return "";
        return `<text x="${xOf(iso)}" y="${H - 8}" class="plviz3-tick">${name.slice(0, 3)}</text>`;
      }).join("");

      const band =
        `<rect x="${padL}" y="${yOf(DB.norm.max)}" width="${innerW}" ` +
        `height="${yOf(DB.norm.min) - yOf(DB.norm.max)}" class="plviz3-band"/>` +
        `<text x="${W - padR - 4}" y="${yOf(DB.norm.max) - 5}" class="plviz3-tick" text-anchor="end">норма 5–7 минут</text>`;

      el.querySelector(".plviz3-svg").innerHTML =
        `<svg viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg">${band}${grid}${monthTicks}${dots}</svg>`;
    }

    const buttons = Object.entries(PERIODS)
      .map(([k, p]) => `<button class="plviz-btn${k === period ? " active" : ""}" data-period="${k}">${p.label}</button>`)
      .join("");
    const legend = Object.values(ZONES)
      .map((z) => `<span class="plviz-legend-item static"><i style="background:${z.color}"></i>${z.label}</span>`)
      .join("");

    el.innerHTML =
      `<div class="plviz-btns">${buttons}</div>` +
      `<div class="plviz3-svg"></div>` +
      `<div class="plviz-legend">${legend}</div>`;

    el.querySelectorAll(".plviz-btn").forEach((b) => {
      b.addEventListener("click", () => {
        period = b.dataset.period;
        el.querySelectorAll(".plviz-btn").forEach((x) => x.classList.toggle("active", x === b));
        draw();
      });
    });
    draw();
  }

  // ---------------------------------------------------------------
  // 4. Треки проектов до публикации
  // ---------------------------------------------------------------

  function renderViz4() {
    const el = document.getElementById("plviz4");
    if (!el) return;

    const t0 = dnum("2026-01-01"), t1 = dnum("2026-08-01");
    const pct = (iso) => (((dnum(iso) - t0) / (t1 - t0)) * 100).toFixed(2);

    const rows = DB.projects
      .map((p) => {
        const demos = DB.demos.filter((d) => d.project === p.id);
        return { p, demos, first: demos[0]?.meeting, last: demos[demos.length - 1]?.meeting };
      })
      .filter((r) => r.demos.length)
      .sort((a, b) => a.first.localeCompare(b.first));

    // вертикальные линии месяцев
    const vlines = MONTHS.map((name, i) => {
      const iso = `2026-0${i + 1}-01`;
      return (
        `<div class="plviz4-vline" style="left:${pct(iso)}%"></div>` +
        `<div class="plviz4-month" style="left:${pct(iso)}%">${name.slice(0, 3)}</div>`
      );
    }).join("");

    const rowsHTML = rows
      .map((r, i) => {
        const lineEnd = r.p.published && r.p.published > r.last ? r.p.published : r.last;
        const line = `<div class="plviz4-line" style="left:${pct(r.first)}%;width:${(pct(lineEnd) - pct(r.first)).toFixed(2)}%"></div>`;
        const seen = {};
        const dots = r.demos
          .map((d) => {
            const k = (seen[d.meeting] = (seen[d.meeting] || 0) + 1) - 1;
            return `<span class="plviz4-dot" style="left:${pct(d.meeting)}%;margin-top:${k % 2 ? -0.45 : 0}em" data-tip="${demoTip(d)}"></span>`;
          })
          .join("");
        const pub = r.p.published
          ? `<span class="plviz4-pub" style="left:${pct(r.p.published)}%" data-tip="<b>${r.p.title}</b><br>опубликован ${fmtDate(r.p.published)}"></span>`
          : "";
        return (
          `<div class="plviz4-row" data-idx="${i}">` +
          `<div class="plviz4-name">${r.p.title}</div>` +
          `<div class="plviz4-track">${line}${dots}${pub}</div>` +
          `</div>`
        );
      })
      .join("");

    el.innerHTML =
      `<div class="plviz4-chart"><div class="plviz4-axis">${vlines}</div>${rowsHTML}</div>` +
      `<div class="plviz-legend">` +
      `<span class="plviz-legend-item static"><i class="plviz4-dot-demo"></i>демо</span>` +
      `<span class="plviz-legend-item static"><i class="plviz4-pub-demo"></i>публикация</span>` +
      `</div>` +
      `<p class="plviz-info" id="plviz4-info">Кликните по строке проекта — покажем путь от первого демо до публикации.</p>`;

    const info = el.querySelector("#plviz4-info");
    el.querySelectorAll(".plviz4-row").forEach((row) => {
      row.addEventListener("click", () => {
        const on = row.classList.contains("active");
        el.querySelectorAll(".plviz4-row").forEach((x) => x.classList.remove("active"));
        if (on) {
          info.innerHTML = "Кликните по строке проекта — покажем путь от первого демо до публикации.";
          return;
        }
        row.classList.add("active");
        const r = rows[+row.dataset.idx];
        let path;
        if (r.p.published) {
          const days = Math.round((dnum(r.p.published) - dnum(r.first)) / 86400000);
          const mtgs = DB.meetings.filter((m) => m.date >= r.first && m.date <= r.p.published).length;
          path = `от первого демо (${fmtDate(r.first)}) до публикации (${fmtDate(r.p.published)}) — ${days} дней, ${mtgs} встреч`;
        } else {
          path = `первое демо ${fmtDate(r.first)}, пока не опубликован`;
        }
        info.innerHTML = `<b>${r.p.title}</b> — ${authorNames(r.p)}. Демо: ${r.demos.length}; ${path}.`;
      });
    });
  }

  // ---------------------------------------------------------------
  // 5. Минуты демо по персонам
  // ---------------------------------------------------------------

  function renderViz5() {
    const el = document.getElementById("plviz5");
    if (!el) return;

    // содокладчики получают полный зачёт каждый
    const rows = DB.persons
      .map((p) => {
        const demos = DB.demos.filter((d) => d.presenters.includes(p.id));
        return { p, demos, total: demos.reduce((s, d) => s + d.minutes, 0) };
      })
      .filter((r) => r.demos.length)
      .sort((a, b) => b.total - a.total);

    const maxTotal = rows[0].total;
    // в минутах сообщества каждое демо считается один раз
    const communityTotal = DB.demos.reduce((s, d) => s + d.minutes, 0);

    const rowsHTML = rows
      .map((r, i) => {
        const segs = r.demos
          .map(
            (d) =>
              `<span class="plviz5-seg" style="width:${((d.minutes / maxTotal) * 100).toFixed(2)}%;` +
              `background:${projectColor[d.project]}" data-tip="${demoTip(d)}"></span>`
          )
          .join("");
        return (
          `<div class="plviz5-row" data-idx="${i}">` +
          `<div class="plviz5-name">${r.p.name.split(" ")[0]}</div>` +
          `<div class="plviz5-bar">${segs}</div>` +
          `<div class="plviz5-total">${r.total} мин</div>` +
          `</div>`
        );
      })
      .join("");

    el.innerHTML =
      `<div class="plviz5-chart">${rowsHTML}</div>` +
      `<p class="plviz-info" id="plviz5-info">Цвет сегмента — проект, длина — минуты. Кликните по строке, чтобы посмотреть на человека внимательнее.</p>`;

    const info = el.querySelector("#plviz5-info");
    el.querySelectorAll(".plviz5-row").forEach((row) => {
      row.addEventListener("click", () => {
        const on = row.classList.contains("on");
        el.querySelectorAll(".plviz5-row").forEach((x) => x.classList.remove("on"));
        el.querySelector(".plviz5-chart").classList.toggle("focus", !on);
        if (on) {
          info.innerHTML = "Цвет сегмента — проект, длина — минуты. Кликните по строке, чтобы посмотреть на человека внимательнее.";
          return;
        }
        row.classList.add("on");
        const r = rows[+row.dataset.idx];
        const projs = new Set(r.demos.map((d) => d.project)).size;
        const share = ((r.total / communityTotal) * 100).toFixed(0);
        info.innerHTML =
          `<b>${r.p.name}</b>: ${r.total} мин в ${r.demos.length} демо о ${projs} проект${projs === 1 ? "е" : "ах"} · ` +
          `медиана ${median(r.demos.map((d) => d.minutes))} мин · ${share}% всех минут демо сообщества.`;
      });
    });
  }

  // ---------------------------------------------------------------

  function init() {
    renderViz1();
    renderViz2();
    renderViz3();
    renderViz4();
    renderViz5();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
