import fs from 'fs';
import path from 'path';

// Generate lots of mock options to satisfy requirements

const hairs = [
    "Short messy hair", "Long wavy hair", "Buzz cut", "Slicked back hair", "Bob cut",
    "Pixie cut", "Curly voluminous hair", "Straight long hair", "Ponytail", "Messy bun",
    "Braided hair", "Dreadlocks", "Afro", "Bald", "Undercut",
    "Mullet", "Faux hawk", "Curtain bangs", "Side-swept bangs", "Wavy bob", "Tousled hair"
];

const poses = [
    "Looking at camera", "Looking away", "Looking down", "Profile view", "Over the shoulder",
    "Arms crossed", "Hands in pockets", "Walking towards camera", "Jumping", "Dancing",
    "Sitting casually", "Leaning against wall", "Crouching", "Laying down", "Running",
    "Mid-action shot", "Hand on chin", "Adjusting glasses", "Looking up", "Dynamic pose",
    "Relaxed posture", "Powerful stance", "Candid smiling"
];

const locations = [
    "Dark Studio", "Street night", "Misty forest", "Sunny beach", "Coffee shop",
    "Abandoned factory", "Neon lit alley", "Library", "Mountain peak", "Underwater",
    "Space station", "Desert dunes", "Snowy cabin", "Cyberpunk city", "Medieval castle",
    "Modern minimalist apartment", "Botanical garden", "Subway station", "Rooftop at dusk", "Art gallery",
    "Busy intersection", "Empty highway", "Lighthouse", "Amusement park", "Concert stage",
    "Luxury hotel lobby", "Vineyard", "Ruins", "Ice cave", "Volcano crater", "Rainy bridge"
];

const clothings = [
    "Black suit", "Streetwear", "Leather jacket", "White t-shirt and jeans", "Formal gown",
    "Tactical gear", "Cyberpunk outfit", "Vintage dress", "Athleisure", "Business casual",
    "Winter coat and scarf", "Swimsuit", "Trench coat", "Hoodie and sweatpants", "Kimono",
    "Bohemian dress", "Puffer jacket", "Denim jacket", "Tuxedo", "Sweater vest",
    "Plaid flannel", "Silk robe", "Futuristic armor", "Steampunk attire", "Goth fashion",
    "Chef uniform", "Astronaut suit", "Safari outfit", "Workout gear", "Summer romper", "Raincoat"
];

const lightings = [
    "Soft key at 45°", "Subtle rim light", "Split-tone neon", "Golden hour", "Harsh direct sunlight",
    "Rembrandt lighting", "Butterfly lighting", "Low-key lighting", "High-key lighting", "Silhouette",
    "Firelight", "Bioluminescent glow", "Cinematic dramatic lighting", "Diffused overcast light", "Flash photography",
    "Candlelight", "Volumetric god rays"
];

const atmospheres = [
    "Mysterious", "Romantic", "Cyberpunk", "Joyful", "Melancholic",
    "Nostalgic", "Epic", "Dreamy", "Ethereal", "Gritty",
    "Whimsical", "Tense", "Peaceful", "Chaotic", "Surreal",
    "Dark fantasy", "Sci-fi", "Retro", "Minimalist", "Cozy", "Vibrant"
];

function genOptions(prefix, list, tags) {
    return list.map((item, i) => ({
        key: `${prefix}.${i}`,
        label: { en: item, ru: item, uk: item },
        prompt: item.toLowerCase(),
        tags: tags,
        weight: 50
    }));
}

