// Админка единой базы PlanetariumDB.
// Черновик — localStorage; на прод — кнопка «На прод» (коммит js/db.js в main).

(() => {
  "use strict";

  const STORAGE_KEY = "planetarium-db-draft";
  const source = window.PlanetariumDB;
  if (!source) {
    console.error("PlanetariumDB не загружена");
    return;
  }

  const clone = (v) => JSON.parse(JSON.stringify(v));

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
    addBy("attendance", (x) => `${x.meeting}::${x.person}`);
    if (!Array.isArray(draft.feedback)) draft.feedback = [];
    addBy("feedback", (x) => `${x.demo}::${x.person}`);
    if (file.aliases && typeof file.aliases === "object") {
      draft.aliases = { ...file.aliases, ...(draft.aliases || {}) };
    }
    return added;
  };

  let db = (() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (!Array.isArray(parsed.feedback)) parsed.feedback = [];
        const added = mergeMissingFromSource(parsed, source);
        const extra =
          added.projects.length +
          added.persons +
          added.meetings +
          added.demos +
          added.attendance +
          added.feedback;
        if (extra) {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(parsed));
        }
        return parsed;
      }
    } catch (_) {}
    const base = clone(source);
    if (!Array.isArray(base.feedback)) base.feedback = [];
    return base;
  })();

  const statusEl = document.getElementById("pdb-status");
  const setStatus = (msg, ok) => {
    statusEl.textContent = msg || "";
    statusEl.classList.toggle("is-ok", Boolean(ok && msg));
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
  // Serialize → db.js
  // ---------------------------------------------------------------

  const serializeFile = () => {
    const payload = {
      norm: db.norm,
      aliases: db.aliases || {},
      persons: db.persons,
      projects: db.projects,
      meetings: db.meetings,
      attendance: db.attendance,
      demos: db.demos,
      feedback: db.feedback || [],
    };
    return (
      `// Единая база данных Планетария.\n` +
      `// Источник правды для визуализаций и админки.\n` +
      `// Реальные данные: посещения еженедельных встреч + демо-эфиры.\n` +
      `// generated: true — длительность восстановлена как 45 + число визитов.\n\n` +
      `(() => {\n` +
      `  "use strict";\n\n` +
      `  const PlanetariumDB = ${JSON.stringify(payload, null, 2)};\n\n` +
      `  if (typeof window !== "undefined") window.PlanetariumDB = PlanetariumDB;\n` +
      `  if (typeof module !== "undefined" && module.exports) module.exports = PlanetariumDB;\n` +
      `})();\n`
    );
  };

  const downloadDb = () => {
    const blob = new Blob([serializeFile()], { type: "text/javascript;charset=utf-8" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "db.js";
    a.click();
    URL.revokeObjectURL(a.href);
    setStatus("Файл db.js скачан");
  };

  const copyDb = async () => {
    try {
      await navigator.clipboard.writeText(serializeFile());
      setStatus("Скопировано в буфер");
    } catch {
      setStatus("Не удалось скопировать");
    }
  };

  const persistDraft = () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(db));
  };

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

  const ensureMeeting = (date, extra = {}) => {
    if (!date) return null;
    let m = db.meetings.find((x) => x.date === date);
    if (!m) {
      m = { date, type: "weekly", minutes: null, note: null };
      db.meetings.push(m);
      db.meetings.sort((a, b) => a.date.localeCompare(b.date));
    }
    m.type = "weekly";
    if (Object.prototype.hasOwnProperty.call(extra, "minutes")) m.minutes = extra.minutes;
    if (Object.prototype.hasOwnProperty.call(extra, "note")) m.note = extra.note;
    return m;
  };

  const writeAttendance = (date, people) => {
    db.attendance = db.attendance.filter((a) => a.meeting !== date);
    people.forEach((person) => db.attendance.push({ meeting: date, person }));
  };

  const upsertPerson = ({ id, name, telegram, photo, note }) => {
    if (id) {
      const p = db.persons.find((x) => x.id === id);
      if (!p) return null;
      p.name = name;
      p.telegram = telegram;
      p.photo = photo;
      p.note = note;
      return id;
    }
    const ids = new Set(db.persons.map((p) => p.id));
    const newId = uniqueId(slug(name), ids);
    db.persons.push({ id: newId, name, telegram, photo, note });
    return newId;
  };

  const upsertProject = ({ id, title, url, authors, note }) => {
    if (id) {
      const p = db.projects.find((x) => x.id === id);
      if (!p) return null;
      p.title = title;
      p.url = url;
      p.authors = authors;
      p.note = note;
      return id;
    }
    const ids = new Set(db.projects.map((p) => p.id));
    const newId = uniqueId(slug(title), ids);
    db.projects.push({ id: newId, title, url, authors, note });
    return newId;
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
    formPerson.telegram.value = p.telegram || "";
    formPerson.photo.value = p.photo || "";
    formPerson.note.value = p.note || "";
    listPersons.querySelectorAll("li").forEach((li) => {
      li.classList.toggle("active", li.dataset.id === id);
    });
  };

  formPerson.addEventListener("submit", (e) => {
    e.preventDefault();
    const name = formPerson.name.value.trim();
    if (!name) return;
    let id = formPerson.id.value;
    if (id) {
      const p = db.persons.find((x) => x.id === id);
      if (!p) return;
      p.name = name;
      p.telegram = empty(formPerson.telegram.value);
      p.photo = empty(formPerson.photo.value);
      p.note = empty(formPerson.note.value);
    } else {
      const ids = new Set(db.persons.map((p) => p.id));
      id = uniqueId(slug(name), ids);
      db.persons.push({
        id,
        name,
        telegram: empty(formPerson.telegram.value),
        photo: empty(formPerson.photo.value),
        note: empty(formPerson.note.value),
      });
    }
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
    db.attendance = db.attendance.filter((a) => a.person !== id);
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
    formProject.title.value = p.title || "";
    formProject.url.value = p.url || "";
    formProject.note.value = p.note || "";
    fillPersonChecks(projectAuthors, p.authors);
    listProjects.querySelectorAll("li").forEach((li) => {
      li.classList.toggle("active", li.dataset.id === id);
    });
    if (projectFormMode) projectFormMode.textContent = `Редактирование: ${p.title}`;
  };

  formProject.addEventListener("submit", (e) => {
    e.preventDefault();
    const title = formProject.title.value.trim();
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
    let id = formProject.id.value;
    if (id) {
      const p = db.projects.find((x) => x.id === id);
      if (!p) return;
      p.title = title;
      p.url = url;
      p.authors = authors;
      p.note = empty(formProject.note.value);
    } else {
      const ids = new Set(db.projects.map((p) => p.id));
      id = uniqueId(slug(title), ids);
      db.projects.push({
        id,
        title,
        url,
        authors,
        note: empty(formProject.note.value),
      });
    }
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
    formMeeting.note.value = m.note || "";
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
      db.attendance.forEach((a) => {
        if (a.meeting === orig) a.meeting = date;
      });
      db.demos.forEach((d) => {
        if (d.meeting === orig) d.meeting = date;
      });
      const m = db.meetings.find((x) => x.date === orig);
      if (m) m.date = date;
    }

    let m = db.meetings.find((x) => x.date === date);
    if (!m) {
      m = { date, type: "weekly", minutes: null, note: null };
      db.meetings.push(m);
    }
    m.type = "weekly";
    m.minutes = numOrNull(formMeeting.minutes.value);
    m.note = empty(formMeeting.note.value);
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
    db.attendance = db.attendance.filter((a) => a.meeting !== date);
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
    const selected = db.attendance.filter((a) => a.meeting === date).map((a) => a.person);
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
    db.attendance = db.attendance.filter((a) => a.meeting !== date);
    people.forEach((person) => db.attendance.push({ meeting: date, person }));
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
  const demoPresenterPicker = document.getElementById("demo-presenter-picker");
  const demoPresenterAuthors = document.getElementById("demo-presenter-authors");

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

  const sameIdSet = (a, b) => {
    if (a.length !== b.length) return false;
    const set = new Set(a);
    return b.every((id) => set.has(id));
  };

  const presenterModeIsAuthor = () =>
    document.querySelector("#demo-presenter-mode input[name=presenterMode]:checked")
      ?.value !== "other";

  const setPresenterMode = (mode) => {
    document.querySelectorAll("#demo-presenter-mode input[name=presenterMode]").forEach((input) => {
      input.checked = input.value === mode;
    });
  };

  const selectedPresenters = () => {
    const authors = projectAuthorsOf(selectedProjectId());
    return presenterModeIsAuthor() ? authors : checkedValues(demoPresenters);
  };

  const syncPresenterUI = () => {
    const projectId = selectedProjectId();
    const authors = projectAuthorsOf(projectId);
    const isAuthor = presenterModeIsAuthor();
    if (demoPresenterPicker) demoPresenterPicker.hidden = isAuthor;
    if (demoPresenterAuthors) {
      if (!isAuthor || !projectId) {
        demoPresenterAuthors.hidden = true;
        demoPresenterAuthors.textContent = "";
      } else if (!authors.length) {
        demoPresenterAuthors.hidden = false;
        demoPresenterAuthors.textContent = "У проекта нет авторов";
      } else {
        demoPresenterAuthors.hidden = false;
        demoPresenterAuthors.textContent = authors.map(personName).join(", ");
      }
    }
    if (isAuthor) fillPersonChecks(demoPresenters, authors);
  };

  const clearDemo = () => {
    formDemo.reset();
    formDemo.id.value = "";
    fillMeetingSelect(demoMeeting, demoMeeting.value);
    fillProjectRadios(demoProject, "");
    fillPersonChecks(demoPresenters, []);
    fillPersonChecks(demoFeedback, []);
    setDemoFormat(null);
    syncPresenterUI();
    syncDemoFormatUI();
    listDemos.querySelectorAll("li").forEach((li) => li.classList.remove("active"));
  };

  const loadDemo = (id) => {
    const d = db.demos.find((x) => x.id === id);
    if (!d) return;
    formDemo.id.value = d.id;
    fillMeetingSelect(demoMeeting, d.meeting);
    fillProjectRadios(demoProject, d.project);
    const authors = projectAuthorsOf(d.project);
    const isAuthor = authors.length > 0 && sameIdSet(d.presenters, authors);
    setPresenterMode(isAuthor ? "author" : "other");
    fillPersonChecks(demoPresenters, d.presenters);
    fillPersonChecks(demoFeedback, feedbackForDemo(id));
    // 1–3 только если у проекта ещё нет ссылки; иначе уровень 4 вычисляется сам
    setDemoFormat(projectHasUrl(d.project) ? null : d.format);
    formDemo.minutes.value = d.minutes ?? "";
    formDemo.note.value = d.note || "";
    syncPresenterUI();
    syncDemoFormatUI();
    listDemos.querySelectorAll("li").forEach((li) => {
      li.classList.toggle("active", li.dataset.id === id);
    });
  };

  demoProject.addEventListener("change", (e) => {
    if (e.target.name === "project") {
      syncPresenterUI();
      syncDemoFormatUI();
    }
  });

  document.getElementById("demo-presenter-mode")?.addEventListener("change", syncPresenterUI);

  formDemo.addEventListener("submit", (e) => {
    e.preventDefault();
    const meeting = formDemo.meeting.value;
    const project = selectedProjectId();
    const presenters = selectedPresenters();
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
      db.meetings.push({ date: meeting, type: "weekly", minutes: null, note: null });
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
      note: empty(formDemo.note.value),
    };
    if (id) {
      const d = db.demos.find((x) => x.id === id);
      if (!d) return;
      Object.assign(d, payload);
    } else {
      id = nextDemoId();
      db.demos.push({ id, ...payload });
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
      .map(
        (p) =>
          `<li data-id="${p.id}"><span>${escapeHtml(p.name)}</span>` +
          `<span class="meta">${p.telegram ? escapeHtml(p.telegram) : p.id}</span></li>`
      )
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
        const count = db.attendance.filter((a) => a.meeting === m.date).length;
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

  const FORMATS = {
    1: "рассказ",
    2: "экран",
    3: "слайды",
    4: "опубликованный продукт",
  };

  const humanDate = (date) => fmtDateRu(date);

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
      if (!projectHasUrl(d.project) && !d.format) {
        out.push(`«${title}»: нет ни ссылки на проект, ни формата`);
      }
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
    const m = db.meetings.find((x) => x.date === date) || {
      date,
      minutes: null,
      note: null,
    };

    const presentIds = db.attendance
      .filter((a) => a.meeting === date)
      .map((a) => a.person);
    const demos = db.demos.filter((d) => d.meeting === date);
    const lines = [humanDate(date)];

    lines.push(m.minutes ? `${m.minutes} мин` : "длительность не указана");
    if (m.note) lines.push(`Заметка: ${m.note}`);

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
      const format = projectHasUrl(d.project) ? 4 : d.format;
      lines.push(`  ${i + 1}. ${projectTitle(d.project)}`);
      lines.push(`     — показывает: ${namesOf(d.presenters).join(", ") || "не указано"}`);
      lines.push(
        `     — ${d.minutes ? `${d.minutes} мин` : "время не указано"} · ` +
          (format ? `формат ${format} · ${FORMATS[format]}` : "формат не указан")
      );
      if (project?.url) lines.push(`     — ссылка: ${project.url}`);
      const feedback = feedbackForDemo(d.id);
      if (feedback.length) lines.push(`     — фидбэк: ${namesOf(feedback).join(", ")}`);
      if (d.note) lines.push(`     — заметка: ${d.note}`);
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
            const people = db.attendance.filter((a) => a.meeting === m.date).length;
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
    fillPersonChecks(
      demoPresenters,
      presenterModeIsAuthor() ? projectAuthorsOf(selectedProjectId()) : checkedValues(demoPresenters)
    );
    syncPresenterUI();
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

  const liveDemoList = document.getElementById("live-demo-list");
  const liveDemoProject = document.getElementById("live-demo-project");
  const liveProjectPicker = document.getElementById("live-project-picker");
  const liveProjectCreate = document.getElementById("live-project-create");
  const liveNewAuthors = document.getElementById("live-new-authors");
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
  let adminMode = "live";

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
    syncLiveFormatUI();
  };

  const renderLiveAttendanceSummary = () => {
    const el = document.getElementById("live-attendance-summary");
    if (!el) return;
    const date = liveDate?.value;
    const n = date ? db.attendance.filter((a) => a.meeting === date).length : 0;
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
    if (liveDemoNote) liveDemoNote.value = "";
    const title = document.getElementById("live-new-title");
    const url = document.getElementById("live-new-url");
    const note = document.getElementById("live-new-note");
    if (title) title.value = "";
    if (url) url.value = "";
    if (note) note.value = "";
    if (liveNewAuthors) fillPersonChecks(liveNewAuthors, []);
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
    if (liveDemoNote) liveDemoNote.value = d.note || "";
    resetStopwatch();
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
        note: empty(document.getElementById("live-new-note").value),
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
    const presenters = projectAuthorsOf(project);
    if (!presenters.length) {
      setStatus("Нужен хотя бы один автор — они будут показывающими");
      return false;
    }
    ensureMeeting(date);
    stopStopwatch();
    const format = projectHasUrl(project) ? null : numOrNull(liveSelectedFormat());
    let id = liveDemoId.value;
    const payload = {
      meeting: date,
      project,
      presenters,
      minutes: numOrNull(liveDemoMinutes.value),
      format,
      note: empty(liveDemoNote?.value),
    };
    if (id) {
      const d = db.demos.find((x) => x.id === id);
      if (!d) return false;
      Object.assign(d, payload);
    } else {
      id = nextDemoId();
      db.demos.push({ id, ...payload });
    }
    const feedbackPeople = checkedValues(liveDemoFeedback);
    db.feedback = (db.feedback || []).filter((f) => f.demo !== id);
    feedbackPeople.forEach((person) => db.feedback.push({ demo: id, person }));
    persistDraft();
    liveDemoId.value = id;
    liveDemoDelete.hidden = false;
    setLiveProjectSource("existing");
    fillProjectRadios(liveDemoProject, project, { name: "live-project" });
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
      !liveDemoMinutes.value &&
      !liveDemoNote?.value.trim() &&
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
    fillPersonChecks(
      liveAttendance,
      db.attendance.filter((a) => a.meeting === liveDate.value).map((a) => a.person)
    );
    clearLiveDemoForm();
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
    fillPersonChecks(liveDemoFeedback, checkedValues(liveDemoFeedback));
    const date = liveDate.value;
    fillPersonChecks(
      liveAttendance,
      db.attendance.filter((a) => a.meeting === date).map((a) => a.person)
    );
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
    adminMode = next;
    localStorage.setItem(MODE_KEY, next);
    if (liveRoot) liveRoot.hidden = next !== "live";
    if (editRoot) editRoot.hidden = next !== "edit";
    document.querySelectorAll(".pdb-modes [data-mode]").forEach((btn) => {
      btn.setAttribute("aria-selected", btn.dataset.mode === next ? "true" : "false");
    });
    if (next === "live") {
      history.replaceState(null, "", "#live");
      refreshLive();
    } else if (location.hash === "#live" || !location.hash.replace(/^#/, "")) {
      switchTab("persons");
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
  liveDemoProject?.addEventListener("change", syncLiveFormatUI);
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
      telegram: empty(document.getElementById("live-new-person-telegram")?.value),
      photo: null,
      note: null,
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
  document.getElementById("live-save-draft")?.addEventListener("click", () => {
    flushLiveMeeting();
    persistDraft();
    setStatus("Черновик сохранён в браузере", true);
    renderLiveSummary();
  });
  document.getElementById("live-publish")?.addEventListener("click", () => {
    flushLiveMeeting();
    persistDraft();
    publishToProd();
  });

  // ---------------------------------------------------------------
  // Toolbar
  // ---------------------------------------------------------------

  document.getElementById("pdb-save-draft").addEventListener("click", () => {
    if (adminMode === "live") flushLiveMeeting();
    saveDraft();
    setStatus("Черновик сохранён в браузере", true);
  });
  document.getElementById("pdb-download").addEventListener("click", downloadDb);
  document.getElementById("pdb-download-2").addEventListener("click", downloadDb);
  document.getElementById("pdb-copy").addEventListener("click", copyDb);
  document.getElementById("pdb-copy-2").addEventListener("click", copyDb);
  document.getElementById("pdb-reset").addEventListener("click", () => {
    if (!confirm("Сбросить черновик и загрузить данные из js/db.js?")) return;
    localStorage.removeItem(STORAGE_KEY);
    db = clone(source);
    clearPerson();
    clearProject();
    clearMeeting();
    clearDemo();
    loadLiveMeeting(todayIso());
    renderAll();
    setStatus("Загружено из файла");
  });

  // ---------------------------------------------------------------
  // Публикация на прод (коммит js/db.js в main через GitHub API)
  // ---------------------------------------------------------------

  const GH_TOKEN_KEY = "planetarium-gh-token";
  const GH_REPO = "Perevvalka/planetarium-dashboard";
  const GH_BRANCH = "main";
  const tokenInput = document.getElementById("pdb-gh-token");
  const publishButtons = [
    document.getElementById("pdb-publish"),
    document.getElementById("pdb-publish-top"),
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

  const readRepoFile = async (path, token) => {
    const file = await ghRequest(
      `${ghRepo(`/contents/${path}`)}?ref=${GH_BRANCH}`,
      token
    );
    return base64ToUtf8(file.content);
  };

  const bustDbCache = (html) =>
    html.replace(
      /(src=["'][^"']*js\/db\.js)(\?v=[^"']*)?/g,
      `$1?v=${todayIso()}`
    );

  const commitFiles = async (token, message, files) => {
    const ref = await ghRequest(`${ghRepo(`/git/ref/heads/${GH_BRANCH}`)}`, token);
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
    await ghRequest(`${ghRepo(`/git/refs/heads/${GH_BRANCH}`)}`, token, {
      method: "PATCH",
      body: JSON.stringify({ sha: created.sha }),
    });
  };

  const publishViaContents = async (token, dbContent) => {
    const apiFile = ghRepo("/contents/js/db.js");
    let sha;
    try {
      const existing = await ghRequest(`${apiFile}?ref=${GH_BRANCH}`, token);
      sha = existing.sha;
    } catch (e) {
      if (e.status !== 404) throw e;
    }
    const payload = {
      message: `Update PlanetariumDB (${todayIso()}).`,
      content: utf8ToBase64(dbContent),
      branch: GH_BRANCH,
    };
    if (sha) payload.sha = sha;
    await ghRequest(apiFile, token, {
      method: "PUT",
      body: JSON.stringify(payload),
    });
  };

  const publishToProd = async () => {
    let token = (tokenInput?.value || "").trim() || localStorage.getItem(GH_TOKEN_KEY) || "";
    if (!token) {
      switchMode("edit");
      switchTab("export");
      tokenInput?.focus();
      setStatus("Сначала вставь токен GitHub на вкладке «Экспорт»");
      return;
    }
    if (tokenInput) tokenInput.value = token;
    localStorage.setItem(GH_TOKEN_KEY, token);

    if (
      !confirm("Записать текущую базу в js/db.js на ветке main и выложить на прод?")
    ) {
      return;
    }

    if (adminMode === "live") flushLiveMeeting();
    saveDraft();
    setStatus("Публикую на прод…");
    publishButtons.forEach((b) => {
      b.disabled = true;
    });

    const dbContent = serializeFile();

    try {
      const files = [{ path: "js/db.js", content: dbContent }];
      for (const path of ["dashboard.html", "admin.html"]) {
        try {
          const html = await readRepoFile(path, token);
          const next = bustDbCache(html);
          if (next !== html) files.push({ path, content: next });
        } catch (_) {}
      }
      try {
        await commitFiles(
          token,
          `Update PlanetariumDB (${todayIso()}).`,
          files
        );
      } catch (e) {
        if (e.status === 401 || e.status === 403) throw e;
        await publishViaContents(token, dbContent);
      }
      setStatus("Опубликовано на прод. Дашборд обновится через минуту.", true);
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
  fillPersonChecks(liveDemoFeedback, []);
  fillPersonChecks(liveAttendance, []);
  fillMeetingSelect(demoMeeting);
  fillProjectRadios(demoProject, "");
  fillProjectRadios(liveDemoProject, "", { name: "live-project" });
  syncMeetingDateLabel();
  if (liveDate) liveDate.value = todayIso();
  syncLiveDateLabel();
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
  if (localStorage.getItem(STORAGE_KEY)) {
    setStatus("Открыт черновик из браузера");
  } else {
    setStatus(
      `${db.persons.length} персон · ${db.meetings.length} встреч · ${db.demos.length} демо`
    );
  }
})();
