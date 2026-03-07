import json

# Fix UK file 
with open('src/i18n/uk.json', 'r') as f:
    uk = json.load(f)

uk["section.output"] = "Формат та референси"
uk["param.output.aspect_ratio"] = "Співвідношення сторін"
uk["output.aspect.4_5"] = "4:5 вертик."
uk["output.aspect.1_1"] = "1:1 квадрат"
uk["output.aspect.3_4"] = "3:4 вертик."
uk["output.aspect.2_3"] = "2:3 вертик."
uk["output.aspect.9_16"] = "9:16 сторіз"
uk["output.aspect.16_9"] = "16:9 кіно"
uk["output.use_reference"] = "Використовувати завантажені фото-референси"

# Add back accidentally removed strings from chunk replace error
uk["q.hdr"] = "HDR"
uk["q.skin"] = "Деталі шкіри"
uk["q.8k"] = "8K"
uk["q.mac"] = "Макро"
uk["pack.cinematic_portrait"] = "Кіно-портрет"
uk["pack.street_photography"] = "Стріт-фото"
uk["pack.luxury_fashion"] = "Люксова мода"
uk["btn.apply"] = "Застосувати"
uk["btn.copy"] = "Копія"
uk["variations.title"] = "Варіації"
uk["hair.0"] = "Короткі скуйовджені волосся"
uk["hair.1"] = "Довгі хвилясті волосся"
uk["hair.2"] = "Їжачок"
uk["hair.3"] = "Зачесані назад"
uk["hair.4"] = "Каре"
uk["hair.5"] = "Піксі"

with open('src/i18n/uk.json', 'w') as f:
    json.dump(uk, f, indent=2, ensure_ascii=False)

# Update schema
with open('src/data/schema.json', 'r') as f:
    schema = json.load(f)

# Add section if not exists
if not any(s['id'] == 'output' for s in schema['uiSections']):
    schema['uiSections'].append({
        "id": "output",
        "categories": ["output.aspect_ratio", "output.use_reference"]
    })

# Add order mapping
schema['promptOrder'].extend(["output.aspect_ratio", "output.use_reference"])

with open('src/data/schema.json', 'w') as f:
    json.dump(schema, f, indent=2)

# Update options
with open('src/data/options.json', 'r') as f:
    opts = json.load(f)

opts['categories']['output.aspect_ratio'] = {
  "type": "single",
  "options": [
    { "key": "output.aspect.4_5", "prompt": "vertical 4:5 aspect ratio", "weight": 50 },
    { "key": "output.aspect.1_1", "prompt": "1:1 aspect ratio", "weight": 50 },
    { "key": "output.aspect.3_4", "prompt": "vertical 3:4 aspect ratio", "weight": 50 },
    { "key": "output.aspect.2_3", "prompt": "vertical 2:3 aspect ratio", "weight": 50 },
    { "key": "output.aspect.9_16", "prompt": "9:16 aspect ratio", "weight": 50 },
    { "key": "output.aspect.16_9", "prompt": "16:9 aspect ratio", "weight": 50 }
  ]
}
opts['categories']['output.use_reference'] = {
  "type": "single",
  "options": [
    { "key": "output.use_reference", "prompt": "RESERVED_FOR_ENGINE", "weight": 50 }
  ]
}

with open('src/data/options.json', 'w') as f:
    json.dump(opts, f, indent=2)

print("Patch complete")