const data = {
    version: "1.0.1",
    locales: ["en", "ru", "uk"],
    categories: {
        "subject.gender": {
            type: "single",
            options: [
                { key: "gender.male", label: { en: "Male", ru: "Мужчина", uk: "Чоловік" }, prompt: "man", tags: ["human"], weight: 50 },
                { key: "gender.female", label: { en: "Female", ru: "Женщина", uk: "Жінка" }, prompt: "woman", tags: ["human"], weight: 50 }
            ]
        },
        "appearance.hair": {
            type: "single",
            options: genOptions("hair", hairs, ["hair"])
        },
        "appearance.glasses": {
            type: "single",
            options: [
                { key: "glasses.none", label: { en: "No glasses", ru: "Без очков", uk: "Без окулярів" }, prompt: "", tags: [], weight: 50 },
                { key: "glasses.sun", label: { en: "Sunglasses", ru: "Солнечные", uk: "Сонячні" }, prompt: "wearing sunglasses", tags: [], weight: 50 },
                { key: "glasses.clear", label: { en: "Clear glasses", ru: "Обычные", uk: "Звичайні" }, prompt: "wearing clear glasses", tags: [], weight: 50 }
            ]
        },
        "clothing.outfit": {
            type: "single",
            options: genOptions("outfit", clothings, ["clothing"])
        },
        "pose.base": {
            type: "single",
            options: genOptions("pose", poses, ["pose"])
        },
        "scene.location": {
            type: "single",
            options: genOptions("loc", locations, ["location"])
        },
        "camera.lens": {
            type: "single",
            options: [
                { key: "lens.16mm", label: { en: "16mm", ru: "16мм", uk: "16мм" }, prompt: "shot on 16mm lens, ultra wide angle", weight: 30 },
                { key: "lens.24mm", label: { en: "24mm", ru: "24мм", uk: "24мм" }, prompt: "shot on 24mm lens, wide angle", weight: 30 },
                { key: "lens.35mm", label: { en: "35mm", ru: "35мм", uk: "35мм" }, prompt: "shot on 35mm lens", weight: 30 },
                { key: "lens.50mm", label: { en: "50mm", ru: "50мм", uk: "50мм" }, prompt: "shot on 50mm lens", weight: 30 },
                { key: "lens.85mm", label: { en: "85mm", ru: "85мм", uk: "85мм" }, prompt: "shot on 85mm lens, portrait", weight: 30 },
                { key: "lens.135mm", label: { en: "135mm", ru: "135мм", uk: "135мм" }, prompt: "shot on 135mm lens, compression", weight: 30 },
                { key: "lens.200mm", label: { en: "200mm", ru: "200мм", uk: "200мм" }, prompt: "shot on 200mm lens, telephoto", weight: 30 }
            ]
        },
        "camera.dof": {
            type: "single",
            options: [
                { key: "dof.shallow", label: { en: "Shallow DOF", ru: "Боке", uk: "Боке" }, prompt: "shallow depth of field, creamy bokeh", weight: 70 },
                { key: "dof.deep", label: { en: "Deep DOF", ru: "Всё в фокусе", uk: "Усе в фокусі" }, prompt: "deep depth of field", weight: 30 }
            ]
        },
        "atmosphere.mood": {
            type: "multi", max: 2,
            options: genOptions("mood", atmospheres, ["mood"])
        },
        "lighting.setup": {
            type: "multi", max: 2,
            options: genOptions("light", lightings, ["lighting"])
        },
        "style.base": {
            type: "single",
            options: [
                { key: "style.photoreal", label: { en: "Editorial photoreal", ru: "Фотореал", uk: "Фотореал" }, prompt: "professional editorial photography, photorealistic", weight: 40 },
                { key: "style.cinematic", label: { en: "Cinematic moody", ru: "Кино", uk: "Кіно" }, prompt: "cinematic color grading", weight: 35 },
                { key: "style.polaroid", label: { en: "Polaroid", ru: "Полароид", uk: "Полароїд" }, prompt: "polaroid aesthetic, vintage film", weight: 35 },
                { key: "style.black_and_white", label: { en: "B&W", ru: "ЧБ", uk: "ЧБ" }, prompt: "high contrast black and white photography", weight: 35 }
            ]
        },
        "quality.detail": {
            type: "multi", max: 3,
            options: [
                { key: "q.hdr", label: { en: "HDR", ru: "HDR", uk: "HDR" }, prompt: "high dynamic range", weight: 30 },
                { key: "q.skin", label: { en: "Skin details", ru: "Детали кожи", uk: "Деталі шкіри" }, prompt: "ultra-detailed skin texture", weight: 35 },
                { key: "q.8k", label: { en: "8K", ru: "8K", uk: "8K" }, prompt: "8k ultra sharp", weight: 25 },
                { key: "q.mac", label: { en: "Macro", ru: "Макро", uk: "Макро" }, prompt: "macro photography details", weight: 25 }
            ]
        }
    }
};

fs.writeFileSync(path.join(process.cwd(), 'src/data/options.json'), JSON.stringify(data, null, 2));
console.log("Done");
