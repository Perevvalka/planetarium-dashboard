(function () {
  var STORAGE_PREFIX = "planetarium-ops:";
  var ROOM = "https://speak.kinescope.io/mxz-eaci-gac";
  var NOTION =
    "https://app.notion.com/p/intuition/2b720a97628a80dca723fccc0f1cdea7";

  var DAYS = [
    {
      id: "day-mon",
      day: "Пн",
      dow: 1,
      tasks: [
        {
          id: "task-subs",
          title: "Непродления",
          when: "утро / день",
          steps: [
            { id: "mon-1", text: "Открыть админку подписок" },
            { id: "mon-2", text: "Написать тем, у кого не удалось списать" },
            { id: "mon-3", text: "Кикнуть тех, кто отписался" },
          ],
        },
        {
          id: "task-post-early",
          title: "Пост в канал",
          when: "удобный слот (можно до вт)",
          steps: [
            {
              id: "rem-1",
              text: "Написать пост: во вторник коворкинг, в четверг тайное демо",
            },
          ],
        },
      ],
    },
    {
      id: "day-tue",
      day: "Вт",
      dow: 2,
      tasks: [
        {
          id: "task-room-tue",
          title: "Ссылка на комнату",
          when: "перед коворкингом",
          steps: [
            {
              id: "room-1",
              text: "Кинуть ссылку в канал",
              href: ROOM,
              linkLabel: "комната",
            },
          ],
        },
      ],
    },
    {
      id: "day-wed",
      day: "Ср",
      dow: 3,
      tasks: [
        {
          id: "task-post-wed",
          title: "Пост в канал",
          when: "день",
          steps: [
            { id: "rem-2", text: "Написать пост: завтра тайное демо" },
          ],
        },
      ],
    },
    {
      id: "day-thu",
      day: "Чт",
      dow: 4,
      tasks: [
        {
          id: "task-room-thu",
          title: "Ссылка на комнату",
          when: "перед демо",
          steps: [
            {
              id: "room-2",
              text: "Кинуть ссылку в канал",
              href: ROOM,
              linkLabel: "комната",
            },
          ],
        },
        {
          id: "task-demo",
          title: "Демо",
          when: "во время и после",
          steps: [
            { id: "demo-1", text: "Открыть admin.html", href: "admin.html" },
            {
              id: "demo-2",
              text: "Создать / открыть встречу на сегодня (еженедельная) и заполнять",
              href: "admin.html",
              linkLabel: "форма",
            },
            {
              id: "demo-3",
              text: "Перепроверить все разделы и сохранить",
              substeps: [
                {
                  id: "demo-3-1",
                  text: "Прочитать сводку по встрече",
                  href: "admin.html#summary",
                  linkLabel: "сводка",
                },
                { id: "demo-3-2", text: "Перейти на ветку main" },
                {
                  id: "demo-3-3",
                  text: "Скопировать db.js",
                  href: "admin.html#export",
                  linkLabel: "экспорт",
                },
                {
                  id: "demo-3-4",
                  text: "Выделить весь код в js/db.js и вставить (⌘A, ⌘V)",
                },
                { id: "demo-3-5", text: "Пуш коммит на прод" },
              ],
            },
            { id: "demo-4", text: "Собрать скриншоты созвона" },
            { id: "demo-5", text: "Сшить коллаж в Illustrator" },
            { id: "demo-6", text: "Пост в канал + картинка" },
          ],
        },
      ],
    },
    {
      id: "day-fri",
      day: "Пт",
      dow: 5,
      tasks: [
        {
          id: "task-friday",
          title: "Асинхронное демо → лендинг",
          when: "утро → лендинг",
          steps: [
            {
              id: "fri-1",
              text: "Пост: обновите строку асинхронного демо в Notion",
            },
            {
              id: "fri-2",
              text: "Сохранить таблицу csv и обновить на лендосе",
              href: NOTION,
              linkLabel: "Notion",
            },
          ],
        },
      ],
    },
    {
      id: "day-sync",
      day: "когда нужно",
      dow: null,
      tasks: [
        {
          id: "task-sync",
          title: "Синк с Женей",
          when: "—",
          steps: [
            {
              id: "sync-1",
              text: "Открыть документ",
              href: "https://docs.google.com/document/d/1TQm38OlaOq2LteHVtj4tYK38kK3Ln_uvPpct0oQa_hk/edit?tab=t.ze6q0u7256v0",
              linkLabel: "актуальное",
            },
            {
              id: "sync-2",
              text: "Дописать, что сгорело / зависло с прошлой недели",
            },
            { id: "sync-3", text: "Разделить: могу сама / нужен Женя" },
            {
              id: "sync-4",
              text: "Пройти «нужен Женя»: решение, кто делает, дедлайн — и зафиксировать в документе",
            },
            {
              id: "sync-6",
              text: "Если нужна ещё встреча — сразу слот или кто зовёт",
            },
            { id: "sync-8", text: "Убрать сделанное" },
            {
              id: "sync-9",
              text: "Новые регулярные пункты добавить на эту страницу через Cursor",
            },
          ],
        },
      ],
    },
  ];

  function isoWeekKey(d) {
    var date = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
    var day = date.getUTCDay() || 7;
    date.setUTCDate(date.getUTCDate() + 4 - day);
    var yearStart = new Date(Date.UTC(date.getUTCFullYear(), 0, 1));
    var week = Math.ceil(((date - yearStart) / 86400000 + 1) / 7);
    return date.getUTCFullYear() + "-W" + String(week).padStart(2, "0");
  }

  function storageKey() {
    return STORAGE_PREFIX + isoWeekKey(new Date());
  }

  function loadState() {
    try {
      var raw = localStorage.getItem(storageKey());
      if (!raw) return {};
      var parsed = JSON.parse(raw);
      return parsed && typeof parsed === "object" ? parsed : {};
    } catch (e) {
      return {};
    }
  }

  function saveState(state) {
    localStorage.setItem(storageKey(), JSON.stringify(state));
  }

  function stepIds(step) {
    var ids = [step.id];
    (step.substeps || []).forEach(function (sub) {
      ids.push(sub.id);
    });
    return ids;
  }

  function taskStepIds(task) {
    var ids = [];
    task.steps.forEach(function (step) {
      ids = ids.concat(stepIds(step));
    });
    return ids;
  }

  function dayStepIds(day) {
    var ids = [];
    day.tasks.forEach(function (task) {
      ids = ids.concat(taskStepIds(task));
    });
    return ids;
  }

  function countDay(day, state) {
    var ids = dayStepIds(day);
    var done = 0;
    ids.forEach(function (id) {
      if (state[id]) done += 1;
    });
    return { done: done, total: ids.length };
  }

  function countTask(task, state) {
    var ids = taskStepIds(task);
    var done = 0;
    ids.forEach(function (id) {
      if (state[id]) done += 1;
    });
    return { done: done, total: ids.length };
  }

  function findDay(id) {
    return DAYS.find(function (day) {
      return day.id === id;
    });
  }

  function daySummary(day) {
    return day.tasks
      .map(function (task) {
        return task.title;
      })
      .join(" · ");
  }

  function appendStepLabel(span, item) {
    if (item.href) {
      if (item.linkLabel) {
        span.appendChild(document.createTextNode(item.text + " — "));
        var a = document.createElement("a");
        a.href = item.href;
        a.textContent = item.linkLabel;
        a.target = "_blank";
        a.rel = "noopener";
        a.addEventListener("click", function (e) {
          e.stopPropagation();
        });
        span.appendChild(a);
      } else {
        var aOnly = document.createElement("a");
        aOnly.href = item.href;
        aOnly.textContent = item.text;
        aOnly.target = "_blank";
        aOnly.rel = "noopener";
        aOnly.addEventListener("click", function (e) {
          e.stopPropagation();
        });
        span.appendChild(aOnly);
      }
    } else {
      span.textContent = item.text;
    }
  }

  var state = loadState();
  var selectedDayId = null;

  function stepLabel(item) {
    var label = document.createElement("label");
    if (state[item.id]) label.classList.add("done");

    var input = document.createElement("input");
    input.type = "checkbox";
    input.checked = !!state[item.id];
    input.dataset.id = item.id;

    var span = document.createElement("span");
    appendStepLabel(span, item);

    label.appendChild(input);
    label.appendChild(span);
    return label;
  }

  var weekLabel = document.getElementById("ops-week-label");
  var weekEl = document.getElementById("ops-week");
  var detailEl = document.getElementById("ops-detail");
  var resetBtn = document.getElementById("ops-reset");

  function todayDow() {
    return new Date().getDay();
  }

  function renderWeek() {
    weekEl.innerHTML = "";
    DAYS.forEach(function (day) {
      var btn = document.createElement("button");
      btn.type = "button";
      btn.className = "ops-week-row";
      if (day.id === selectedDayId) btn.classList.add("selected");
      btn.setAttribute("role", "option");
      btn.setAttribute("aria-selected", day.id === selectedDayId ? "true" : "false");
      btn.dataset.day = day.id;

      var dayEl = document.createElement("span");
      dayEl.className = "ops-week-day";
      dayEl.textContent = day.day;

      var textWrap = document.createElement("span");
      textWrap.className = "ops-week-text";
      textWrap.appendChild(document.createTextNode(daySummary(day)));

      var counts = countDay(day, state);
      var count = document.createElement("span");
      count.className = "ops-week-count";
      count.textContent = counts.done + "/" + counts.total;
      textWrap.appendChild(count);

      var when = document.createElement("span");
      when.className = "ops-week-when";
      when.textContent =
        day.tasks.length > 1 ? day.tasks.length + " задачи" : day.tasks[0].when;

      btn.appendChild(dayEl);
      btn.appendChild(textWrap);
      btn.appendChild(when);
      btn.addEventListener("click", function () {
        selectDay(day.id);
      });
      weekEl.appendChild(btn);
    });
  }

  function renderDetail() {
    detailEl.innerHTML = "";
    var day = findDay(selectedDayId);
    if (!day) return;

    var title = document.createElement("h2");
    title.className = "ops-detail-title";
    title.textContent = day.day;
    detailEl.appendChild(title);

    var counts = countDay(day, state);
    var banner = document.createElement("div");
    banner.className = "ops-done-banner";
    banner.hidden = counts.done !== counts.total || counts.total === 0;
    banner.textContent = "День закрыт.";
    detailEl.appendChild(banner);

    day.tasks.forEach(function (task) {
      var block = document.createElement("div");
      block.className = "ops-task";

      var head = document.createElement("div");
      head.className = "ops-task-head";

      var h = document.createElement("h3");
      h.textContent = task.title;
      head.appendChild(h);

      var meta = document.createElement("span");
      meta.className = "ops-task-meta";
      var taskCounts = countTask(task, state);
      meta.textContent =
        task.when + " · " + taskCounts.done + "/" + taskCounts.total;
      head.appendChild(meta);

      block.appendChild(head);

      var ul = document.createElement("ul");
      ul.className = "ops-list";
      task.steps.forEach(function (item) {
        var li = document.createElement("li");
        li.appendChild(stepLabel(item));
        if (item.substeps && item.substeps.length) {
          var subUl = document.createElement("ul");
          subUl.className = "ops-list ops-sublist";
          item.substeps.forEach(function (sub) {
            var subLi = document.createElement("li");
            subLi.appendChild(stepLabel(sub));
            subUl.appendChild(subLi);
          });
          li.appendChild(subUl);
        }
        ul.appendChild(li);
      });
      block.appendChild(ul);
      detailEl.appendChild(block);
    });
  }

  function refresh() {
    weekLabel.textContent =
      "Неделя " + isoWeekKey(new Date()).replace("-W", " · W");
    renderWeek();
    renderDetail();
  }

  function selectDay(id) {
    selectedDayId = id;
    renderWeek();
    renderDetail();
    history.replaceState(null, "", "#" + id);
  }

  detailEl.addEventListener("change", function (e) {
    var input = e.target;
    if (!input || input.type !== "checkbox" || !input.dataset.id) return;
    state[input.dataset.id] = input.checked;
    saveState(state);
    var label = input.closest("label");
    if (label) label.classList.toggle("done", input.checked);
    refresh();
  });

  resetBtn.addEventListener("click", function () {
    if (!confirm("Сбросить все галочки этой недели?")) return;
    state = {};
    localStorage.removeItem(storageKey());
    refresh();
  });

  function defaultDay() {
    var dow = todayDow();
    var match = DAYS.find(function (day) {
      return day.dow === dow;
    });
    if (match) return match.id;
    if (dow === 0 || dow === 6) return "day-sync";
    return "day-mon";
  }

  var hash = (location.hash || "").replace(/^#/, "");
  selectedDayId = findDay(hash) ? hash : defaultDay();
  refresh();
})();
