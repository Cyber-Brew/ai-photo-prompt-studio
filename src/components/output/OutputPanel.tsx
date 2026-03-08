'use client';

import { useBuilderStore, useUiStore } from '@/store';
import { Copy, Save, Wand2, RefreshCcw } from 'lucide-react';
import { useEffect, useState } from 'react';
import VariationsModal from './VariationsModal';

export default function OutputPanel() {
    const { t } = useUiStore();
    const prompt = useBuilderStore(s => s.getPrompt());
    const generateScene = useBuilderStore(s => s.generateScene);
    const promptStyle = useBuilderStore(s => s.promptStyle);
    const setPromptStyle = useBuilderStore(s => s.setPromptStyle);

    const [copyStatus, setCopyStatus] = useState<'idle' | 'success' | 'fail'>('idle');
    const [showVariations, setShowVariations] = useState(false);

    const showStatus = (status: 'success' | 'fail') => {
        setCopyStatus(status);
        setTimeout(() => setCopyStatus('idle'), 2000);
    };

    const handleCopy = async () => {
        // 1. Try modern clipboard API
        try {
            if (navigator?.clipboard?.writeText) {
                await navigator.clipboard.writeText(prompt);
                showStatus('success');
                return;
            }
        } catch (err) {
            console.error('Clipboard API failed', err);
        }

        // 2. Fallback for mobile/older browsers
        try {
            const textArea = document.createElement('textarea');
            textArea.value = prompt;

            // Prevent scrolling to bottom
            textArea.style.top = '0';
            textArea.style.left = '0';
            textArea.style.position = 'fixed';

            document.body.appendChild(textArea);
            textArea.focus();
            textArea.select();

            const successful = document.execCommand('copy');
            document.body.removeChild(textArea);

            if (successful) {
                showStatus('success');
            } else {
                showStatus('fail');
            }
        } catch (fallbackErr) {
            console.error('Fallback copy failed', fallbackErr);
            showStatus('fail');
        }
    };

    // Auto-generate a scene on first load if empty
    useEffect(() => {
        if (prompt.trim() === '') {
            generateScene();
        }
    }, []);

    return (
        <div className="h-[calc(100vh-73px)] border-l bg-white flex flex-col pt-6">
            <div className="px-6 flex-1 flex flex-col">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-semibold">{t('ui.generated.title')}</h2>
                </div>

                <div className="w-full flex bg-gray-100 p-1 rounded-xl mb-4">
                    {(['natural', 'cinematic', 'fashion'] as const).map(style => (
                        <button
                            key={style}
                            onClick={() => setPromptStyle(style)}
                            className={`flex-1 py-1.5 text-sm font-medium rounded-lg transition-all ${promptStyle === style ? 'bg-white shadow-sm text-black' : 'text-gray-500 hover:text-gray-700'}`}
                        >
                            {t(`style.mode.${style}`)}
                        </button>
                    ))}
                </div>

                <div className="relative flex-1 bg-gray-50 border rounded-xl p-4 mb-6 shadow-inner group">
                    <textarea
                        readOnly
                        value={prompt}
                        className="w-full h-full bg-transparent resize-none outline-none text-gray-800 leading-relaxed font-mono text-sm whitespace-pre-wrap"
                        placeholder={t('ui.placeholder')}
                    />

                    <button
                        onClick={handleCopy}
                        className="absolute top-4 right-4 bg-white border shadow-sm p-2 rounded-lg text-gray-600 hover:text-black hover:border-gray-300 transition-all focus:ring-2 focus:ring-black"
                        title="Copy to clipboard"
                    >
                        <Copy size={16} />
                        {copyStatus === 'success' && <span className="absolute -top-8 right-0 bg-black text-white text-xs px-2 py-1 rounded">{t('ui.copied')}</span>}
                        {copyStatus === 'fail' && <span className="absolute -top-8 right-0 bg-red-500 text-white text-xs px-2 py-1 rounded whitespace-nowrap">{t('ui.copy_failed')}</span>}
                    </button>
                </div>

                <div className="pb-6 space-y-3">
                    <button
                        onClick={generateScene}
                        className="w-full py-3 px-4 bg-black text-white rounded-xl font-medium flex items-center justify-center gap-2 hover:bg-gray-800 transition-colors shadow-sm active:scale-[0.98]"
                    >
                        <Wand2 size={18} />
                        {t('ui.generate.scene')}
                    </button>

                    <div className="grid grid-cols-1 gap-3">
                        <button onClick={() => setShowVariations(true)} className="py-2.5 px-4 bg-white border rounded-xl font-medium text-sm flex items-center justify-center gap-2 hover:bg-gray-50 transition-colors">
                            <RefreshCcw size={16} />
                            {t('ui.variations')}
                        </button>
                    </div>
                </div>
            </div>
            {showVariations && <VariationsModal onClose={() => setShowVariations(false)} />}
        </div>
    );
}
