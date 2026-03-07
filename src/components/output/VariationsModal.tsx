'use client';

import { useUiStore, useBuilderStore } from '@/store';
import { Copy, Check, Save } from 'lucide-react';
import { useState } from 'react';
import { PromptEngine } from '@/core/engine/PromptEngine';
import { SceneGenerator } from '@/core/generator/SceneGenerator';
import { PackSystem } from '@/core/packs/PackSystem';
import { BuilderStateData } from '@/types';

interface VariationsModalProps {
    onClose: () => void;
}

export default function VariationsModal({ onClose }: VariationsModalProps) {
    const { t } = useUiStore();
    const generateScene = useBuilderStore(s => s.generateScene);
    const activePackId = useBuilderStore(s => s.activePackId);
    const baseState = useBuilderStore(s => s) as unknown as BuilderStateData;
    const setOption = useBuilderStore(s => s.setOption);
    const applyPack = useBuilderStore(s => s.applyPack);
    const setPromptStyle = useBuilderStore(s => s.setPromptStyle);

    // Generate 10 variations
    const [variations, setVariations] = useState<Array<{ state: BuilderStateData; text: string }>>(() => {
        const results = [];
        const pack = activePackId ? PackSystem.getPack(activePackId) : PackSystem.getPacks()[0];
        if (!pack) return [];

        for (let i = 0; i < 10; i++) {
            // Deep merge base state with randomly seeded selections
            const randomSelections = SceneGenerator.generateScene(pack, Date.now() + i * 100);

            // Force a new state composition
            const variationState: BuilderStateData = {
                ...baseState,
                selections: {
                    ...baseState.selections,
                    ...randomSelections // Adds variation
                }
            };
            results.push({
                state: variationState,
                text: PromptEngine.generate(variationState)
            });
        }
        return results;
    });

    const handleApply = (variationState: BuilderStateData) => {
        // A bit hacky but works for the MVP: iterate state and set Option (could just overwrite zustand directly if we exposed it)
        if (variationState.activePackId) {
            applyPack(variationState.activePackId);
        }
        if (variationState.promptStyle) {
            setPromptStyle(variationState.promptStyle);
        }
        for (const [cat, keys] of Object.entries(variationState.selections)) {
            if (!keys) continue;
            keys.forEach(k => setOption(cat, k, true, 3));
        }
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl">
                <div className="p-6 border-b flex justify-between items-center">
                    <h2 className="text-xl font-bold">{t('variations.title')}</h2>
                    <button onClick={onClose} className="text-gray-500 hover:text-black font-medium">Close</button>
                </div>
                <div className="p-6 overflow-y-auto flex-1 space-y-4 bg-gray-50">
                    {variations.map((v, i) => (
                        <VariationCard key={i} item={v} onApply={() => handleApply(v.state)} t={t} />
                    ))}
                </div>
            </div>
        </div>
    );
}

function VariationCard({ item, onApply, t }: { item: any, onApply: () => void, t: any }) {
    const [copied, setCopied] = useState(false);

    const copy = () => {
        navigator.clipboard.writeText(item.text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="bg-white border rounded-xl p-4 shadow-sm flex flex-col gap-3">
            <p className="font-mono text-sm text-gray-800 leading-relaxed whitespace-pre-wrap">{item.text}</p>
            <div className="flex gap-2 justify-end">
                <button onClick={copy} className="px-3 py-1.5 rounded-lg border text-sm font-medium hover:bg-gray-50 flex items-center gap-2">
                    {copied ? <Check size={14} /> : <Copy size={14} />} {t('btn.copy')}
                </button>
                <button onClick={onApply} className="px-3 py-1.5 rounded-lg bg-black text-white text-sm font-medium hover:bg-gray-800">
                    {t('btn.apply')}
                </button>
            </div>
        </div>
    );
}
