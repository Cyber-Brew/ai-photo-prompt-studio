const fs = require('fs');
const path = require('path');

const hairs = [
    { id: "hair.0", en: "Short messy hair", ru: "Короткие взъерошенные волосы", uk: "Короткі скуйовджені волосся" },
    { id: "hair.1", en: "Long wavy hair", ru: "Длинные волнистые волосы", uk: "Довгі хвилясті волосся" },
    { id: "hair.2", en: "Buzz cut", ru: "Ёжик", uk: "Їжачок" },
    { id: "hair.3", en: "Slicked back hair", ru: "Зачесанные назад", uk: "Зачесані назад" },
    { id: "hair.4", en: "Bob cut", ru: "Каре", uk: "Каре" },
    { id: "hair.5", en: "Pixie cut", ru: "Пикси", uk: "Піксі" },
    { id: "hair.6", en: "Curly voluminous hair", ru: "Кудрявые объемные", uk: "Кучеряві об'ємні" },
    { id: "hair.7", en: "Straight long hair", ru: "Прямые длинные", uk: "Прямі довгі" },
    { id: "hair.8", en: "Ponytail", ru: "Хвост", uk: "Хвіст" },
    { id: "hair.9", en: "Messy bun", ru: "Небрежный пучок", uk: "Недбалий пучок" },
    { id: "hair.10", en: "Braided hair", ru: "Косы", uk: "Коси" },
    { id: "hair.11", en: "Dreadlocks", ru: "Дреды", uk: "Дреди" },
    { id: "hair.12", en: "Afro", ru: "Афро", uk: "Афро" },
    { id: "hair.13", en: "Bald", ru: "Лысый", uk: "Лисий" },
    { id: "hair.14", en: "Undercut", ru: "Андеркат", uk: "Андеркат" },
    { id: "hair.15", en: "Mullet", ru: "Маллет", uk: "Маллет" },
    { id: "hair.16", en: "Faux hawk", ru: "Фоксхок", uk: "Фоксхок" },
    { id: "hair.17", en: "Curtain bangs", ru: "Челка-шторка", uk: "Чубчик-шторка" },
    { id: "hair.18", en: "Side-swept bangs", ru: "Косая челка", uk: "Косий чубчик" },
    { id: "hair.19", en: "Wavy bob", ru: "Волнистое каре", uk: "Хвилясте каре" },
    { id: "hair.20", en: "Tousled hair", ru: "Растрепанные", uk: "Розпатлані" }
];

const poses = [
    { id: "pose.0", en: "Looking at camera", ru: "Смотрит в камеру", uk: "Дивиться в камеру" },
    { id: "pose.1", en: "Looking away", ru: "Смотрит в сторону", uk: "Дивиться вбік" },
    { id: "pose.2", en: "Looking down", ru: "Смотрит вниз", uk: "Дивиться вниз" },
    { id: "pose.3", en: "Profile view", ru: "В профиль", uk: "В профіль" },
    { id: "pose.4", en: "Over the shoulder", ru: "Через плечо", uk: "Через плече" },
    { id: "pose.5", en: "Arms crossed", ru: "Скрещенные руки", uk: "Схрещені руки" },
    { id: "pose.6", en: "Hands in pockets", ru: "Руки в карманах", uk: "Руки в кишенях" },
    { id: "pose.7", en: "Walking towards camera", ru: "Идет на камеру", uk: "Йде на камеру" },
    { id: "pose.8", en: "Jumping", ru: "Прыжок", uk: "Стрибок" },
    { id: "pose.9", en: "Dancing", ru: "Танцует", uk: "Танцює" },
    { id: "pose.10", en: "Sitting casually", ru: "Сидит расслабленно", uk: "Сидить розслаблено" },
    { id: "pose.11", en: "Leaning against wall", ru: "Опирается на стену", uk: "Спирається на стіну" },
    { id: "pose.12", en: "Crouching", ru: "На корточках", uk: "Напочіпки" },
    { id: "pose.13", en: "Laying down", ru: "Лежит", uk: "Лежить" },
    { id: "pose.14", en: "Running", ru: "Бежит", uk: "Біжить" },
    { id: "pose.15", en: "Mid-action shot", ru: "В движении", uk: "В русі" },
    { id: "pose.16", en: "Hand on chin", ru: "Рука на подбородке", uk: "Рука на підборідді" },
    { id: "pose.17", en: "Adjusting glasses", ru: "Поправляет очки", uk: "Поправляє окуляри" },
    { id: "pose.18", en: "Looking up", ru: "Смотрит вверх", uk: "Дивиться вгору" },
    { id: "pose.19", en: "Dynamic pose", ru: "Динамичная поза", uk: "Динамічна поза" },
    { id: "pose.20", en: "Relaxed posture", ru: "Расслабленная поза", uk: "Розслаблена поза" },
    { id: "pose.21", en: "Powerful stance", ru: "Властная поза", uk: "Владна поза" },
    { id: "pose.22", en: "Candid smiling", ru: "Искренняя улыбка", uk: "Щира усмішка" }
];

