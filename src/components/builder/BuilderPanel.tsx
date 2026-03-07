'use client';

import { useBuilderStore, useUiStore } from '@/store';
import schemaDataJson from '@/data/schema.json';
import optionsDataJson from '@/data/options.json';
import { SchemaData, OptionsData } from '@/types';
import { clsx } from 'clsx';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { useState } from 'react';

const schemaData = schemaDataJson as SchemaData;
const optionsData = optionsDataJson as OptionsData;

export default function BuilderPanel() {
    const { t } = useUiStore();

    return (
        <div className="h-[calc(100vh-73px)] overflow-y-auto p-6 bg-gray-50/50">
            <div className="max-w-2xl mx-auto space-y-6 pb-20">
                <div className="mb-8">
                    <h2 className="text-2xl font-semibold mb-1">{t('ui.builder')}</h2>
                    <p className="text-gray-500 text-sm">{t('ui.subtitle')}</p>
                </div>

                {schemaData.uiSections.map((section) => (
                    <SectionBlock key={section.id} section={section} />
                ))}
            </div>
        </div>
    );
}

function SectionBlock({ section }: { section: SchemaData['uiSections'][0] }) {
    const [isOpen, setIsOpen] = useState(true);
    const { t } = useUiStore();

    return (
        <div className="bg-white border rounded-xl shadow-sm overflow-hidden">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex items-center justify-between p-4 bg-white hover:bg-gray-50 transition-colors"
            >
                <h3 className="font-medium text-gray-900 capitalize">{t(`section.${section.id}`)}</h3>
                {isOpen ? <ChevronDown size={18} className="text-gray-400" /> : <ChevronRight size={18} className="text-gray-400" />}
            </button>

            {isOpen && (
                <div className="p-4 pt-0 border-t border-gray-100 bg-gray-50/30 space-y-4">
                    <div className="pt-4">
                        {section.categories.map(categoryId => (
                            <CategoryBlock key={categoryId} categoryId={categoryId} />
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}

function CategoryBlock({ categoryId }: { categoryId: string }) {
    const { t } = useUiStore();
    const { selections, setOption, customText, setCustomText } = useBuilderStore();
    const categoryDef = optionsData.categories[categoryId];

    if (!categoryDef) return null;

    const currentSelections = selections[categoryId] || [];
    const currentCustomText = customText[categoryId] || '';
    const isMulti = categoryDef.type === 'multi';

    const displayTitle = t(`param.${categoryId}`);

    const allowCustomInput = ['scene.location', 'pose.direction', 'pose.expression', 'pose.body', 'clothing.outfit', 'camera.lens', 'lighting.setup'].includes(categoryId);

    return (
        <div className="mb-6 last:mb-0">
            <div className="flex justify-between items-center mb-2">
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">{displayTitle}</label>
                {isMulti && categoryDef.max && (
                    <span className="text-xs text-gray-400">Up to {categoryDef.max}</span>
                )}
            </div>

            <div className="flex flex-wrap gap-2 mb-3">
                {categoryDef.options.map((opt) => {
                    const isSelected = currentSelections.includes(opt.key);
                    return (
                        <button
                            key={opt.key}
                            onClick={() => setOption(categoryId, opt.key, isMulti, categoryDef.max)}
                            className={clsx(
                                "px-3 py-1.5 text-sm rounded-md border transition-all duration-200 font-medium",
                                isSelected
                                    ? "bg-black border-black text-white shadow-sm"
                                    : "bg-white border-gray-200 text-gray-700 hover:border-gray-300 hover:bg-gray-50"
                            )}
                        >
                            {opt.key === 'output.use_reference' ? t('ui.use_reference_button') : t(opt.key)}
                        </button>
                    );
                })}
            </div>

            {allowCustomInput && (
                <input
                    type="text"
                    placeholder={t('ui.custom.placeholder', displayTitle)}
                    value={currentCustomText}
                    onChange={(e) => setCustomText(categoryId, e.target.value)}
                    className="w-full text-sm bg-white border border-gray-200 rounded-md px-3 py-2 outline-none focus:ring-1 focus:ring-black placeholder:text-gray-400"
                />
            )}
        </div>
    );
}
