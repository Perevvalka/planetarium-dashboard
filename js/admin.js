// Админка единой базы PlanetariumDB.
// Черновик — localStorage; в репозиторий — через скачивание js/db.js.

(() => {
  "use strict";

  const STORAGE_KEY = "planetarium-db-draft";
  const source = window.PlanetariumDB;
  if (!source) {
    console.error("PlanetariumDB не загружена");
    return;
  }

  const clone = (v) => JSON.parse(JSON.stringify(v));

  let db = (() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (!Array.isArray(parsed.feedback)) parsed.feedback = [];
        return parsed;
      }
    } catch (_) {}
    const base = clone(source);
    if (!Array.isArray(base.feedback)) base.feedback = [];
    return base;
  })();

  const statusEl = document.getElementById("pdb-status");
  const setStatus = (msg) => {
    statusEl.textContent = msg || "";
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
      `// Реальные данные: посещения еженедельных встреч + демо-эфиры.\n\n` +
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

  const saveDraft = () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(db));
    setStatus("Черновик сохранён в браузере");
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
    if (id === "export") {
      document.getElementById("pdb-preview").textContent = serializeFile();
    }
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
        const label = `${m.date} · ${m.type === "stream" ? "эфир" : "встреча"}`;
        return `<option value="${m.date}"${m.date === selected ? " selected" : ""}>${label}</option>`;
      })
      .join("");
  };

  const fillProjectRadios = (host, selected) => {
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
        const match = !query || normalizeSearch(p.title).includes(query);
        const mark = p.url ? " · ссылка" : "";
        return (
          `<label${match ? "" : " hidden"}>` +
          `<input type="radio" name="project" value="${p.id}"${p.id === set ? " checked" : ""} required> ` +
          `${escapeHtml(p.title)}${mark}</label>`
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
        fillProjectRadios(host, current);
      });
    }
  };

  const selectedProjectId = () =>
    document.querySelector("#demo-project input[type=radio]:checked")?.value || "";

  const selectedFormat = () =>
    document.querySelector("#demo-format input[name=format]:checked")?.value || "";

  const projectHasUrl = (projectId) => {
    const p = db.projects.find((x) => x.id === projectId);
    return Boolean(p?.url);
  };

  const syncDemoFormatUI = () => {
    const radios = document.getElementById("demo-format");
    const autoNote = document.getElementById("demo-format-auto");
    const projectId = selectedProjectId();
    const hasUrl = projectId && projectHasUrl(projectId);
    if (radios) radios.hidden = hasUrl;
    if (autoNote) autoNote.hidden = !hasUrl;
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
    setStatus("Персона сохранена");
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
    setStatus("Проект сохранён");
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

  const clearMeeting = () => {
    formMeeting.reset();
    formMeeting.origDate.value = "";
    listMeetings.querySelectorAll("li").forEach((li) => li.classList.remove("active"));
  };

  const loadMeeting = (date) => {
    const m = db.meetings.find((x) => x.date === date);
    if (!m) return;
    formMeeting.origDate.value = m.date;
    formMeeting.date.value = m.date;
    formMeeting.type.value = m.type || "weekly";
    formMeeting.minutes.value = m.minutes ?? "";
    formMeeting.note.value = m.note || "";
    listMeetings.querySelectorAll("li").forEach((li) => {
      li.classList.toggle("active", li.dataset.date === date);
    });
  };

  formMeeting.addEventListener("submit", (e) => {
    e.preventDefault();
    const date = formMeeting.date.value;
    const type = formMeeting.type.value;
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
      m = { date, type, minutes: null, note: null };
      db.meetings.push(m);
    }
    m.type = type;
    m.minutes = numOrNull(formMeeting.minutes.value);
    m.note = empty(formMeeting.note.value);
    db.meetings.sort((a, b) => a.date.localeCompare(b.date));
    saveDraft();
    loadMeeting(date);
    setStatus("Встреча сохранена");
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

  // ---------------------------------------------------------------
  // Attendance
  // ---------------------------------------------------------------

  const formAttendance = document.getElementById("form-attendance");
  const attendanceMeeting = document.getElementById("attendance-meeting");
  const attendancePeople = document.getElementById("attendance-people");
  const attendanceSummary = document.getElementById("attendance-summary");

  const isWeekly = (m) => m.type === "weekly";

  const loadAttendanceForm = () => {
    const weekly = db.meetings.filter(isWeekly);
    const preferred =
      attendanceMeeting.value && weekly.some((m) => m.date === attendanceMeeting.value)
        ? attendanceMeeting.value
        : weekly.at(-1)?.date;
    fillMeetingSelect(attendanceMeeting, preferred, isWeekly);
    const date = attendanceMeeting.value;
    const selected = db.attendance.filter((a) => a.meeting === date).map((a) => a.person);
    fillPersonChecks(attendancePeople, selected);
    attendanceSummary.textContent = date
      ? `${selected.length} человек на встрече ${date}`
      : "Нет еженедельных встреч";
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
    setStatus(`Присутствие сохранено: ${people.length}`);
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

  const setDemoFormat = (value) => {
    document.querySelectorAll("#demo-format input[name=format]").forEach((input) => {
      input.checked = value != null && String(input.value) === String(value);
    });
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
    formDemo.note.value = d.note || "";
    syncDemoFormatUI();
    listDemos.querySelectorAll("li").forEach((li) => {
      li.classList.toggle("active", li.dataset.id === id);
    });
  };

  demoProject.addEventListener("change", (e) => {
    if (e.target.name === "project") syncDemoFormatUI();
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

    // если даты нет в meetings — добавим как stream
    if (!db.meetings.some((m) => m.date === meeting)) {
      db.meetings.push({ date: meeting, type: "stream", minutes: null, note: null });
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
    setStatus(
      feedbackPeople.length
        ? `Демо сохранено · фидбэк: ${feedbackPeople.length}`
        : "Демо сохранено"
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
        const match = !query || normalizeSearch(p.title).includes(query);
        const authors = p.authors.map(personName).join(", ");
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
      listProjects.innerHTML = `<li class="pdb-empty" style="cursor:default;border:none">Пока нет проектов</li>`;
    } else if (query && !visible) {
      listProjects.insertAdjacentHTML(
        "beforeend",
        `<li class="pdb-empty" style="cursor:default;border:none">Ничего не найдено</li>`
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
        const meta =
          m.type === "stream"
            ? `эфир · ${demos} демо`
            : `встреча · ${count} чел.${demos ? ` · ${demos} демо` : ""}`;
        return (
          `<li data-date="${m.date}"><span>${m.date}</span>` +
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
        return (
          `<li data-id="${d.id}"><span>${escapeHtml(projectTitle(d.project))}</span>` +
          `<span class="meta">${d.meeting} · ${escapeHtml(who)}</span></li>`
        );
      })
      .join("");
    listDemos.querySelectorAll("li").forEach((li) => {
      li.addEventListener("click", () => loadDemo(li.dataset.id));
    });
  };

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
    const preview = document.getElementById("pdb-preview");
    if (preview && !document.querySelector('[data-panel="export"]').hidden) {
      preview.textContent = serializeFile();
    }
  };

  // ---------------------------------------------------------------
  // Toolbar
  // ---------------------------------------------------------------

  document.getElementById("pdb-save-draft").addEventListener("click", saveDraft);
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
    renderAll();
    setStatus("Загружено из файла");
  });

  // init
  fillPersonChecks(projectAuthors, []);
  fillPersonChecks(demoPresenters, []);
  fillPersonChecks(demoFeedback, []);
  fillMeetingSelect(demoMeeting);
  fillProjectRadios(demoProject, "");
  renderAll();
  if (localStorage.getItem(STORAGE_KEY)) {
    setStatus("Открыт черновик из браузера");
  } else {
    setStatus(
      `${db.persons.length} персон · ${db.meetings.length} встреч · ${db.demos.length} демо`
    );
  }
})();