const locations = [
    { id: "loc.0", en: "Dark Studio", ru: "Темная студия", uk: "Темна студія" },
    { id: "loc.1", en: "Street night", ru: "Ночная улица", uk: "Нічна вулиця" },
    { id: "loc.2", en: "Misty forest", ru: "Туманный лес", uk: "Туманний ліс" },
    { id: "loc.3", en: "Sunny beach", ru: "Солнечный пляж", uk: "Сонячний пляж" },
    { id: "loc.4", en: "Coffee shop", ru: "Кофейня", uk: "Кав'ярня" },
    { id: "loc.5", en: "Abandoned factory", ru: "Заброшенный завод", uk: "Покинутий завод" },
    { id: "loc.6", en: "Neon lit alley", ru: "Неоновая аллея", uk: "Неонова алея" },
    { id: "loc.7", en: "Library", ru: "Библиотека", uk: "Бібліотека" },
    { id: "loc.8", en: "Mountain peak", ru: "Вершина горы", uk: "Вершина гори" },
    { id: "loc.9", en: "Underwater", ru: "Под водой", uk: "Під водою" },
    { id: "loc.10", en: "Space station", ru: "Космическая станция", uk: "Космічна станція" },
    { id: "loc.11", en: "Desert dunes", ru: "Дюны пустыни", uk: "Дюни пустелі" },
    { id: "loc.12", en: "Snowy cabin", ru: "Заснеженный домик", uk: "Засніжений будиночок" },
    { id: "loc.13", en: "Cyberpunk city", ru: "Киберпанк город", uk: "Кіберпанк місто" },
    { id: "loc.14", en: "Medieval castle", ru: "Средневековый замок", uk: "Середньовічний замок" },
    { id: "loc.15", en: "Modern minimalist apartment", ru: "Стильная квартира", uk: "Стильна квартира" },
    { id: "loc.16", en: "Botanical garden", ru: "Ботанический сад", uk: "Ботанічний сад" },
    { id: "loc.17", en: "Subway station", ru: "Станция метро", uk: "Станція метро" },
    { id: "loc.18", en: "Rooftop at dusk", ru: "Крыша на закате", uk: "Дах на заході сонця" },
    { id: "loc.19", en: "Art gallery", ru: "Галерея искусств", uk: "Галерея мистецтв" },
    { id: "loc.20", en: "Busy intersection", ru: "Оживленный перекресток", uk: "Жваве перехрестя" },
    { id: "loc.21", en: "Empty highway", ru: "Пустое шоссе", uk: "Порожнє шосе" },
    { id: "loc.22", en: "Lighthouse", ru: "Маяк", uk: "Маяк" },
    { id: "loc.23", en: "Amusement park", ru: "Парк аттракционов", uk: "Парк атракціонів" },
    { id: "loc.24", en: "Concert stage", ru: "Сцена концерта", uk: "Сцена концерту" },
    { id: "loc.25", en: "Luxury hotel lobby", ru: "Лобби дорогого отеля", uk: "Лобі дорогого готелю" },
    { id: "loc.26", en: "Vineyard", ru: "Виноградники", uk: "Виноградники" },
    { id: "loc.27", en: "Ruins", ru: "Руины", uk: "Руїни" },
    { id: "loc.28", en: "Ice cave", ru: "Ледяная пещера", uk: "Крижана печера" },
    { id: "loc.29", en: "Volcano crater", ru: "Кратер вулкана", uk: "Кратер вулкана" },
    { id: "loc.30", en: "Rainy bridge", ru: "Мост под дождем", uk: "Міст під дощем" }
];

