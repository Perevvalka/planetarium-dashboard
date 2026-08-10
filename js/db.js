// Единая база данных Планетария.
// Источник правды для визуализаций и админки.
// Реальные данные: посещения еженедельных встреч + демо-эфиры.

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
      "id": "aleksandr-liso",
      "name": "Александр Лисо…?",
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
      "title": "Свой сайт",
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
    }
  ],
  "meetings": [
    {
      "date": "2025-08-28",
      "type": "stream",
      "minutes": null,
      "note": null
    },
    {
      "date": "2025-09-11",
      "type": "stream",
      "minutes": null,
      "note": null
    },
    {
      "date": "2025-09-25",
      "type": "stream",
      "minutes": null,
      "note": null
    },
    {
      "date": "2025-10-10",
      "type": "weekly",
      "minutes": null,
      "note": null
    },
    {
      "date": "2025-10-16",
      "type": "weekly",
      "minutes": null,
      "note": null
    },
    {
      "date": "2025-10-23",
      "type": "stream",
      "minutes": null,
      "note": null
    },
    {
      "date": "2025-11-07",
      "type": "weekly",
      "minutes": null,
      "note": null
    },
    {
      "date": "2025-11-14",
      "type": "weekly",
      "minutes": null,
      "note": null
    },
    {
      "date": "2025-11-21",
      "type": "weekly",
      "minutes": null,
      "note": null
    },
    {
      "date": "2025-11-27",
      "type": "stream",
      "minutes": null,
      "note": null
    },
    {
      "date": "2025-12-05",
      "type": "weekly",
      "minutes": null,
      "note": null
    },
    {
      "date": "2025-12-12",
      "type": "weekly",
      "minutes": null,
      "note": null
    },
    {
      "date": "2026-01-16",
      "type": "weekly",
      "minutes": null,
      "note": null
    },
    {
      "date": "2026-01-23",
      "type": "weekly",
      "minutes": null,
      "note": null
    },
    {
      "date": "2026-01-29",
      "type": "weekly",
      "minutes": null,
      "note": null
    },
    {
      "date": "2026-02-06",
      "type": "weekly",
      "minutes": null,
      "note": null
    },
    {
      "date": "2026-02-21",
      "type": "weekly",
      "minutes": null,
      "note": null
    },
    {
      "date": "2026-02-27",
      "type": "weekly",
      "minutes": null,
      "note": null
    },
    {
      "date": "2026-03-07",
      "type": "weekly",
      "minutes": null,
      "note": null
    },
    {
      "date": "2026-03-12",
      "type": "weekly",
      "minutes": null,
      "note": null
    },
    {
      "date": "2026-03-20",
      "type": "weekly",
      "minutes": null,
      "note": null
    },
    {
      "date": "2026-03-28",
      "type": "weekly",
      "minutes": null,
      "note": null
    },
    {
      "date": "2026-04-02",
      "type": "weekly",
      "minutes": null,
      "note": null
    },
    {
      "date": "2026-04-09",
      "type": "weekly",
      "minutes": null,
      "note": null
    },
    {
      "date": "2026-04-17",
      "type": "weekly",
      "minutes": null,
      "note": null
    },
    {
      "date": "2026-04-24",
      "type": "weekly",
      "minutes": null,
      "note": null
    },
    {
      "date": "2026-05-01",
      "type": "weekly",
      "minutes": null,
      "note": null
    },
    {
      "date": "2026-05-15",
      "type": "weekly",
      "minutes": null,
      "note": null
    },
    {
      "date": "2026-05-25",
      "type": "stream",
      "minutes": null,
      "note": null
    },
    {
      "date": "2026-06-05",
      "type": "weekly",
      "minutes": null,
      "note": null
    },
    {
      "date": "2026-06-12",
      "type": "weekly",
      "minutes": null,
      "note": null
    },
    {
      "date": "2026-06-25",
      "type": "stream",
      "minutes": null,
      "note": null
    },
    {
      "date": "2026-07-03",
      "type": "weekly",
      "minutes": null,
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
      "person": "aleksandr-liso"
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
      "minutes": null,
      "format": null,
      "note": null
    },
    {
      "id": "demo-2",
      "meeting": "2025-08-28",
      "project": "telegram-kanal-oy-babonki-glyante-ka",
      "presenters": [
        "elena-chausova"
      ],
      "minutes": null,
      "format": null,
      "note": null
    },
    {
      "id": "demo-3",
      "meeting": "2025-08-28",
      "project": "bookov",
      "presenters": [
        "kirill-oleynichenko"
      ],
      "minutes": null,
      "format": null,
      "note": null
    },
    {
      "id": "demo-4",
      "meeting": "2025-08-28",
      "project": "illyustratsii-dlya-upakovki",
      "presenters": [
        "kristina-dunina"
      ],
      "minutes": null,
      "format": null,
      "note": null
    },
    {
      "id": "demo-5",
      "meeting": "2025-08-28",
      "project": "stopfires-org",
      "presenters": [
        "rinat-enikeev"
      ],
      "minutes": null,
      "format": null,
      "note": null
    },
    {
      "id": "demo-6",
      "meeting": "2025-09-11",
      "project": "telegram-kanal-kakovo-byt-dizaynerom",
      "presenters": [
        "kristina-marchenko"
      ],
      "minutes": null,
      "format": null,
      "note": null
    },
    {
      "id": "demo-7",
      "meeting": "2025-09-11",
      "project": "creative-spark-board",
      "presenters": [
        "roma-kuzhel"
      ],
      "minutes": null,
      "format": null,
      "note": null
    },
    {
      "id": "demo-8",
      "meeting": "2025-09-11",
      "project": "telegram-kanal-ruslan-i-bukvalnyy-chellendzh",
      "presenters": [
        "ruslan-mamedov"
      ],
      "minutes": null,
      "format": null,
      "note": null
    },
    {
      "id": "demo-9",
      "meeting": "2025-09-25",
      "project": "podkast-hoba",
      "presenters": [
        "daler-alierov"
      ],
      "minutes": null,
      "format": null,
      "note": null
    },
    {
      "id": "demo-10",
      "meeting": "2025-09-25",
      "project": "svoy-sayt",
      "presenters": [
        "viktor-timofeev"
      ],
      "minutes": null,
      "format": null,
      "note": null
    },
    {
      "id": "demo-11",
      "meeting": "2025-09-25",
      "project": "gotitbureau-com-rus",
      "presenters": [
        "ira-zaharova"
      ],
      "minutes": null,
      "format": null,
      "note": null
    },
    {
      "id": "demo-12",
      "meeting": "2025-09-25",
      "project": "detskaya-kniga",
      "presenters": [
        "ekaterina-lakutina"
      ],
      "minutes": null,
      "format": null,
      "note": null
    },
    {
      "id": "demo-13",
      "meeting": "2025-09-25",
      "project": "telegram-kanal-kakovo-byt-dizaynerom",
      "presenters": [
        "kristina-marchenko"
      ],
      "minutes": null,
      "format": null,
      "note": null
    },
    {
      "id": "demo-14",
      "meeting": "2025-09-25",
      "project": "telegram-kanal-ruslan-i-bukvalnyy-chellendzh",
      "presenters": [
        "ruslan-mamedov"
      ],
      "minutes": null,
      "format": null,
      "note": null
    },
    {
      "id": "demo-15",
      "meeting": "2025-10-23",
      "project": "muzey-neprinyatyh-rabot-stol",
      "presenters": [
        "artem-ermolaev"
      ],
      "minutes": null,
      "format": null,
      "note": null
    },
    {
      "id": "demo-16",
      "meeting": "2025-10-23",
      "project": "hypetype",
      "presenters": [
        "ruslan-mamedov"
      ],
      "minutes": null,
      "format": null,
      "note": null
    },
    {
      "id": "demo-17",
      "meeting": "2025-11-27",
      "project": "muzey-neprinyatyh-rabot-stol",
      "presenters": [
        "artem-ermolaev"
      ],
      "minutes": null,
      "format": null,
      "note": null
    },
    {
      "id": "demo-18",
      "meeting": "2025-11-27",
      "project": "kurs-po-matematike-kotoraya-prigoditsya-v-zhizni",
      "presenters": [
        "adam-arutyunov"
      ],
      "minutes": null,
      "format": null,
      "note": null
    },
    {
      "id": "demo-19",
      "meeting": "2026-05-25",
      "project": "pervyy-rolik-na-yutyub",
      "presenters": [
        "masha-troitskaya"
      ],
      "minutes": null,
      "format": null,
      "note": null
    },
    {
      "id": "demo-20",
      "meeting": "2026-05-25",
      "project": "prilozhenie-dlya-rasshifrovki-vstrech-context",
      "presenters": [
        "daler-alierov"
      ],
      "minutes": null,
      "format": null,
      "note": null
    },
    {
      "id": "demo-21",
      "meeting": "2026-05-25",
      "project": "past-simple",
      "presenters": [
        "artem-ermolaev"
      ],
      "minutes": null,
      "format": null,
      "note": null
    },
    {
      "id": "demo-22",
      "meeting": "2026-05-25",
      "project": "aside",
      "presenters": [
        "lesha-nikitin"
      ],
      "minutes": null,
      "format": null,
      "note": null
    },
    {
      "id": "demo-23",
      "meeting": "2026-05-25",
      "project": "bot-letmidzhoyn",
      "presenters": [
        "kirill-myshkin"
      ],
      "minutes": null,
      "format": null,
      "note": null
    },
    {
      "id": "demo-24",
      "meeting": "2026-06-25",
      "project": "prezentatsiya-kak-sobrat-portfolio",
      "presenters": [
        "evgeniy-smirnov"
      ],
      "minutes": null,
      "format": null,
      "note": null
    },
    {
      "id": "demo-25",
      "meeting": "2026-06-25",
      "project": "dot-dead",
      "presenters": [
        "danya-samoylenko"
      ],
      "minutes": null,
      "format": null,
      "note": null
    },
    {
      "id": "demo-26",
      "meeting": "2026-06-25",
      "project": "search-thru",
      "presenters": [
        "magomed-vagabov"
      ],
      "minutes": null,
      "format": null,
      "note": null
    },
    {
      "id": "demo-27",
      "meeting": "2026-06-25",
      "project": "telerupor",
      "presenters": [
        "kirill-myshkin"
      ],
      "minutes": null,
      "format": null,
      "note": null
    },
    {
      "id": "demo-28",
      "meeting": "2026-06-25",
      "project": "kontsept-igry-chayka",
      "presenters": [
        "anastasiya-fomina"
      ],
      "minutes": null,
      "format": null,
      "note": null
    },
    {
      "id": "demo-29",
      "meeting": "2026-06-25",
      "project": "hypetype",
      "presenters": [
        "ruslan-mamedov"
      ],
      "minutes": null,
      "format": null,
      "note": null
    }
  ],
  "feedback": []
};

  // Экспорт для браузера и (при необходимости) Node
  if (typeof window !== "undefined") window.PlanetariumDB = PlanetariumDB;
  if (typeof module !== "undefined" && module.exports) module.exports = PlanetariumDB;
})();
