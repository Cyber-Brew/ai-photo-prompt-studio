export type Locale = 'en' | 'ru' | 'uk';

export interface LocalizedString {
  en: string;
  ru: string;
  uk: string;
}

export interface OptionDef {
  key: string;
  prompt: string;
  tags?: string[];
  weight: number;
  conflicts?: string[];
  requires?: string[];
}

export interface CategoryDef {
  type: 'single' | 'multi';
  max?: number;
  options: OptionDef[];
}

export interface OptionsData {
  version: string;
  categories: Record<string, CategoryDef>;
}

export interface SchemaSection {
  id: string;
  categories: string[];
}

export interface SchemaData {
  version: string;
  promptOrder: string[];
  uiSections: SchemaSection[];
}

export interface PackDef {
  id: string;
  name: LocalizedString;
  description: LocalizedString;
  cover?: string;
  defaults: Record<string, string[]>;
  pools: Record<string, string[]>;
  generator: {
    picks: Record<string, { min: number; max: number }>;
    seedStrategy: string;
  };
  rules: {
    forbidCombos: string[][];
    require: Array<{ if: string; thenAny: string[] }>;
  };
}

export interface BuilderStateData {
  selections: Record<string, string[]>; // categoryId -> array of option keys
  customText: Record<string, string>;   // categoryId -> custom text overrides
  activePackId: string | null;
  targetEngine: 'generic' | 'midjourney' | 'sdxl' | 'flux';
  outputSettings: Record<string, any>;
  promptStyle: 'natural' | 'cinematic' | 'fashion';
}
