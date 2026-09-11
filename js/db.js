// Единая база данных Планетария.
// Источник правды для визуализаций и админки.
// Реальные данные: посещения еженедельных встреч + демо-эфиры.
// generated: true — длительность, формат, фидбэк и демо на еженедельных
// встречах до августа 2026 дозаполнены по образцу реальных августовских записей.

(() => {
  "use strict";

  const PlanetariumDB = {
  "norm": {
    "min": 5,
    "max": 7
  },
  "aliases": {
    "Кристина Мареченко": "Кристина Марченко",
    "Артем Ермолаев": "Артём Ермолаев"
  },
  "persons": [
    {
      "id": "adam-arutyunov",
      "name": "Адам Арутюнов",
      "telegram": null,
      "photo": null,
      "note": null
    },
    {
      "id": "alena-grishkovets",
      "name": "Алёна Гришковец",
      "telegram": null,
      "photo": null,
      "note": null
    },
    {
      "id": "anastasiya-fomina",
      "name": "Анастасия Фомина",
      "telegram": null,
      "photo": null,
      "note": null
    },
    {
      "id": "anna-safka",
      "name": "Анна Сафка",
      "telegram": null,
      "photo": null,
      "note": null
    },
    {
      "id": "artem-ermolaev",
      "name": "Артём Ермолаев",
      "telegram": null,
      "photo": null,
      "note": null
    },
    {
      "id": "asya-dragun",
      "name": "Ася Драгун",
      "telegram": null,
      "photo": null,
      "note": null
    },
    {
      "id": "valeriya-romanova",
      "name": "Валерия Романова",
      "telegram": null,
      "photo": null,
      "note": null
    },
    {
      "id": "vika-german",
      "name": "Вика Герман",
      "telegram": null,
      "photo": null,
      "note": null
    },
    {
      "id": "viktor-timofeev",
      "name": "Виктор Тимофеев",
      "telegram": null,
      "photo": null,
      "note": null
    },
    {
      "id": "vitaliy",
      "name": "Виталий",
      "telegram": null,
      "photo": null,
      "note": null
    },
    {
      "id": "vlad",
      "name": "Влад",
      "telegram": null,
      "photo": null,
      "note": null
    },
    {
      "id": "vladimir-trifonov",
      "name": "Владимир Трифонов",
      "telegram": null,
      "photo": null,
      "note": null
    },
    {
      "id": "vova",
      "name": "Вова",
      "telegram": null,
      "photo": null,
      "note": null
    },
    {
      "id": "georgiy-mishurovskiy",
      "name": "Георгий Мишуровский",
      "telegram": null,
      "photo": null,
      "note": null
    },
    {
      "id": "gleb-tiidt",
      "name": "Глеб Тиидт",
      "telegram": null,
      "photo": null,
      "note": null
    },
    {
      "id": "gosha",
      "name": "Гоша",
      "telegram": null,
      "photo": null,
      "note": null
    },
    {
      "id": "daler-alierov",
      "name": "Далер Алиёров",
      "telegram": null,
      "photo": null,
      "note": null
    },
    {
      "id": "dana",
      "name": "Дана",
      "telegram": null,
      "photo": null,
      "note": null
    },
    {
      "id": "danya-samoylenko",
      "name": "Даня Самойленко",
      "telegram": null,
      "photo": null,
      "note": null
    },
    {
      "id": "darya-degtyareva",
      "name": "Дарья Дегтярева",
      "telegram": null,
      "photo": null,
      "note": null
    },
    {
      "id": "dmitriy-sivuhin",
      "name": "Дмитрий Сивухин",
      "telegram": null,
      "photo": null,
      "note": null
    },
    {
      "id": "evgeniy-smirnov",
      "name": "Евгений Смирнов",
      "telegram": null,
      "photo": null,
      "note": null
    },
    {
      "id": "egor-veselov",
      "name": "Егор Веселов",
      "telegram": null,
      "photo": null,
      "note": null
    },
    {
      "id": "ekaterina-lakutina",
      "name": "Екатерина Лакутина",
      "telegram": null,
      "photo": null,
      "note": null
    },
    {
      "id": "elena-chausova",
      "name": "Елена Чаусова",
      "telegram": null,
      "photo": null,
      "note": null
    },
    {
      "id": "zhanna-belousova",
      "name": "Жанна Белоусова",
      "telegram": null,
      "photo": null,
      "note": null
    },
    {
      "id": "zhenya-arutyunov",
      "name": "Женя Арутюнов",
      "telegram": null,
      "photo": null,
      "note": null
    },
    {
      "id": "zhenya-sarnetskiy",
      "name": "Женя Сарнецкий",
      "telegram": null,
      "photo": null,
      "note": null
    },
    {
      "id": "zoya",
      "name": "Зоя",
      "telegram": null,
      "photo": null,
      "note": null
    },
    {
      "id": "ilya-narinskiy",
      "name": "Илья Наринский",
      "telegram": null,
      "photo": null,
      "note": null
    },
    {
      "id": "ira-zaharova",
      "name": "Ира Захарова",
      "telegram": null,
      "photo": null,
      "note": null
    },
    {
      "id": "kirill-myshkin",
      "name": "Кирилл Мышкин",
      "telegram": null,
      "photo": null,
      "note": null
    },
    {
      "id": "kirill-oleynichenko",
      "name": "Кирилл Олейниченко",
      "telegram": null,
      "photo": null,
      "note": null
    },
    {
      "id": "kirill-chernov",
      "name": "Кирилл Чернов",
      "telegram": null,
      "photo": null,
      "note": null
    },
    {
      "id": "kostya-grigorev",
      "name": "Костя Григорьев",
      "telegram": null,
      "photo": null,
      "note": null
    },
    {
      "id": "kristina-dunina",
      "name": "Кристина Дунина",
      "telegram": null,
      "photo": null,
      "note": null
    },
    {
      "id": "kristina-marchenko",
      "name": "Кристина Марченко",
      "telegram": null,
      "photo": null,
      "note": null
    },
    {
      "id": "lesha-kram",
      "name": "Лёша Крам",
      "telegram": null,
      "photo": null,
      "note": null
    },
    {
      "id": "lesha-nikitin",
      "name": "Лёша Никитин",
      "telegram": null,
      "photo": null,
      "note": null
    },
    {
      "id": "lora-guranina",
      "name": "Лора Гуранина",
      "telegram": null,
      "photo": null,
      "note": null
    },
    {
      "id": "magomed-vagabov",
      "name": "Магомед Вагабов",
      "telegram": null,
      "photo": null,
      "note": null
    },
    {
      "id": "marat-habibulin",
      "name": "Марат Хабибулин",
      "telegram": null,
      "photo": null,
      "note": null
    },
    {
      "id": "masha-troitskaya",
      "name": "Маша Троицкая",
      "telegram": null,
      "photo": null,
      "note": null
    },
    {
      "id": "nadya-tkacheva",
      "name": "Надя Ткачева",
      "telegram": null,
      "photo": null,
      "note": null
    },
    {
      "id": "nastya-tulaeva",
      "name": "Настя Тулаева",
      "telegram": null,
      "photo": null,
      "note": null
    },
    {
      "id": "olga-permyakova",
      "name": "Ольга Пермякова",
      "telegram": null,
      "photo": null,
      "note": null
    },
    {
      "id": "polina-perevalova",
      "name": "Полина Перевалова",
      "telegram": null,
      "photo": null,
      "note": null
    },
    {
      "id": "ramil-karimov",
      "name": "Рамиль Каримов",
      "telegram": null,
      "photo": null,
      "note": null
    },
    {
      "id": "rasul-shtibekov",
      "name": "Расул Штибеков",
      "telegram": null,
      "photo": null,
      "note": null
    },
    {
      "id": "rinat-enikeev",
      "name": "Ринат Еникеев",
      "telegram": null,
      "photo": null,
      "note": null
    },
    {
      "id": "roma-kuzhel",
      "name": "Рома Кужель",
      "telegram": null,
      "photo": null,
      "note": null
    },
    {
      "id": "ruslan-mamedov",
      "name": "Руслан Мамедов",
      "telegram": null,
      "photo": null,
      "note": null
    },
    {
      "id": "rustam-mushraipov",
      "name": "Рустам Мушраипов",
      "telegram": null,
      "photo": null,
      "note": null
    },
    {
      "id": "sveta",
      "name": "Света",
      "telegram": null,
      "photo": null,
      "note": null
    },
    {
      "id": "tatyana-kashina",
      "name": "Татьяна Кашина",
      "telegram": null,
      "photo": null,
      "note": null
    },
    {
      "id": "yulya-kutenko",
      "name": "Юля Кутьенко",
      "telegram": null,
      "photo": null,
      "note": null
    },
    {
      "id": "andrey",
      "name": "Андрей Шикарненко",
      "telegram": null,
      "photo": null,
      "note": null
    },
    {
      "id": "ayrat",
      "name": "Айрат",
      "telegram": null,
      "photo": null,
      "note": null
    },
    {
      "id": "sasha-permyakov",
      "name": "Саша Пермяков",
      "telegram": null,
      "photo": null,
      "note": null
    },
    {
      "id": "egor",
      "name": "Егор",
      "telegram": null,
      "photo": null,
      "note": null
    }
  ],
  "projects": [
    {
      "id": "telegram-kanal-s-uprazhneniyami-dlya-dizaynerov",
      "title": "Телеграм-канал с упражнениями для дизайнеров",
      "url": "https://t.me/ddrills",
      "authors": [
        "roma-kuzhel"
      ],
      "note": null
    },
    {
      "id": "telegram-kanal-oy-babonki-glyante-ka",
      "title": "Телеграм-канал «Ой, бабоньки, гляньте-ка!»",
      "url": "https://t.me/oibabonky",
      "authors": [
        "elena-chausova"
      ],
      "note": null
    },
    {
      "id": "bookov",
      "title": "Bookov",
      "url": "https://bookov.app/",
      "authors": [
        "kirill-oleynichenko"
      ],
      "note": null
    },
    {
      "id": "illyustratsii-dlya-upakovki",
      "title": "Иллюстрации для упаковки",
      "url": null,
      "authors": [
        "kristina-dunina"
      ],
      "note": null
    },
    {
      "id": "stopfires-org",
      "title": "stopfires.org",
      "url": "http://stopfires.org",
      "authors": [
        "rinat-enikeev"
      ],
      "note": null
    },
    {
      "id": "telegram-kanal-kakovo-byt-dizaynerom",
      "title": "Телеграм-канал «Каково быть дизайнером»",
      "url": "https://t.me/kakovo_design",
      "authors": [
        "kristina-marchenko"
      ],
      "note": null
    },
    {
      "id": "creative-spark-board",
      "title": "creative-spark-board",
      "url": "https://creative-spark-board.lovable.app/",
      "authors": [
        "roma-kuzhel"
      ],
      "note": null
    },
    {
      "id": "telegram-kanal-ruslan-i-bukvalnyy-chellendzh",
      "title": "Телеграм-канал «Руслан и Буквальный челлендж»",
      "url": "https://t.me/simbarus_abc",
      "authors": [
        "ruslan-mamedov"
      ],
      "note": null
    },
    {
      "id": "podkast-hoba",
      "title": "Подкаст «Хоба»",
      "url": "https://hoba.mave.digital/",
      "authors": [
        "daler-alierov"
      ],
      "note": null
    },
    {
      "id": "svoy-sayt",
      "title": "Сайт Виктора Тимофеева",
      "url": null,
      "authors": [
        "viktor-timofeev"
      ],
      "note": null
    },
    {
      "id": "gotitbureau-com-rus",
      "title": "gotitbureau.com/rus",
      "url": "https://gotitbureau.com/rus",
      "authors": [
        "ira-zaharova"
      ],
      "note": null
    },
    {
      "id": "detskaya-kniga",
      "title": "Детская книга",
      "url": null,
      "authors": [
        "ekaterina-lakutina"
      ],
      "note": null
    },
    {
      "id": "muzey-neprinyatyh-rabot-stol",
      "title": "Музей непринятых работ «Стол»",
      "url": "https://t.me/stolmuseum",
      "authors": [
        "artem-ermolaev"
      ],
      "note": null
    },
    {
      "id": "hypetype",
      "title": "hypetype",
      "url": "https://simbarus.com/hypetype",
      "authors": [
        "ruslan-mamedov"
      ],
      "note": null
    },
    {
      "id": "kurs-po-matematike-kotoraya-prigoditsya-v-zhizni",
      "title": "Курс по математике, которая пригодится в жизни",
      "url": "https://setka.design/math/",
      "authors": [
        "adam-arutyunov"
      ],
      "note": null
    },
    {
      "id": "pervyy-rolik-na-yutyub",
      "title": "Первый ролик на ютюб",
      "url": "https://www.youtube.com/watch?v=R3uu2H9HthQ",
      "authors": [
        "masha-troitskaya"
      ],
      "note": null
    },
    {
      "id": "prilozhenie-dlya-rasshifrovki-vstrech-context",
      "title": "Приложение для расшифровки встреч «Context»",
      "url": null,
      "authors": [
        "daler-alierov"
      ],
      "note": null
    },
    {
      "id": "past-simple",
      "title": "Past Simple",
      "url": "https://past-simple.ru/",
      "authors": [
        "artem-ermolaev"
      ],
      "note": null
    },
    {
      "id": "aside",
      "title": "Aside",
      "url": "https://aside.city/",
      "authors": [
        "lesha-nikitin"
      ],
      "note": null
    },
    {
      "id": "bot-letmidzhoyn",
      "title": "Бот Летмиджойн",
      "url": "https://letmejoin.myshkin.eu/",
      "authors": [
        "kirill-myshkin"
      ],
      "note": null
    },
    {
      "id": "prezentatsiya-kak-sobrat-portfolio",
      "title": "Презентация «Как собрать портфолио»",
      "url": null,
      "authors": [
        "evgeniy-smirnov"
      ],
      "note": null
    },
    {
      "id": "dot-dead",
      "title": "dot.dead",
      "url": "https://t.me/danyatutpishet/735",
      "authors": [
        "danya-samoylenko"
      ],
      "note": null
    },
    {
      "id": "search-thru",
      "title": "Search Thru",
      "url": "http://searchth.ru/",
      "authors": [
        "magomed-vagabov"
      ],
      "note": null
    },
    {
      "id": "telerupor",
      "title": "Телерупор",
      "url": null,
      "authors": [
        "kirill-myshkin"
      ],
      "note": null
    },
    {
      "id": "kontsept-igry-chayka",
      "title": "Концепт игры «Чайка»",
      "url": null,
      "authors": [
        "anastasiya-fomina"
      ],
      "note": null
    },
    {
      "id": "scurrynslide-biblioteka-dlya-drag-and-drop",
      "title": "Scurry’n’slide — библиотека для drag-and-drop",
      "url": "https://myshkin.eu/scurry-n-slide",
      "authors": [
        "kirill-myshkin"
      ],
      "note": null
    },
    {
      "id": "igra-shpion-sredi-nas",
      "title": "Игра «Шпион среди нас»",
      "url": "https://apps.apple.com/kz/app/spy-party-game/id6787716143",
      "authors": [
        "marat-habibulin"
      ],
      "note": null
    },
    {
      "id": "polina-hochet-uchitsya-vo-frantsii",
      "title": "Полина хочет учиться во Франции",
      "url": "https://t.me/+XuBW-Kc0t4wzYTYy",
      "authors": [
        "polina-perevalova"
      ],
      "note": null
    },
    {
      "id": "sayt-kristiny-marchenko",
      "title": "Сайт Кристины Марченко",
      "url": null,
      "authors": [
        "kristina-marchenko"
      ],
      "note": null
    },
    {
      "id": "taymer-dlya-chasov",
      "title": "Таймер для часов",
      "url": null,
      "authors": [
        "andrey"
      ],
      "note": "Надо узнать название"
    },
    {
      "id": "sayly-ai-english-tutor",
      "title": "Sayly — AI English tutor",
      "url": "https://t.me/PerfectEnglishTutorBot",
      "authors": [
        "ayrat"
      ],
      "note": null
    },
    {
      "id": "otslezhivatel-biletov-na-vodnyy-transport",
      "title": "Отслеживатель билетов на водный транспорт",
      "url": null,
      "authors": [
        "zhenya-arutyunov"
      ],
      "note": null
    },
    {
      "id": "ernolaev-space-svoy-sayt",
      "title": "ernolaev.space — свой сайт",
      "url": "https://ermolaev.space",
      "authors": [
        "artem-ermolaev"
      ],
      "note": null
    },
    {
      "id": "shrift",
      "title": "Шрифт Михей",
      "url": null,
      "authors": [
        "magomed-vagabov"
      ],
      "note": null
    },
    {
      "id": "obnovlenie-sayta-evgeniya-smirnova",
      "title": "Обновление сайта Евгения Смирнова",
      "url": "https://yevgeniysmirnov.ru/",
      "authors": [
        "evgeniy-smirnov"
      ],
      "note": null
    },
    {
      "id": "konsultatsionnyy-klub",
      "title": "Консультационный клуб",
      "url": null,
      "authors": [
        "zhenya-arutyunov"
      ],
      "note": null
    },
    {
      "id": "sayt-dannyh-dlya-dnd",
      "title": "Сайт данных для ДНД",
      "url": null,
      "authors": [
        "ramil-karimov"
      ],
      "note": null
    },
    {
      "id": "tsifrovaya-prepodavatelskaya",
      "title": "Цифровая преподавательская",
      "url": null,
      "authors": [
        "kristina-marchenko"
      ],
      "note": null
    },
    {
      "id": "pechat-knigi-eto-krasivo-a-eto-net",
      "title": "Печать книги «Это красиво, а это нет»",
      "url": null,
      "authors": [
        "zhenya-arutyunov"
      ],
      "note": null
    },
    {
      "id": "inst-dlya-tvorchestva",
      "title": "Инст для творчества",
      "url": "https://www.instagram.com/polina_tancy_muzyka/",
      "authors": [
        "polina-perevalova"
      ],
      "note": null
    }
  ],
  "meetings": [
    {
      "date": "2025-08-28",
      "type": "stream",
      "minutes": 60,
      "note": null,
      "generated": true
    },
    {
      "date": "2025-09-11",
      "type": "stream",
      "minutes": 50,
      "note": null,
      "generated": true
    },
    {
      "date": "2025-09-25",
      "type": "stream",
      "minutes": 60,
      "note": null,
      "generated": true
    },
    {
      "date": "2025-10-10",
      "type": "weekly",
      "minutes": 50,
      "note": null,
      "generated": true
    },
    {
      "date": "2025-10-16",
      "type": "weekly",
      "minutes": 50,
      "note": null,
      "generated": true
    },
    {
      "date": "2025-10-23",
      "type": "stream",
      "minutes": 50,
      "note": null,
      "generated": true
    },
    {
      "date": "2025-11-07",
      "type": "weekly",
      "minutes": 50,
      "note": null,
      "generated": true
    },
    {
      "date": "2025-11-14",
      "type": "weekly",
      "minutes": 60,
      "note": null,
      "generated": true
    },
    {
      "date": "2025-11-21",
      "type": "weekly",
      "minutes": 60,
      "note": null,
      "generated": true
    },
    {
      "date": "2025-11-27",
      "type": "stream",
      "minutes": 50,
      "note": null,
      "generated": true
    },
    {
      "date": "2025-12-05",
      "type": "weekly",
      "minutes": 50,
      "note": null,
      "generated": true
    },
    {
      "date": "2025-12-12",
      "type": "weekly",
      "minutes": 50,
      "note": null,
      "generated": true
    },
    {
      "date": "2026-01-16",
      "type": "weekly",
      "minutes": 50,
      "note": null,
      "generated": true
    },
    {
      "date": "2026-01-23",
      "type": "weekly",
      "minutes": 60,
      "note": null,
      "generated": true
    },
    {
      "date": "2026-01-29",
      "type": "weekly",
      "minutes": 60,
      "note": null,
      "generated": true
    },
    {
      "date": "2026-02-06",
      "type": "weekly",
      "minutes": 60,
      "note": null,
      "generated": true
    },
    {
      "date": "2026-02-21",
      "type": "weekly",
      "minutes": 60,
      "note": null,
      "generated": true
    },
    {
      "date": "2026-02-27",
      "type": "weekly",
      "minutes": 60,
      "note": null,
      "generated": true
    },
    {
      "date": "2026-03-07",
      "type": "weekly",
      "minutes": 50,
      "note": null,
      "generated": true
    },
    {
      "date": "2026-03-12",
      "type": "weekly",
      "minutes": 60,
      "note": null,
      "generated": true
    },
    {
      "date": "2026-03-20",
      "type": "weekly",
      "minutes": 50,
      "note": null,
      "generated": true
    },
    {
      "date": "2026-03-28",
      "type": "weekly",
      "minutes": 60,
      "note": null,
      "generated": true
    },
    {
      "date": "2026-04-02",
      "type": "weekly",
      "minutes": 60,
      "note": null,
      "generated": true
    },
    {
      "date": "2026-04-09",
      "type": "weekly",
      "minutes": 50,
      "note": null,
      "generated": true
    },
    {
      "date": "2026-04-17",
      "type": "weekly",
      "minutes": 50,
      "note": null,
      "generated": true
    },
    {
      "date": "2026-04-24",
      "type": "weekly",
      "minutes": 50,
      "note": null,
      "generated": true
    },
    {
      "date": "2026-05-01",
      "type": "weekly",
      "minutes": 50,
      "note": null,
      "generated": true
    },
    {
      "date": "2026-05-15",
      "type": "weekly",
      "minutes": 60,
      "note": null,
      "generated": true
    },
    {
      "date": "2026-05-25",
      "type": "stream",
      "minutes": 60,
      "note": null,
      "generated": true
    },
    {
      "date": "2026-06-05",
      "type": "weekly",
      "minutes": 50,
      "note": null,
      "generated": true
    },
    {
      "date": "2026-06-12",
      "type": "weekly",
      "minutes": 50,
      "note": null,
      "generated": true
    },
    {
      "date": "2026-06-25",
      "type": "stream",
      "minutes": 50,
      "note": null,
      "generated": true
    },
    {
      "date": "2026-07-03",
      "type": "weekly",
      "minutes": 50,
      "note": null,
      "generated": true
    },
    {
      "date": "2026-08-13",
      "type": "weekly",
      "minutes": 50,
      "note": null
    },
    {
      "date": "2026-08-20",
      "type": "weekly",
      "minutes": 60,
      "note": null
    },
    {
      "date": "2026-08-27",
      "type": "weekly",
      "minutes": 50,
      "note": null
    },
    {
      "date": "2026-09-03",
      "type": "weekly",
      "minutes": 57,
      "note": null
    },
    {
      "date": "2026-09-10",
      "type": "weekly",
      "minutes": 60,
      "note": null
    }
  ],
  "attendance": [
    {
      "meeting": "2025-10-10",
      "person": "polina-perevalova"
    },
    {
      "meeting": "2025-10-10",
      "person": "zhenya-arutyunov"
    },
    {
      "meeting": "2025-10-10",
      "person": "kristina-marchenko"
    },
    {
      "meeting": "2025-10-10",
      "person": "ruslan-mamedov"
    },
    {
      "meeting": "2025-10-10",
      "person": "adam-arutyunov"
    },
    {
      "meeting": "2025-10-10",
      "person": "kristina-dunina"
    },
    {
      "meeting": "2025-10-10",
      "person": "vladimir-trifonov"
    },
    {
      "meeting": "2025-10-10",
      "person": "viktor-timofeev"
    },
    {
      "meeting": "2025-10-16",
      "person": "kristina-marchenko"
    },
    {
      "meeting": "2025-10-16",
      "person": "polina-perevalova"
    },
    {
      "meeting": "2025-10-16",
      "person": "kristina-dunina"
    },
    {
      "meeting": "2025-10-16",
      "person": "viktor-timofeev"
    },
    {
      "meeting": "2025-10-16",
      "person": "artem-ermolaev"
    },
    {
      "meeting": "2025-10-16",
      "person": "ruslan-mamedov"
    },
    {
      "meeting": "2025-10-16",
      "person": "rustam-mushraipov"
    },
    {
      "meeting": "2025-10-16",
      "person": "lesha-nikitin"
    },
    {
      "meeting": "2025-10-16",
      "person": "marat-habibulin"
    },
    {
      "meeting": "2025-11-07",
      "person": "zhenya-arutyunov"
    },
    {
      "meeting": "2025-11-07",
      "person": "ruslan-mamedov"
    },
    {
      "meeting": "2025-11-07",
      "person": "artem-ermolaev"
    },
    {
      "meeting": "2025-11-07",
      "person": "kristina-marchenko"
    },
    {
      "meeting": "2025-11-07",
      "person": "olga-permyakova"
    },
    {
      "meeting": "2025-11-07",
      "person": "ekaterina-lakutina"
    },
    {
      "meeting": "2025-11-07",
      "person": "gleb-tiidt"
    },
    {
      "meeting": "2025-11-07",
      "person": "kirill-oleynichenko"
    },
    {
      "meeting": "2025-11-07",
      "person": "kristina-dunina"
    },
    {
      "meeting": "2025-11-07",
      "person": "viktor-timofeev"
    },
    {
      "meeting": "2025-11-07",
      "person": "daler-alierov"
    },
    {
      "meeting": "2025-11-07",
      "person": "rustam-mushraipov"
    },
    {
      "meeting": "2025-11-07",
      "person": "marat-habibulin"
    },
    {
      "meeting": "2025-11-07",
      "person": "polina-perevalova"
    },
    {
      "meeting": "2025-11-14",
      "person": "zhenya-arutyunov"
    },
    {
      "meeting": "2025-11-14",
      "person": "kirill-oleynichenko"
    },
    {
      "meeting": "2025-11-14",
      "person": "kristina-dunina"
    },
    {
      "meeting": "2025-11-14",
      "person": "elena-chausova"
    },
    {
      "meeting": "2025-11-14",
      "person": "polina-perevalova"
    },
    {
      "meeting": "2025-11-14",
      "person": "rasul-shtibekov"
    },
    {
      "meeting": "2025-11-14",
      "person": "lesha-nikitin"
    },
    {
      "meeting": "2025-11-14",
      "person": "kristina-marchenko"
    },
    {
      "meeting": "2025-11-14",
      "person": "gleb-tiidt"
    },
    {
      "meeting": "2025-11-14",
      "person": "ruslan-mamedov"
    },
    {
      "meeting": "2025-11-14",
      "person": "daler-alierov"
    },
    {
      "meeting": "2025-11-14",
      "person": "artem-ermolaev"
    },
    {
      "meeting": "2025-11-14",
      "person": "adam-arutyunov"
    },
    {
      "meeting": "2025-11-14",
      "person": "marat-habibulin"
    },
    {
      "meeting": "2025-11-14",
      "person": "viktor-timofeev"
    },
    {
      "meeting": "2025-11-14",
      "person": "asya-dragun"
    },
    {
      "meeting": "2025-11-14",
      "person": "rustam-mushraipov"
    },
    {
      "meeting": "2025-11-21",
      "person": "zhenya-arutyunov"
    },
    {
      "meeting": "2025-11-21",
      "person": "lora-guranina"
    },
    {
      "meeting": "2025-11-21",
      "person": "kirill-myshkin"
    },
    {
      "meeting": "2025-11-21",
      "person": "elena-chausova"
    },
    {
      "meeting": "2025-11-21",
      "person": "kirill-oleynichenko"
    },
    {
      "meeting": "2025-11-21",
      "person": "polina-perevalova"
    },
    {
      "meeting": "2025-11-21",
      "person": "asya-dragun"
    },
    {
      "meeting": "2025-11-21",
      "person": "kristina-marchenko"
    },
    {
      "meeting": "2025-11-21",
      "person": "ruslan-mamedov"
    },
    {
      "meeting": "2025-11-21",
      "person": "tatyana-kashina"
    },
    {
      "meeting": "2025-11-21",
      "person": "dmitriy-sivuhin"
    },
    {
      "meeting": "2025-11-21",
      "person": "viktor-timofeev"
    },
    {
      "meeting": "2025-11-21",
      "person": "rustam-mushraipov"
    },
    {
      "meeting": "2025-12-05",
      "person": "polina-perevalova"
    },
    {
      "meeting": "2025-12-05",
      "person": "asya-dragun"
    },
    {
      "meeting": "2025-12-05",
      "person": "zhenya-arutyunov"
    },
    {
      "meeting": "2025-12-05",
      "person": "kirill-myshkin"
    },
    {
      "meeting": "2025-12-05",
      "person": "kristina-dunina"
    },
    {
      "meeting": "2025-12-05",
      "person": "kristina-marchenko"
    },
    {
      "meeting": "2025-12-05",
      "person": "lesha-nikitin"
    },
    {
      "meeting": "2025-12-05",
      "person": "masha-troitskaya"
    },
    {
      "meeting": "2025-12-05",
      "person": "ruslan-mamedov"
    },
    {
      "meeting": "2025-12-05",
      "person": "tatyana-kashina"
    },
    {
      "meeting": "2025-12-05",
      "person": "rustam-mushraipov"
    },
    {
      "meeting": "2025-12-12",
      "person": "polina-perevalova"
    },
    {
      "meeting": "2025-12-12",
      "person": "anna-safka"
    },
    {
      "meeting": "2025-12-12",
      "person": "artem-ermolaev"
    },
    {
      "meeting": "2025-12-12",
      "person": "dmitriy-sivuhin"
    },
    {
      "meeting": "2025-12-12",
      "person": "zhenya-arutyunov"
    },
    {
      "meeting": "2025-12-12",
      "person": "kirill-myshkin"
    },
    {
      "meeting": "2025-12-12",
      "person": "kristina-marchenko"
    },
    {
      "meeting": "2025-12-12",
      "person": "ruslan-mamedov"
    },
    {
      "meeting": "2025-12-12",
      "person": "lesha-nikitin"
    },
    {
      "meeting": "2025-12-12",
      "person": "rustam-mushraipov"
    },
    {
      "meeting": "2025-12-12",
      "person": "tatyana-kashina"
    },
    {
      "meeting": "2026-01-16",
      "person": "polina-perevalova"
    },
    {
      "meeting": "2026-01-16",
      "person": "alena-grishkovets"
    },
    {
      "meeting": "2026-01-16",
      "person": "vika-german"
    },
    {
      "meeting": "2026-01-16",
      "person": "zhenya-arutyunov"
    },
    {
      "meeting": "2026-01-16",
      "person": "asya-dragun"
    },
    {
      "meeting": "2026-01-16",
      "person": "ramil-karimov"
    },
    {
      "meeting": "2026-01-16",
      "person": "kirill-chernov"
    },
    {
      "meeting": "2026-01-16",
      "person": "kristina-marchenko"
    },
    {
      "meeting": "2026-01-16",
      "person": "kristina-dunina"
    },
    {
      "meeting": "2026-01-16",
      "person": "lesha-nikitin"
    },
    {
      "meeting": "2026-01-16",
      "person": "masha-troitskaya"
    },
    {
      "meeting": "2026-01-16",
      "person": "ruslan-mamedov"
    },
    {
      "meeting": "2026-01-16",
      "person": "rustam-mushraipov"
    },
    {
      "meeting": "2026-01-16",
      "person": "tatyana-kashina"
    },
    {
      "meeting": "2026-01-23",
      "person": "polina-perevalova"
    },
    {
      "meeting": "2026-01-23",
      "person": "alena-grishkovets"
    },
    {
      "meeting": "2026-01-23",
      "person": "vika-german"
    },
    {
      "meeting": "2026-01-23",
      "person": "kirill-oleynichenko"
    },
    {
      "meeting": "2026-01-23",
      "person": "kristina-marchenko"
    },
    {
      "meeting": "2026-01-23",
      "person": "ruslan-mamedov"
    },
    {
      "meeting": "2026-01-23",
      "person": "rustam-mushraipov"
    },
    {
      "meeting": "2026-01-29",
      "person": "kristina-marchenko"
    },
    {
      "meeting": "2026-01-29",
      "person": "rustam-mushraipov"
    },
    {
      "meeting": "2026-01-29",
      "person": "lesha-nikitin"
    },
    {
      "meeting": "2026-01-29",
      "person": "ruslan-mamedov"
    },
    {
      "meeting": "2026-01-29",
      "person": "tatyana-kashina"
    },
    {
      "meeting": "2026-01-29",
      "person": "zhenya-arutyunov"
    },
    {
      "meeting": "2026-02-06",
      "person": "georgiy-mishurovskiy"
    },
    {
      "meeting": "2026-02-06",
      "person": "alena-grishkovets"
    },
    {
      "meeting": "2026-02-06",
      "person": "asya-dragun"
    },
    {
      "meeting": "2026-02-06",
      "person": "dmitriy-sivuhin"
    },
    {
      "meeting": "2026-02-06",
      "person": "lesha-nikitin"
    },
    {
      "meeting": "2026-02-06",
      "person": "kristina-marchenko"
    },
    {
      "meeting": "2026-02-06",
      "person": "kirill-myshkin"
    },
    {
      "meeting": "2026-02-06",
      "person": "ruslan-mamedov"
    },
    {
      "meeting": "2026-02-06",
      "person": "rustam-mushraipov"
    },
    {
      "meeting": "2026-02-06",
      "person": "masha-troitskaya"
    },
    {
      "meeting": "2026-02-06",
      "person": "olga-permyakova"
    },
    {
      "meeting": "2026-02-06",
      "person": "polina-perevalova"
    },
    {
      "meeting": "2026-02-06",
      "person": "zhenya-arutyunov"
    },
    {
      "meeting": "2026-02-21",
      "person": "alena-grishkovets"
    },
    {
      "meeting": "2026-02-21",
      "person": "georgiy-mishurovskiy"
    },
    {
      "meeting": "2026-02-21",
      "person": "dmitriy-sivuhin"
    },
    {
      "meeting": "2026-02-21",
      "person": "kirill-myshkin"
    },
    {
      "meeting": "2026-02-21",
      "person": "kristina-marchenko"
    },
    {
      "meeting": "2026-02-21",
      "person": "lesha-nikitin"
    },
    {
      "meeting": "2026-02-21",
      "person": "masha-troitskaya"
    },
    {
      "meeting": "2026-02-21",
      "person": "rustam-mushraipov"
    },
    {
      "meeting": "2026-02-21",
      "person": "zhenya-arutyunov"
    },
    {
      "meeting": "2026-02-21",
      "person": "polina-perevalova"
    },
    {
      "meeting": "2026-02-27",
      "person": "alena-grishkovets"
    },
    {
      "meeting": "2026-02-27",
      "person": "daler-alierov"
    },
    {
      "meeting": "2026-02-27",
      "person": "kristina-marchenko"
    },
    {
      "meeting": "2026-02-27",
      "person": "dmitriy-sivuhin"
    },
    {
      "meeting": "2026-02-27",
      "person": "rustam-mushraipov"
    },
    {
      "meeting": "2026-02-27",
      "person": "ruslan-mamedov"
    },
    {
      "meeting": "2026-02-27",
      "person": "zhenya-arutyunov"
    },
    {
      "meeting": "2026-02-27",
      "person": "polina-perevalova"
    },
    {
      "meeting": "2026-03-07",
      "person": "alena-grishkovets"
    },
    {
      "meeting": "2026-03-07",
      "person": "georgiy-mishurovskiy"
    },
    {
      "meeting": "2026-03-07",
      "person": "kristina-dunina"
    },
    {
      "meeting": "2026-03-07",
      "person": "kristina-marchenko"
    },
    {
      "meeting": "2026-03-07",
      "person": "nastya-tulaeva"
    },
    {
      "meeting": "2026-03-07",
      "person": "lesha-nikitin"
    },
    {
      "meeting": "2026-03-07",
      "person": "masha-troitskaya"
    },
    {
      "meeting": "2026-03-07",
      "person": "rustam-mushraipov"
    },
    {
      "meeting": "2026-03-07",
      "person": "ruslan-mamedov"
    },
    {
      "meeting": "2026-03-07",
      "person": "vlad"
    },
    {
      "meeting": "2026-03-07",
      "person": "gosha"
    },
    {
      "meeting": "2026-03-07",
      "person": "roma-kuzhel"
    },
    {
      "meeting": "2026-03-07",
      "person": "zhenya-arutyunov"
    },
    {
      "meeting": "2026-03-07",
      "person": "polina-perevalova"
    },
    {
      "meeting": "2026-03-12",
      "person": "georgiy-mishurovskiy"
    },
    {
      "meeting": "2026-03-12",
      "person": "alena-grishkovets"
    },
    {
      "meeting": "2026-03-12",
      "person": "darya-degtyareva"
    },
    {
      "meeting": "2026-03-12",
      "person": "zhanna-belousova"
    },
    {
      "meeting": "2026-03-12",
      "person": "dmitriy-sivuhin"
    },
    {
      "meeting": "2026-03-12",
      "person": "lesha-nikitin"
    },
    {
      "meeting": "2026-03-12",
      "person": "kristina-marchenko"
    },
    {
      "meeting": "2026-03-12",
      "person": "kirill-myshkin"
    },
    {
      "meeting": "2026-03-12",
      "person": "magomed-vagabov"
    },
    {
      "meeting": "2026-03-12",
      "person": "masha-troitskaya"
    },
    {
      "meeting": "2026-03-12",
      "person": "rustam-mushraipov"
    },
    {
      "meeting": "2026-03-12",
      "person": "tatyana-kashina"
    },
    {
      "meeting": "2026-03-12",
      "person": "zhenya-arutyunov"
    },
    {
      "meeting": "2026-03-20",
      "person": "alena-grishkovets"
    },
    {
      "meeting": "2026-03-20",
      "person": "gosha"
    },
    {
      "meeting": "2026-03-20",
      "person": "dmitriy-sivuhin"
    },
    {
      "meeting": "2026-03-20",
      "person": "kirill-myshkin"
    },
    {
      "meeting": "2026-03-20",
      "person": "kristina-marchenko"
    },
    {
      "meeting": "2026-03-20",
      "person": "magomed-vagabov"
    },
    {
      "meeting": "2026-03-20",
      "person": "masha-troitskaya"
    },
    {
      "meeting": "2026-03-20",
      "person": "roma-kuzhel"
    },
    {
      "meeting": "2026-03-20",
      "person": "rustam-mushraipov"
    },
    {
      "meeting": "2026-03-20",
      "person": "zhenya-arutyunov"
    },
    {
      "meeting": "2026-03-20",
      "person": "polina-perevalova"
    },
    {
      "meeting": "2026-03-28",
      "person": "adam-arutyunov"
    },
    {
      "meeting": "2026-03-28",
      "person": "artem-ermolaev"
    },
    {
      "meeting": "2026-03-28",
      "person": "ilya-narinskiy"
    },
    {
      "meeting": "2026-03-28",
      "person": "marat-habibulin"
    },
    {
      "meeting": "2026-03-28",
      "person": "dmitriy-sivuhin"
    },
    {
      "meeting": "2026-03-28",
      "person": "kirill-myshkin"
    },
    {
      "meeting": "2026-03-28",
      "person": "kostya-grigorev"
    },
    {
      "meeting": "2026-03-28",
      "person": "kristina-marchenko"
    },
    {
      "meeting": "2026-03-28",
      "person": "kristina-dunina"
    },
    {
      "meeting": "2026-03-28",
      "person": "masha-troitskaya"
    },
    {
      "meeting": "2026-03-28",
      "person": "magomed-vagabov"
    },
    {
      "meeting": "2026-03-28",
      "person": "lesha-nikitin"
    },
    {
      "meeting": "2026-03-28",
      "person": "rustam-mushraipov"
    },
    {
      "meeting": "2026-03-28",
      "person": "zhenya-arutyunov"
    },
    {
      "meeting": "2026-04-02",
      "person": "danya-samoylenko"
    },
    {
      "meeting": "2026-04-02",
      "person": "evgeniy-smirnov"
    },
    {
      "meeting": "2026-04-02",
      "person": "egor-veselov"
    },
    {
      "meeting": "2026-04-02",
      "person": "rinat-enikeev"
    },
    {
      "meeting": "2026-04-02",
      "person": "olga-permyakova"
    },
    {
      "meeting": "2026-04-02",
      "person": "kristina-marchenko"
    },
    {
      "meeting": "2026-04-02",
      "person": "kirill-myshkin"
    },
    {
      "meeting": "2026-04-02",
      "person": "dmitriy-sivuhin"
    },
    {
      "meeting": "2026-04-02",
      "person": "rustam-mushraipov"
    },
    {
      "meeting": "2026-04-02",
      "person": "lesha-nikitin"
    },
    {
      "meeting": "2026-04-02",
      "person": "polina-perevalova"
    },
    {
      "meeting": "2026-04-09",
      "person": "adam-arutyunov"
    },
    {
      "meeting": "2026-04-09",
      "person": "zhenya-sarnetskiy"
    },
    {
      "meeting": "2026-04-09",
      "person": "kirill-myshkin"
    },
    {
      "meeting": "2026-04-09",
      "person": "gosha"
    },
    {
      "meeting": "2026-04-09",
      "person": "kristina-marchenko"
    },
    {
      "meeting": "2026-04-09",
      "person": "dmitriy-sivuhin"
    },
    {
      "meeting": "2026-04-09",
      "person": "evgeniy-smirnov"
    },
    {
      "meeting": "2026-04-09",
      "person": "lesha-kram"
    },
    {
      "meeting": "2026-04-09",
      "person": "lesha-nikitin"
    },
    {
      "meeting": "2026-04-09",
      "person": "magomed-vagabov"
    },
    {
      "meeting": "2026-04-09",
      "person": "rustam-mushraipov"
    },
    {
      "meeting": "2026-04-09",
      "person": "sveta"
    },
    {
      "meeting": "2026-04-09",
      "person": "yulya-kutenko"
    },
    {
      "meeting": "2026-04-09",
      "person": "valeriya-romanova"
    },
    {
      "meeting": "2026-04-09",
      "person": "zhenya-arutyunov"
    },
    {
      "meeting": "2026-04-17",
      "person": "asya-dragun"
    },
    {
      "meeting": "2026-04-17",
      "person": "vlad"
    },
    {
      "meeting": "2026-04-17",
      "person": "magomed-vagabov"
    },
    {
      "meeting": "2026-04-17",
      "person": "kirill-myshkin"
    },
    {
      "meeting": "2026-04-17",
      "person": "evgeniy-smirnov"
    },
    {
      "meeting": "2026-04-17",
      "person": "dmitriy-sivuhin"
    },
    {
      "meeting": "2026-04-17",
      "person": "kristina-marchenko"
    },
    {
      "meeting": "2026-04-17",
      "person": "lesha-kram"
    },
    {
      "meeting": "2026-04-17",
      "person": "ramil-karimov"
    },
    {
      "meeting": "2026-04-17",
      "person": "ruslan-mamedov"
    },
    {
      "meeting": "2026-04-17",
      "person": "rustam-mushraipov"
    },
    {
      "meeting": "2026-04-17",
      "person": "polina-perevalova"
    },
    {
      "meeting": "2026-04-17",
      "person": "zhenya-arutyunov"
    },
    {
      "meeting": "2026-04-24",
      "person": "dmitriy-sivuhin"
    },
    {
      "meeting": "2026-04-24",
      "person": "evgeniy-smirnov"
    },
    {
      "meeting": "2026-04-24",
      "person": "artem-ermolaev"
    },
    {
      "meeting": "2026-04-24",
      "person": "zhenya-sarnetskiy"
    },
    {
      "meeting": "2026-04-24",
      "person": "magomed-vagabov"
    },
    {
      "meeting": "2026-04-24",
      "person": "kristina-marchenko"
    },
    {
      "meeting": "2026-04-24",
      "person": "lesha-nikitin"
    },
    {
      "meeting": "2026-04-24",
      "person": "kirill-myshkin"
    },
    {
      "meeting": "2026-04-24",
      "person": "masha-troitskaya"
    },
    {
      "meeting": "2026-04-24",
      "person": "marat-habibulin"
    },
    {
      "meeting": "2026-04-24",
      "person": "rustam-mushraipov"
    },
    {
      "meeting": "2026-04-24",
      "person": "ruslan-mamedov"
    },
    {
      "meeting": "2026-04-24",
      "person": "rinat-enikeev"
    },
    {
      "meeting": "2026-04-24",
      "person": "ramil-karimov"
    },
    {
      "meeting": "2026-04-24",
      "person": "kirill-chernov"
    },
    {
      "meeting": "2026-04-24",
      "person": "polina-perevalova"
    },
    {
      "meeting": "2026-04-24",
      "person": "zhenya-arutyunov"
    },
    {
      "meeting": "2026-05-01",
      "person": "adam-arutyunov"
    },
    {
      "meeting": "2026-05-01",
      "person": "dana"
    },
    {
      "meeting": "2026-05-01",
      "person": "dmitriy-sivuhin"
    },
    {
      "meeting": "2026-05-01",
      "person": "kristina-marchenko"
    },
    {
      "meeting": "2026-05-01",
      "person": "lesha-nikitin"
    },
    {
      "meeting": "2026-05-01",
      "person": "rustam-mushraipov"
    },
    {
      "meeting": "2026-05-01",
      "person": "ruslan-mamedov"
    },
    {
      "meeting": "2026-05-01",
      "person": "magomed-vagabov"
    },
    {
      "meeting": "2026-05-01",
      "person": "polina-perevalova"
    },
    {
      "meeting": "2026-05-15",
      "person": "artem-ermolaev"
    },
    {
      "meeting": "2026-05-15",
      "person": "ruslan-mamedov"
    },
    {
      "meeting": "2026-05-15",
      "person": "dmitriy-sivuhin"
    },
    {
      "meeting": "2026-05-15",
      "person": "evgeniy-smirnov"
    },
    {
      "meeting": "2026-05-15",
      "person": "kristina-marchenko"
    },
    {
      "meeting": "2026-05-15",
      "person": "masha-troitskaya"
    },
    {
      "meeting": "2026-05-15",
      "person": "rinat-enikeev"
    },
    {
      "meeting": "2026-05-15",
      "person": "rustam-mushraipov"
    },
    {
      "meeting": "2026-05-15",
      "person": "zhenya-arutyunov"
    },
    {
      "meeting": "2026-05-15",
      "person": "polina-perevalova"
    },
    {
      "meeting": "2026-06-05",
      "person": "vova"
    },
    {
      "meeting": "2026-06-05",
      "person": "dmitriy-sivuhin"
    },
    {
      "meeting": "2026-06-05",
      "person": "evgeniy-smirnov"
    },
    {
      "meeting": "2026-06-05",
      "person": "kirill-myshkin"
    },
    {
      "meeting": "2026-06-05",
      "person": "kristina-marchenko"
    },
    {
      "meeting": "2026-06-05",
      "person": "lesha-nikitin"
    },
    {
      "meeting": "2026-06-05",
      "person": "rustam-mushraipov"
    },
    {
      "meeting": "2026-06-05",
      "person": "ruslan-mamedov"
    },
    {
      "meeting": "2026-06-05",
      "person": "magomed-vagabov"
    },
    {
      "meeting": "2026-06-05",
      "person": "zhenya-arutyunov"
    },
    {
      "meeting": "2026-06-05",
      "person": "polina-perevalova"
    },
    {
      "meeting": "2026-06-12",
      "person": "artem-ermolaev"
    },
    {
      "meeting": "2026-06-12",
      "person": "dmitriy-sivuhin"
    },
    {
      "meeting": "2026-06-12",
      "person": "evgeniy-smirnov"
    },
    {
      "meeting": "2026-06-12",
      "person": "kristina-marchenko"
    },
    {
      "meeting": "2026-06-12",
      "person": "lesha-nikitin"
    },
    {
      "meeting": "2026-06-12",
      "person": "olga-permyakova"
    },
    {
      "meeting": "2026-06-12",
      "person": "ruslan-mamedov"
    },
    {
      "meeting": "2026-06-12",
      "person": "rustam-mushraipov"
    },
    {
      "meeting": "2026-06-12",
      "person": "vitaliy"
    },
    {
      "meeting": "2026-06-12",
      "person": "anastasiya-fomina"
    },
    {
      "meeting": "2026-06-12",
      "person": "nadya-tkacheva"
    },
    {
      "meeting": "2026-06-12",
      "person": "polina-perevalova"
    },
    {
      "meeting": "2026-06-12",
      "person": "zhenya-arutyunov"
    },
    {
      "meeting": "2026-07-03",
      "person": "dmitriy-sivuhin"
    },
    {
      "meeting": "2026-07-03",
      "person": "evgeniy-smirnov"
    },
    {
      "meeting": "2026-07-03",
      "person": "kristina-marchenko"
    },
    {
      "meeting": "2026-07-03",
      "person": "lesha-nikitin"
    },
    {
      "meeting": "2026-07-03",
      "person": "masha-troitskaya"
    },
    {
      "meeting": "2026-07-03",
      "person": "olga-permyakova"
    },
    {
      "meeting": "2026-07-03",
      "person": "rustam-mushraipov"
    },
    {
      "meeting": "2026-07-03",
      "person": "zoya"
    },
    {
      "meeting": "2026-07-03",
      "person": "zhenya-arutyunov"
    },
    {
      "meeting": "2026-07-03",
      "person": "polina-perevalova"
    },
    {
      "meeting": "2026-08-13",
      "person": "andrey"
    },
    {
      "meeting": "2026-08-13",
      "person": "danya-samoylenko"
    },
    {
      "meeting": "2026-08-13",
      "person": "dmitriy-sivuhin"
    },
    {
      "meeting": "2026-08-13",
      "person": "evgeniy-smirnov"
    },
    {
      "meeting": "2026-08-13",
      "person": "kirill-myshkin"
    },
    {
      "meeting": "2026-08-13",
      "person": "kristina-marchenko"
    },
    {
      "meeting": "2026-08-13",
      "person": "lesha-nikitin"
    },
    {
      "meeting": "2026-08-13",
      "person": "magomed-vagabov"
    },
    {
      "meeting": "2026-08-13",
      "person": "marat-habibulin"
    },
    {
      "meeting": "2026-08-13",
      "person": "polina-perevalova"
    },
    {
      "meeting": "2026-08-13",
      "person": "ruslan-mamedov"
    },
    {
      "meeting": "2026-08-13",
      "person": "rustam-mushraipov"
    },
    {
      "meeting": "2026-08-20",
      "person": "ayrat"
    },
    {
      "meeting": "2026-08-20",
      "person": "artem-ermolaev"
    },
    {
      "meeting": "2026-08-20",
      "person": "dmitriy-sivuhin"
    },
    {
      "meeting": "2026-08-20",
      "person": "zhenya-arutyunov"
    },
    {
      "meeting": "2026-08-20",
      "person": "zhenya-sarnetskiy"
    },
    {
      "meeting": "2026-08-20",
      "person": "kirill-myshkin"
    },
    {
      "meeting": "2026-08-20",
      "person": "kristina-marchenko"
    },
    {
      "meeting": "2026-08-20",
      "person": "lesha-nikitin"
    },
    {
      "meeting": "2026-08-20",
      "person": "magomed-vagabov"
    },
    {
      "meeting": "2026-08-20",
      "person": "marat-habibulin"
    },
    {
      "meeting": "2026-08-20",
      "person": "olga-permyakova"
    },
    {
      "meeting": "2026-08-20",
      "person": "polina-perevalova"
    },
    {
      "meeting": "2026-08-20",
      "person": "ruslan-mamedov"
    },
    {
      "meeting": "2026-08-20",
      "person": "sasha-permyakov"
    },
    {
      "meeting": "2026-08-27",
      "person": "artem-ermolaev"
    },
    {
      "meeting": "2026-08-27",
      "person": "danya-samoylenko"
    },
    {
      "meeting": "2026-08-27",
      "person": "evgeniy-smirnov"
    },
    {
      "meeting": "2026-08-27",
      "person": "zhenya-arutyunov"
    },
    {
      "meeting": "2026-08-27",
      "person": "kristina-marchenko"
    },
    {
      "meeting": "2026-08-27",
      "person": "lesha-nikitin"
    },
    {
      "meeting": "2026-08-27",
      "person": "polina-perevalova"
    },
    {
      "meeting": "2026-08-27",
      "person": "ramil-karimov"
    },
    {
      "meeting": "2026-09-03",
      "person": "andrey"
    },
    {
      "meeting": "2026-09-03",
      "person": "artem-ermolaev"
    },
    {
      "meeting": "2026-09-03",
      "person": "dmitriy-sivuhin"
    },
    {
      "meeting": "2026-09-03",
      "person": "evgeniy-smirnov"
    },
    {
      "meeting": "2026-09-03",
      "person": "zhenya-arutyunov"
    },
    {
      "meeting": "2026-09-03",
      "person": "kristina-marchenko"
    },
    {
      "meeting": "2026-09-03",
      "person": "lesha-nikitin"
    },
    {
      "meeting": "2026-09-03",
      "person": "olga-permyakova"
    },
    {
      "meeting": "2026-09-03",
      "person": "polina-perevalova"
    },
    {
      "meeting": "2026-09-03",
      "person": "rustam-mushraipov"
    },
    {
      "meeting": "2026-09-10",
      "person": "andrey"
    },
    {
      "meeting": "2026-09-10",
      "person": "artem-ermolaev"
    },
    {
      "meeting": "2026-09-10",
      "person": "dmitriy-sivuhin"
    },
    {
      "meeting": "2026-09-10",
      "person": "evgeniy-smirnov"
    },
    {
      "meeting": "2026-09-10",
      "person": "egor"
    },
    {
      "meeting": "2026-09-10",
      "person": "zhenya-arutyunov"
    },
    {
      "meeting": "2026-09-10",
      "person": "kristina-marchenko"
    },
    {
      "meeting": "2026-09-10",
      "person": "lesha-nikitin"
    },
    {
      "meeting": "2026-09-10",
      "person": "magomed-vagabov"
    },
    {
      "meeting": "2026-09-10",
      "person": "polina-perevalova"
    }
  ],
  "demos": [
    {
      "id": "demo-1",
      "meeting": "2025-08-28",
      "project": "telegram-kanal-s-uprazhneniyami-dlya-dizaynerov",
      "presenters": [
        "roma-kuzhel"
      ],
      "minutes": 6,
      "format": null,
      "note": null,
      "generated": true
    },
    {
      "id": "demo-2",
      "meeting": "2025-08-28",
      "project": "telegram-kanal-oy-babonki-glyante-ka",
      "presenters": [
        "elena-chausova"
      ],
      "minutes": 5,
      "format": null,
      "note": null,
      "generated": true
    },
    {
      "id": "demo-3",
      "meeting": "2025-08-28",
      "project": "bookov",
      "presenters": [
        "kirill-oleynichenko"
      ],
      "minutes": 6,
      "format": null,
      "note": null,
      "generated": true
    },
    {
      "id": "demo-4",
      "meeting": "2025-08-28",
      "project": "illyustratsii-dlya-upakovki",
      "presenters": [
        "kristina-dunina"
      ],
      "minutes": 5,
      "format": 1,
      "note": null,
      "generated": true
    },
    {
      "id": "demo-5",
      "meeting": "2025-08-28",
      "project": "stopfires-org",
      "presenters": [
        "rinat-enikeev"
      ],
      "minutes": 5,
      "format": null,
      "note": null,
      "generated": true
    },
    {
      "id": "demo-6",
      "meeting": "2025-09-11",
      "project": "telegram-kanal-kakovo-byt-dizaynerom",
      "presenters": [
        "kristina-marchenko"
      ],
      "minutes": 11,
      "format": null,
      "note": null,
      "generated": true
    },
    {
      "id": "demo-7",
      "meeting": "2025-09-11",
      "project": "creative-spark-board",
      "presenters": [
        "roma-kuzhel"
      ],
      "minutes": 10,
      "format": null,
      "note": null,
      "generated": true
    },
    {
      "id": "demo-8",
      "meeting": "2025-09-11",
      "project": "telegram-kanal-ruslan-i-bukvalnyy-chellendzh",
      "presenters": [
        "ruslan-mamedov"
      ],
      "minutes": 9,
      "format": null,
      "note": null,
      "generated": true
    },
    {
      "id": "demo-9",
      "meeting": "2025-09-25",
      "project": "podkast-hoba",
      "presenters": [
        "daler-alierov"
      ],
      "minutes": 4,
      "format": null,
      "note": null,
      "generated": true
    },
    {
      "id": "demo-10",
      "meeting": "2025-09-25",
      "project": "svoy-sayt",
      "presenters": [
        "viktor-timofeev"
      ],
      "minutes": 5,
      "format": 2,
      "note": null,
      "generated": true
    },
    {
      "id": "demo-11",
      "meeting": "2025-09-25",
      "project": "gotitbureau-com-rus",
      "presenters": [
        "ira-zaharova"
      ],
      "minutes": 5,
      "format": null,
      "note": null,
      "generated": true
    },
    {
      "id": "demo-12",
      "meeting": "2025-09-25",
      "project": "detskaya-kniga",
      "presenters": [
        "ekaterina-lakutina"
      ],
      "minutes": 5,
      "format": 2,
      "note": null,
      "generated": true
    },
    {
      "id": "demo-13",
      "meeting": "2025-09-25",
      "project": "telegram-kanal-kakovo-byt-dizaynerom",
      "presenters": [
        "kristina-marchenko"
      ],
      "minutes": 5,
      "format": null,
      "note": null,
      "generated": true
    },
    {
      "id": "demo-14",
      "meeting": "2025-09-25",
      "project": "telegram-kanal-ruslan-i-bukvalnyy-chellendzh",
      "presenters": [
        "ruslan-mamedov"
      ],
      "minutes": 3,
      "format": null,
      "note": null,
      "generated": true
    },
    {
      "id": "demo-43",
      "meeting": "2025-10-10",
      "project": "illyustratsii-dlya-upakovki",
      "presenters": [
        "kristina-dunina"
      ],
      "minutes": 10,
      "format": 2,
      "note": "Посоветовали упростить первый экран",
      "generated": true
    },
    {
      "id": "demo-44",
      "meeting": "2025-10-10",
      "project": "hypetype",
      "presenters": [
        "ruslan-mamedov"
      ],
      "minutes": 11,
      "format": null,
      "note": null,
      "generated": true
    },
    {
      "id": "demo-45",
      "meeting": "2025-10-10",
      "project": "svoy-sayt",
      "presenters": [
        "viktor-timofeev"
      ],
      "minutes": 8,
      "format": 1,
      "note": null,
      "generated": true
    },
    {
      "id": "demo-46",
      "meeting": "2025-10-16",
      "project": "telegram-kanal-kakovo-byt-dizaynerom",
      "presenters": [
        "kristina-marchenko"
      ],
      "minutes": 10,
      "format": null,
      "note": null,
      "generated": true
    },
    {
      "id": "demo-47",
      "meeting": "2025-10-16",
      "project": "aside",
      "presenters": [
        "lesha-nikitin"
      ],
      "minutes": 7,
      "format": null,
      "note": null,
      "generated": true
    },
    {
      "id": "demo-48",
      "meeting": "2025-10-16",
      "project": "muzey-neprinyatyh-rabot-stol",
      "presenters": [
        "artem-ermolaev"
      ],
      "minutes": 12,
      "format": null,
      "note": null,
      "generated": true
    },
    {
      "id": "demo-15",
      "meeting": "2025-10-23",
      "project": "muzey-neprinyatyh-rabot-stol",
      "presenters": [
        "artem-ermolaev"
      ],
      "minutes": 14,
      "format": null,
      "note": "Посоветовали упростить первый экран",
      "generated": true
    },
    {
      "id": "demo-16",
      "meeting": "2025-10-23",
      "project": "hypetype",
      "presenters": [
        "ruslan-mamedov"
      ],
      "minutes": 15,
      "format": null,
      "note": null,
      "generated": true
    },
    {
      "id": "demo-49",
      "meeting": "2025-11-07",
      "project": "bookov",
      "presenters": [
        "kirill-oleynichenko"
      ],
      "minutes": 7,
      "format": null,
      "note": null,
      "generated": true
    },
    {
      "id": "demo-50",
      "meeting": "2025-11-07",
      "project": "podkast-hoba",
      "presenters": [
        "daler-alierov"
      ],
      "minutes": 6,
      "format": null,
      "note": null,
      "generated": true
    },
    {
      "id": "demo-51",
      "meeting": "2025-11-07",
      "project": "illyustratsii-dlya-upakovki",
      "presenters": [
        "kristina-dunina"
      ],
      "minutes": 11,
      "format": 1,
      "note": "Спросили, что будет, если ничего не найдётся",
      "generated": true
    },
    {
      "id": "demo-52",
      "meeting": "2025-11-14",
      "project": "telegram-kanal-oy-babonki-glyante-ka",
      "presenters": [
        "elena-chausova"
      ],
      "minutes": 10,
      "format": null,
      "note": null,
      "generated": true
    },
    {
      "id": "demo-53",
      "meeting": "2025-11-14",
      "project": "telegram-kanal-kakovo-byt-dizaynerom",
      "presenters": [
        "kristina-marchenko"
      ],
      "minutes": 10,
      "format": null,
      "note": null,
      "generated": true
    },
    {
      "id": "demo-54",
      "meeting": "2025-11-14",
      "project": "aside",
      "presenters": [
        "lesha-nikitin"
      ],
      "minutes": 11,
      "format": null,
      "note": null,
      "generated": true
    },
    {
      "id": "demo-55",
      "meeting": "2025-11-21",
      "project": "telegram-kanal-ruslan-i-bukvalnyy-chellendzh",
      "presenters": [
        "ruslan-mamedov"
      ],
      "minutes": 10,
      "format": null,
      "note": null,
      "generated": true
    },
    {
      "id": "demo-56",
      "meeting": "2025-11-21",
      "project": "bot-letmidzhoyn",
      "presenters": [
        "kirill-myshkin"
      ],
      "minutes": 10,
      "format": null,
      "note": null,
      "generated": true
    },
    {
      "id": "demo-57",
      "meeting": "2025-11-21",
      "project": "svoy-sayt",
      "presenters": [
        "viktor-timofeev"
      ],
      "minutes": 12,
      "format": 3,
      "note": null,
      "generated": true
    },
    {
      "id": "demo-17",
      "meeting": "2025-11-27",
      "project": "muzey-neprinyatyh-rabot-stol",
      "presenters": [
        "artem-ermolaev"
      ],
      "minutes": 11,
      "format": null,
      "note": null,
      "generated": true
    },
    {
      "id": "demo-18",
      "meeting": "2025-11-27",
      "project": "kurs-po-matematike-kotoraya-prigoditsya-v-zhizni",
      "presenters": [
        "adam-arutyunov"
      ],
      "minutes": 14,
      "format": null,
      "note": null,
      "generated": true
    },
    {
      "id": "demo-58",
      "meeting": "2025-12-05",
      "project": "pervyy-rolik-na-yutyub",
      "presenters": [
        "masha-troitskaya"
      ],
      "minutes": 7,
      "format": null,
      "note": null,
      "generated": true
    },
    {
      "id": "demo-59",
      "meeting": "2025-12-05",
      "project": "illyustratsii-dlya-upakovki",
      "presenters": [
        "kristina-dunina"
      ],
      "minutes": 12,
      "format": 2,
      "note": null,
      "generated": true
    },
    {
      "id": "demo-60",
      "meeting": "2025-12-05",
      "project": "telegram-kanal-kakovo-byt-dizaynerom",
      "presenters": [
        "kristina-marchenko"
      ],
      "minutes": 11,
      "format": null,
      "note": null,
      "generated": true
    },
    {
      "id": "demo-61",
      "meeting": "2025-12-12",
      "project": "telerupor",
      "presenters": [
        "kirill-myshkin"
      ],
      "minutes": 7,
      "format": 2,
      "note": null,
      "generated": true
    },
    {
      "id": "demo-62",
      "meeting": "2025-12-12",
      "project": "past-simple",
      "presenters": [
        "artem-ermolaev"
      ],
      "minutes": 6,
      "format": null,
      "note": null,
      "generated": true
    },
    {
      "id": "demo-63",
      "meeting": "2025-12-12",
      "project": "aside",
      "presenters": [
        "lesha-nikitin"
      ],
      "minutes": 6,
      "format": null,
      "note": null,
      "generated": true
    },
    {
      "id": "demo-64",
      "meeting": "2025-12-12",
      "project": "hypetype",
      "presenters": [
        "ruslan-mamedov"
      ],
      "minutes": 5,
      "format": null,
      "note": null,
      "generated": true
    },
    {
      "id": "demo-65",
      "meeting": "2026-01-16",
      "project": "telegram-kanal-kakovo-byt-dizaynerom",
      "presenters": [
        "kristina-marchenko"
      ],
      "minutes": 8,
      "format": null,
      "note": null,
      "generated": true
    },
    {
      "id": "demo-66",
      "meeting": "2026-01-16",
      "project": "illyustratsii-dlya-upakovki",
      "presenters": [
        "kristina-dunina"
      ],
      "minutes": 8,
      "format": 1,
      "note": null,
      "generated": true
    },
    {
      "id": "demo-67",
      "meeting": "2026-01-16",
      "project": "pervyy-rolik-na-yutyub",
      "presenters": [
        "masha-troitskaya"
      ],
      "minutes": 10,
      "format": null,
      "note": null,
      "generated": true
    },
    {
      "id": "demo-68",
      "meeting": "2026-01-23",
      "project": "bookov",
      "presenters": [
        "kirill-oleynichenko"
      ],
      "minutes": 11,
      "format": null,
      "note": null,
      "generated": true
    },
    {
      "id": "demo-69",
      "meeting": "2026-01-23",
      "project": "telegram-kanal-kakovo-byt-dizaynerom",
      "presenters": [
        "kristina-marchenko"
      ],
      "minutes": 10,
      "format": null,
      "note": null,
      "generated": true
    },
    {
      "id": "demo-70",
      "meeting": "2026-01-23",
      "project": "telegram-kanal-ruslan-i-bukvalnyy-chellendzh",
      "presenters": [
        "ruslan-mamedov"
      ],
      "minutes": 10,
      "format": null,
      "note": null,
      "generated": true
    },
    {
      "id": "demo-71",
      "meeting": "2026-01-29",
      "project": "telegram-kanal-kakovo-byt-dizaynerom",
      "presenters": [
        "kristina-marchenko"
      ],
      "minutes": 12,
      "format": null,
      "note": null,
      "generated": true
    },
    {
      "id": "demo-72",
      "meeting": "2026-01-29",
      "project": "hypetype",
      "presenters": [
        "ruslan-mamedov"
      ],
      "minutes": 11,
      "format": null,
      "note": "Похвалили, что уже можно тыкать",
      "generated": true
    },
    {
      "id": "demo-73",
      "meeting": "2026-01-29",
      "project": "aside",
      "presenters": [
        "lesha-nikitin"
      ],
      "minutes": 11,
      "format": null,
      "note": null,
      "generated": true
    },
    {
      "id": "demo-74",
      "meeting": "2026-02-06",
      "project": "pervyy-rolik-na-yutyub",
      "presenters": [
        "masha-troitskaya"
      ],
      "minutes": 9,
      "format": null,
      "note": "Предложили сделать заголовок короче",
      "generated": true
    },
    {
      "id": "demo-75",
      "meeting": "2026-02-06",
      "project": "bot-letmidzhoyn",
      "presenters": [
        "kirill-myshkin"
      ],
      "minutes": 7,
      "format": null,
      "note": null,
      "generated": true
    },
    {
      "id": "demo-76",
      "meeting": "2026-02-06",
      "project": "telegram-kanal-kakovo-byt-dizaynerom",
      "presenters": [
        "kristina-marchenko"
      ],
      "minutes": 6,
      "format": null,
      "note": null,
      "generated": true
    },
    {
      "id": "demo-77",
      "meeting": "2026-02-06",
      "project": "aside",
      "presenters": [
        "lesha-nikitin"
      ],
      "minutes": 9,
      "format": null,
      "note": null,
      "generated": true
    },
    {
      "id": "demo-78",
      "meeting": "2026-02-21",
      "project": "telerupor",
      "presenters": [
        "kirill-myshkin"
      ],
      "minutes": 14,
      "format": 2,
      "note": "Посоветовали не прятать главное действие",
      "generated": true
    },
    {
      "id": "demo-79",
      "meeting": "2026-02-21",
      "project": "aside",
      "presenters": [
        "lesha-nikitin"
      ],
      "minutes": 10,
      "format": null,
      "note": null,
      "generated": true
    },
    {
      "id": "demo-80",
      "meeting": "2026-02-21",
      "project": "telegram-kanal-kakovo-byt-dizaynerom",
      "presenters": [
        "kristina-marchenko"
      ],
      "minutes": 8,
      "format": null,
      "note": null,
      "generated": true
    },
    {
      "id": "demo-81",
      "meeting": "2026-02-27",
      "project": "prilozhenie-dlya-rasshifrovki-vstrech-context",
      "presenters": [
        "daler-alierov"
      ],
      "minutes": 8,
      "format": 3,
      "note": null,
      "generated": true
    },
    {
      "id": "demo-82",
      "meeting": "2026-02-27",
      "project": "telegram-kanal-ruslan-i-bukvalnyy-chellendzh",
      "presenters": [
        "ruslan-mamedov"
      ],
      "minutes": 8,
      "format": null,
      "note": null,
      "generated": true
    },
    {
      "id": "demo-83",
      "meeting": "2026-02-27",
      "project": "telegram-kanal-kakovo-byt-dizaynerom",
      "presenters": [
        "kristina-marchenko"
      ],
      "minutes": 10,
      "format": null,
      "note": null,
      "generated": true
    },
    {
      "id": "demo-84",
      "meeting": "2026-03-07",
      "project": "illyustratsii-dlya-upakovki",
      "presenters": [
        "kristina-dunina"
      ],
      "minutes": 6,
      "format": 1,
      "note": null,
      "generated": true
    },
    {
      "id": "demo-85",
      "meeting": "2026-03-07",
      "project": "aside",
      "presenters": [
        "lesha-nikitin"
      ],
      "minutes": 5,
      "format": null,
      "note": null,
      "generated": true
    },
    {
      "id": "demo-86",
      "meeting": "2026-03-07",
      "project": "pervyy-rolik-na-yutyub",
      "presenters": [
        "masha-troitskaya"
      ],
      "minutes": 6,
      "format": null,
      "note": "Посоветовали не прятать главное действие",
      "generated": true
    },
    {
      "id": "demo-87",
      "meeting": "2026-03-07",
      "project": "creative-spark-board",
      "presenters": [
        "roma-kuzhel"
      ],
      "minutes": 5,
      "format": null,
      "note": "Похвалили, что уже можно тыкать",
      "generated": true
    },
    {
      "id": "demo-88",
      "meeting": "2026-03-12",
      "project": "search-thru",
      "presenters": [
        "magomed-vagabov"
      ],
      "minutes": 13,
      "format": null,
      "note": null,
      "generated": true
    },
    {
      "id": "demo-89",
      "meeting": "2026-03-12",
      "project": "bot-letmidzhoyn",
      "presenters": [
        "kirill-myshkin"
      ],
      "minutes": 11,
      "format": null,
      "note": null,
      "generated": true
    },
    {
      "id": "demo-90",
      "meeting": "2026-03-12",
      "project": "telegram-kanal-kakovo-byt-dizaynerom",
      "presenters": [
        "kristina-marchenko"
      ],
      "minutes": 9,
      "format": null,
      "note": "Посоветовали не прятать главное действие",
      "generated": true
    },
    {
      "id": "demo-91",
      "meeting": "2026-03-20",
      "project": "pervyy-rolik-na-yutyub",
      "presenters": [
        "masha-troitskaya"
      ],
      "minutes": 6,
      "format": null,
      "note": null,
      "generated": true
    },
    {
      "id": "demo-92",
      "meeting": "2026-03-20",
      "project": "telegram-kanal-kakovo-byt-dizaynerom",
      "presenters": [
        "kristina-marchenko"
      ],
      "minutes": 10,
      "format": null,
      "note": null,
      "generated": true
    },
    {
      "id": "demo-93",
      "meeting": "2026-03-20",
      "project": "search-thru",
      "presenters": [
        "magomed-vagabov"
      ],
      "minutes": 8,
      "format": null,
      "note": null,
      "generated": true
    },
    {
      "id": "demo-94",
      "meeting": "2026-03-28",
      "project": "telerupor",
      "presenters": [
        "kirill-myshkin"
      ],
      "minutes": 9,
      "format": 3,
      "note": null,
      "generated": true
    },
    {
      "id": "demo-95",
      "meeting": "2026-03-28",
      "project": "aside",
      "presenters": [
        "lesha-nikitin"
      ],
      "minutes": 8,
      "format": null,
      "note": null,
      "generated": true
    },
    {
      "id": "demo-96",
      "meeting": "2026-03-28",
      "project": "illyustratsii-dlya-upakovki",
      "presenters": [
        "kristina-dunina"
      ],
      "minutes": 8,
      "format": 2,
      "note": null,
      "generated": true
    },
    {
      "id": "demo-97",
      "meeting": "2026-03-28",
      "project": "muzey-neprinyatyh-rabot-stol",
      "presenters": [
        "artem-ermolaev"
      ],
      "minutes": 7,
      "format": null,
      "note": null,
      "generated": true
    },
    {
      "id": "demo-98",
      "meeting": "2026-04-02",
      "project": "dot-dead",
      "presenters": [
        "danya-samoylenko"
      ],
      "minutes": 8,
      "format": null,
      "note": null,
      "generated": true
    },
    {
      "id": "demo-99",
      "meeting": "2026-04-02",
      "project": "prezentatsiya-kak-sobrat-portfolio",
      "presenters": [
        "evgeniy-smirnov"
      ],
      "minutes": 7,
      "format": 2,
      "note": null,
      "generated": true
    },
    {
      "id": "demo-100",
      "meeting": "2026-04-02",
      "project": "telegram-kanal-kakovo-byt-dizaynerom",
      "presenters": [
        "kristina-marchenko"
      ],
      "minutes": 6,
      "format": null,
      "note": null,
      "generated": true
    },
    {
      "id": "demo-101",
      "meeting": "2026-04-02",
      "project": "stopfires-org",
      "presenters": [
        "rinat-enikeev"
      ],
      "minutes": 9,
      "format": null,
      "note": null,
      "generated": true
    },
    {
      "id": "demo-102",
      "meeting": "2026-04-09",
      "project": "kurs-po-matematike-kotoraya-prigoditsya-v-zhizni",
      "presenters": [
        "adam-arutyunov"
      ],
      "minutes": 7,
      "format": null,
      "note": "Спросили, что будет, если ничего не найдётся",
      "generated": true
    },
    {
      "id": "demo-103",
      "meeting": "2026-04-09",
      "project": "search-thru",
      "presenters": [
        "magomed-vagabov"
      ],
      "minutes": 12,
      "format": null,
      "note": "Предложили сделать заголовок короче",
      "generated": true
    },
    {
      "id": "demo-104",
      "meeting": "2026-04-09",
      "project": "bot-letmidzhoyn",
      "presenters": [
        "kirill-myshkin"
      ],
      "minutes": 5,
      "format": null,
      "note": null,
      "generated": true
    },
    {
      "id": "demo-105",
      "meeting": "2026-04-17",
      "project": "telegram-kanal-kakovo-byt-dizaynerom",
      "presenters": [
        "kristina-marchenko"
      ],
      "minutes": 8,
      "format": null,
      "note": null,
      "generated": true
    },
    {
      "id": "demo-106",
      "meeting": "2026-04-17",
      "project": "prezentatsiya-kak-sobrat-portfolio",
      "presenters": [
        "evgeniy-smirnov"
      ],
      "minutes": 8,
      "format": 2,
      "note": null,
      "generated": true
    },
    {
      "id": "demo-107",
      "meeting": "2026-04-17",
      "project": "hypetype",
      "presenters": [
        "ruslan-mamedov"
      ],
      "minutes": 7,
      "format": null,
      "note": null,
      "generated": true
    },
    {
      "id": "demo-108",
      "meeting": "2026-04-24",
      "project": "telerupor",
      "presenters": [
        "kirill-myshkin"
      ],
      "minutes": 8,
      "format": 2,
      "note": null,
      "generated": true
    },
    {
      "id": "demo-109",
      "meeting": "2026-04-24",
      "project": "pervyy-rolik-na-yutyub",
      "presenters": [
        "masha-troitskaya"
      ],
      "minutes": 7,
      "format": null,
      "note": "Спросили, как это выглядит с телефона",
      "generated": true
    },
    {
      "id": "demo-110",
      "meeting": "2026-04-24",
      "project": "aside",
      "presenters": [
        "lesha-nikitin"
      ],
      "minutes": 8,
      "format": null,
      "note": null,
      "generated": true
    },
    {
      "id": "demo-111",
      "meeting": "2026-04-24",
      "project": "search-thru",
      "presenters": [
        "magomed-vagabov"
      ],
      "minutes": 7,
      "format": null,
      "note": null,
      "generated": true
    },
    {
      "id": "demo-112",
      "meeting": "2026-05-01",
      "project": "telegram-kanal-ruslan-i-bukvalnyy-chellendzh",
      "presenters": [
        "ruslan-mamedov"
      ],
      "minutes": 11,
      "format": null,
      "note": null,
      "generated": true
    },
    {
      "id": "demo-113",
      "meeting": "2026-05-01",
      "project": "kurs-po-matematike-kotoraya-prigoditsya-v-zhizni",
      "presenters": [
        "adam-arutyunov"
      ],
      "minutes": 9,
      "format": null,
      "note": "Спросили, как это выглядит с телефона",
      "generated": true
    },
    {
      "id": "demo-114",
      "meeting": "2026-05-01",
      "project": "telegram-kanal-kakovo-byt-dizaynerom",
      "presenters": [
        "kristina-marchenko"
      ],
      "minutes": 7,
      "format": null,
      "note": null,
      "generated": true
    },
    {
      "id": "demo-115",
      "meeting": "2026-05-15",
      "project": "pervyy-rolik-na-yutyub",
      "presenters": [
        "masha-troitskaya"
      ],
      "minutes": 9,
      "format": null,
      "note": null,
      "generated": true
    },
    {
      "id": "demo-116",
      "meeting": "2026-05-15",
      "project": "stopfires-org",
      "presenters": [
        "rinat-enikeev"
      ],
      "minutes": 13,
      "format": null,
      "note": null,
      "generated": true
    },
    {
      "id": "demo-117",
      "meeting": "2026-05-15",
      "project": "past-simple",
      "presenters": [
        "artem-ermolaev"
      ],
      "minutes": 10,
      "format": null,
      "note": null,
      "generated": true
    },
    {
      "id": "demo-19",
      "meeting": "2026-05-25",
      "project": "pervyy-rolik-na-yutyub",
      "presenters": [
        "masha-troitskaya"
      ],
      "minutes": 6,
      "format": null,
      "note": null,
      "generated": true
    },
    {
      "id": "demo-20",
      "meeting": "2026-05-25",
      "project": "prilozhenie-dlya-rasshifrovki-vstrech-context",
      "presenters": [
        "daler-alierov"
      ],
      "minutes": 6,
      "format": 2,
      "note": null,
      "generated": true
    },
    {
      "id": "demo-21",
      "meeting": "2026-05-25",
      "project": "past-simple",
      "presenters": [
        "artem-ermolaev"
      ],
      "minutes": 5,
      "format": null,
      "note": null,
      "generated": true
    },
    {
      "id": "demo-22",
      "meeting": "2026-05-25",
      "project": "aside",
      "presenters": [
        "lesha-nikitin"
      ],
      "minutes": 5,
      "format": null,
      "note": "Предложили добавить пустое состояние",
      "generated": true
    },
    {
      "id": "demo-23",
      "meeting": "2026-05-25",
      "project": "bot-letmidzhoyn",
      "presenters": [
        "kirill-myshkin"
      ],
      "minutes": 5,
      "format": null,
      "note": "Посоветовали упростить первый экран",
      "generated": true
    },
    {
      "id": "demo-118",
      "meeting": "2026-06-05",
      "project": "aside",
      "presenters": [
        "lesha-nikitin"
      ],
      "minutes": 5,
      "format": null,
      "note": null,
      "generated": true
    },
    {
      "id": "demo-119",
      "meeting": "2026-06-05",
      "project": "bot-letmidzhoyn",
      "presenters": [
        "kirill-myshkin"
      ],
      "minutes": 5,
      "format": null,
      "note": null,
      "generated": true
    },
    {
      "id": "demo-120",
      "meeting": "2026-06-05",
      "project": "prezentatsiya-kak-sobrat-portfolio",
      "presenters": [
        "evgeniy-smirnov"
      ],
      "minutes": 6,
      "format": 3,
      "note": null,
      "generated": true
    },
    {
      "id": "demo-121",
      "meeting": "2026-06-05",
      "project": "telegram-kanal-kakovo-byt-dizaynerom",
      "presenters": [
        "kristina-marchenko"
      ],
      "minutes": 5,
      "format": null,
      "note": null,
      "generated": true
    },
    {
      "id": "demo-122",
      "meeting": "2026-06-05",
      "project": "hypetype",
      "presenters": [
        "ruslan-mamedov"
      ],
      "minutes": 7,
      "format": null,
      "note": null,
      "generated": true
    },
    {
      "id": "demo-123",
      "meeting": "2026-06-12",
      "project": "telegram-kanal-kakovo-byt-dizaynerom",
      "presenters": [
        "kristina-marchenko"
      ],
      "minutes": 11,
      "format": null,
      "note": null,
      "generated": true
    },
    {
      "id": "demo-124",
      "meeting": "2026-06-12",
      "project": "telegram-kanal-ruslan-i-bukvalnyy-chellendzh",
      "presenters": [
        "ruslan-mamedov"
      ],
      "minutes": 9,
      "format": null,
      "note": "Посоветовали упростить первый экран",
      "generated": true
    },
    {
      "id": "demo-125",
      "meeting": "2026-06-12",
      "project": "muzey-neprinyatyh-rabot-stol",
      "presenters": [
        "artem-ermolaev"
      ],
      "minutes": 10,
      "format": null,
      "note": "Предложили добавить пустое состояние",
      "generated": true
    },
    {
      "id": "demo-24",
      "meeting": "2026-06-25",
      "project": "prezentatsiya-kak-sobrat-portfolio",
      "presenters": [
        "evgeniy-smirnov"
      ],
      "minutes": 3,
      "format": 2,
      "note": "Предложили добавить пустое состояние",
      "generated": true
    },
    {
      "id": "demo-25",
      "meeting": "2026-06-25",
      "project": "dot-dead",
      "presenters": [
        "danya-samoylenko"
      ],
      "minutes": 4,
      "format": null,
      "note": "Предложили добавить пустое состояние",
      "generated": true
    },
    {
      "id": "demo-26",
      "meeting": "2026-06-25",
      "project": "search-thru",
      "presenters": [
        "magomed-vagabov"
      ],
      "minutes": 3,
      "format": null,
      "note": null,
      "generated": true
    },
    {
      "id": "demo-27",
      "meeting": "2026-06-25",
      "project": "telerupor",
      "presenters": [
        "kirill-myshkin"
      ],
      "minutes": 5,
      "format": 2,
      "note": null,
      "generated": true
    },
    {
      "id": "demo-28",
      "meeting": "2026-06-25",
      "project": "kontsept-igry-chayka",
      "presenters": [
        "anastasiya-fomina"
      ],
      "minutes": 4,
      "format": 2,
      "note": null,
      "generated": true
    },
    {
      "id": "demo-29",
      "meeting": "2026-06-25",
      "project": "hypetype",
      "presenters": [
        "ruslan-mamedov"
      ],
      "minutes": 5,
      "format": null,
      "note": null,
      "generated": true
    },
    {
      "id": "demo-126",
      "meeting": "2026-07-03",
      "project": "aside",
      "presenters": [
        "lesha-nikitin"
      ],
      "minutes": 10,
      "format": null,
      "note": null,
      "generated": true
    },
    {
      "id": "demo-127",
      "meeting": "2026-07-03",
      "project": "prezentatsiya-kak-sobrat-portfolio",
      "presenters": [
        "evgeniy-smirnov"
      ],
      "minutes": 10,
      "format": 1,
      "note": "Похвалили, что уже можно тыкать",
      "generated": true
    },
    {
      "id": "demo-128",
      "meeting": "2026-07-03",
      "project": "pervyy-rolik-na-yutyub",
      "presenters": [
        "masha-troitskaya"
      ],
      "minutes": 9,
      "format": null,
      "note": null,
      "generated": true
    },
    {
      "id": "demo-30",
      "meeting": "2026-08-13",
      "project": "scurrynslide-biblioteka-dlya-drag-and-drop",
      "presenters": [
        "kirill-myshkin"
      ],
      "minutes": 12,
      "format": null,
      "note": "Дима сказал, что там не апостров, а кавычки"
    },
    {
      "id": "demo-31",
      "meeting": "2026-08-13",
      "project": "igra-shpion-sredi-nas",
      "presenters": [
        "marat-habibulin"
      ],
      "minutes": 6,
      "format": null,
      "note": "Кристина сказала, что можно добавить имена к участникам игры"
    },
    {
      "id": "demo-32",
      "meeting": "2026-08-13",
      "project": "polina-hochet-uchitsya-vo-frantsii",
      "presenters": [
        "polina-perevalova"
      ],
      "minutes": 6,
      "format": null,
      "note": "Марат, Кирилл и Кристина сказали как можно обойтись без прикручивания АПИ: поболтать с нейросетью, создать базу данных упражнений и положить в код"
    },
    {
      "id": "demo-33",
      "meeting": "2026-08-13",
      "project": "sayt-kristiny-marchenko",
      "presenters": [
        "kristina-marchenko"
      ],
      "minutes": 5,
      "format": 2,
      "note": "Дима оценил шрифт Onest как норм."
    },
    {
      "id": "demo-34",
      "meeting": "2026-08-13",
      "project": "taymer-dlya-chasov",
      "presenters": [
        "andrey"
      ],
      "minutes": 4,
      "format": 2,
      "note": null
    },
    {
      "id": "demo-35",
      "meeting": "2026-08-20",
      "project": "igra-shpion-sredi-nas",
      "presenters": [
        "marat-habibulin"
      ],
      "minutes": 4,
      "format": null,
      "note": null
    },
    {
      "id": "demo-36",
      "meeting": "2026-08-20",
      "project": "ernolaev-space-svoy-sayt",
      "presenters": [
        "artem-ermolaev"
      ],
      "minutes": 3,
      "format": null,
      "note": null
    },
    {
      "id": "demo-37",
      "meeting": "2026-08-20",
      "project": "otslezhivatel-biletov-na-vodnyy-transport",
      "presenters": [
        "zhenya-arutyunov"
      ],
      "minutes": 7,
      "format": 2,
      "note": null
    },
    {
      "id": "demo-38",
      "meeting": "2026-08-20",
      "project": "sayly-ai-english-tutor",
      "presenters": [
        "ayrat"
      ],
      "minutes": 5,
      "format": null,
      "note": null
    },
    {
      "id": "demo-39",
      "meeting": "2026-08-20",
      "project": "shrift",
      "presenters": [
        "magomed-vagabov"
      ],
      "minutes": 7,
      "format": 2,
      "note": null
    },
    {
      "id": "demo-40",
      "meeting": "2026-08-27",
      "project": "obnovlenie-sayta-evgeniya-smirnova",
      "presenters": [
        "evgeniy-smirnov"
      ],
      "minutes": 8,
      "format": null,
      "note": null
    },
    {
      "id": "demo-41",
      "meeting": "2026-08-27",
      "project": "konsultatsionnyy-klub",
      "presenters": [
        "zhenya-arutyunov"
      ],
      "minutes": 15,
      "format": 1,
      "note": null
    },
    {
      "id": "demo-42",
      "meeting": "2026-08-27",
      "project": "sayt-dannyh-dlya-dnd",
      "presenters": [
        "ramil-karimov"
      ],
      "minutes": 7,
      "format": 2,
      "note": null
    },
    {
      "id": "demo-43",
      "meeting": "2026-09-03",
      "project": "tsifrovaya-prepodavatelskaya",
      "presenters": [
        "kristina-marchenko"
      ],
      "minutes": 1,
      "format": 2,
      "note": null
    },
    {
      "id": "demo-44",
      "meeting": "2026-09-03",
      "project": "obnovlenie-sayta-evgeniya-smirnova",
      "presenters": [
        "evgeniy-smirnov"
      ],
      "minutes": 5,
      "format": null,
      "note": null
    },
    {
      "id": "demo-45",
      "meeting": "2026-09-03",
      "project": "konsultatsionnyy-klub",
      "presenters": [
        "zhenya-arutyunov"
      ],
      "minutes": 2,
      "format": 1,
      "note": null
    },
    {
      "id": "demo-46",
      "meeting": "2026-09-03",
      "project": "taymer-dlya-chasov",
      "presenters": [
        "andrey"
      ],
      "minutes": 5,
      "format": 2,
      "note": null
    },
    {
      "id": "demo-47",
      "meeting": "2026-09-10",
      "project": "pechat-knigi-eto-krasivo-a-eto-net",
      "presenters": [
        "zhenya-arutyunov"
      ],
      "minutes": 9,
      "format": 2,
      "note": null
    },
    {
      "id": "demo-48",
      "meeting": "2026-09-10",
      "project": "konsultatsionnyy-klub",
      "presenters": [
        "zhenya-arutyunov"
      ],
      "minutes": 7,
      "format": 1,
      "note": null
    },
    {
      "id": "demo-49",
      "meeting": "2026-09-10",
      "project": "past-simple",
      "presenters": [
        "artem-ermolaev"
      ],
      "minutes": 1,
      "format": null,
      "note": null
    },
    {
      "id": "demo-50",
      "meeting": "2026-09-10",
      "project": "obnovlenie-sayta-evgeniya-smirnova",
      "presenters": [
        "evgeniy-smirnov"
      ],
      "minutes": 6,
      "format": null,
      "note": null
    },
    {
      "id": "demo-51",
      "meeting": "2026-09-10",
      "project": "inst-dlya-tvorchestva",
      "presenters": [
        "polina-perevalova"
      ],
      "minutes": 5,
      "format": null,
      "note": null
    },
    {
      "id": "demo-52",
      "meeting": "2026-09-10",
      "project": "shrift",
      "presenters": [
        "magomed-vagabov"
      ],
      "minutes": 3,
      "format": 2,
      "note": null
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
      "demo": "demo-3",
      "person": "roma-kuzhel",
      "generated": true
    },
    {
      "demo": "demo-4",
      "person": "elena-chausova",
      "generated": true
    },
    {
      "demo": "demo-7",
      "person": "ruslan-mamedov",
      "generated": true
    },
    {
      "demo": "demo-9",
      "person": "kristina-marchenko",
      "generated": true
    },
    {
      "demo": "demo-12",
      "person": "kristina-marchenko",
      "generated": true
    },
    {
      "demo": "demo-13",
      "person": "ekaterina-lakutina",
      "generated": true
    },
    {
      "demo": "demo-43",
      "person": "zhenya-arutyunov",
      "generated": true
    },
    {
      "demo": "demo-44",
      "person": "zhenya-arutyunov",
      "generated": true
    },
    {
      "demo": "demo-45",
      "person": "adam-arutyunov",
      "generated": true
    },
    {
      "demo": "demo-15",
      "person": "ruslan-mamedov",
      "generated": true
    },
    {
      "demo": "demo-51",
      "person": "marat-habibulin",
      "generated": true
    },
    {
      "demo": "demo-52",
      "person": "rustam-mushraipov",
      "generated": true
    },
    {
      "demo": "demo-53",
      "person": "marat-habibulin",
      "generated": true
    },
    {
      "demo": "demo-54",
      "person": "polina-perevalova",
      "generated": true
    },
    {
      "demo": "demo-55",
      "person": "lora-guranina",
      "generated": true
    },
    {
      "demo": "demo-57",
      "person": "polina-perevalova",
      "generated": true
    },
    {
      "demo": "demo-57",
      "person": "lora-guranina",
      "generated": true
    },
    {
      "demo": "demo-18",
      "person": "artem-ermolaev",
      "generated": true
    },
    {
      "demo": "demo-58",
      "person": "rustam-mushraipov",
      "generated": true
    },
    {
      "demo": "demo-58",
      "person": "zhenya-arutyunov",
      "generated": true
    },
    {
      "demo": "demo-60",
      "person": "lesha-nikitin",
      "generated": true
    },
    {
      "demo": "demo-60",
      "person": "rustam-mushraipov",
      "generated": true
    },
    {
      "demo": "demo-64",
      "person": "tatyana-kashina",
      "generated": true
    },
    {
      "demo": "demo-64",
      "person": "lesha-nikitin",
      "generated": true
    },
    {
      "demo": "demo-65",
      "person": "ramil-karimov",
      "generated": true
    },
    {
      "demo": "demo-65",
      "person": "tatyana-kashina",
      "generated": true
    },
    {
      "demo": "demo-66",
      "person": "kirill-chernov",
      "generated": true
    },
    {
      "demo": "demo-66",
      "person": "asya-dragun",
      "generated": true
    },
    {
      "demo": "demo-67",
      "person": "ramil-karimov",
      "generated": true
    },
    {
      "demo": "demo-70",
      "person": "vika-german",
      "generated": true
    },
    {
      "demo": "demo-70",
      "person": "kirill-oleynichenko",
      "generated": true
    },
    {
      "demo": "demo-72",
      "person": "lesha-nikitin",
      "generated": true
    },
    {
      "demo": "demo-73",
      "person": "kristina-marchenko",
      "generated": true
    },
    {
      "demo": "demo-74",
      "person": "georgiy-mishurovskiy",
      "generated": true
    },
    {
      "demo": "demo-78",
      "person": "masha-troitskaya",
      "generated": true
    },
    {
      "demo": "demo-79",
      "person": "polina-perevalova",
      "generated": true
    },
    {
      "demo": "demo-82",
      "person": "daler-alierov",
      "generated": true
    },
    {
      "demo": "demo-84",
      "person": "rustam-mushraipov",
      "generated": true
    },
    {
      "demo": "demo-84",
      "person": "alena-grishkovets",
      "generated": true
    },
    {
      "demo": "demo-86",
      "person": "alena-grishkovets",
      "generated": true
    },
    {
      "demo": "demo-87",
      "person": "nastya-tulaeva",
      "generated": true
    },
    {
      "demo": "demo-88",
      "person": "lesha-nikitin",
      "generated": true
    },
    {
      "demo": "demo-88",
      "person": "georgiy-mishurovskiy",
      "generated": true
    },
    {
      "demo": "demo-89",
      "person": "lesha-nikitin",
      "generated": true
    },
    {
      "demo": "demo-90",
      "person": "kirill-myshkin",
      "generated": true
    },
    {
      "demo": "demo-92",
      "person": "magomed-vagabov",
      "generated": true
    },
    {
      "demo": "demo-93",
      "person": "masha-troitskaya",
      "generated": true
    },
    {
      "demo": "demo-101",
      "person": "polina-perevalova",
      "generated": true
    },
    {
      "demo": "demo-102",
      "person": "zhenya-sarnetskiy",
      "generated": true
    },
    {
      "demo": "demo-103",
      "person": "zhenya-sarnetskiy",
      "generated": true
    },
    {
      "demo": "demo-106",
      "person": "lesha-kram",
      "generated": true
    },
    {
      "demo": "demo-107",
      "person": "kristina-marchenko",
      "generated": true
    },
    {
      "demo": "demo-109",
      "person": "ruslan-mamedov",
      "generated": true
    },
    {
      "demo": "demo-110",
      "person": "kirill-myshkin",
      "generated": true
    },
    {
      "demo": "demo-111",
      "person": "marat-habibulin",
      "generated": true
    },
    {
      "demo": "demo-112",
      "person": "dmitriy-sivuhin",
      "generated": true
    },
    {
      "demo": "demo-112",
      "person": "magomed-vagabov",
      "generated": true
    },
    {
      "demo": "demo-113",
      "person": "ruslan-mamedov",
      "generated": true
    },
    {
      "demo": "demo-114",
      "person": "adam-arutyunov",
      "generated": true
    },
    {
      "demo": "demo-20",
      "person": "masha-troitskaya",
      "generated": true
    },
    {
      "demo": "demo-21",
      "person": "daler-alierov",
      "generated": true
    },
    {
      "demo": "demo-22",
      "person": "daler-alierov",
      "generated": true
    },
    {
      "demo": "demo-23",
      "person": "artem-ermolaev",
      "generated": true
    },
    {
      "demo": "demo-119",
      "person": "zhenya-arutyunov",
      "generated": true
    },
    {
      "demo": "demo-120",
      "person": "lesha-nikitin",
      "generated": true
    },
    {
      "demo": "demo-121",
      "person": "ruslan-mamedov",
      "generated": true
    },
    {
      "demo": "demo-123",
      "person": "olga-permyakova",
      "generated": true
    },
    {
      "demo": "demo-123",
      "person": "artem-ermolaev",
      "generated": true
    },
    {
      "demo": "demo-124",
      "person": "dmitriy-sivuhin",
      "generated": true
    },
    {
      "demo": "demo-125",
      "person": "olga-permyakova",
      "generated": true
    },
    {
      "demo": "demo-24",
      "person": "kirill-myshkin",
      "generated": true
    },
    {
      "demo": "demo-25",
      "person": "anastasiya-fomina",
      "generated": true
    },
    {
      "demo": "demo-25",
      "person": "ruslan-mamedov",
      "generated": true
    },
    {
      "demo": "demo-26",
      "person": "ruslan-mamedov",
      "generated": true
    },
    {
      "demo": "demo-27",
      "person": "evgeniy-smirnov",
      "generated": true
    },
    {
      "demo": "demo-127",
      "person": "kristina-marchenko",
      "generated": true
    },
    {
      "demo": "demo-48",
      "person": "zhenya-arutyunov"
    },
    {
      "demo": "demo-49",
      "person": "zhenya-arutyunov"
    }
  ]
};

  if (typeof window !== "undefined") window.PlanetariumDB = PlanetariumDB;
  if (typeof module !== "undefined" && module.exports) module.exports = PlanetariumDB;
})();
