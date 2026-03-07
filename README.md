# AI Photo Prompt Studio

A modular prompt builder application for AI image generation systems (Midjourney, SDXL, Flux) with dynamic scene pack support and localized UI.

## Getting Started

1. Set up the dependencies:
   ```bash
   npm install
   ```

2. Run the development server:
   ```bash
   npm run dev
   ```

3. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Architecture & Modules

- **React & Next.js App Router**: Client-first interactivity.
- **Zustand (`src/store/`)**: Two main stores: `BuilderStore` for active options & target engines, `LibraryStore` for saving prompts.
- **PromptEngine (`src/core/engine/`)**: Compiles schema rules and active constraints into a conflict-free prompt string.
- **SceneGenerator (`src/core/generator/`)**: Seed-based stable random generator reading from pack pools.
- **Data Definition (`src/data/`)**: Base category definitions (`options.json`) and pack templates.

## How To Add a New Scene Pack

1. Navigate to the `src/data/packs` directory.
2. Create a new `.json` file representing your scene, for example: `neon_nights.json`.
3. Follow the standard Pack structure, defining labels and rules:

```json
{
  "id": "pack.neon_nights",
  "name": { "en": "Neon Nights", "ru": "Неоновые ночи", "uk": "Неонові ночі" },
  "description": { "en": "Aggressive cyberpunk styling", "ru": "...", "uk": "..." },
  "defaults": {
     "atmosphere.mood": ["mood.cyberpunk"],
     "lighting.setup": ["light.neon.split"]
  },
  "pools": {
     "scene.location": ["loc.street.night"],
     "clothing.outfit": ["outfit.leather.jacket", "outfit.streetwear"]
  },
  "generator": {
    "picks": {
       "clothing.outfit": { "min": 1, "max": 1 }
    },
    "seedStrategy": "stable"
  },
  "rules": {
    "forbidCombos": [], "require": []
  }
}
```

4. Open `src/core/packs/PackSystem.ts`.
5. Import your new pack:
   ```typescript
   import neonNights from '@/data/packs/neon_nights.json';
   ```
6. Add it to the `availablePacks` array:
   ```typescript
   export const availablePacks: PackDef[] = [
      ...
      neonNights as PackDef
   ];
   ```
That's it! The application will automatically pick it up, load its UI localizations, apply constraints, and permit the user to randomly generate scenes using the new pools.

### Localizing New Options

If you define a new parameter Key string (e.g. `"clothing.cyberpunk"`), the UI will attempt to look it up in the localization dictionary using `t('clothing.cyberpunk')`.

To add new dictionary labels:
1. Open `src/i18n/en.json`, `ru.json`, and `uk.json`.
2. Map your new Option Key directly in the flat structure:
```json
// en.json
{
   "clothing.cyberpunk": "Cyberpunk Neon Outfit"
}
```
3. Do the same for other languages. The UI will automatically pull the translated labels wherever that Option Key appears in the Builder section!

## Target Audience

For photographers, prompt engineers, and hobbyists requesting structurally sound prompts for detailed 8K photoreal imagery.