const clothings = [
    { id: "outfit.0", en: "Black suit", ru: "Черный костюм", uk: "Чорний костюм" },
    { id: "outfit.1", en: "Streetwear", ru: "Стритвир", uk: "Стрітвір" },
    { id: "outfit.2", en: "Leather jacket", ru: "Кожаная куртка", uk: "Шкіряна куртка" },
    { id: "outfit.3", en: "White t-shirt and jeans", ru: "Белая футболка и джинсы", uk: "Біла футболка та джинси" },
    { id: "outfit.4", en: "Formal gown", ru: "Вечернее платье", uk: "Вечірня сукня" },
    { id: "outfit.5", en: "Tactical gear", ru: "Тактическая экипировка", uk: "Тактичне екіпірування" },
    { id: "outfit.6", en: "Cyberpunk outfit", ru: "Киберпанк наряд", uk: "Кіберпанк вбрання" },
    { id: "outfit.7", en: "Vintage dress", ru: "Винтажное платье", uk: "Вінтажна сукня" },
    { id: "outfit.8", en: "Athleisure", ru: "Спортивный стиль", uk: "Спортивний стиль" },
    { id: "outfit.9", en: "Business casual", ru: "Бизнес-кэжуал", uk: "Бізнес-кежуал" },
    { id: "outfit.10", en: "Winter coat and scarf", ru: "Зимнее пальто и шарф", uk: "Зимове пальто і шарф" },
    { id: "outfit.11", en: "Swimsuit", ru: "Купальник", uk: "Купальник" },
    { id: "outfit.12", en: "Trench coat", ru: "Тренч", uk: "Тренч" },
    { id: "outfit.13", en: "Hoodie and sweatpants", ru: "Худи и треники", uk: "Худі та спортивні штани" },
    { id: "outfit.14", en: "Kimono", ru: "Кимоно", uk: "Кімоно" },
    { id: "outfit.15", en: "Bohemian dress", ru: "Бохо платье", uk: "Бохо сукня" },
    { id: "outfit.16", en: "Puffer jacket", ru: "Пуховик", uk: "Пуховик" },
    { id: "outfit.17", en: "Denim jacket", ru: "Джинсовка", uk: "Джинсівка" },
    { id: "outfit.18", en: "Tuxedo", ru: "Смокинг", uk: "Смокінг" },
    { id: "outfit.19", en: "Sweater vest", ru: "Вязаный жилет", uk: "В'язаний жилет" },
    { id: "outfit.20", en: "Plaid flannel", ru: "Фланелевая рубашка", uk: "Фланелева сорочка" },
    { id: "outfit.21", en: "Silk robe", ru: "Шелковый халат", uk: "Шовковий халат" },
    { id: "outfit.22", en: "Futuristic armor", ru: "Футуристичная броня", uk: "Футуристична броня" },
    { id: "outfit.23", en: "Steampunk attire", ru: "Стимпанк костюм", uk: "Стімпанк костюм" },
    { id: "outfit.24", en: "Goth fashion", ru: "Готический стиль", uk: "Готичний стиль" },
    { id: "outfit.25", en: "Chef uniform", ru: "Униформа шеф-повара", uk: "Уніформа шеф-кухаря" },
    { id: "outfit.26", en: "Astronaut suit", ru: "Скафандр", uk: "Скафандр" },
    { id: "outfit.27", en: "Safari outfit", ru: "Наряд для сафари", uk: "Вбрання для сафарі" },
    { id: "outfit.28", en: "Workout gear", ru: "Экипировка для фитнеса", uk: "Екіпірування для фітнесу" },
    { id: "outfit.29", en: "Summer romper", ru: "Летний комбинезон", uk: "Літній комбінезон" },
    { id: "outfit.30", en: "Raincoat", ru: "Дождевик", uk: "Дощовик" }
];

