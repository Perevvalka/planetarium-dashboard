// Админка единой базы PlanetariumDB.
// Черновик — localStorage; «На прод» пишет js/db.js в main и в wip.

(() => {
  "use strict";

  const STORAGE_EDIT = "planetarium-db-draft";
  const STORAGE_LIVE = "planetarium-db-draft-live";
  const source = window.PlanetariumDB;
  if (!source) {
    console.error("PlanetariumDB не загружена");
    return;
  }

  let adminMode = "live";
  const storageKey = () => (adminMode === "live" ? STORAGE_LIVE : STORAGE_EDIT);

  const clone = (v) => JSON.parse(JSON.stringify(v));

  const isBlank = (v) => v == null || v === "";

  // Пустые поля в базе не хранятся: вместо null просто нет ключа.
  const setField = (obj, key, value) => {
    if (isBlank(value)) delete obj[key];
    else obj[key] = value;
  };

  const compactItem = (obj) => {
    const out = {};
    Object.entries(obj).forEach(([key, value]) => {
      if (!isBlank(value)) out[key] = value;
    });
    return out;
  };

  // Приводит базу любой версии к текущей схеме: явка — объект «дата → id людей»,
  // пустые поля и заметки не хранятся. Нужно для старых черновиков и файлов с прода.
  const normalizeDb = (data) => {
    const out = data && typeof data === "object" ? data : {};
    ["persons", "projects", "meetings", "demos", "feedback"].forEach((key) => {
      if (!Array.isArray(out[key])) out[key] = [];
    });

    if (Array.isArray(out.attendance)) {
      const byDate = {};
      out.attendance.forEach((a) => {
        if (!a || !a.meeting || !a.person) return;
        if (!byDate[a.meeting]) byDate[a.meeting] = [];
        if (!byDate[a.meeting].includes(a.person)) byDate[a.meeting].push(a.person);
      });
      out.attendance = byDate;
    } else if (!out.attendance || typeof out.attendance !== "object") {
      out.attendance = {};
    } else {
      Object.entries(out.attendance).forEach(([date, people]) => {
        if (!Array.isArray(people) || !people.length) delete out.attendance[date];
      });
    }

    const prune = (item, keys) => {
      delete item.note;
      keys.forEach((key) => {
        if (isBlank(item[key])) delete item[key];
      });
    };
    out.persons.forEach((p) => {
      prune(p, ["telegram", "photo"]);
      if (p.active !== true) delete p.active;
    });
    out.projects.forEach((p) => prune(p, ["url"]));
    out.meetings.forEach((m) => {
      prune(m, ["minutes"]);
      if (!m.generated) delete m.generated;
    });
    out.demos.forEach((d) => prune(d, ["minutes", "format"]));
    return out;
  };

  normalizeDb(source);

  const mergeMissingFromSource = (draft, file) => {
    const added = {
      persons: 0,
      projects: [],
      meetings: 0,
      demos: 0,
      attendance: 0,
      feedback: 0,
    };
    const addBy = (key, idOf) => {
      if (!Array.isArray(draft[key])) draft[key] = [];
      const have = new Set(draft[key].map(idOf));
      (file[key] || []).forEach((item) => {
        const id = idOf(item);
        if (have.has(id)) return;
        draft[key].push(clone(item));
        have.add(id);
        if (key === "projects") added.projects.push(item.title);
        else added[key]++;
      });
    };
    addBy("persons", (x) => x.id);
    addBy("projects", (x) => x.id);
    addBy("meetings", (x) => x.date);
    addBy("demos", (x) => x.id);
    if (!draft.attendance || typeof draft.attendance !== "object") draft.attendance = {};
    Object.entries(file.attendance || {}).forEach(([date, people]) => {
      if (!Array.isArray(draft.attendance[date])) draft.attendance[date] = [];
      const list = draft.attendance[date];
      people.forEach((person) => {
        if (list.includes(person)) return;
        list.push(person);
        added.attendance++;
      });
    });
    if (!Array.isArray(draft.feedback)) draft.feedback = [];
    addBy("feedback", (x) => `${x.demo}::${x.person}`);
    return added;
  };

  const fillEmptyFromSource = (draft, file) => {
    let filled = 0;
    const fillBy = (key, idOf, fields) => {
      const srcMap = new Map((file[key] || []).map((item) => [idOf(item), item]));
      (draft[key] || []).forEach((item) => {
        const src = srcMap.get(idOf(item));
        if (!src) return;
        fields.forEach((field) => {
          if (isBlank(item[field]) && !isBlank(src[field])) {
            item[field] = src[field];
            filled++;
          }
        });
        if ((key === "meetings" || key === "demos") && src.generated) {
          if (item.minutes === src.minutes && !item.generated) {
            item.generated = true;
            filled++;
          }
        }
      });
    };
    fillBy("meetings", (x) => x.date, ["minutes"]);
    fillBy("demos", (x) => x.id, ["minutes", "format"]);
    fillBy("persons", (x) => x.id, ["name", "telegram", "photo"]);
    fillBy("projects", (x) => x.id, ["url"]);
    return filled;
  };

  const addedCount = (added) =>
    added.projects.length +
    added.persons +
    added.meetings +
    added.demos +
    added.attendance +
    added.feedback;

  // Черновик старше подписок: переносим флаги из файла целиком, иначе при выгрузке
  // на сайт они пропали бы. Если в черновике есть хоть один флаг — подписки уже
  // ведут в нём, и снятую галку возвращать нельзя.
  const adoptActiveFlags = (draft, file) => {
    const anyActive = (list) => (list || []).some((p) => p.active);
    if (!anyActive(file.persons) || anyActive(draft.persons)) return 0;
    const fromFile = new Map((file.persons || []).map((p) => [p.id, p]));
    let filled = 0;
    (draft.persons || []).forEach((p) => {
      if (!fromFile.get(p.id)?.active) return;
      p.active = true;
      filled++;
    });
    return filled;
  };

  // Значения, которые в файле уже другие: черновик их перекроет при выгрузке.
  const staleFields = (draft, file) => {
    const out = [];
    const persons = new Map((draft.persons || []).map((p) => [p.id, p]));
    (file.persons || []).forEach((p) => {
      const mine = persons.get(p.id);
      if (!mine) return;
      if (mine.name !== p.name) out.push(`${p.name}: имя`);
      if (Boolean(mine.active) !== Boolean(p.active)) out.push(`${p.name}: подписка`);
    });
    const meetings = new Map((draft.meetings || []).map((m) => [m.date, m]));
    (file.meetings || []).forEach((m) => {
      const mine = meetings.get(m.date);
      if (mine && (mine.minutes ?? null) !== (m.minutes ?? null)) out.push(`${m.date}: минуты`);
    });
    return out;
  };

  const syncDraftFromSource = (draft, file) =>
    addedCount(mergeMissingFromSource(draft, file)) +
    fillEmptyFromSource(draft, file) +
    adoptActiveFlags(draft, file);

  const parseDbFile = (text) => {
    const match = String(text).match(/const PlanetariumDB = (\{[\s\S]*\});/);
    if (!match) return null;
    try {
      return normalizeDb(JSON.parse(match[1]));
    } catch {
      return null;
    }
  };

  const loadStoredDraft = (key) => {
    try {
      const raw = localStorage.getItem(key);
      if (!raw) return null;
      const parsed = normalizeDb(JSON.parse(raw));
      syncDraftFromSource(parsed, source);
      localStorage.setItem(key, JSON.stringify(parsed));
      return parsed;
    } catch (_) {
      return null;
    }
  };

  const freshDb = () => normalizeDb(clone(source));

  let liveDb = loadStoredDraft(STORAGE_LIVE) || freshDb();
  let editDb = loadStoredDraft(STORAGE_EDIT) || freshDb();
  let db = liveDb;

  const setStatus = (msg, ok) => {
    document.querySelectorAll(".pdb-status").forEach((el) => {
      el.textContent = msg || "";
      el.classList.toggle("is-ok", Boolean(ok && msg));
    });
  };

  const MONTHS_GEN = [
    "января", "февраля", "марта", "апреля", "мая", "июня",
    "июля", "августа", "сентября", "октября", "ноября", "декабря",
  ];

  const todayIso = () => {
    const d = new Date();
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${y}-${m}-${day}`;
  };

  const fmtDateRu = (iso) => {
    if (!iso) return "";
    const parts = String(iso).split("-");
    if (parts.length !== 3) return iso;
    const y = +parts[0];
    const m = +parts[1];
    const d = +parts[2];
    if (!y || !m || !d || !MONTHS_GEN[m - 1]) return iso;
    return `${d} ${MONTHS_GEN[m - 1]} ${y}`;
  };

  const revealListItem = (list, selector) => {
    const li = list?.querySelector(selector);
    if (!li) return;
    li.classList.add("just-saved");
    li.scrollIntoView({ block: "nearest", behavior: "smooth" });
    window.setTimeout(() => li.classList.remove("just-saved"), 1600);
  };

  const flashSubmit = (form, label) => {
    const btn = form.querySelector("button[type=submit]");
    if (!btn) return;
    const orig = btn.dataset.origLabel || btn.textContent;
    btn.dataset.origLabel = orig;
    btn.textContent = label;
    window.setTimeout(() => {
      if (btn.textContent === label) btn.textContent = orig;
    }, 1600);
  };

  const MAP = {
    а: "a", б: "b", в: "v", г: "g", д: "d", е: "e", ё: "e", ж: "zh", з: "z",
    и: "i", й: "y", к: "k", л: "l", м: "m", н: "n", о: "o", п: "p", р: "r",
    с: "s", т: "t", у: "u", ф: "f", х: "h", ц: "ts", ч: "ch", ш: "sh", щ: "sch",
    ъ: "", ы: "y", ь: "", э: "e", ю: "yu", я: "ya", " ": "-", "…": "", "?": "",
    "«": "", "»": "", ".": "-", ",": "", "'": "", "’": "", "/": "-",
  };

  const slug = (s) =>
    String(s)
      .toLowerCase()
      .split("")
      .map((c) => MAP[c] ?? (/[a-z0-9-]/.test(c) ? c : ""))
      .join("")
      .replace(/-+/g, "-")
      .replace(/^-|-$/g, "") || "id";

  const uniqueId = (base, existing) => {
    let id = base;
    let i = 2;
    while (existing.has(id)) id = `${base}-${i++}`;
    return id;
  };

  const personName = (id) => db.persons.find((p) => p.id === id)?.name || id;
  const projectTitle = (id) => db.projects.find((p) => p.id === id)?.title || id;

  const empty = (v) => {
    const t = typeof v === "string" ? v.trim() : v;
    return t === "" || t == null ? null : t;
  };

  const numOrNull = (v) => {
    if (v === "" || v == null) return null;
    const n = Number(v);
    return Number.isFinite(n) ? n : null;
  };

  // ---------------------------------------------------------------
  // Serialize → planetarium-db.json и js/db.js
  // ---------------------------------------------------------------

  const dbPayload = (data = db) => {
    const attendance = {};
    Object.keys(data.attendance || {})
      .sort((a, b) => a.localeCompare(b))
      .forEach((date) => {
        const people = data.attendance[date];
        if (Array.isArray(people) && people.length) attendance[date] = people;
      });
    return {
      persons: data.persons.map((p) =>
        compactItem({
          id: p.id,
          name: p.name,
          active: p.active ? true : undefined,
          telegram: p.telegram,
          photo: p.photo,
        })
      ),
      projects: data.projects.map((p) =>
        compactItem({ id: p.id, title: p.title, url: p.url, authors: p.authors })
      ),
      meetings: data.meetings.map((m) =>
        compactItem({
          date: m.date,
          type: m.type,
          minutes: m.minutes,
          generated: m.generated ? true : undefined,
        })
      ),
      attendance,
      demos: data.demos.map((d) =>
        compactItem({
          id: d.id,
          meeting: d.meeting,
          project: d.project,
          presenters: d.presenters,
          minutes: d.minutes,
          format: d.format,
        })
      ),
      feedback: data.feedback || [],
    };
  };

  // Файл для загрузки на сайт: чистый JSON, без JS-обёртки.
  const serializeJson = (data = db) => `${JSON.stringify(dbPayload(data), null, 2)}\n`;

  const serializeFile = (data = db) =>
    `// Единая база данных Планетария.\n` +
    `// Источник правды для визуализаций и админки.\n` +
    `// Реальные данные: посещения еженедельных встреч + демо-эфиры.\n` +
    `// Пустые поля не хранятся: отсутствие ключа = значение не задано.\n` +
    `// attendance — явка, сгруппированная по дате встречи.\n` +
    `// active: true — активная подписка; у остальных поля нет.\n` +
    `// generated: true — длительность не замерена, а проставлена приблизительно.\n\n` +
    `(() => {\n` +
    `  "use strict";\n\n` +
    `  const PlanetariumDB = ${JSON.stringify(dbPayload(data), null, 2)};\n\n` +
    `  if (typeof window !== "undefined") window.PlanetariumDB = PlanetariumDB;\n` +
    `  if (typeof module !== "undefined" && module.exports) module.exports = PlanetariumDB;\n` +
    `})();\n`;

  const download = (name, text, type) => {
    const blob = new Blob([text], { type });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = name;
    a.click();
    URL.revokeObjectURL(a.href);
    setStatus(`Файл ${name} скачан`);
  };

  const downloadDb = () => download("db.js", serializeFile(), "text/javascript;charset=utf-8");

  const downloadJson = () =>
    download("planetarium-db.json", serializeJson(), "application/json;charset=utf-8");

  const copyJson = async () => {
    try {
      await navigator.clipboard.writeText(serializeJson());
      setStatus("JSON скопирован в буфер");
    } catch {
      setStatus("Не удалось скопировать");
    }
  };

  const persistDraft = () => {
    localStorage.setItem(storageKey(), JSON.stringify(db));
  };

  const persistAllDrafts = () => {
    localStorage.setItem(STORAGE_LIVE, JSON.stringify(liveDb));
    localStorage.setItem(STORAGE_EDIT, JSON.stringify(editDb));
  };

  const formField = (form, name) => form.elements.namedItem(name);

  const saveDraft = () => {
    persistDraft();
    renderAll();
  };

  // ---------------------------------------------------------------
  // Tabs
  // ---------------------------------------------------------------

  const switchTab = (id) => {
    document.querySelectorAll(".pdb-tabs [role='tab']").forEach((t) => {
      t.setAttribute("aria-selected", t.dataset.tab === id ? "true" : "false");
    });
    document.querySelectorAll(".pdb-panel").forEach((p) => {
      p.hidden = p.dataset.panel !== id;
    });
    if (id === "summary") renderSummary();
    if (id === "export") {
      document.getElementById("pdb-preview").textContent = serializeFile();
    }
    history.replaceState(null, "", `#${id}`);
  };

  document.querySelectorAll(".pdb-tabs [role='tab']").forEach((tab) => {
    tab.addEventListener("click", () => switchTab(tab.dataset.tab));
  });

  // ---------------------------------------------------------------
  // Checkbox helpers
  // ---------------------------------------------------------------

  const normalizeSearch = (s) =>
    String(s)
      .toLowerCase()
      .replace(/ё/g, "е")
      .trim();

  const fillPersonChecks = (host, selected) => {
    const set = new Set(selected || []);
    const sorted = db.persons.slice().sort((a, b) => a.name.localeCompare(b.name, "ru"));
    const picker = host.closest(".pdb-person-picker");
    const search = picker?.querySelector(".pdb-search");
    const query = normalizeSearch(search?.value || "");

    if (!sorted.length) {
      host.innerHTML = `<span class="pdb-empty">Сначала добавь персон</span>`;
      return;
    }

    host.innerHTML = sorted
      .map((p) => {
        const match = !query || normalizeSearch(p.name).includes(query);
        return (
          `<label${match ? "" : " hidden"}>` +
          `<input type="checkbox" value="${p.id}"${set.has(p.id) ? " checked" : ""}> ` +
          `${escapeHtml(p.name)}</label>`
        );
      })
      .join("");

    const visible = host.querySelectorAll("label:not([hidden])").length;
    if (query && !visible) {
      host.insertAdjacentHTML(
        "beforeend",
        `<span class="pdb-empty">Никого не найдено</span>`
      );
    }

    if (search && !search.dataset.bound) {
      search.dataset.bound = "1";
      search.addEventListener("input", () => {
        fillPersonChecks(host, checkedValues(host));
      });
    }
  };

  const checkedValues = (host) =>
    [...host.querySelectorAll("input[type=checkbox]:checked")].map((el) => el.value);

  const escapeHtml = (s) =>
    String(s)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");

  const fillMeetingSelect = (select, selected, filterFn) => {
    const items = db.meetings
      .filter(filterFn || (() => true))
      .slice()
      .sort((a, b) => b.date.localeCompare(a.date));
    select.innerHTML = items
      .map((m) => {
        return `<option value="${m.date}"${m.date === selected ? " selected" : ""}>${fmtDateRu(m.date)}</option>`;
      })
      .join("");
  };

  const authorsLabel = (p) => (p.authors || []).map(personName).join(", ");

  const projectMatchesQuery = (p, query) => {
    if (!query) return true;
    return normalizeSearch(`${p.title} ${authorsLabel(p)}`).includes(query);
  };

  const fillProjectRadios = (host, selected, opts = {}) => {
    const name = opts.name || host?.dataset.radioName || "project";
    if (host) host.dataset.radioName = name;
    const set = selected || "";
    const picker = host.closest(".pdb-person-picker");
    const search = picker?.querySelector(".pdb-search");
    const query = normalizeSearch(search?.value || "");
    const items = db.projects.slice().sort((a, b) => a.title.localeCompare(b.title, "ru"));

    if (!items.length) {
      host.innerHTML = `<span class="pdb-empty">Сначала добавь проект</span>`;
      return;
    }

    host.innerHTML = items
      .map((p) => {
        const match = projectMatchesQuery(p, query);
        const authors = authorsLabel(p);
        const extra = [authors, p.url ? "ссылка" : ""].filter(Boolean).join(" · ");
        const req = name === "project" ? " required" : "";
        return (
          `<label${match ? "" : " hidden"}>` +
          `<input type="radio" name="${name}" value="${p.id}"${p.id === set ? " checked" : ""}${req}> ` +
          `<span>${escapeHtml(p.title)}` +
          (extra ? `<span class="meta"> · ${escapeHtml(extra)}</span>` : "") +
          `</span></label>`
        );
      })
      .join("");

    const visible = host.querySelectorAll("label:not([hidden])").length;
    if (query && !visible) {
      host.insertAdjacentHTML("beforeend", `<span class="pdb-empty">Ничего не найдено</span>`);
    }

    if (search && !search.dataset.bound) {
      search.dataset.bound = "1";
      search.addEventListener("input", () => {
        const current = host.querySelector("input[type=radio]:checked")?.value || "";
        fillProjectRadios(host, current, { name });
      });
    }
  };

  const selectedProjectId = (host) =>
    (host || document.getElementById("demo-project"))?.querySelector(
      "input[type=radio]:checked"
    )?.value || "";

  const selectedFormat = () =>
    document.querySelector("#demo-format input[name=format]:checked")?.value || "";

  const projectHasUrl = (projectId) => {
    const p = db.projects.find((x) => x.id === projectId);
    return Boolean(p?.url);
  };

  // Введённая руками длительность перестаёт быть восстановленной по формуле.
  const setMeetingMinutes = (meeting, minutes) => {
    if (minutes === (meeting.minutes ?? null)) return;
    setField(meeting, "minutes", minutes);
    delete meeting.generated;
  };

  const ensureMeeting = (date, extra = {}) => {
    if (!date) return null;
    let m = db.meetings.find((x) => x.date === date);
    if (!m) {
      m = { date, type: "weekly" };
      db.meetings.push(m);
      db.meetings.sort((a, b) => a.date.localeCompare(b.date));
    }
    m.type = "weekly";
    if (Object.prototype.hasOwnProperty.call(extra, "minutes")) {
      setMeetingMinutes(m, extra.minutes);
    }
    return m;
  };

  const attendanceOf = (date) => db.attendance[date] || [];

  const writeAttendance = (date, people) => {
    if (people.length) db.attendance[date] = people.slice();
    else delete db.attendance[date];
  };

  const moveAttendance = (from, to) => {
    if (from === to || !db.attendance[from]) return;
    db.attendance[to] = db.attendance[from];
    delete db.attendance[from];
  };

  const dropPersonFromAttendance = (person) => {
    Object.keys(db.attendance).forEach((date) => {
      writeAttendance(date, db.attendance[date].filter((p) => p !== person));
    });
  };

  const upsertPerson = ({ id, name, active, telegram, photo }) => {
    const person = id ? db.persons.find((x) => x.id === id) : null;
    if (id && !person) return null;
    if (person) {
      person.name = name;
      setField(person, "active", active ? true : null);
      setField(person, "telegram", telegram);
      setField(person, "photo", photo);
      return id;
    }
    const ids = new Set(db.persons.map((p) => p.id));
    const newId = uniqueId(slug(name), ids);
    db.persons.push(
      compactItem({ id: newId, name, active: active ? true : undefined, telegram, photo })
    );
    return newId;
  };

  const upsertProject = ({ id, title, url, authors }) => {
    const project = id ? db.projects.find((x) => x.id === id) : null;
    if (id && !project) return null;
    if (project) {
      project.title = title;
      setField(project, "url", url);
      project.authors = authors;
      return id;
    }
    const ids = new Set(db.projects.map((p) => p.id));
    const newId = uniqueId(slug(title), ids);
    db.projects.push(compactItem({ id: newId, title, url, authors }));
    return newId;
  };

  const writeDemo = (demo, { meeting, project, presenters, minutes, format }) => {
    demo.meeting = meeting;
    demo.project = project;
    demo.presenters = presenters;
    setField(demo, "minutes", minutes);
    setField(demo, "format", format);
    return demo;
  };

  const setDemoFormat = (value) => {
    document.querySelectorAll("#demo-format input[name=format]").forEach((input) => {
      input.checked = value != null && String(input.value) === String(value);
    });
  };

  const syncDemoFormatUI = () => {
    const block = document.getElementById("demo-format-block");
    const projectId = selectedProjectId();
    const hasUrl = projectId && projectHasUrl(projectId);
    if (block) block.hidden = !projectId || hasUrl;
    if (hasUrl) setDemoFormat(null);
  };

  // ---------------------------------------------------------------
  // Persons
  // ---------------------------------------------------------------

  const formPerson = document.getElementById("form-person");
  const listPersons = document.getElementById("list-persons");

  const clearPerson = () => {
    formPerson.reset();
    formPerson.id.value = "";
    listPersons.querySelectorAll("li").forEach((li) => li.classList.remove("active"));
  };

  const loadPerson = (id) => {
    const p = db.persons.find((x) => x.id === id);
    if (!p) return;
    formPerson.id.value = p.id;
    formPerson.name.value = p.name || "";
    formPerson.active.checked = Boolean(p.active);
    formPerson.telegram.value = p.telegram || "";
    formPerson.photo.value = p.photo || "";
    listPersons.querySelectorAll("li").forEach((li) => {
      li.classList.toggle("active", li.dataset.id === id);
    });
  };

  formPerson.addEventListener("submit", (e) => {
    e.preventDefault();
    const name = formPerson.name.value.trim();
    if (!name) return;
    const id = upsertPerson({
      id: formPerson.id.value,
      name,
      active: formPerson.active.checked,
      telegram: empty(formPerson.telegram.value),
      photo: empty(formPerson.photo.value),
    });
    if (!id) return;
    saveDraft();
    loadPerson(id);
    revealListItem(listPersons, `[data-id="${CSS.escape(id)}"]`);
    flashSubmit(formPerson, "Сохранено");
    setStatus(`Персона сохранена: ${name}`, true);
  });

  document.querySelector('[data-clear="person"]').addEventListener("click", clearPerson);
  document.querySelector('[data-delete="person"]').addEventListener("click", () => {
    const id = formPerson.id.value;
    if (!id) return;
    if (!confirm("Удалить персону и её связи (присутствие, авторство, показы)?")) return;
    db.persons = db.persons.filter((p) => p.id !== id);
    dropPersonFromAttendance(id);
    db.feedback = (db.feedback || []).filter((f) => f.person !== id);
    db.projects.forEach((p) => {
      p.authors = p.authors.filter((a) => a !== id);
    });
    db.demos.forEach((d) => {
      d.presenters = d.presenters.filter((a) => a !== id);
    });
    clearPerson();
    saveDraft();
    setStatus("Персона удалена");
  });

  // ---------------------------------------------------------------
  // Projects
  // ---------------------------------------------------------------

  const formProject = document.getElementById("form-project");
  const listProjects = document.getElementById("list-projects");
  const projectAuthors = document.getElementById("project-authors");
  const projectFormMode = document.getElementById("project-form-mode");
  const projectListSearch = document.getElementById("project-list-search");

  const clearProject = () => {
    formProject.reset();
    formProject.id.value = "";
    formProject.classList.remove("pdb-url-needed");
    fillPersonChecks(projectAuthors, []);
    listProjects.querySelectorAll("li").forEach((li) => li.classList.remove("active"));
    if (projectFormMode) projectFormMode.textContent = "Новый проект";
  };

  const loadProject = (id) => {
    const p = db.projects.find((x) => x.id === id);
    if (!p) return;
    formProject.id.value = p.id;
    formField(formProject, "title").value = p.title || "";
    formProject.url.value = p.url || "";
    fillPersonChecks(projectAuthors, p.authors);
    listProjects.querySelectorAll("li").forEach((li) => {
      li.classList.toggle("active", li.dataset.id === id);
    });
    if (projectFormMode) projectFormMode.textContent = `Редактирование: ${p.title}`;
  };

  formProject.addEventListener("submit", (e) => {
    e.preventDefault();
    const title = String(formField(formProject, "title")?.value || "").trim();
    const authors = checkedValues(projectAuthors);
    if (!title) return;
    if (!authors.length) {
      setStatus("Нужен хотя бы один автор");
      return;
    }
    const url = empty(formProject.url.value);
    if (formProject.classList.contains("pdb-url-needed") && !url) {
      setStatus("Нужна ссылка на проект");
      formProject.url.focus();
      return;
    }
    const id = upsertProject({ id: formProject.id.value, title, url, authors });
    if (!id) return;
    formProject.classList.remove("pdb-url-needed");
    saveDraft();
    loadProject(id);
    revealListItem(listProjects, `[data-id="${CSS.escape(id)}"]`);
    flashSubmit(formProject, "Сохранено");
    setStatus(`Проект сохранён: ${title}`, true);
  });

  document.querySelector('[data-clear="project"]').addEventListener("click", clearProject);
  document.querySelector('[data-delete="project"]').addEventListener("click", () => {
    const id = formProject.id.value;
    if (!id) return;
    if (!confirm("Удалить проект и связанные демо?")) return;
    const removedDemos = new Set(db.demos.filter((d) => d.project === id).map((d) => d.id));
    db.projects = db.projects.filter((p) => p.id !== id);
    db.demos = db.demos.filter((d) => d.project !== id);
    db.feedback = (db.feedback || []).filter((f) => !removedDemos.has(f.demo));
    clearProject();
    saveDraft();
    setStatus("Проект удалён");
  });

  if (projectListSearch) {
    projectListSearch.addEventListener("input", () => renderProjects());
  }

  // ---------------------------------------------------------------
  // Meetings
  // ---------------------------------------------------------------

  const formMeeting = document.getElementById("form-meeting");
  const listMeetings = document.getElementById("list-meetings");
  const meetingDateHuman = document.getElementById("meeting-date-human");
  const meetingToday = document.getElementById("meeting-today");

  const syncMeetingDateLabel = () => {
    if (!meetingDateHuman) return;
    meetingDateHuman.textContent = formMeeting.date.value
      ? fmtDateRu(formMeeting.date.value)
      : "";
  };

  const clearMeeting = () => {
    formMeeting.reset();
    formMeeting.origDate.value = "";
    syncMeetingDateLabel();
    listMeetings.querySelectorAll("li").forEach((li) => li.classList.remove("active"));
  };

  const loadMeeting = (date) => {
    const m = db.meetings.find((x) => x.date === date);
    if (!m) return;
    formMeeting.origDate.value = m.date;
    formMeeting.date.value = m.date;
    formMeeting.minutes.value = m.minutes ?? "";
    syncMeetingDateLabel();
    listMeetings.querySelectorAll("li").forEach((li) => {
      li.classList.toggle("active", li.dataset.date === date);
    });
  };

  formMeeting.addEventListener("submit", (e) => {
    e.preventDefault();
    const date = formMeeting.date.value;
    const orig = formMeeting.origDate.value;
    if (!date) return;

    if (orig && orig !== date) {
      if (db.meetings.some((m) => m.date === date)) {
        setStatus("Встреча с такой датой уже есть");
        return;
      }
      moveAttendance(orig, date);
      db.demos.forEach((d) => {
        if (d.meeting === orig) d.meeting = date;
      });
      const m = db.meetings.find((x) => x.date === orig);
      if (m) m.date = date;
    }

    let m = db.meetings.find((x) => x.date === date);
    if (!m) {
      m = { date, type: "weekly" };
      db.meetings.push(m);
    }
    m.type = "weekly";
    setMeetingMinutes(m, numOrNull(formMeeting.minutes.value));
    db.meetings.sort((a, b) => a.date.localeCompare(b.date));
    saveDraft();
    loadMeeting(date);
    revealListItem(listMeetings, `[data-date="${CSS.escape(date)}"]`);
    flashSubmit(formMeeting, "Сохранено");
    setStatus(`Встреча сохранена: ${fmtDateRu(date)}`, true);
  });

  document.querySelector('[data-clear="meeting"]').addEventListener("click", clearMeeting);
  document.querySelector('[data-delete="meeting"]').addEventListener("click", () => {
    const date = formMeeting.origDate.value || formMeeting.date.value;
    if (!date) return;
    if (!confirm("Удалить встречу, присутствие и демо за эту дату?")) return;
    const removedDemos = new Set(db.demos.filter((d) => d.meeting === date).map((d) => d.id));
    db.meetings = db.meetings.filter((m) => m.date !== date);
    delete db.attendance[date];
    db.demos = db.demos.filter((d) => d.meeting !== date);
    db.feedback = (db.feedback || []).filter((f) => !removedDemos.has(f.demo));
    clearMeeting();
    saveDraft();
    setStatus("Встреча удалена");
  });

  formMeeting.date.addEventListener("input", syncMeetingDateLabel);
  formMeeting.date.addEventListener("change", syncMeetingDateLabel);
  if (meetingToday) {
    meetingToday.addEventListener("click", () => {
      formMeeting.date.value = todayIso();
      syncMeetingDateLabel();
      formMeeting.date.focus();
    });
  }

  // ---------------------------------------------------------------
  // Attendance
  // ---------------------------------------------------------------

  const formAttendance = document.getElementById("form-attendance");
  const attendanceMeeting = document.getElementById("attendance-meeting");
  const attendancePeople = document.getElementById("attendance-people");
  const attendanceSummary = document.getElementById("attendance-summary");

  const loadAttendanceForm = () => {
    const preferred =
      attendanceMeeting.value && db.meetings.some((m) => m.date === attendanceMeeting.value)
        ? attendanceMeeting.value
        : db.meetings.slice().sort((a, b) => a.date.localeCompare(b.date)).at(-1)?.date;
    fillMeetingSelect(attendanceMeeting, preferred);
    const date = attendanceMeeting.value;
    const selected = attendanceOf(date);
    fillPersonChecks(attendancePeople, selected);
    attendanceSummary.textContent = date
      ? `${selected.length} человек · ${fmtDateRu(date)}`
      : "Нет встреч";
  };

  attendanceMeeting.addEventListener("change", loadAttendanceForm);

  formAttendance.addEventListener("submit", (e) => {
    e.preventDefault();
    const date = attendanceMeeting.value;
    if (!date) return;
    const people = checkedValues(attendancePeople);
    writeAttendance(date, people);
    saveDraft();
    loadAttendanceForm();
    flashSubmit(formAttendance, "Сохранено");
    setStatus(`Присутствие сохранено: ${people.length} · ${fmtDateRu(date)}`, true);
  });

  // ---------------------------------------------------------------
  // Demos
  // ---------------------------------------------------------------

  const formDemo = document.getElementById("form-demo");
  const listDemos = document.getElementById("list-demos");
  const demoMeeting = document.getElementById("demo-meeting");
  const demoProject = document.getElementById("demo-project");
  const demoPresenters = document.getElementById("demo-presenters");
  const demoFeedback = document.getElementById("demo-feedback");

  if (!Array.isArray(db.feedback)) db.feedback = [];

  const nextDemoId = () => {
    let max = 0;
    db.demos.forEach((d) => {
      const m = /^demo-(\d+)$/.exec(d.id);
      if (m) max = Math.max(max, +m[1]);
    });
    return `demo-${max + 1}`;
  };

  const feedbackForDemo = (demoId) =>
    (db.feedback || []).filter((f) => f.demo === demoId).map((f) => f.person);

  const projectAuthorsOf = (projectId) =>
    db.projects.find((p) => p.id === projectId)?.authors?.slice() || [];

  const prefillPresentersIfEmpty = (host, ids) => {
    if (!host) return;
    if (checkedValues(host).length) return;
    fillPersonChecks(host, ids || []);
  };

  const clearDemo = () => {
    formDemo.reset();
    formDemo.id.value = "";
    fillMeetingSelect(demoMeeting, demoMeeting.value);
    fillProjectRadios(demoProject, "");
    fillPersonChecks(demoPresenters, []);
    fillPersonChecks(demoFeedback, []);
    setDemoFormat(null);
    syncDemoFormatUI();
    listDemos.querySelectorAll("li").forEach((li) => li.classList.remove("active"));
  };

  const loadDemo = (id) => {
    const d = db.demos.find((x) => x.id === id);
    if (!d) return;
    formDemo.id.value = d.id;
    fillMeetingSelect(demoMeeting, d.meeting);
    fillProjectRadios(demoProject, d.project);
    fillPersonChecks(demoPresenters, d.presenters);
    fillPersonChecks(demoFeedback, feedbackForDemo(id));
    // 1–3 только если у проекта ещё нет ссылки; иначе уровень 4 вычисляется сам
    setDemoFormat(projectHasUrl(d.project) ? null : d.format);
    formDemo.minutes.value = d.minutes ?? "";
    syncDemoFormatUI();
    listDemos.querySelectorAll("li").forEach((li) => {
      li.classList.toggle("active", li.dataset.id === id);
    });
  };

  demoProject.addEventListener("change", (e) => {
    if (e.target.name === "project") {
      prefillPresentersIfEmpty(demoPresenters, projectAuthorsOf(selectedProjectId()));
      syncDemoFormatUI();
    }
  });

  formDemo.addEventListener("submit", (e) => {
    e.preventDefault();
    const meeting = formDemo.meeting.value;
    const project = selectedProjectId();
    const presenters = checkedValues(demoPresenters);
    const feedbackPeople = checkedValues(demoFeedback);
    if (!meeting || !project) {
      setStatus("Нужны встреча и проект");
      return;
    }
    if (!presenters.length) {
      setStatus("Нужен хотя бы один показывающий");
      return;
    }

    if (!db.meetings.some((m) => m.date === meeting)) {
      db.meetings.push({ date: meeting, type: "weekly" });
      db.meetings.sort((a, b) => a.date.localeCompare(b.date));
    }

    // есть ссылка → формат 4 вычисляется, в демо не храним;
    // нет ссылки → вручную 1–3
    const format = projectHasUrl(project) ? null : numOrNull(selectedFormat());

    let id = formDemo.id.value;
    const payload = {
      meeting,
      project,
      presenters,
      minutes: numOrNull(formDemo.minutes.value),
      format,
    };
    if (id) {
      const d = db.demos.find((x) => x.id === id);
      if (!d) return;
      writeDemo(d, payload);
    } else {
      id = nextDemoId();
      db.demos.push(writeDemo({ id }, payload));
    }

    // факт фидбэка: уникальная пара персона×демо
    db.feedback = (db.feedback || []).filter((f) => f.demo !== id);
    feedbackPeople.forEach((person) => {
      db.feedback.push({ demo: id, person });
    });

    saveDraft();
    loadDemo(id);
    revealListItem(listDemos, `[data-id="${CSS.escape(id)}"]`);
    flashSubmit(formDemo, "Сохранено");
    setStatus(
      feedbackPeople.length
        ? `Демо сохранено: ${projectTitle(project)} · фидбэк: ${feedbackPeople.length}`
        : `Демо сохранено: ${projectTitle(project)}`,
      true
    );
  });
  document.querySelector('[data-clear="demo"]').addEventListener("click", clearDemo);
  document.querySelector('[data-delete="demo"]').addEventListener("click", () => {
    const id = formDemo.id.value;
    if (!id) return;
    if (!confirm("Удалить демо?")) return;
    db.demos = db.demos.filter((d) => d.id !== id);
    db.feedback = (db.feedback || []).filter((f) => f.demo !== id);
    clearDemo();
    saveDraft();
    setStatus("Демо удалено");
  });

  // ---------------------------------------------------------------
  // Lists
  // ---------------------------------------------------------------

  const renderPersons = () => {
    const items = db.persons.slice().sort((a, b) => a.name.localeCompare(b.name, "ru"));
    listPersons.innerHTML = items
      .map((p) => {
        const meta = [p.active ? "подписка" : "", p.telegram || p.id].filter(Boolean).join(" · ");
        return (
          `<li data-id="${p.id}"><span>${escapeHtml(p.name)}</span>` +
          `<span class="meta">${escapeHtml(meta)}</span></li>`
        );
      })
      .join("");
    listPersons.querySelectorAll("li").forEach((li) => {
      li.addEventListener("click", () => loadPerson(li.dataset.id));
    });
  };

  const renderProjects = () => {
    const query = normalizeSearch(projectListSearch?.value || "");
    const activeId = formProject.id.value;
    const items = db.projects.slice().sort((a, b) => a.title.localeCompare(b.title, "ru"));
    listProjects.innerHTML = items
      .map((p) => {
        const match = projectMatchesQuery(p, query);
        const authors = authorsLabel(p);
        const link = p.url ? " · ссылка" : "";
        return (
          `<li data-id="${p.id}"${match ? "" : " hidden"}${p.id === activeId ? ' class="active"' : ""}>` +
          `<span>${escapeHtml(p.title)}</span>` +
          `<span class="meta">${escapeHtml(authors)}${link}</span></li>`
        );
      })
      .join("");
    const visible = listProjects.querySelectorAll("li:not([hidden])").length;
    if (!items.length) {
      listProjects.innerHTML = `<li class="pdb-empty">Пока нет проектов</li>`;
    } else if (query && !visible) {
      listProjects.insertAdjacentHTML(
        "beforeend",
        `<li class="pdb-empty">Ничего не найдено</li>`
      );
    }
    listProjects.querySelectorAll("li[data-id]").forEach((li) => {
      li.addEventListener("click", () => {
        formProject.classList.remove("pdb-url-needed");
        loadProject(li.dataset.id);
      });
    });
  };

  const renderMeetings = () => {
    const items = db.meetings.slice().sort((a, b) => b.date.localeCompare(a.date));
    listMeetings.innerHTML = items
      .map((m) => {
        const count = attendanceOf(m.date).length;
        const demos = db.demos.filter((d) => d.meeting === m.date).length;
        const gen = m.generated ? " · сген." : "";
        const meta = `${count} чел.${demos ? ` · ${demos} демо` : ""}${gen}`;
        return (
          `<li data-date="${m.date}"><span>${fmtDateRu(m.date)}</span>` +
          `<span class="meta">${meta}</span></li>`
        );
      })
      .join("");
    listMeetings.querySelectorAll("li").forEach((li) => {
      li.addEventListener("click", () => loadMeeting(li.dataset.date));
    });
  };

  const renderDemos = () => {
    const items = db.demos.slice().sort((a, b) => b.meeting.localeCompare(a.meeting));
    listDemos.innerHTML = items
      .map((d) => {
        const who = d.presenters.map(personName).join(", ");
        const gen = d.generated ? " · сген." : "";
        return (
          `<li data-id="${d.id}"><span>${escapeHtml(projectTitle(d.project))}</span>` +
          `<span class="meta">${fmtDateRu(d.meeting)} · ${escapeHtml(who)}${gen}</span></li>`
        );
      })
      .join("");
    listDemos.querySelectorAll("li").forEach((li) => {
      li.addEventListener("click", () => loadDemo(li.dataset.id));
    });
  };

  // ---------------------------------------------------------------
  // Сводка по встрече
  // ---------------------------------------------------------------

  const summaryMeetings = document.getElementById("summary-meetings");
  const summaryTextEl = document.getElementById("summary-text");
  let summaryDate = "";

  const namesOf = (ids) => ids.map(personName).sort((a, b) => a.localeCompare(b, "ru"));

  const meetingChecks = (m, presentIds, demos) => {
    const out = [];
    const present = new Set(presentIds);
    if (!m.minutes) out.push("у встречи не указана длительность");
    if (!presentIds.length) out.push("не отмечено присутствие");
    if (!demos.length) out.push("нет ни одного демо");
    demos.forEach((d) => {
      const title = projectTitle(d.project);
      if (!d.presenters.length) out.push(`«${title}»: нет показывающих`);
      if (!d.minutes) out.push(`«${title}»: нет длительности`);
      d.presenters.forEach((p) => {
        if (!present.has(p)) {
          out.push(`${personName(p)} показывает «${title}», но не отмечен в присутствии`);
        }
      });
      feedbackForDemo(d.id).forEach((p) => {
        if (!present.has(p)) {
          out.push(`${personName(p)} дал фидбэк на «${title}», но не отмечен в присутствии`);
        }
      });
    });
    return out;
  };

  const meetingSummary = (date) => {
    if (!date) return "Укажи дату встречи.";
    const m = db.meetings.find((x) => x.date === date) || { date };

    const presentIds = attendanceOf(date);
    const demos = db.demos.filter((d) => d.meeting === date);
    const lines = [fmtDateRu(date)];

    lines.push(m.minutes ? `${m.minutes} мин` : "длительность не указана");

    lines.push("", `Присутствие — ${presentIds.length}`);
    if (presentIds.length) {
      namesOf(presentIds).forEach((name) => lines.push(`  — ${name}`));
    } else {
      lines.push("  — никого не отмечено");
    }

    lines.push("", `Демо — ${demos.length}`);
    if (!demos.length) lines.push("  — пусто");
    demos.forEach((d, i) => {
      const project = db.projects.find((x) => x.id === d.project);
      lines.push(`  ${i + 1}. ${projectTitle(d.project)}`);
      lines.push(`     — показывает: ${namesOf(d.presenters).join(", ") || "не указано"}`);
      lines.push(`     — ${d.minutes ? `${d.minutes} мин` : "время не указано"}`);
      if (project?.url) lines.push(`     — ссылка: ${project.url}`);
      const feedback = feedbackForDemo(d.id);
      if (feedback.length) lines.push(`     — фидбэк: ${namesOf(feedback).join(", ")}`);
    });

    const checks = meetingChecks(m, presentIds, demos);
    lines.push(
      "",
      checks.length ? `Проверить — ${checks.length}` : "Проверить — пусто, всё заполнено"
    );
    checks.forEach((c) => lines.push(`  — ${c}`));

    return lines.join("\n");
  };

  const renderSummary = () => {
    const items = db.meetings.slice().sort((a, b) => b.date.localeCompare(a.date));
    if (!items.some((m) => m.date === summaryDate)) summaryDate = items[0]?.date || "";

    summaryMeetings.innerHTML = items.length
      ? items
          .map((m) => {
            const people = attendanceOf(m.date).length;
            const count = db.demos.filter((d) => d.meeting === m.date).length;
            const gen = m.generated ? " · сген." : "";
            const meta = `${people} чел. · ${count} демо${gen}`;
            return (
              `<li data-date="${m.date}"${m.date === summaryDate ? ' class="active"' : ""}>` +
              `<span>${fmtDateRu(m.date)}</span><span class="meta">${meta}</span></li>`
            );
          })
          .join("")
      : `<li class="pdb-empty">Пока нет встреч</li>`;

    summaryMeetings.querySelectorAll("li[data-date]").forEach((li) => {
      li.addEventListener("click", () => {
        summaryDate = li.dataset.date;
        renderSummary();
      });
    });

    summaryTextEl.textContent = summaryDate
      ? meetingSummary(summaryDate)
      : "Сначала создай встречу на вкладке «Встречи».";
  };

  document.getElementById("summary-copy").addEventListener("click", async () => {
    try {
      await navigator.clipboard.writeText(summaryTextEl.textContent);
      setStatus("Сводка скопирована");
    } catch {
      setStatus("Не удалось скопировать");
    }
  });

  const renderAll = () => {
    renderPersons();
    fillPersonChecks(projectAuthors, checkedValues(projectAuthors));
    renderProjects();
    renderMeetings();
    fillMeetingSelect(demoMeeting, demoMeeting.value);
    fillProjectRadios(demoProject, selectedProjectId());
    fillPersonChecks(demoPresenters, checkedValues(demoPresenters));
    fillPersonChecks(
      demoFeedback,
      formDemo.id.value ? feedbackForDemo(formDemo.id.value) : checkedValues(demoFeedback)
    );
    syncDemoFormatUI();
    loadAttendanceForm();
    renderDemos();
    refreshLive();
    if (!document.querySelector('[data-panel="summary"]').hidden) renderSummary();
    const preview = document.getElementById("pdb-preview");
    if (preview && !document.querySelector('[data-panel="export"]').hidden) {
      preview.textContent = serializeFile();
    }
  };

  // ---------------------------------------------------------------
  // Режимы: «В прямом эфире» / «Редактура»
  // ---------------------------------------------------------------

  const MODE_KEY = "planetarium-admin-mode";
  const liveRoot = document.getElementById("pdb-live");
  const editRoot = document.getElementById("pdb-edit");
  const liveDate = document.getElementById("live-date");
  const liveDateHuman = document.getElementById("live-date-human");
  const liveDemoNote = document.getElementById("live-demo-note");
  const liveStopwatchDisplay = document.getElementById("live-stopwatch-display");
  const liveStopwatchToggle = document.getElementById("live-stopwatch-toggle");
  let stopwatchStarted = 0;
  let stopwatchBase = 0;
  let stopwatchTimer = null;

  const stopwatchElapsedMs = () =>
    stopwatchStarted ? stopwatchBase + (Date.now() - stopwatchStarted) : stopwatchBase;

  const fmtStopwatch = (ms) => {
    const s = Math.floor(ms / 1000);
    return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;
  };

  const renderStopwatch = () => {
    if (liveStopwatchDisplay) liveStopwatchDisplay.textContent = fmtStopwatch(stopwatchElapsedMs());
  };

  const syncStopwatchMinutes = () => {
    const ms = stopwatchElapsedMs();
    if (ms < 1000 || !liveDemoMinutes) return;
    liveDemoMinutes.value = String(Math.max(1, Math.round(ms / 60000)));
  };

  const stopStopwatch = () => {
    if (stopwatchStarted) {
      stopwatchBase = stopwatchElapsedMs();
      stopwatchStarted = 0;
    }
    if (stopwatchTimer) {
      clearInterval(stopwatchTimer);
      stopwatchTimer = null;
    }
    if (liveStopwatchToggle) liveStopwatchToggle.textContent = "Старт";
    renderStopwatch();
    syncStopwatchMinutes();
  };

  const startStopwatch = () => {
    if (stopwatchStarted) return;
    stopwatchStarted = Date.now();
    if (liveStopwatchToggle) liveStopwatchToggle.textContent = "Стоп";
    stopwatchTimer = setInterval(renderStopwatch, 250);
    renderStopwatch();
  };

  const resetStopwatch = () => {
    stopwatchStarted = 0;
    stopwatchBase = 0;
    if (stopwatchTimer) {
      clearInterval(stopwatchTimer);
      stopwatchTimer = null;
    }
    if (liveStopwatchToggle) liveStopwatchToggle.textContent = "Старт";
    renderStopwatch();
  };

  const LIVE_SCRATCH_KEY = "planetarium-live-scratch";
  const liveDemoList = document.getElementById("live-demo-list");
  const liveDemoProject = document.getElementById("live-demo-project");
  const liveProjectPicker = document.getElementById("live-project-picker");
  const liveProjectCreate = document.getElementById("live-project-create");
  const liveNewAuthors = document.getElementById("live-new-authors");
  const liveDemoPresenters = document.getElementById("live-demo-presenters");
  const liveDemoFeedback = document.getElementById("live-demo-feedback");
  const liveAttendance = document.getElementById("live-attendance");
  const liveFormatBlock = document.getElementById("live-format-block");
  const liveDemoId = document.getElementById("live-demo-id");
  const liveDemoMinutes = document.getElementById("live-demo-minutes");
  const liveMeetingMinutes = document.getElementById("live-meeting-minutes");
  const liveSummaryText = document.getElementById("live-summary-text");
  const liveDemoStatus = document.getElementById("live-demo-status");
  const liveDemoDelete = document.getElementById("live-demo-delete");
  let liveProjectSource = "existing";

  const readLiveScratch = () => {
    try {
      const parsed = JSON.parse(localStorage.getItem(LIVE_SCRATCH_KEY) || "{}");
      return parsed && typeof parsed === "object" ? parsed : {};
    } catch {
      return {};
    }
  };

  const persistLiveScratch = () => {
    if (!liveDate?.value || !liveDemoNote) return;
    const all = readLiveScratch();
    const text = liveDemoNote.value;
    if (text.trim()) all[liveDate.value] = text;
    else delete all[liveDate.value];
    localStorage.setItem(LIVE_SCRATCH_KEY, JSON.stringify(all));
  };

  const restoreLiveScratch = () => {
    if (!liveDemoNote) return;
    liveDemoNote.value = readLiveScratch()[liveDate?.value] || "";
  };

  const liveSelectedProjectId = () =>
    liveProjectSource === "new" ? "" : selectedProjectId(liveDemoProject);

  const liveProjectAuthors = () =>
    liveProjectSource === "new"
      ? checkedValues(liveNewAuthors)
      : projectAuthorsOf(liveSelectedProjectId());

  const syncLiveDateLabel = () => {
    if (liveDateHuman) {
      liveDateHuman.textContent = liveDate?.value ? fmtDateRu(liveDate.value) : "";
    }
  };

  const liveSelectedFormat = () =>
    document.querySelector("#live-format input[name='live-format']:checked")?.value || "";

  const setLiveFormat = (value) => {
    document.querySelectorAll("#live-format input[name='live-format']").forEach((input) => {
      input.checked = value != null && String(input.value) === String(value);
    });
  };

  const liveProjectHasUrl = () => {
    if (liveProjectSource === "new") {
      return Boolean(empty(document.getElementById("live-new-url")?.value));
    }
    return projectHasUrl(selectedProjectId(liveDemoProject));
  };

  const syncLiveFormatUI = () => {
    if (!liveFormatBlock) return;
    const hasProject =
      liveProjectSource === "new"
        ? Boolean(document.getElementById("live-new-title")?.value.trim())
        : Boolean(selectedProjectId(liveDemoProject));
    const hasUrl = liveProjectHasUrl();
    liveFormatBlock.hidden = !hasProject || hasUrl;
    if (hasUrl) setLiveFormat(null);
  };

  const setLiveProjectSource = (source) => {
    liveProjectSource = source;
    document
      .getElementById("live-project-existing")
      ?.setAttribute("aria-pressed", source === "existing" ? "true" : "false");
    document
      .getElementById("live-project-new")
      ?.setAttribute("aria-pressed", source === "new" ? "true" : "false");
    if (liveProjectPicker) liveProjectPicker.hidden = source !== "existing";
    if (liveProjectCreate) liveProjectCreate.hidden = source !== "new";
    prefillPresentersIfEmpty(liveDemoPresenters, liveProjectAuthors());
    syncLiveFormatUI();
  };

  const renderLiveAttendanceSummary = () => {
    const el = document.getElementById("live-attendance-summary");
    if (!el) return;
    const date = liveDate?.value;
    const n = date ? attendanceOf(date).length : 0;
    el.textContent = date ? `${n} человек · ${fmtDateRu(date)}` : "";
  };

  const renderLiveSummary = () => {
    if (!liveSummaryText) return;
    liveSummaryText.textContent = liveDate?.value
      ? meetingSummary(liveDate.value)
      : "Укажи дату встречи.";
  };

  const renderLiveDemos = () => {
    if (!liveDemoList) return;
    const date = liveDate?.value;
    const items = date
      ? db.demos.filter((d) => d.meeting === date).sort((a, b) => a.id.localeCompare(b.id))
      : [];
    const activeId = liveDemoId?.value;
    liveDemoList.innerHTML = items.length
      ? items
          .map((d) => {
            const fb = feedbackForDemo(d.id).length;
            const meta = [d.minutes ? `${d.minutes} мин` : "", fb ? `фидбэк ${fb}` : ""]
              .filter(Boolean)
              .join(" · ");
            return (
              `<li data-id="${d.id}"${d.id === activeId ? ' class="active"' : ""}>` +
              `<span>${escapeHtml(projectTitle(d.project))}</span>` +
              `<span class="meta">${escapeHtml(meta || "без времени")}</span></li>`
            );
          })
          .join("")
      : `<li class="pdb-empty">Пока нет демо за эту дату</li>`;
    liveDemoList.querySelectorAll("li[data-id]").forEach((li) => {
      li.addEventListener("click", () => loadLiveDemo(li.dataset.id));
    });
  };

  const clearLiveDemoForm = () => {
    if (liveDemoId) liveDemoId.value = "";
    if (liveDemoMinutes) liveDemoMinutes.value = "";
    const title = document.getElementById("live-new-title");
    const url = document.getElementById("live-new-url");
    if (title) title.value = "";
    if (url) url.value = "";
    if (liveNewAuthors) fillPersonChecks(liveNewAuthors, []);
    if (liveDemoPresenters) fillPersonChecks(liveDemoPresenters, []);
    if (liveDemoFeedback) fillPersonChecks(liveDemoFeedback, []);
    if (liveDemoProject) fillProjectRadios(liveDemoProject, "", { name: "live-project" });
    setLiveFormat(null);
    setLiveProjectSource("existing");
    if (liveDemoDelete) liveDemoDelete.hidden = true;
    if (liveDemoStatus) liveDemoStatus.textContent = "";
    resetStopwatch();
    renderLiveDemos();
    syncLiveFormatUI();
  };

  const loadLiveDemo = (id) => {
    const d = db.demos.find((x) => x.id === id);
    if (!d) return;
    liveDemoId.value = d.id;
    setLiveProjectSource("existing");
    fillProjectRadios(liveDemoProject, d.project, { name: "live-project" });
    liveDemoMinutes.value = d.minutes ?? "";
    resetStopwatch();
    fillPersonChecks(liveDemoPresenters, d.presenters);
    fillPersonChecks(liveDemoFeedback, feedbackForDemo(id));
    setLiveFormat(projectHasUrl(d.project) ? null : d.format);
    liveDemoDelete.hidden = false;
    liveDemoStatus.textContent = `Редактирование: ${projectTitle(d.project)}`;
    renderLiveDemos();
    syncLiveFormatUI();
  };

  const resolveLiveProject = () => {
    if (liveProjectSource === "new") {
      const title = document.getElementById("live-new-title").value.trim();
      const authors = checkedValues(liveNewAuthors);
      if (!title) {
        setStatus("Нужно название проекта");
        return null;
      }
      if (!authors.length) {
        setStatus("Нужен хотя бы один автор");
        return null;
      }
      return upsertProject({
        title,
        url: empty(document.getElementById("live-new-url").value),
        authors,
      });
    }
    const id = selectedProjectId(liveDemoProject);
    if (!id) {
      setStatus("Выбери проект или добавь новый");
      return null;
    }
    return id;
  };

  const saveLiveDemo = () => {
    const date = liveDate.value;
    if (!date) {
      setStatus("Сначала укажи дату встречи");
      return false;
    }
    const project = resolveLiveProject();
    if (!project) return false;
    prefillPresentersIfEmpty(liveDemoPresenters, projectAuthorsOf(project));
    const presenters = checkedValues(liveDemoPresenters);
    if (!presenters.length) {
      setStatus("Нужен хотя бы один показывающий");
      return false;
    }
    ensureMeeting(date);
    stopStopwatch();
    const format = projectHasUrl(project) ? null : numOrNull(liveSelectedFormat());
    let id = liveDemoId.value;
    const existing = id ? db.demos.find((x) => x.id === id) : null;
    if (id && !existing) return false;
    const payload = {
      meeting: date,
      project,
      presenters,
      minutes: numOrNull(liveDemoMinutes.value),
      format,
    };
    if (id) {
      const d = db.demos.find((x) => x.id === id);
      if (!d) return false;
      writeDemo(d, payload);
    } else {
      id = nextDemoId();
      db.demos.push(writeDemo({ id }, payload));
    }
    const feedbackPeople = checkedValues(liveDemoFeedback);
    db.feedback = (db.feedback || []).filter((f) => f.demo !== id);
    feedbackPeople.forEach((person) => db.feedback.push({ demo: id, person }));
    persistDraft();
    liveDemoId.value = id;
    liveDemoDelete.hidden = false;
    setLiveProjectSource("existing");
    fillProjectRadios(liveDemoProject, project, { name: "live-project" });
    fillPersonChecks(liveDemoPresenters, presenters);
    liveDemoStatus.textContent = `Сохранено: ${projectTitle(project)}`;
    setStatus(`Демо сохранено: ${projectTitle(project)}`, true);
    renderLiveDemos();
    renderLiveSummary();
    syncLiveFormatUI();
    return true;
  };

  const liveDemoFormIsEmpty = () => {
    if (liveDemoId.value) return false;
    if (liveProjectSource === "new") {
      return !document.getElementById("live-new-title").value.trim();
    }
    return (
      !selectedProjectId(liveDemoProject) &&
      !checkedValues(liveDemoPresenters).length &&
      !liveDemoMinutes.value &&
      stopwatchElapsedMs() < 1000
    );
  };

  const saveLiveAttendance = () => {
    const date = liveDate.value;
    if (!date) return;
    ensureMeeting(date);
    writeAttendance(date, checkedValues(liveAttendance));
    persistDraft();
    renderLiveSummary();
    renderLiveAttendanceSummary();
  };

  const saveLiveMinutes = () => {
    const date = liveDate.value;
    if (!date) return;
    ensureMeeting(date, { minutes: numOrNull(liveMeetingMinutes.value) });
    persistDraft();
    renderLiveSummary();
  };

  const flushLiveMeeting = () => {
    if (!liveDate?.value) return;
    ensureMeeting(liveDate.value, { minutes: numOrNull(liveMeetingMinutes.value) });
    writeAttendance(liveDate.value, checkedValues(liveAttendance));
  };

  const loadLiveMeeting = (date) => {
    liveDate.value = date || todayIso();
    syncLiveDateLabel();
    const m = db.meetings.find((x) => x.date === liveDate.value);
    liveMeetingMinutes.value = m?.minutes ?? "";
    fillPersonChecks(liveAttendance, attendanceOf(liveDate.value));
    clearLiveDemoForm();
    restoreLiveScratch();
    renderLiveAttendanceSummary();
    renderLiveSummary();
  };

  const refreshLive = () => {
    if (!liveDate) return;
    if (!liveDate.value) {
      liveDate.value = todayIso();
      syncLiveDateLabel();
    }
    fillProjectRadios(liveDemoProject, selectedProjectId(liveDemoProject), {
      name: "live-project",
    });
    fillPersonChecks(liveNewAuthors, checkedValues(liveNewAuthors));
    fillPersonChecks(liveDemoPresenters, checkedValues(liveDemoPresenters));
    fillPersonChecks(liveDemoFeedback, checkedValues(liveDemoFeedback));
    const date = liveDate.value;
    fillPersonChecks(liveAttendance, attendanceOf(date));
    const m = db.meetings.find((x) => x.date === date);
    if (document.activeElement !== liveMeetingMinutes) {
      liveMeetingMinutes.value = m?.minutes ?? liveMeetingMinutes.value;
    }
    renderLiveDemos();
    renderLiveAttendanceSummary();
    renderLiveSummary();
    syncLiveFormatUI();
  };

  const switchMode = (next) => {
    if (next !== adminMode) persistDraft();
    adminMode = next;
    db = next === "live" ? liveDb : editDb;
    localStorage.setItem(MODE_KEY, next);
    document.querySelector("[data-pdb-mode]")?.setAttribute("data-pdb-mode", next);
    if (liveRoot) liveRoot.hidden = next !== "live";
    if (editRoot) editRoot.hidden = next !== "edit";
    const liveToolbar = document.getElementById("pdb-toolbar-live");
    const editToolbar = document.getElementById("pdb-toolbar-edit");
    if (liveToolbar) liveToolbar.hidden = next !== "live";
    if (editToolbar) editToolbar.hidden = next !== "edit";
    document.querySelectorAll(".pdb-modes [data-mode]").forEach((btn) => {
      btn.setAttribute("aria-selected", btn.dataset.mode === next ? "true" : "false");
    });
    if (next === "live") {
      history.replaceState(null, "", "#live");
      refreshLive();
    } else {
      renderAll();
      if (location.hash === "#live" || !location.hash.replace(/^#/, "")) {
        switchTab("persons");
      }
    }
  };

  document.querySelectorAll(".pdb-modes [data-mode]").forEach((btn) => {
    btn.addEventListener("click", () => switchMode(btn.dataset.mode));
  });

  liveDate?.addEventListener("input", syncLiveDateLabel);
  liveDate?.addEventListener("change", () => loadLiveMeeting(liveDate.value));
  document.getElementById("live-today")?.addEventListener("click", () => {
    loadLiveMeeting(todayIso());
    liveDate.focus();
  });
  document.getElementById("live-project-existing")?.addEventListener("click", () => {
    setLiveProjectSource("existing");
  });
  document.getElementById("live-project-new")?.addEventListener("click", () => {
    setLiveProjectSource("new");
    document.getElementById("live-new-title")?.focus();
  });
  liveDemoProject?.addEventListener("change", () => {
    prefillPresentersIfEmpty(liveDemoPresenters, liveProjectAuthors());
    syncLiveFormatUI();
  });
  liveNewAuthors?.addEventListener("change", () => {
    prefillPresentersIfEmpty(liveDemoPresenters, checkedValues(liveNewAuthors));
  });
  liveDemoNote?.addEventListener("input", persistLiveScratch);
  document.getElementById("live-new-title")?.addEventListener("input", syncLiveFormatUI);
  document.getElementById("live-new-url")?.addEventListener("input", syncLiveFormatUI);
  liveStopwatchToggle?.addEventListener("click", () => {
    if (stopwatchStarted) stopStopwatch();
    else startStopwatch();
  });
  document.getElementById("live-stopwatch-reset")?.addEventListener("click", resetStopwatch);
  document.getElementById("live-demo-save")?.addEventListener("click", () => {
    saveLiveDemo();
  });
  document.getElementById("live-demo-another")?.addEventListener("click", () => {
    if (liveDemoFormIsEmpty() || saveLiveDemo()) clearLiveDemoForm();
  });
  liveDemoDelete?.addEventListener("click", () => {
    const id = liveDemoId.value;
    if (!id) return;
    if (!confirm("Удалить демо?")) return;
    db.demos = db.demos.filter((d) => d.id !== id);
    db.feedback = (db.feedback || []).filter((f) => f.demo !== id);
    persistDraft();
    clearLiveDemoForm();
    renderLiveSummary();
    setStatus("Демо удалено");
  });
  liveAttendance?.addEventListener("change", saveLiveAttendance);
  liveMeetingMinutes?.addEventListener("change", saveLiveMinutes);

  const livePersonCreate = document.getElementById("live-person-create");
  const showLivePersonCreate = (show) => {
    if (!livePersonCreate) return;
    livePersonCreate.hidden = !show;
    const name = document.getElementById("live-new-person-name");
    const tg = document.getElementById("live-new-person-telegram");
    if (show) {
      name?.focus();
      return;
    }
    if (name) name.value = "";
    if (tg) tg.value = "";
    const active = document.getElementById("live-new-person-active");
    if (active) active.checked = false;
  };

  document.getElementById("live-person-add")?.addEventListener("click", () => {
    showLivePersonCreate(true);
  });
  document.getElementById("live-person-cancel")?.addEventListener("click", () => {
    showLivePersonCreate(false);
  });
  document.getElementById("live-person-save")?.addEventListener("click", () => {
    const name = document.getElementById("live-new-person-name")?.value.trim();
    if (!name) {
      setStatus("Нужно имя");
      document.getElementById("live-new-person-name")?.focus();
      return;
    }
    const id = upsertPerson({
      name,
      active: document.getElementById("live-new-person-active")?.checked,
      telegram: empty(document.getElementById("live-new-person-telegram")?.value),
    });
    const selected = checkedValues(liveAttendance);
    if (!selected.includes(id)) selected.push(id);
    if (liveDate.value) {
      ensureMeeting(liveDate.value);
      writeAttendance(liveDate.value, selected);
    }
    persistDraft();
    fillPersonChecks(liveAttendance, selected);
    fillPersonChecks(liveNewAuthors, checkedValues(liveNewAuthors));
    fillPersonChecks(liveDemoPresenters, checkedValues(liveDemoPresenters));
    fillPersonChecks(liveDemoFeedback, checkedValues(liveDemoFeedback));
    renderLiveAttendanceSummary();
    renderLiveSummary();
    showLivePersonCreate(false);
    setStatus(`Персона добавлена: ${name}`, true);
  });
  livePersonCreate?.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      document.getElementById("live-person-save")?.click();
    }
  });
  document.getElementById("live-publish")?.addEventListener("click", () => {
    flushLiveMeeting();
    persistDraft();
    publishToProd();
  });
  document.getElementById("live-download")?.addEventListener("click", () => {
    flushLiveMeeting();
    persistDraft();
    downloadDb();
  });
  document.getElementById("live-reset")?.addEventListener("click", () => {
    if (!confirm("Сбросить черновик прямого эфира и загрузить данные из js/db.js?")) return;
    localStorage.removeItem(STORAGE_LIVE);
    liveDb = freshDb();
    db = liveDb;
    loadLiveMeeting(todayIso());
    setStatus("Прямой эфир загружен из файла");
  });

  // ---------------------------------------------------------------
  // Toolbar
  // ---------------------------------------------------------------

  document.getElementById("pdb-download").addEventListener("click", downloadDb);
  document.getElementById("pdb-download-2").addEventListener("click", downloadDb);
  // В прямом эфире выгружаем то же, что видно на экране: сначала дописываем встречу.
  const flushAndRun = (run) => () => {
    if (adminMode === "live") {
      flushLiveMeeting();
      persistDraft();
    }
    run();
  };
  document
    .querySelectorAll("[data-download-json]")
    .forEach((btn) => btn.addEventListener("click", flushAndRun(downloadJson)));
  document.getElementById("pdb-copy-json")?.addEventListener("click", flushAndRun(copyJson));
  document.getElementById("pdb-reset").addEventListener("click", () => {
    if (!confirm("Сбросить черновик редактуры и загрузить данные из js/db.js?")) return;
    localStorage.removeItem(STORAGE_EDIT);
    editDb = freshDb();
    db = editDb;
    clearPerson();
    clearProject();
    clearMeeting();
    clearDemo();
    renderAll();
    setStatus("Редактура загружена из файла");
  });

  // ---------------------------------------------------------------
  // Публикация на прод (коммит js/db.js в main через GitHub API)
  // ---------------------------------------------------------------

  const GH_TOKEN_KEY = "planetarium-gh-token";
  const GH_REPO = "Perevvalka/planetarium-dashboard";
  const GH_BRANCH = "main";
  const GH_SYNC_BRANCH = "wip";
  const tokenInput = document.getElementById("pdb-gh-token");
  const publishButtons = [
    document.getElementById("pdb-publish"),
    document.getElementById("pdb-publish-top"),
    document.getElementById("live-publish"),
  ].filter(Boolean);

  const utf8ToBase64 = (str) => {
    const bytes = new TextEncoder().encode(str);
    const chunk = 0x8000;
    let binary = "";
    for (let i = 0; i < bytes.length; i += chunk) {
      binary += String.fromCharCode(...bytes.subarray(i, i + chunk));
    }
    return btoa(binary);
  };

  const base64ToUtf8 = (b64) =>
    new TextDecoder().decode(
      Uint8Array.from(atob(String(b64).replace(/\s/g, "")), (c) => c.charCodeAt(0))
    );

  const loadToken = () => {
    const token = localStorage.getItem(GH_TOKEN_KEY) || "";
    if (tokenInput) tokenInput.value = token;
    return token;
  };

  const saveToken = () => {
    const token = (tokenInput?.value || "").trim();
    if (!token) {
      localStorage.removeItem(GH_TOKEN_KEY);
      setStatus("Токен удалён");
      return "";
    }
    localStorage.setItem(GH_TOKEN_KEY, token);
    setStatus("Токен сохранён в браузере", true);
    return token;
  };

  const ghRequest = async (url, token, opts = {}) => {
    const res = await fetch(url, {
      ...opts,
      headers: {
        Accept: "application/vnd.github+json",
        Authorization: `Bearer ${token}`,
        "X-GitHub-Api-Version": "2022-11-28",
        ...(opts.body ? { "Content-Type": "application/json" } : {}),
        ...(opts.headers || {}),
      },
    });
    const text = await res.text();
    let data = null;
    try {
      data = text ? JSON.parse(text) : null;
    } catch {
      data = { message: text };
    }
    if (!res.ok) {
      const msg = data?.message || `GitHub ${res.status}`;
      const err = new Error(msg);
      err.status = res.status;
      throw err;
    }
    return data;
  };

  const ghRepo = (path) => `https://api.github.com/repos/${GH_REPO}${path}`;

  const readRepoFile = async (path, token, branch = GH_BRANCH) => {
    const file = await ghRequest(
      `${ghRepo(`/contents/${path}`)}?ref=${branch}`,
      token
    );
    return base64ToUtf8(file.content);
  };

  const cacheStamp = () => {
    const d = new Date();
    const hh = String(d.getHours()).padStart(2, "0");
    const mm = String(d.getMinutes()).padStart(2, "0");
    return `${todayIso()}-${hh}${mm}`;
  };

  const bustDbCache = (html) =>
    html.replace(
      /(src=["'][^"']*js\/db\.js)(\?v=[^"']*)?/g,
      `$1?v=${cacheStamp()}`
    );

  const commitFiles = async (token, message, files, branch = GH_BRANCH) => {
    const ref = await ghRequest(`${ghRepo(`/git/ref/heads/${branch}`)}`, token);
    const headSha = ref.object.sha;
    const commit = await ghRequest(`${ghRepo(`/git/commits/${headSha}`)}`, token);
    const treeItems = [];
    for (const f of files) {
      const blob = await ghRequest(`${ghRepo("/git/blobs")}`, token, {
        method: "POST",
        body: JSON.stringify({ content: f.content, encoding: "utf-8" }),
      });
      treeItems.push({
        path: f.path,
        mode: "100644",
        type: "blob",
        sha: blob.sha,
      });
    }
    const tree = await ghRequest(`${ghRepo("/git/trees")}`, token, {
      method: "POST",
      body: JSON.stringify({ base_tree: commit.tree.sha, tree: treeItems }),
    });
    const created = await ghRequest(`${ghRepo("/git/commits")}`, token, {
      method: "POST",
      body: JSON.stringify({
        message,
        tree: tree.sha,
        parents: [headSha],
      }),
    });
    await ghRequest(`${ghRepo(`/git/refs/heads/${branch}`)}`, token, {
      method: "PATCH",
      body: JSON.stringify({ sha: created.sha }),
    });
  };

  const publishViaContents = async (token, dbContent, branch = GH_BRANCH) => {
    const apiFile = ghRepo("/contents/js/db.js");
    let sha;
    try {
      const existing = await ghRequest(`${apiFile}?ref=${branch}`, token);
      sha = existing.sha;
    } catch (e) {
      if (e.status !== 404) throw e;
    }
    const payload = {
      message: `Update PlanetariumDB (${todayIso()}).`,
      content: utf8ToBase64(dbContent),
      branch,
    };
    if (sha) payload.sha = sha;
    await ghRequest(apiFile, token, {
      method: "PUT",
      body: JSON.stringify(payload),
    });
  };

  const pullRemoteDbIntoDraft = async (token) => {
    const remoteText = await readRepoFile("js/db.js", token, GH_BRANCH);
    const remoteDb = parseDbFile(remoteText);
    if (!remoteDb) return;
    if (syncDraftFromSource(db, remoteDb)) persistDraft();
  };

  const applyLiveMeeting = (base) => {
    const out = normalizeDb(clone(base));
    const date = liveDate?.value;
    if (!date) return out;
    mergeMissingFromSource(out, {
      persons: liveDb.persons,
      projects: liveDb.projects,
      meetings: [],
      demos: [],
      attendance: {},
      feedback: [],
    });
    const srcMeeting = liveDb.meetings.find((m) => m.date === date);
    if (srcMeeting) {
      let meeting = out.meetings.find((m) => m.date === date);
      if (!meeting) {
        out.meetings.push(clone(srcMeeting));
        out.meetings.sort((a, b) => a.date.localeCompare(b.date));
      } else {
        meeting.type = srcMeeting.type || meeting.type;
        setField(meeting, "minutes", srcMeeting.minutes);
        if (srcMeeting.generated) meeting.generated = true;
        else delete meeting.generated;
      }
    }
    const livePeople = liveDb.attendance?.[date];
    if (livePeople && livePeople.length) out.attendance[date] = clone(livePeople);
    else delete out.attendance[date];
    const oldDateDemoIds = new Set(
      (base.demos || []).filter((d) => d.meeting === date).map((d) => d.id)
    );
    out.demos = (out.demos || []).filter((d) => d.meeting !== date);
    const liveDemos = (liveDb.demos || []).filter((d) => d.meeting === date);
    liveDemos.forEach((d) => out.demos.push(clone(d)));
    const liveDemoIds = new Set(liveDemos.map((d) => d.id));
    out.feedback = (out.feedback || []).filter((f) => !oldDateDemoIds.has(f.demo));
    (liveDb.feedback || [])
      .filter((f) => liveDemoIds.has(f.demo))
      .forEach((f) => out.feedback.push(clone(f)));
    return out;
  };

  // Опубликованное становится обоими черновиками. Долив по недостающим записям
  // тут не годится: удаление в одном режиме иначе вернётся из другого.
  const adoptPublished = (published) => {
    if (!published) return;
    liveDb = clone(published);
    editDb = clone(published);
    db = adminMode === "edit" ? editDb : liveDb;
    persistAllDrafts();
    if (adminMode === "edit") {
      clearPerson();
      clearProject();
      clearMeeting();
      clearDemo();
      renderAll();
    } else {
      refreshLive();
    }
  };

  const publishDbToBranch = async (token, message, files, dbContent, branch) => {
    try {
      await commitFiles(token, message, files, branch);
    } catch (e) {
      if (e.status === 401 || e.status === 403) throw e;
      await publishViaContents(token, dbContent, branch);
    }
  };

  const publishToProd = async () => {
    let token = (tokenInput?.value || "").trim() || localStorage.getItem(GH_TOKEN_KEY) || "";
    if (!token) {
      const fromLive = adminMode === "live";
      switchMode("edit");
      switchTab("export");
      tokenInput?.focus();
      setStatus(
        fromLive
          ? "Сначала вставь токен на вкладке «Экспорт», потом вернись в прямой эфир и нажми «На прод»"
          : "Сначала вставь токен GitHub на вкладке «Экспорт»"
      );
      return;
    }
    if (tokenInput) tokenInput.value = token;
    localStorage.setItem(GH_TOKEN_KEY, token);

    if (
      !confirm(
        adminMode === "live"
          ? "Записать встречу из прямого эфира в js/db.js на ветке main и подтянуть её в wip?"
          : "Записать черновик редактуры в js/db.js на ветке main и подтянуть его в wip?"
      )
    ) {
      return;
    }

    if (adminMode === "live") flushLiveMeeting();
    persistDraft();
    setStatus("Публикую на прод…");
    publishButtons.forEach((b) => {
      b.disabled = true;
    });

    try {
      let remoteDb = null;
      try {
        const remoteText = await readRepoFile("js/db.js", token, GH_BRANCH);
        remoteDb = parseDbFile(remoteText);
      } catch (_) {}
      let toWrite = db;
      if (adminMode === "live") {
        toWrite = applyLiveMeeting(remoteDb || clone(source));
      } else if (remoteDb) {
        syncDraftFromSource(db, remoteDb);
        persistDraft();
        toWrite = db;
      }
      const dbContent = serializeFile(toWrite);
      const published = parseDbFile(dbContent);
      const message = `Update PlanetariumDB (${todayIso()}).`;
      const files = [{ path: "js/db.js", content: dbContent }];
      for (const path of ["dashboard.html", "admin.html"]) {
        try {
          const html = await readRepoFile(path, token, GH_BRANCH);
          const next = bustDbCache(html);
          if (next !== html) files.push({ path, content: next });
        } catch (_) {}
      }
      await publishDbToBranch(token, message, files, dbContent, GH_BRANCH);
      adoptPublished(published);
      try {
        await publishDbToBranch(
          token,
          message,
          files,
          dbContent,
          GH_SYNC_BRANCH
        );
        setStatus(
          "Опубликовано на прод и в ветку wip. Дашборд обновится через минуту.",
          true
        );
      } catch (e) {
        setStatus(
          `Опубликовано на прод. Ветку ${GH_SYNC_BRANCH} обновить не удалось: ${e.message || e}`,
          true
        );
      }
    } catch (e) {
      if (e.status === 401 || e.status === 403) {
        switchMode("edit");
        switchTab("export");
        setStatus("Токен не принят. Проверь права Contents: Read and write.");
      } else {
        setStatus(`Не удалось опубликовать: ${e.message || e}`);
      }
    } finally {
      publishButtons.forEach((b) => {
        b.disabled = false;
      });
    }
  };

  loadToken();
  document.getElementById("pdb-save-token")?.addEventListener("click", saveToken);
  document.getElementById("pdb-publish")?.addEventListener("click", () => {
    publishToProd();
  });
  document.getElementById("pdb-publish-top")?.addEventListener("click", () => {
    publishToProd();
  });

  // init
  fillPersonChecks(projectAuthors, []);
  fillPersonChecks(demoPresenters, []);
  fillPersonChecks(demoFeedback, []);
  fillPersonChecks(liveNewAuthors, []);
  fillPersonChecks(liveDemoPresenters, []);
  fillPersonChecks(liveDemoFeedback, []);
  fillPersonChecks(liveAttendance, []);
  fillMeetingSelect(demoMeeting);
  fillProjectRadios(demoProject, "");
  fillProjectRadios(liveDemoProject, "", { name: "live-project" });
  syncMeetingDateLabel();
  if (liveDate) liveDate.value = todayIso();
  syncLiveDateLabel();
  restoreLiveScratch();
  renderAll();
  const hashTab = location.hash.replace(/^#/, "");
  const tabIds = [...document.querySelectorAll(".pdb-tabs [role='tab']")].map(
    (t) => t.dataset.tab
  );
  const savedMode = localStorage.getItem(MODE_KEY);
  if (hashTab === "live") {
    switchMode("live");
  } else if (tabIds.includes(hashTab)) {
    switchMode("edit");
    switchTab(hashTab);
  } else if (savedMode === "edit") {
    switchMode("edit");
  } else {
    switchMode("live");
  }
  if (localStorage.getItem(storageKey())) {
    const opened =
      adminMode === "live" ? "Открыт черновик прямого эфира" : "Открыт черновик редактуры";
    const stale = staleFields(db, source);
    setStatus(
      stale.length
        ? `${opened}. Он старше js/db.js — расхождений: ${stale.length} (${stale
            .slice(0, 3)
            .join(", ")}${stale.length > 3 ? "…" : ""}). Если правки не нужны — «Сбросить к файлу».`
        : opened
    );
  } else {
    setStatus(
      `${db.persons.length} персон · ${db.meetings.length} встреч · ${db.demos.length} демо`
    );
  }
})();
