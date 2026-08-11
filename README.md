# planetarium-dashboard

Дашборд Планетария: чек-листы, база встреч, стрики и датавиз.
Вёрстка на каркасе [IDS](https://intuition-tech.github.io/ids/) (CSS-токены и компоненты).

## Структура

```
├── index.html          # главная — ссылки на страницы
├── ops.html            # чек-листы админа
├── admin.html          # ввод базы данных
├── attendance.html     # стрики посещений
├── dataviz.html        # пять визуализаций
│
├── css/                # каркас IDS
│   ├── tokens/         # палитра, цвета, шкалы
│   ├── settings.css    # шрифт, плотность
│   ├── reset.css
│   ├── page-composition/layout.css
│   └── components/     # ids.css, theme-toggle
│
├── js/
│   ├── theme-toggle.js # переключатель темы (IDS)
│   ├── db.js           # данные планетария
│   ├── ops.js
│   ├── admin.js
│   ├── attendance.js
│   └── dataviz.js
│
├── fonts/              # Inter Variable
├── images/             # favicon
└── docs/
    ├── CONVENTIONS.md  # CSS-конвенции IDS
    └── admin/          # текстовые чек-листы
```

Открывай `index.html` в браузере — оттуда все остальные страницы.
На каждой странице есть ссылка «← Главная».

## License

MIT — see [LICENSE](./LICENSE).