const lightings = [
    { id: "light.0", en: "Soft key at 45°", ru: "Мягкий ключ 45°", uk: "М’яке ключове 45°" },
    { id: "light.1", en: "Subtle rim light", ru: "Лёгкий контровой", uk: "Легке контрове" },
    { id: "light.2", en: "Split-tone neon", ru: "Неоновый сплит", uk: "Неоновий спліт" },
    { id: "light.3", en: "Golden hour", ru: "Золотой час", uk: "Золота година" },
    { id: "light.4", en: "Harsh direct sunlight", ru: "Жесткий прямой свет солнца", uk: "Жорстке пряме сонячне світло" },
    { id: "light.5", en: "Rembrandt lighting", ru: "Рембрандтовский свет", uk: "Рембрандтівське світло" },
    { id: "light.6", en: "Butterfly lighting", ru: "Свет-бабочка (Гламур)", uk: "Світло-метелик (Гламур)" },
    { id: "light.7", en: "Low-key lighting", ru: "Низкий ключ (Темный)", uk: "Низький ключ (Темний)" },
    { id: "light.8", en: "High-key lighting", ru: "Высокий ключ (Светлый)", uk: "Високий ключ (Світлий)" },
    { id: "light.9", en: "Silhouette", ru: "Силуэт", uk: "Силует" },
    { id: "light.10", en: "Firelight", ru: "Свет от костра", uk: "Світло від багаття" },
    { id: "light.11", en: "Bioluminescent glow", ru: "Биолюминесцентное свечение", uk: "Біолюмінесцентне світіння" },
    { id: "light.12", en: "Cinematic dramatic lighting", ru: "Кино - драматичный свет", uk: "Кіно - драматичне світло" },
    { id: "light.13", en: "Diffused overcast light", ru: "Рассеянный свет (облачно)", uk: "Розсіяне світло (хмарно)" },
    { id: "light.14", en: "Flash photography", ru: "Вспышка (Flash)", uk: "Спалах (Flash)" },
    { id: "light.15", en: "Candlelight", ru: "Свет от свечи", uk: "Світло від свічки" },
    { id: "light.16", en: "Volumetric god rays", ru: "Объемные лучи", uk: "Об'ємні промені світла" }
];

const atmospheres = [
    { id: "mood.0", en: "Mysterious", ru: "Загадочно", uk: "Таємниче" },
    { id: "mood.1", en: "Romantic", ru: "Романтично", uk: "Романтично" },
    { id: "mood.2", en: "Cyberpunk", ru: "Киберпанк", uk: "Кіберпанк" },
    { id: "mood.3", en: "Joyful", ru: "Радостно", uk: "Радісно" },
    { id: "mood.4", en: "Melancholic", ru: "Меланхолично", uk: "Меланхолійно" },
    { id: "mood.5", en: "Nostalgic", ru: "Ностальгично", uk: "Ностальгічно" },
    { id: "mood.6", en: "Epic", ru: "Эпично", uk: "Епічно" },
    { id: "mood.7", en: "Dreamy", ru: "Мечтательно", uk: "Замріяно" },
    { id: "mood.8", en: "Ethereal", ru: "Эфирно", uk: "Ефірно" },
    { id: "mood.9", en: "Gritty", ru: "Сурово", uk: "Суворо" },
    { id: "mood.10", en: "Whimsical", ru: "Причудливо", uk: "Химерно" },
    { id: "mood.11", en: "Tense", ru: "Напряженно", uk: "Напружено" },
    { id: "mood.12", en: "Peaceful", ru: "Мирно", uk: "Мирно" },
    { id: "mood.13", en: "Chaotic", ru: "Хаотично", uk: "Хаотично" },
    { id: "mood.14", en: "Surreal", ru: "Сюрреалистично", uk: "Сюрреалістично" },
    { id: "mood.15", en: "Dark fantasy", ru: "Темное фэнтези", uk: "Темне фентезі" },
    { id: "mood.16", en: "Sci-fi", ru: "Научная фантастика", uk: "Наукова фантастика" },
    { id: "mood.17", en: "Retro", ru: "Ретро", uk: "Ретро" },
    { id: "mood.18", en: "Minimalist", ru: "Минималистично", uk: "Мінімалістично" },
    { id: "mood.19", en: "Cozy", ru: "Уютно", uk: "Затишно" },
    { id: "mood.20", en: "Vibrant", ru: "Ярко", uk: "Яскраво" }
];

