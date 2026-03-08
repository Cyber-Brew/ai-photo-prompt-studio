import { create } from 'zustand';
import { BuilderStateData } from '@/types';
import { PackSystem } from '@/core/packs/PackSystem';
import { SceneGenerator } from '@/core/generator/SceneGenerator';
import { PromptEngine } from '@/core/engine/PromptEngine';
import en from '@/i18n/en.json';
import ru from '@/i18n/ru.json';
import uk from '@/i18n/uk.json';

const dictionaries = { en, ru, uk };

interface BuilderStore extends BuilderStateData {
    setOption: (categoryId: string, optionKey: string, multi: boolean, max?: number) => void;
    removeOption: (categoryId: string, optionKey: string) => void;
    setCustomText: (categoryId: string, text: string) => void;
    applyPack: (packId: string) => void;
    generateScene: () => void;
    setTargetEngine: (engine: 'generic' | 'midjourney' | 'sdxl' | 'flux') => void;
    setPromptStyle: (style: 'natural' | 'cinematic' | 'fashion') => void;

    getPrompt: () => string;
}

export const useBuilderStore = create<BuilderStore>((set, get) => ({
    selections: {
        'output.use_reference': ['output.use_reference']
    },
    customText: {},
    activePackId: null,
    targetEngine: 'generic',
    outputSettings: {},
    promptStyle: 'natural',

    setOption: (categoryId, optionKey, multi, max = 1) => set((state) => {
        const current = state.selections[categoryId] || [];
        let newSelections;

        if (multi) {
            if (current.includes(optionKey)) {
                newSelections = current.filter(k => k !== optionKey);
            } else {
                newSelections = [...current, optionKey].slice(-max); // Keep up to max
            }
        } else {
            // Toggle off if clicking the same one, or set it
            newSelections = current.includes(optionKey) ? [] : [optionKey];
        }

        return { selections: { ...state.selections, [categoryId]: newSelections } };
    }),

    removeOption: (categoryId, optionKey) => set((state) => {
        const current = state.selections[categoryId] || [];
        return { selections: { ...state.selections, [categoryId]: current.filter(k => k !== optionKey) } };
    }),

    setCustomText: (categoryId, text) => set((state) => ({
        customText: { ...state.customText, [categoryId]: text }
    })),

    applyPack: (packId) => set((state) => {
        const pack = PackSystem.getPack(packId);
        if (!pack) return state;

        // Apply defaults from pack to current state, overwriting categories that have specified defaults
        const newSelections = { ...state.selections };
        for (const [cat, keys] of Object.entries(pack.defaults)) {
            newSelections[cat] = [...keys];
        }
        return { activePackId: packId, selections: newSelections };
    }),

    generateScene: () => set((state) => {
        const pack = state.activePackId ? PackSystem.getPack(state.activePackId) : PackSystem.getPacks()[0];
        if (!pack) return state;

        const seededSelections = SceneGenerator.generateScene(pack);

        // Preserve essential settings that shouldn't be overwritten blindly by rng
        const finalSelections = { ...seededSelections };
        if (state.selections['output.use_reference']) {
            finalSelections['output.use_reference'] = state.selections['output.use_reference'];
        }
        if (state.selections['output.aspect_ratio']) {
            finalSelections['output.aspect_ratio'] = state.selections['output.aspect_ratio'];
        }

        return { selections: finalSelections };
    }),

    setTargetEngine: (engine) => set({ targetEngine: engine }),

    setPromptStyle: (style) => set({ promptStyle: style }),

    getPrompt: () => {
        return PromptEngine.generate(get());
    }
}));

export interface SavedPrompt {
    id: string;
    createdAt: number;
    parameters: BuilderStateData;
    finalPromptText: string;
    targetEngine: string;
    isFavorite: boolean;
}

interface LibraryStore {
    saved: SavedPrompt[];
    savePrompt: (prompt: SavedPrompt) => void;
    toggleFavorite: (id: string) => void;
    removePrompt: (id: string) => void;
}

export const useLibraryStore = create<LibraryStore>((set) => ({
    saved: [],
    savePrompt: (prompt) => set((state) => ({ saved: [prompt, ...state.saved] })),
    toggleFavorite: (id) => set((state) => ({
        saved: state.saved.map(p => p.id === id ? { ...p, isFavorite: !p.isFavorite } : p)
    })),
    removePrompt: (id) => set((state) => ({ saved: state.saved.filter(p => p.id !== id) }))
}));

interface UiStore {
    language: 'en' | 'ru' | 'uk';
    setLanguage: (lang: 'en' | 'ru' | 'uk') => void;
    t: (key: string, ...args: string[]) => string;
}

export const useUiStore = create<UiStore>((set, get) => ({
    language: 'en',
    setLanguage: (lang) => set({ language: lang }),
    t: (key, ...args) => {
        const lang = get().language;
        const dict = dictionaries[lang] as Record<string, string>;
        let text = dict[key] || (dictionaries.en as Record<string, string>)[key] || key;
        args.forEach(arg => {
            text = text.replace('%s', arg);
        });
        return text;
    }
}));
