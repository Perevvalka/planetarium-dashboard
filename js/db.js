// Единая база данных Планетария.
// Источник правды для визуализаций и админки.
// Реальные данные: посещения еженедельных встреч + демо-эфиры.
// Пустые поля не хранятся: отсутствие ключа = значение не задано.
// attendance — явка, сгруппированная по дате встречи.
// active: true — активная подписка; у остальных поля нет.
// generated: true — длительность не замерена, а проставлена приблизительно.

(() => {
  "use strict";

  const PlanetariumDB = {
  "persons": [
    {
      "id": "adam-arutyunov",
      "name": "Адам Арутюнов",
      "active": true
    },
    {
      "id": "alena-grishkovets",
      "name": "Алёна Гришковец"
    },
    {
      "id": "anastasiya-fomina",
      "name": "Анастасия Фомина",
      "active": true
    },
    {
      "id": "anna-safka",
      "name": "Анна Сафка"
    },
    {
      "id": "artem-ermolaev",
      "name": "Артём Ермолаев",
      "active": true
    },
    {
      "id": "asya-dragun",
      "name": "Ася Драгун"
    },
    {
      "id": "valeriya-romanova",
      "name": "Валерия Романова"
    },
    {
      "id": "vika-german",
      "name": "Вика Герман"
    },
    {
      "id": "viktor-timofeev",
      "name": "Виктор Тимофеев"
    },
    {
      "id": "vitaliy",
      "name": "Виталий"
    },
    {
      "id": "vlad",
      "name": "Влад"
    },
    {
      "id": "vladimir-trifonov",
      "name": "Владимир Трифонов"
    },
    {
      "id": "vova",
      "name": "Вова"
    },
    {
      "id": "georgiy-mishurovskiy",
      "name": "Георгий Мишуровский",
      "active": true
    },
    {
      "id": "gleb-tiidt",
      "name": "Глеб Тиидт"
    },
    {
      "id": "gosha",
      "name": "Гоша"
    },
    {
      "id": "daler-alierov",
      "name": "Далер Алиёров",
      "active": true
    },
    {
      "id": "dana",
      "name": "Дана",
      "active": true
    },
    {
      "id": "danya-samoylenko",
      "name": "Даня Самойленко",
      "active": true
    },
    {
      "id": "darya-degtyareva",
      "name": "Дарья Дегтярева"
    },
    {
      "id": "dmitriy-sivuhin",
      "name": "Дмитрий Сивухин",
      "active": true
    },
    {
      "id": "evgeniy-smirnov",
      "name": "Евгений Смирнов",
      "active": true
    },
    {
      "id": "egor-veselov",
      "name": "Егор Веселов",
      "active": true
    },
    {
      "id": "ekaterina-lakutina",
      "name": "Екатерина Лакутина"
    },
    {
      "id": "elena-chausova",
      "name": "Елена Чаусова",
      "active": true
    },
    {
      "id": "zhanna-belousova",
      "name": "Жанна Белоусова",
      "active": true
    },
    {
      "id": "zhenya-arutyunov",
      "name": "Женя Арутюнов",
      "active": true
    },
    {
      "id": "zhenya-sarnetskiy",
      "name": "Женя Сарнецкий",
      "active": true
    },
    {
      "id": "zoya",
      "name": "Зоя",
      "active": true
    },
    {
      "id": "ilya-narinskiy",
      "name": "Илья Наринский"
    },
    {
      "id": "ira-zaharova",
      "name": "Ира Захарова"
    },
    {
      "id": "kirill-myshkin",
      "name": "Кирилл Мышкин"
    },
    {
      "id": "kirill-oleynichenko",
      "name": "Кирилл Олейниченко",
      "active": true
    },
    {
      "id": "kirill-chernov",
      "name": "Кирилл Чернов"
    },
    {
      "id": "kostya-grigorev",
      "name": "Костя Григорьев"
    },
    {
      "id": "kristina-dunina",
      "name": "Кристина Дунина",
      "active": true
    },
    {
      "id": "kristina-marchenko",
      "name": "Кристина Марченко",
      "active": true
    },
    {
      "id": "lesha-kram",
      "name": "Лёша Крам"
    },
    {
      "id": "lesha-nikitin",
      "name": "Лёша Никитин",
      "active": true
    },
    {
      "id": "lora-guranina",
      "name": "Лора Гуранина",
      "active": true
    },
    {
      "id": "magomed-vagabov",
      "name": "Магомед Вагабов",
      "active": true
    },
    {
      "id": "marat-habibulin",
      "name": "Марат Хабибулин",
      "active": true
    },
    {
      "id": "masha-troitskaya",
      "name": "Маша Троицкая"
    },
    {
      "id": "nadya-tkacheva",
      "name": "Надя Ткачева"
    },
    {
      "id": "nastya-tulaeva",
      "name": "Настя Тулаева"
    },
    {
      "id": "olga-permyakova",
      "name": "Ольга Пермякова",
      "active": true
    },
    {
      "id": "polina-perevalova",
      "name": "Полина Перевалова",
      "active": true
    },
    {
      "id": "ramil-karimov",
      "name": "Рамиль Каримов",
      "active": true
    },
    {
      "id": "rasul-shtibekov",
      "name": "Расул Штибеков"
    },
    {
      "id": "rinat-enikeev",
      "name": "Ринат Еникеев"
    },
    {
      "id": "roma-kuzhel",
      "name": "Рома Кужель",
      "active": true
    },
    {
      "id": "ruslan-mamedov",
      "name": "Руслан Мамедов",
      "active": true
    },
    {
      "id": "rustam-mushraipov",
      "name": "Рустам Мушраипов",
      "active": true
    },
    {
      "id": "sveta",
      "name": "Света",
      "active": true
    },
    {
      "id": "tatyana-kashina",
      "name": "Татьяна Кашина"
    },
    {
      "id": "yulya-kutenko",
      "name": "Юля Кутьенко"
    },
    {
      "id": "andrey",
      "name": "Андрей Шинкаренко",
      "active": true
    },
    {
      "id": "ayrat",
      "name": "Айрат"
    },
    {
      "id": "sasha-permyakov",
      "name": "Саша Пермяков",
      "active": true
    },
    {
      "id": "mariya-gribova",
      "name": "Мария Грибова",
      "active": true
    },
    {
      "id": "nikita-breyk",
      "name": "Никита Брейк",
      "active": true
    }
  ],
  "projects": [
    {
      "id": "telegram-kanal-s-uprazhneniyami-dlya-dizaynerov",
      "title": "Телеграм-канал с упражнениями для дизайнеров",
      "url": "https://t.me/ddrills",
      "authors": [
        "roma-kuzhel"
      ]
    },
    {
      "id": "telegram-kanal-oy-babonki-glyante-ka",
      "title": "Телеграм-канал «Ой, бабоньки, гляньте-ка!»",
      "url": "https://t.me/oibabonky",
      "authors": [
        "elena-chausova"
      ]
    },
    {
      "id": "bookov",
      "title": "Bookov",
      "url": "https://bookov.app/",
      "authors": [
        "kirill-oleynichenko"
      ]
    },
    {
      "id": "illyustratsii-dlya-upakovki",
      "title": "Иллюстрации для упаковки",
      "authors": [
        "kristina-dunina"
      ]
    },
    {
      "id": "stopfires-org",
      "title": "stopfires.org",
      "url": "http://stopfires.org",
      "authors": [
        "rinat-enikeev"
      ]
    },
    {
      "id": "telegram-kanal-kakovo-byt-dizaynerom",
      "title": "Телеграм-канал «Каково быть дизайнером»",
      "url": "https://t.me/kakovo_design",
      "authors": [
        "kristina-marchenko"
      ]
    },
    {
      "id": "creative-spark-board",
      "title": "creative-spark-board",
      "url": "https://creative-spark-board.lovable.app/",
      "authors": [
        "roma-kuzhel"
      ]
    },
    {
      "id": "telegram-kanal-ruslan-i-bukvalnyy-chellendzh",
      "title": "Телеграм-канал «Руслан и Буквальный челлендж»",
      "url": "https://t.me/simbarus_abc",
      "authors": [
        "ruslan-mamedov"
      ]
    },
    {
      "id": "podkast-hoba",
      "title": "Подкаст «Хоба»",
      "url": "https://hoba.mave.digital/",
      "authors": [
        "daler-alierov"
      ]
    },
    {
      "id": "svoy-sayt",
      "title": "Свой сайт",
      "authors": [
        "viktor-timofeev"
      ]
    },
    {
      "id": "gotitbureau-com-rus",
      "title": "gotitbureau.com/rus",
      "url": "https://gotitbureau.com/rus",
      "authors": [
        "ira-zaharova"
      ]
    },
    {
      "id": "detskaya-kniga",
      "title": "Детская книга",
      "authors": [
        "ekaterina-lakutina"
      ]
    },
    {
      "id": "muzey-neprinyatyh-rabot-stol",
      "title": "Музей непринятых работ «Стол»",
      "url": "https://t.me/stolmuseum",
      "authors": [
        "artem-ermolaev"
      ]
    },
    {
      "id": "hypetype",
      "title": "hypetype",
      "url": "https://simbarus.com/hypetype",
      "authors": [
        "ruslan-mamedov"
      ]
    },
    {
      "id": "kurs-po-matematike-kotoraya-prigoditsya-v-zhizni",
      "title": "Курс по математике, которая пригодится в жизни",
      "url": "https://setka.design/math/",
      "authors": [
        "adam-arutyunov"
      ]
    },
    {
      "id": "pervyy-rolik-na-yutyub",
      "title": "Первый ролик на ютюб",
      "url": "https://www.youtube.com/watch?v=R3uu2H9HthQ",
      "authors": [
        "masha-troitskaya"
      ]
    },
    {
      "id": "prilozhenie-dlya-rasshifrovki-vstrech-context",
      "title": "Приложение для расшифровки встреч «Context»",
      "authors": [
        "daler-alierov"
      ]
    },
    {
      "id": "past-simple",
      "title": "Past Simple",
      "url": "https://past-simple.ru/",
      "authors": [
        "artem-ermolaev"
      ]
    },
    {
      "id": "aside",
      "title": "Aside",
      "url": "https://aside.city/",
      "authors": [
        "lesha-nikitin"
      ]
    },
    {
      "id": "bot-letmidzhoyn",
      "title": "Бот Летмиджойн",
      "url": "https://letmejoin.myshkin.eu/",
      "authors": [
        "kirill-myshkin"
      ]
    },
    {
      "id": "prezentatsiya-kak-sobrat-portfolio",
      "title": "Презентация «Как собрать портфолио»",
      "authors": [
        "evgeniy-smirnov"
      ]
    },
    {
      "id": "dot-dead",
      "title": "dot.dead",
      "url": "https://t.me/danyatutpishet/735",
      "authors": [
        "danya-samoylenko"
      ]
    },
    {
      "id": "search-thru",
      "title": "Search Thru",
      "url": "http://searchth.ru/",
      "authors": [
        "magomed-vagabov"
      ]
    },
    {
      "id": "telerupor",
      "title": "Телерупор",
      "authors": [
        "kirill-myshkin"
      ]
    },
    {
      "id": "kontsept-igry-chayka",
      "title": "Концепт игры «Чайка»",
      "authors": [
        "anastasiya-fomina"
      ]
    },
    {
      "id": "scurrynslide-biblioteka-dlya-drag-and-drop",
      "title": "Scurry’n’slide — библиотека для drag-and-drop",
      "url": "https://myshkin.eu/scurry-n-slide",
      "authors": [
        "kirill-myshkin"
      ]
    },
    {
      "id": "igra-shpion-sredi-nas",
      "title": "Игра «Шпион среди нас»",
      "url": "https://apps.apple.com/kz/app/spy-party-game/id6787716143",
      "authors": [
        "marat-habibulin"
      ]
    },
    {
      "id": "polina-hochet-uchitsya-vo-frantsii",
      "title": "Полина хочет учиться во Франции",
      "url": "https://t.me/+XuBW-Kc0t4wzYTYy",
      "authors": [
        "polina-perevalova"
      ]
    },
    {
      "id": "sayt-kristiny-marchenko",
      "title": "Свой сайт",
      "authors": [
        "kristina-marchenko"
      ]
    },
    {
      "id": "taymer-dlya-chasov",
      "title": "Таймер для часов",
      "authors": [
        "andrey"
      ]
    },
    {
      "id": "sayly-ai-english-tutor",
      "title": "Sayly — AI English tutor",
      "url": "https://t.me/PerfectEnglishTutorBot",
      "authors": [
        "ayrat"
      ]
    },
    {
      "id": "otslezhivatel-biletov-na-vodnyy-transport",
      "title": "Отслеживатель билетов на водный транспорт",
      "authors": [
        "zhenya-arutyunov"
      ]
    },
    {
      "id": "ernolaev-space-svoy-sayt",
      "title": "Свой сайт",
      "url": "https://ermolaev.space",
      "authors": [
        "artem-ermolaev"
      ]
    },
    {
      "id": "shrift",
      "title": "Шрифт Михей",
      "authors": [
        "magomed-vagabov"
      ]
    },
    {
      "id": "obnovlenie-sayta-evgeniya-smirnova",
      "title": "Свой сайт",
      "url": "https://yevgeniysmirnov.ru/",
      "authors": [
        "evgeniy-smirnov"
      ]
    },
    {
      "id": "konsultatsionnyy-klub",
      "title": "Консультационный клуб",
      "authors": [
        "zhenya-arutyunov"
      ]
    },
    {
      "id": "sayt-dannyh-dlya-dnd",
      "title": "Сайт данных для ДНД",
      "authors": [
        "ramil-karimov"
      ]
    },
    {
      "id": "tsifrovaya-prepodavatelskaya",
      "title": "Цифровая преподавательская",
      "authors": [
        "kristina-marchenko"
      ]
    },
    {
      "id": "pechat-knigi-eto-krasivo-a-eto-net",
      "title": "Печать книги «Это красиво, а это нет»",
      "authors": [
        "zhenya-arutyunov"
      ]
    },
    {
      "id": "inst-dlya-tvorchestva",
      "title": "Инст для творчества",
      "url": "https://www.instagram.com/polina_tancy_muzyka/",
      "authors": [
        "polina-perevalova"
      ]
    },
    {
      "id": "dashbord-planetariya",
      "title": "Дашборд Планетария",
      "authors": [
        "zhenya-arutyunov",
        "polina-perevalova"
      ]
    },
    {
      "id": "kurs-dizayn-s-klodom",
      "title": "Курс «Дизайн с Клодом»",
      "authors": [
        "artem-ermolaev"
      ]
    },
    {
      "id": "svoy-sayt-2",
      "title": "Свой сайт",
      "authors": [
        "anastasiya-fomina"
      ]
    },
    {
      "id": "triema-dvizhok-bloga",
      "title": "Триема — движок блога",
      "authors": [
        "magomed-vagabov"
      ]
    },
    {
      "id": "bot-cool-triad",
      "title": "Бот «Cool triad»",
      "url": "https://t.me/cool_triad_bot",
      "authors": [
        "kristina-marchenko"
      ]
    },
    {
      "id": "dashbord-planetariya-2",
      "title": "Дашборд Планетария",
      "authors": [
        "polina-perevalova"
      ]
    }
  ],
  "meetings": [
    {
      "date": "2025-08-28",
      "type": "weekly"
    },
    {
      "date": "2025-09-11",
      "type": "weekly"
    },
    {
      "date": "2025-09-25",
      "type": "weekly"
    },
    {
      "date": "2025-10-10",
      "type": "weekly",
      "minutes": 53,
      "generated": true
    },
    {
      "date": "2025-10-16",
      "type": "weekly",
      "minutes": 54,
      "generated": true
    },
    {
      "date": "2025-10-23",
      "type": "weekly"
    },
    {
      "date": "2025-11-07",
      "type": "weekly",
      "minutes": 59,
      "generated": true
    },
    {
      "date": "2025-11-14",
      "type": "weekly",
      "minutes": 62,
      "generated": true
    },
    {
      "date": "2025-11-21",
      "type": "weekly",
      "minutes": 58,
      "generated": true
    },
    {
      "date": "2025-11-27",
      "type": "weekly"
    },
    {
      "date": "2025-12-05",
      "type": "weekly",
      "minutes": 56,
      "generated": true
    },
    {
      "date": "2025-12-12",
      "type": "weekly",
      "minutes": 56,
      "generated": true
    },
    {
      "date": "2026-01-16",
      "type": "weekly",
      "minutes": 59,
      "generated": true
    },
    {
      "date": "2026-01-23",
      "type": "weekly",
      "minutes": 52,
      "generated": true
    },
    {
      "date": "2026-01-29",
      "type": "weekly",
      "minutes": 51,
      "generated": true
    },
    {
      "date": "2026-02-06",
      "type": "weekly",
      "minutes": 58,
      "generated": true
    },
    {
      "date": "2026-02-21",
      "type": "weekly",
      "minutes": 55,
      "generated": true
    },
    {
      "date": "2026-02-27",
      "type": "weekly",
      "minutes": 53,
      "generated": true
    },
    {
      "date": "2026-03-07",
      "type": "weekly",
      "minutes": 59,
      "generated": true
    },
    {
      "date": "2026-03-12",
      "type": "weekly",
      "minutes": 58,
      "generated": true
    },
    {
      "date": "2026-03-20",
      "type": "weekly",
      "minutes": 56,
      "generated": true
    },
    {
      "date": "2026-03-28",
      "type": "weekly",
      "minutes": 59,
      "generated": true
    },
    {
      "date": "2026-04-02",
      "type": "weekly",
      "minutes": 56,
      "generated": true
    },
    {
      "date": "2026-04-09",
      "type": "weekly",
      "minutes": 60,
      "generated": true
    },
    {
      "date": "2026-04-17",
      "type": "weekly",
      "minutes": 58,
      "generated": true
    },
    {
      "date": "2026-04-24",
      "type": "weekly",
      "minutes": 62,
      "generated": true
    },
    {
      "date": "2026-05-01",
      "type": "weekly",
      "minutes": 54,
      "generated": true
    },
    {
      "date": "2026-05-15",
      "type": "weekly",
      "minutes": 55,
      "generated": true
    },
    {
      "date": "2026-05-25",
      "type": "weekly"
    },
    {
      "date": "2026-06-05",
      "type": "weekly",
      "minutes": 56,
      "generated": true
    },
    {
      "date": "2026-06-12",
      "type": "weekly",
      "minutes": 58,
      "generated": true
    },
    {
      "date": "2026-06-25",
      "type": "weekly"
    },
    {
      "date": "2026-07-03",
      "type": "weekly",
      "minutes": 55,
      "generated": true
    },
    {
      "date": "2026-08-13",
      "type": "weekly",
      "minutes": 50
    },
    {
      "date": "2026-08-20",
      "type": "weekly",
      "minutes": 60
    },
    {
      "date": "2026-08-27",
      "type": "weekly",
      "minutes": 50
    },
    {
      "date": "2026-09-03",
      "type": "weekly",
      "minutes": 57
    },
    {
      "date": "2026-09-10",
      "type": "weekly",
      "minutes": 60
    },
    {
      "date": "2026-09-17",
      "type": "weekly",
      "minutes": 60
    }
  ],
  "attendance": {
    "2025-10-10": [
      "polina-perevalova",
      "zhenya-arutyunov",
      "kristina-marchenko",
      "ruslan-mamedov",
      "adam-arutyunov",
      "kristina-dunina",
      "vladimir-trifonov",
      "viktor-timofeev"
    ],
    "2025-10-16": [
      "kristina-marchenko",
      "polina-perevalova",
      "kristina-dunina",
      "viktor-timofeev",
      "artem-ermolaev",
      "ruslan-mamedov",
      "rustam-mushraipov",
      "lesha-nikitin",
      "marat-habibulin"
    ],
    "2025-11-07": [
      "zhenya-arutyunov",
      "ruslan-mamedov",
      "artem-ermolaev",
      "kristina-marchenko",
      "olga-permyakova",
      "ekaterina-lakutina",
      "gleb-tiidt",
      "kirill-oleynichenko",
      "kristina-dunina",
      "viktor-timofeev",
      "daler-alierov",
      "rustam-mushraipov",
      "marat-habibulin",
      "polina-perevalova"
    ],
    "2025-11-14": [
      "zhenya-arutyunov",
      "kirill-oleynichenko",
      "kristina-dunina",
      "elena-chausova",
      "polina-perevalova",
      "rasul-shtibekov",
      "lesha-nikitin",
      "kristina-marchenko",
      "gleb-tiidt",
      "ruslan-mamedov",
      "daler-alierov",
      "artem-ermolaev",
      "adam-arutyunov",
      "marat-habibulin",
      "viktor-timofeev",
      "asya-dragun",
      "rustam-mushraipov"
    ],
    "2025-11-21": [
      "zhenya-arutyunov",
      "lora-guranina",
      "kirill-myshkin",
      "elena-chausova",
      "kirill-oleynichenko",
      "polina-perevalova",
      "asya-dragun",
      "kristina-marchenko",
      "ruslan-mamedov",
      "tatyana-kashina",
      "dmitriy-sivuhin",
      "viktor-timofeev",
      "rustam-mushraipov"
    ],
    "2025-12-05": [
      "polina-perevalova",
      "asya-dragun",
      "zhenya-arutyunov",
      "kirill-myshkin",
      "kristina-dunina",
      "kristina-marchenko",
      "lesha-nikitin",
      "masha-troitskaya",
      "ruslan-mamedov",
      "tatyana-kashina",
      "rustam-mushraipov"
    ],
    "2025-12-12": [
      "polina-perevalova",
      "anna-safka",
      "artem-ermolaev",
      "dmitriy-sivuhin",
      "zhenya-arutyunov",
      "kirill-myshkin",
      "kristina-marchenko",
      "ruslan-mamedov",
      "lesha-nikitin",
      "rustam-mushraipov",
      "tatyana-kashina"
    ],
    "2026-01-16": [
      "polina-perevalova",
      "alena-grishkovets",
      "vika-german",
      "zhenya-arutyunov",
      "asya-dragun",
      "ramil-karimov",
      "kirill-chernov",
      "kristina-marchenko",
      "kristina-dunina",
      "lesha-nikitin",
      "masha-troitskaya",
      "ruslan-mamedov",
      "rustam-mushraipov",
      "tatyana-kashina"
    ],
    "2026-01-23": [
      "polina-perevalova",
      "alena-grishkovets",
      "vika-german",
      "kirill-oleynichenko",
      "kristina-marchenko",
      "ruslan-mamedov",
      "rustam-mushraipov"
    ],
    "2026-01-29": [
      "kristina-marchenko",
      "rustam-mushraipov",
      "lesha-nikitin",
      "ruslan-mamedov",
      "tatyana-kashina",
      "zhenya-arutyunov"
    ],
    "2026-02-06": [
      "georgiy-mishurovskiy",
      "alena-grishkovets",
      "asya-dragun",
      "dmitriy-sivuhin",
      "lesha-nikitin",
      "kristina-marchenko",
      "kirill-myshkin",
      "ruslan-mamedov",
      "rustam-mushraipov",
      "masha-troitskaya",
      "olga-permyakova",
      "polina-perevalova",
      "zhenya-arutyunov"
    ],
    "2026-02-21": [
      "alena-grishkovets",
      "georgiy-mishurovskiy",
      "dmitriy-sivuhin",
      "kirill-myshkin",
      "kristina-marchenko",
      "lesha-nikitin",
      "masha-troitskaya",
      "rustam-mushraipov",
      "zhenya-arutyunov",
      "polina-perevalova"
    ],
    "2026-02-27": [
      "alena-grishkovets",
      "daler-alierov",
      "kristina-marchenko",
      "dmitriy-sivuhin",
      "rustam-mushraipov",
      "ruslan-mamedov",
      "zhenya-arutyunov",
      "polina-perevalova"
    ],
    "2026-03-07": [
      "alena-grishkovets",
      "georgiy-mishurovskiy",
      "kristina-dunina",
      "kristina-marchenko",
      "nastya-tulaeva",
      "lesha-nikitin",
      "masha-troitskaya",
      "rustam-mushraipov",
      "ruslan-mamedov",
      "vlad",
      "gosha",
      "roma-kuzhel",
      "zhenya-arutyunov",
      "polina-perevalova"
    ],
    "2026-03-12": [
      "georgiy-mishurovskiy",
      "alena-grishkovets",
      "darya-degtyareva",
      "zhanna-belousova",
      "dmitriy-sivuhin",
      "lesha-nikitin",
      "kristina-marchenko",
      "kirill-myshkin",
      "magomed-vagabov",
      "masha-troitskaya",
      "rustam-mushraipov",
      "tatyana-kashina",
      "zhenya-arutyunov"
    ],
    "2026-03-20": [
      "alena-grishkovets",
      "gosha",
      "dmitriy-sivuhin",
      "kirill-myshkin",
      "kristina-marchenko",
      "magomed-vagabov",
      "masha-troitskaya",
      "roma-kuzhel",
      "rustam-mushraipov",
      "zhenya-arutyunov",
      "polina-perevalova"
    ],
    "2026-03-28": [
      "adam-arutyunov",
      "artem-ermolaev",
      "ilya-narinskiy",
      "marat-habibulin",
      "dmitriy-sivuhin",
      "kirill-myshkin",
      "kostya-grigorev",
      "kristina-marchenko",
      "kristina-dunina",
      "masha-troitskaya",
      "magomed-vagabov",
      "lesha-nikitin",
      "rustam-mushraipov",
      "zhenya-arutyunov"
    ],
    "2026-04-02": [
      "danya-samoylenko",
      "evgeniy-smirnov",
      "egor-veselov",
      "rinat-enikeev",
      "olga-permyakova",
      "kristina-marchenko",
      "kirill-myshkin",
      "dmitriy-sivuhin",
      "rustam-mushraipov",
      "lesha-nikitin",
      "polina-perevalova"
    ],
    "2026-04-09": [
      "adam-arutyunov",
      "zhenya-sarnetskiy",
      "kirill-myshkin",
      "gosha",
      "kristina-marchenko",
      "dmitriy-sivuhin",
      "evgeniy-smirnov",
      "lesha-kram",
      "lesha-nikitin",
      "magomed-vagabov",
      "rustam-mushraipov",
      "sveta",
      "yulya-kutenko",
      "valeriya-romanova",
      "zhenya-arutyunov"
    ],
    "2026-04-17": [
      "asya-dragun",
      "vlad",
      "magomed-vagabov",
      "kirill-myshkin",
      "evgeniy-smirnov",
      "dmitriy-sivuhin",
      "kristina-marchenko",
      "lesha-kram",
      "ramil-karimov",
      "ruslan-mamedov",
      "rustam-mushraipov",
      "polina-perevalova",
      "zhenya-arutyunov"
    ],
    "2026-04-24": [
      "dmitriy-sivuhin",
      "evgeniy-smirnov",
      "artem-ermolaev",
      "zhenya-sarnetskiy",
      "magomed-vagabov",
      "kristina-marchenko",
      "lesha-nikitin",
      "kirill-myshkin",
      "masha-troitskaya",
      "marat-habibulin",
      "rustam-mushraipov",
      "ruslan-mamedov",
      "rinat-enikeev",
      "ramil-karimov",
      "kirill-chernov",
      "polina-perevalova",
      "zhenya-arutyunov"
    ],
    "2026-05-01": [
      "adam-arutyunov",
      "dana",
      "dmitriy-sivuhin",
      "kristina-marchenko",
      "lesha-nikitin",
      "rustam-mushraipov",
      "ruslan-mamedov",
      "magomed-vagabov",
      "polina-perevalova"
    ],
    "2026-05-15": [
      "artem-ermolaev",
      "ruslan-mamedov",
      "dmitriy-sivuhin",
      "evgeniy-smirnov",
      "kristina-marchenko",
      "masha-troitskaya",
      "rinat-enikeev",
      "rustam-mushraipov",
      "zhenya-arutyunov",
      "polina-perevalova"
    ],
    "2026-06-05": [
      "vova",
      "dmitriy-sivuhin",
      "evgeniy-smirnov",
      "kirill-myshkin",
      "kristina-marchenko",
      "lesha-nikitin",
      "rustam-mushraipov",
      "ruslan-mamedov",
      "magomed-vagabov",
      "zhenya-arutyunov",
      "polina-perevalova"
    ],
    "2026-06-12": [
      "artem-ermolaev",
      "dmitriy-sivuhin",
      "evgeniy-smirnov",
      "kristina-marchenko",
      "lesha-nikitin",
      "olga-permyakova",
      "ruslan-mamedov",
      "rustam-mushraipov",
      "vitaliy",
      "anastasiya-fomina",
      "nadya-tkacheva",
      "polina-perevalova",
      "zhenya-arutyunov"
    ],
    "2026-07-03": [
      "dmitriy-sivuhin",
      "evgeniy-smirnov",
      "kristina-marchenko",
      "lesha-nikitin",
      "masha-troitskaya",
      "olga-permyakova",
      "rustam-mushraipov",
      "zoya",
      "zhenya-arutyunov",
      "polina-perevalova"
    ],
    "2026-08-13": [
      "andrey",
      "danya-samoylenko",
      "dmitriy-sivuhin",
      "evgeniy-smirnov",
      "kirill-myshkin",
      "kristina-marchenko",
      "lesha-nikitin",
      "magomed-vagabov",
      "marat-habibulin",
      "polina-perevalova",
      "ruslan-mamedov",
      "rustam-mushraipov"
    ],
    "2026-08-20": [
      "ayrat",
      "artem-ermolaev",
      "dmitriy-sivuhin",
      "zhenya-arutyunov",
      "zhenya-sarnetskiy",
      "kirill-myshkin",
      "kristina-marchenko",
      "lesha-nikitin",
      "magomed-vagabov",
      "marat-habibulin",
      "olga-permyakova",
      "polina-perevalova",
      "ruslan-mamedov",
      "sasha-permyakov"
    ],
    "2026-08-27": [
      "artem-ermolaev",
      "danya-samoylenko",
      "evgeniy-smirnov",
      "zhenya-arutyunov",
      "kristina-marchenko",
      "lesha-nikitin",
      "polina-perevalova",
      "ramil-karimov"
    ],
    "2026-09-03": [
      "andrey",
      "artem-ermolaev",
      "dmitriy-sivuhin",
      "evgeniy-smirnov",
      "zhenya-arutyunov",
      "kristina-marchenko",
      "lesha-nikitin",
      "olga-permyakova",
      "polina-perevalova",
      "rustam-mushraipov"
    ],
    "2026-09-10": [
      "andrey",
      "artem-ermolaev",
      "dmitriy-sivuhin",
      "evgeniy-smirnov",
      "egor-veselov",
      "zhenya-arutyunov",
      "kristina-marchenko",
      "lesha-nikitin",
      "magomed-vagabov",
      "polina-perevalova"
    ],
    "2026-09-17": [
      "anastasiya-fomina",
      "andrey",
      "artem-ermolaev",
      "danya-samoylenko",
      "dmitriy-sivuhin",
      "evgeniy-smirnov",
      "zhenya-arutyunov",
      "kristina-marchenko",
      "lesha-nikitin",
      "magomed-vagabov",
      "marat-habibulin",
      "mariya-gribova",
      "nikita-breyk",
      "polina-perevalova",
      "rustam-mushraipov"
    ]
  },
  "demos": [
    {
      "id": "demo-1",
      "meeting": "2025-08-28",
      "project": "telegram-kanal-s-uprazhneniyami-dlya-dizaynerov",
      "presenters": [
        "roma-kuzhel"
      ]
    },
    {
      "id": "demo-2",
      "meeting": "2025-08-28",
      "project": "telegram-kanal-oy-babonki-glyante-ka",
      "presenters": [
        "elena-chausova"
      ]
    },
    {
      "id": "demo-3",
      "meeting": "2025-08-28",
      "project": "bookov",
      "presenters": [
        "kirill-oleynichenko"
      ]
    },
    {
      "id": "demo-4",
      "meeting": "2025-08-28",
      "project": "illyustratsii-dlya-upakovki",
      "presenters": [
        "kristina-dunina"
      ]
    },
    {
      "id": "demo-5",
      "meeting": "2025-08-28",
      "project": "stopfires-org",
      "presenters": [
        "rinat-enikeev"
      ]
    },
    {
      "id": "demo-6",
      "meeting": "2025-09-11",
      "project": "telegram-kanal-kakovo-byt-dizaynerom",
      "presenters": [
        "kristina-marchenko"
      ]
    },
    {
      "id": "demo-7",
      "meeting": "2025-09-11",
      "project": "creative-spark-board",
      "presenters": [
        "roma-kuzhel"
      ]
    },
    {
      "id": "demo-8",
      "meeting": "2025-09-11",
      "project": "telegram-kanal-ruslan-i-bukvalnyy-chellendzh",
      "presenters": [
        "ruslan-mamedov"
      ]
    },
    {
      "id": "demo-9",
      "meeting": "2025-09-25",
      "project": "podkast-hoba",
      "presenters": [
        "daler-alierov"
      ]
    },
    {
      "id": "demo-10",
      "meeting": "2025-09-25",
      "project": "svoy-sayt",
      "presenters": [
        "viktor-timofeev"
      ]
    },
    {
      "id": "demo-11",
      "meeting": "2025-09-25",
      "project": "gotitbureau-com-rus",
      "presenters": [
        "ira-zaharova"
      ]
    },
    {
      "id": "demo-12",
      "meeting": "2025-09-25",
      "project": "detskaya-kniga",
      "presenters": [
        "ekaterina-lakutina"
      ]
    },
    {
      "id": "demo-13",
      "meeting": "2025-09-25",
      "project": "telegram-kanal-kakovo-byt-dizaynerom",
      "presenters": [
        "kristina-marchenko"
      ]
    },
    {
      "id": "demo-14",
      "meeting": "2025-09-25",
      "project": "telegram-kanal-ruslan-i-bukvalnyy-chellendzh",
      "presenters": [
        "ruslan-mamedov"
      ]
    },
    {
      "id": "demo-15",
      "meeting": "2025-10-23",
      "project": "muzey-neprinyatyh-rabot-stol",
      "presenters": [
        "artem-ermolaev"
      ]
    },
    {
      "id": "demo-16",
      "meeting": "2025-10-23",
      "project": "hypetype",
      "presenters": [
        "ruslan-mamedov"
      ]
    },
    {
      "id": "demo-17",
      "meeting": "2025-11-27",
      "project": "muzey-neprinyatyh-rabot-stol",
      "presenters": [
        "artem-ermolaev"
      ]
    },
    {
      "id": "demo-18",
      "meeting": "2025-11-27",
      "project": "kurs-po-matematike-kotoraya-prigoditsya-v-zhizni",
      "presenters": [
        "adam-arutyunov"
      ]
    },
    {
      "id": "demo-19",
      "meeting": "2026-05-25",
      "project": "pervyy-rolik-na-yutyub",
      "presenters": [
        "masha-troitskaya"
      ]
    },
    {
      "id": "demo-20",
      "meeting": "2026-05-25",
      "project": "prilozhenie-dlya-rasshifrovki-vstrech-context",
      "presenters": [
        "daler-alierov"
      ]
    },
    {
      "id": "demo-21",
      "meeting": "2026-05-25",
      "project": "past-simple",
      "presenters": [
        "artem-ermolaev"
      ]
    },
    {
      "id": "demo-22",
      "meeting": "2026-05-25",
      "project": "aside",
      "presenters": [
        "lesha-nikitin"
      ]
    },
    {
      "id": "demo-23",
      "meeting": "2026-05-25",
      "project": "bot-letmidzhoyn",
      "presenters": [
        "kirill-myshkin"
      ]
    },
    {
      "id": "demo-24",
      "meeting": "2026-06-25",
      "project": "prezentatsiya-kak-sobrat-portfolio",
      "presenters": [
        "evgeniy-smirnov"
      ]
    },
    {
      "id": "demo-25",
      "meeting": "2026-06-25",
      "project": "dot-dead",
      "presenters": [
        "danya-samoylenko"
      ]
    },
    {
      "id": "demo-26",
      "meeting": "2026-06-25",
      "project": "search-thru",
      "presenters": [
        "magomed-vagabov"
      ]
    },
    {
      "id": "demo-27",
      "meeting": "2026-06-25",
      "project": "telerupor",
      "presenters": [
        "kirill-myshkin"
      ]
    },
    {
      "id": "demo-28",
      "meeting": "2026-06-25",
      "project": "kontsept-igry-chayka",
      "presenters": [
        "anastasiya-fomina"
      ]
    },
    {
      "id": "demo-29",
      "meeting": "2026-06-25",
      "project": "hypetype",
      "presenters": [
        "ruslan-mamedov"
      ]
    },
    {
      "id": "demo-30",
      "meeting": "2026-08-13",
      "project": "scurrynslide-biblioteka-dlya-drag-and-drop",
      "presenters": [
        "kirill-myshkin"
      ],
      "minutes": 12
    },
    {
      "id": "demo-31",
      "meeting": "2026-08-13",
      "project": "igra-shpion-sredi-nas",
      "presenters": [
        "marat-habibulin"
      ],
      "minutes": 6
    },
    {
      "id": "demo-32",
      "meeting": "2026-08-13",
      "project": "polina-hochet-uchitsya-vo-frantsii",
      "presenters": [
        "polina-perevalova"
      ],
      "minutes": 6
    },
    {
      "id": "demo-33",
      "meeting": "2026-08-13",
      "project": "sayt-kristiny-marchenko",
      "presenters": [
        "kristina-marchenko"
      ],
      "minutes": 5,
      "format": 2
    },
    {
      "id": "demo-34",
      "meeting": "2026-08-13",
      "project": "taymer-dlya-chasov",
      "presenters": [
        "andrey"
      ],
      "minutes": 4,
      "format": 2
    },
    {
      "id": "demo-35",
      "meeting": "2026-08-20",
      "project": "igra-shpion-sredi-nas",
      "presenters": [
        "marat-habibulin"
      ],
      "minutes": 4
    },
    {
      "id": "demo-36",
      "meeting": "2026-08-20",
      "project": "ernolaev-space-svoy-sayt",
      "presenters": [
        "artem-ermolaev"
      ],
      "minutes": 3
    },
    {
      "id": "demo-37",
      "meeting": "2026-08-20",
      "project": "otslezhivatel-biletov-na-vodnyy-transport",
      "presenters": [
        "zhenya-arutyunov"
      ],
      "minutes": 7,
      "format": 2
    },
    {
      "id": "demo-38",
      "meeting": "2026-08-20",
      "project": "sayly-ai-english-tutor",
      "presenters": [
        "ayrat"
      ],
      "minutes": 5
    },
    {
      "id": "demo-39",
      "meeting": "2026-08-20",
      "project": "shrift",
      "presenters": [
        "magomed-vagabov"
      ],
      "minutes": 7,
      "format": 2
    },
    {
      "id": "demo-40",
      "meeting": "2026-08-27",
      "project": "obnovlenie-sayta-evgeniya-smirnova",
      "presenters": [
        "evgeniy-smirnov"
      ],
      "minutes": 8
    },
    {
      "id": "demo-41",
      "meeting": "2026-08-27",
      "project": "konsultatsionnyy-klub",
      "presenters": [
        "zhenya-arutyunov"
      ],
      "minutes": 15,
      "format": 1
    },
    {
      "id": "demo-42",
      "meeting": "2026-08-27",
      "project": "sayt-dannyh-dlya-dnd",
      "presenters": [
        "ramil-karimov"
      ],
      "minutes": 7,
      "format": 2
    },
    {
      "id": "demo-43",
      "meeting": "2026-09-03",
      "project": "tsifrovaya-prepodavatelskaya",
      "presenters": [
        "kristina-marchenko"
      ],
      "minutes": 6,
      "format": 2
    },
    {
      "id": "demo-44",
      "meeting": "2026-09-03",
      "project": "obnovlenie-sayta-evgeniya-smirnova",
      "presenters": [
        "evgeniy-smirnov"
      ],
      "minutes": 5
    },
    {
      "id": "demo-45",
      "meeting": "2026-09-03",
      "project": "konsultatsionnyy-klub",
      "presenters": [
        "zhenya-arutyunov"
      ],
      "minutes": 2,
      "format": 1
    },
    {
      "id": "demo-46",
      "meeting": "2026-09-03",
      "project": "taymer-dlya-chasov",
      "presenters": [
        "andrey"
      ],
      "minutes": 5,
      "format": 2
    },
    {
      "id": "demo-47",
      "meeting": "2026-09-10",
      "project": "pechat-knigi-eto-krasivo-a-eto-net",
      "presenters": [
        "zhenya-arutyunov"
      ],
      "minutes": 9,
      "format": 2
    },
    {
      "id": "demo-48",
      "meeting": "2026-09-10",
      "project": "konsultatsionnyy-klub",
      "presenters": [
        "zhenya-arutyunov"
      ],
      "minutes": 7,
      "format": 1
    },
    {
      "id": "demo-49",
      "meeting": "2026-09-10",
      "project": "past-simple",
      "presenters": [
        "artem-ermolaev"
      ],
      "minutes": 6
    },
    {
      "id": "demo-50",
      "meeting": "2026-09-10",
      "project": "obnovlenie-sayta-evgeniya-smirnova",
      "presenters": [
        "evgeniy-smirnov"
      ],
      "minutes": 6
    },
    {
      "id": "demo-51",
      "meeting": "2026-09-10",
      "project": "inst-dlya-tvorchestva",
      "presenters": [
        "polina-perevalova"
      ],
      "minutes": 5
    },
    {
      "id": "demo-52",
      "meeting": "2026-09-10",
      "project": "shrift",
      "presenters": [
        "magomed-vagabov"
      ],
      "minutes": 3,
      "format": 2
    },
    {
      "id": "demo-53",
      "meeting": "2026-09-17",
      "project": "dashbord-planetariya",
      "presenters": [
        "zhenya-arutyunov",
        "polina-perevalova"
      ],
      "minutes": 10,
      "format": 2
    },
    {
      "id": "demo-54",
      "meeting": "2026-09-17",
      "project": "kurs-dizayn-s-klodom",
      "presenters": [
        "artem-ermolaev"
      ],
      "minutes": 4,
      "format": 1
    },
    {
      "id": "demo-55",
      "meeting": "2026-09-17",
      "project": "svoy-sayt-2",
      "presenters": [
        "anastasiya-fomina"
      ],
      "minutes": 4,
      "format": 2
    },
    {
      "id": "demo-56",
      "meeting": "2026-09-17",
      "project": "triema-dvizhok-bloga",
      "presenters": [
        "magomed-vagabov"
      ],
      "minutes": 5,
      "format": 2
    },
    {
      "id": "demo-57",
      "meeting": "2026-09-17",
      "project": "bot-cool-triad",
      "presenters": [
        "kristina-marchenko"
      ],
      "minutes": 7
    }
  ],
  "feedback": [
    {
      "demo": "demo-30",
      "person": "dmitriy-sivuhin"
    },
    {
      "demo": "demo-31",
      "person": "kristina-marchenko"
    },
    {
      "demo": "demo-32",
      "person": "kirill-myshkin"
    },
    {
      "demo": "demo-32",
      "person": "kristina-marchenko"
    },
    {
      "demo": "demo-32",
      "person": "marat-habibulin"
    },
    {
      "demo": "demo-33",
      "person": "dmitriy-sivuhin"
    },
    {
      "demo": "demo-36",
      "person": "artem-ermolaev"
    },
    {
      "demo": "demo-48",
      "person": "zhenya-arutyunov"
    },
    {
      "demo": "demo-49",
      "person": "zhenya-arutyunov"
    },
    {
      "demo": "demo-55",
      "person": "artem-ermolaev"
    },
    {
      "demo": "demo-55",
      "person": "zhenya-arutyunov"
    }
  ]
};

  if (typeof window !== "undefined") window.PlanetariumDB = PlanetariumDB;
  if (typeof module !== "undefined" && module.exports) module.exports = PlanetariumDB;
})();