const generalEn = {
    "ui.title": "AI Photo Prompt Studio",
    "ui.subtitle": "Select parameters to compose your detailed AI photography prompt.",
    "ui.builder": "Prompt Builder",
    "ui.pack.select": "Select a Scene Pack",
    "ui.generated.title": "AI Photo Prompt",
    "ui.generate.scene": "Generate Random Scene",
    "ui.variations": "10 Variations",
    "ui.save": "Save to Library",
    "ui.copied": "Copied!",
    "ui.placeholder": "Your prompt will appear here...",
    "ui.custom.placeholder": "Or type a custom %s...",

    "section.subject": "Subject",
    "section.appearance": "Appearance",
    "section.clothing": "Clothing",
    "section.pose": "Pose",
    "section.scene": "Scene",
    "section.lighting": "Lighting",
    "section.camera": "Camera",
    "section.atmosphere": "Atmosphere",
    "section.style": "Style",
    "section.quality": "Quality",

    "param.subject.gender": "Gender",
    "param.appearance.hair": "Hair",
    "param.appearance.glasses": "Glasses",
    "param.clothing.outfit": "Outfit",
    "param.pose.base": "Pose",
    "param.scene.location": "Location",
    "param.camera.lens": "Lens",
    "param.camera.dof": "Depth of Field",
    "param.atmosphere.mood": "Mood",
    "param.lighting.setup": "Setup",
    "param.style.base": "Base Style",
    "param.quality.detail": "Detail",

    "gender.male": "Male",
    "gender.female": "Female",

    "glasses.none": "No glasses",
    "glasses.sun": "Sunglasses",
    "glasses.clear": "Clear glasses",

    "lens.16mm": "16mm",
    "lens.24mm": "24mm",
    "lens.35mm": "35mm",
    "lens.50mm": "50mm",
    "lens.85mm": "85mm",
    "lens.135mm": "135mm",
    "lens.200mm": "200mm",

    "dof.shallow": "Shallow DOF",
    "dof.deep": "Deep DOF",

    "style.photoreal": "Editorial photoreal",
    "style.cinematic": "Cinematic moody",
    "style.polaroid": "Polaroid",
    "style.black_and_white": "B&W",

    "q.hdr": "HDR",
    "q.skin": "Skin details",
    "q.8k": "8K",
    "q.mac": "Macro",

    "pack.cinematic_portrait": "Cinematic Portrait",
    "pack.street_photography": "Street Photography",
    "pack.luxury_fashion": "Luxury Fashion",

    "btn.apply": "Use",
    "btn.copy": "Copy",
    "variations.title": "Prompt Variations"
};

const generalRu = {
    "ui.title": "AI Фото Промпт Студия",
    "ui.subtitle": "Выберите параметры для составления промпта.",
    "ui.builder": "Конструктор промптов",
    "ui.pack.select": "Выберите набор сцены",
    "ui.generated.title": "ИИ Промпт",
    "ui.generate.scene": "Сгенерировать случайную",
    "ui.variations": "10 Вариаций",
    "ui.save": "В библиотеку",
    "ui.copied": "Скопировано!",
    "ui.placeholder": "Тут появится промпт...",
    "ui.custom.placeholder": "Или введите свой %s...",

    "section.subject": "Объект"
};

