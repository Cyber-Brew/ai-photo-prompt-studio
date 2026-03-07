'use client';

import { useUiStore, useBuilderStore } from '@/store';
import { PackSystem } from '@/core/packs/PackSystem';
import { Camera, Beaker, Languages } from 'lucide-react';

export default function Header() {
    const { language, setLanguage, t } = useUiStore();
    const { activePackId, applyPack } = useBuilderStore();
    const packs = PackSystem.getPacks();

    return (
        <header className="border-b bg-white px-4 py-3 md:px-6 md:py-4 flex flex-wrap items-center justify-between gap-4 sticky top-0 z-10">
            <div className="flex items-center gap-2">
                <div className="bg-black text-white p-2 rounded-lg">
                    <Camera size={20} />
                </div>
                <h1 className="text-xl font-bold tracking-tight">{t('ui.title')}</h1>
            </div>

            <div className="flex flex-wrap items-center gap-3 md:gap-6">
                {/* Pack Selector */}
                <div className="flex items-center gap-2">
                    <Beaker size={16} className="text-gray-500 shrink-0" />
                    <select
                        className="text-sm font-medium bg-gray-50 border border-gray-200 rounded-md px-3 py-1.5 outline-none focus:ring-2 focus:ring-black max-w-[140px] sm:max-w-xs"
                        value={activePackId || ''}
                        onChange={(e) => applyPack(e.target.value)}
                    >
                        <option value="" disabled>{t('ui.pack.select')}</option>
                        {packs.map(p => (
                            <option key={p.id} value={p.id}>{t(p.id)}</option>
                        ))}
                    </select>
                </div>

                {/* Language Switcher */}
                <div className="flex items-center gap-2">
                    <Languages size={16} className="text-gray-500 shrink-0" />
                    <div className="flex bg-gray-100 p-1 rounded-md text-sm overflow-x-auto">
                        {(['en', 'ru', 'uk'] as const).map(lang => (
                            <button
                                key={lang}
                                onClick={() => setLanguage(lang)}
                                className={`px-3 py-1 rounded-sm transition-colors ${language === lang ? 'bg-white font-medium shadow-sm' : 'text-gray-500 hover:text-black'}`}
                            >
                                {lang.toUpperCase()}
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </header>
    );
}