// Quick merge tool for translations
const dictEn = { ...generalEn };
const dictRu = {
    ...generalRu,
    "section.subject": "Объект", "section.appearance": "Внешность", "section.clothing": "Одежда",
    "section.pose": "Поза", "section.scene": "Сцена", "section.lighting": "Свет",
    "section.camera": "Камера", "section.atmosphere": "Атмосфера", "section.style": "Стиль", "section.quality": "Качество",
    "param.subject.gender": "Пол", "param.appearance.hair": "Волосы", "param.appearance.glasses": "Очки",
    "param.clothing.outfit": "Наряд", "param.pose.base": "Поза", "param.scene.location": "Локация",
    "param.camera.lens": "Объектив", "param.camera.dof": "Глубина резкости", "param.atmosphere.mood": "Настроение",
    "param.lighting.setup": "Схема", "param.style.base": "Стиль", "param.quality.detail": "Детализация",
    "gender.male": "Мужчина", "gender.female": "Женщина",
    "glasses.none": "Без очков", "glasses.sun": "Солнечные", "glasses.clear": "Для зрения",
    "lens.16mm": "16мм", "lens.24mm": "24мм", "lens.35mm": "35мм", "lens.50mm": "50мм", "lens.85mm": "85мм", "lens.135mm": "135мм", "lens.200mm": "200мм",
    "dof.shallow": "Боке (размытие)", "dof.deep": "Всё в фокусе",
    "style.photoreal": "Фотореал", "style.cinematic": "Кино (мрачно)", "style.polaroid": "Полароид", "style.black_and_white": "ЧБ",
    "q.hdr": "HDR", "q.skin": "Детали кожи", "q.8k": "8K", "q.mac": "Макро",
    "pack.cinematic_portrait": "Кино-портрет", "pack.street_photography": "Стрит-фото", "pack.luxury_fashion": "Люкс-мода",
    "btn.apply": "Применить", "btn.copy": "Клик", "variations.title": "Вариации"
};
const dictUk = {
    ...generalEn,
    "ui.title": "AI Фото Промпт Студія", "ui.subtitle": "Виберіть параметри для побудови промпта.",
    "ui.builder": "Конструктор промптів", "ui.pack.select": "Виберіть набір сцени",
    "ui.generated.title": "ШІ Промпт", "ui.generate.scene": "Випадкова сцена",
    "ui.variations": "10 Варіацій", "ui.save": "До бібліотеки", "ui.copied": "Скопійовано!",
    "ui.placeholder": "Тут з'явиться промпт...", "ui.custom.placeholder": "Або напишіть свій %s...",

    "section.subject": "Об'єкт", "section.appearance": "Зовнішність", "section.clothing": "Одяг",
    "section.pose": "Поза", "section.scene": "Сцена", "section.lighting": "Світло",
    "section.camera": "Камера", "section.atmosphere": "Атмосфера", "section.style": "Стиль", "section.quality": "Якість",
    "param.subject.gender": "Стать", "param.appearance.hair": "Волосся", "param.appearance.glasses": "Окуляри",
    "param.clothing.outfit": "Вбрання", "param.pose.base": "Поза", "param.scene.location": "Локація",
    "param.camera.lens": "Об'єктив", "param.camera.dof": "Глибина різкості", "param.atmosphere.mood": "Настрій",
    "param.lighting.setup": "Схема", "param.style.base": "Стиль", "param.quality.detail": "Деталізація",

    "gender.male": "Чоловік", "gender.female": "Жінка",
    "glasses.none": "Без окулярів", "glasses.sun": "Сонячні", "glasses.clear": "Для зору",
    "lens.16mm": "16мм", "lens.24mm": "24мм", "lens.35mm": "35мм", "lens.50mm": "50мм", "lens.85mm": "85мм", "lens.135mm": "135мм", "lens.200mm": "200мм",
    "dof.shallow": "Боке (розмиття)", "dof.deep": "Усе у фокусі",
    "style.photoreal": "Фотореал", "style.cinematic": "Кіно (похмуро)", "style.polaroid": "Полароїд", "style.black_and_white": "ЧБ",
    "q.hdr": "HDR", "q.skin": "Деталі шкіри", "q.8k": "8K", "q.mac": "Макро",
    "pack.cinematic_portrait": "Кіно-портрет", "pack.street_photography": "Стріт-фото", "pack.luxury_fashion": "Люксова мода",
    "btn.apply": "Застосувати", "btn.copy": "Копія", "variations.title": "Варіації"
};

const arrays = [hairs, poses, locations, clothings, lightings, atmospheres];
arrays.forEach(arr => {
    arr.forEach(item => {
        dictEn[item.id] = item.en;
        dictRu[item.id] = item.ru;
        dictUk[item.id] = item.uk;
    });
});

fs.mkdirSync(path.join(process.cwd(), 'src/i18n'), { recursive: true });
fs.writeFileSync(path.join(process.cwd(), 'src/i18n/en.json'), JSON.stringify(dictEn, null, 2));
fs.writeFileSync(path.join(process.cwd(), 'src/i18n/ru.json'), JSON.stringify(dictRu, null, 2));
fs.writeFileSync(path.join(process.cwd(), 'src/i18n/uk.json'), JSON.stringify(dictUk, null, 2));

function buildOpt(item) {
    return { key: item.id, prompt: item.en.toLowerCase(), weight: 50 };
}

const finalOptions = {
    version: "1.0.2",
    categories: {
        "subject.gender": {
            type: "single",
            options: [
                { key: "gender.male", prompt: "man", weight: 50 },
                { key: "gender.female", prompt: "woman", weight: 50 }
            ]
        },
        "appearance.hair": { type: "single", options: hairs.map(buildOpt) },
        "appearance.glasses": {
            type: "single",
            options: [
                { key: "glasses.none", prompt: "", weight: 50 },
                { key: "glasses.sun", prompt: "wearing sunglasses", weight: 50 },
                { key: "glasses.clear", prompt: "wearing clear glasses", weight: 50 }
            ]
        },
        "clothing.outfit": { type: "single", options: clothings.map(buildOpt) },
        "pose.base": { type: "single", options: poses.map(buildOpt) },
        "scene.location": { type: "single", options: locations.map(buildOpt) },
        "camera.lens": {
            type: "single",
            options: [
                { key: "lens.16mm", prompt: "shot on 16mm lens, ultra wide angle", weight: 30 },
                { key: "lens.24mm", prompt: "shot on 24mm lens, wide angle", weight: 30 },
                { key: "lens.35mm", prompt: "shot on 35mm lens", weight: 30 },
                { key: "lens.50mm", prompt: "shot on 50mm lens", weight: 30 },
                { key: "lens.85mm", prompt: "shot on 85mm lens, portrait", weight: 30 },
                { key: "lens.135mm", prompt: "shot on 135mm lens, compression", weight: 30 },
                { key: "lens.200mm", prompt: "shot on 200mm lens, telephoto", weight: 30 }
            ]
        },
        "camera.dof": {
            type: "single",
            options: [
                { key: "dof.shallow", prompt: "shallow depth of field, creamy bokeh", weight: 70 },
                { key: "dof.deep", prompt: "deep depth of field", weight: 30 }
            ]
        },
        "atmosphere.mood": { type: "multi", max: 2, options: atmospheres.map(buildOpt) },
        "lighting.setup": { type: "multi", max: 2, options: lightings.map(buildOpt) },
        "style.base": {
            type: "single",
            options: [
                { key: "style.photoreal", prompt: "professional editorial photography, photorealistic", weight: 40 },
                { key: "style.cinematic", prompt: "cinematic color grading", weight: 35 },
                { key: "style.polaroid", prompt: "polaroid aesthetic, vintage film", weight: 35 },
                { key: "style.black_and_white", prompt: "high contrast black and white photography", weight: 35 }
            ]
        },
        "quality.detail": {
            type: "multi", max: 3,
            options: [
                { key: "q.hdr", prompt: "high dynamic range", weight: 30 },
                { key: "q.skin", prompt: "ultra-detailed skin texture", weight: 35 },
                { key: "q.8k", prompt: "8k ultra sharp", weight: 25 },
                { key: "q.mac", prompt: "macro photography details", weight: 25 }
            ]
        }
    }
};

fs.writeFileSync(path.join(process.cwd(), 'src/data/options.json'), JSON.stringify(finalOptions, null, 2));
console.log("I18N Build Done");
