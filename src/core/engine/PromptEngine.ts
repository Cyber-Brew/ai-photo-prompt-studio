// Simple fixed PromptEngine implementation with the options index

import { BuilderStateData, OptionsData, SchemaData } from '@/types';
import optionsDataJson from '@/data/options.json';
import schemaDataJson from '@/data/schema.json';

const optionsData = optionsDataJson as OptionsData;
const schemaData = schemaDataJson as SchemaData;

// Create a flat map of optionKey -> OptionDef for quick lookups
export const optionIndex = new Map(
    Object.values(optionsData.categories).flatMap(cat =>
        cat.options.map(opt => [opt.key, opt] as const)
    )
);

export class PromptEngine {
    static generate(state: BuilderStateData): string {
        const finalPromptBlocks: string[] = [];

        // 1. Reference Block
        const useReference = state.selections['output.use_reference']?.includes('output.use_reference');
        if (useReference) {
            finalPromptBlocks.push("Use the uploaded reference photos of the person as a face reference.\nKeep the same person, same facial structure, same identity.");
        }

        // 2. Style Block
        if (state.promptStyle === 'cinematic') {
            finalPromptBlocks.push("cinematic color grading, dramatic atmosphere, cinematic photography");
        } else if (state.promptStyle === 'fashion') {
            finalPromptBlocks.push("high-end editorial photography, fashion magazine aesthetic, polished professional look");
        } else {
            // default natural
            finalPromptBlocks.push("realistic photography, natural lighting, lifelike appearance");
        }

        const currentCategoryPrompts: string[] = [];
        const usedKeys = new Set<string>();
        let aspectRatioBlock = "";

        // 3. Scene Description Block (Iterate in defined schema order)
        for (const categoryId of schemaData.promptOrder) {
            const selectedKeys = state.selections[categoryId] || [];
            const customText = state.customText[categoryId];
            const categoryDef = optionsData.categories[categoryId];

            if (!categoryDef) continue;

            // Handle custom text
            if (customText && customText.trim() !== '') {
                // Special rule: extract custom aspect ratio, ensure it has "aspect ratio"
                if (categoryId === 'output.aspect_ratio') {
                    if (!customText.toLowerCase().includes('aspect ratio')) {
                        aspectRatioBlock = `${customText.trim()} aspect ratio`;
                    } else {
                        aspectRatioBlock = customText.trim();
                    }
                    continue; // Skip adding to main visual prompt flow
                } else {
                    currentCategoryPrompts.push(customText.trim());
                }
            }

            // Add proper options
            for (const key of selectedKeys) {
                if (usedKeys.has(key)) continue;

                // Special handling for predefined aspect ratios
                if (categoryId === 'output.aspect_ratio') {
                    const aspectStr = key.replace('output.aspect.', '').replace('_', ':');
                    let aspectLabel = aspectStr;
                    if (aspectStr === '4:5' || aspectStr === '3:4' || aspectStr === '2:3') aspectLabel = `vertical ${aspectStr}`;
                    else if (aspectStr === '16:9') aspectLabel = '16:9 cinematic';
                    else if (aspectStr === '9:16') aspectLabel = 'vertical 9:16';
                    else if (aspectStr === '1:1') aspectLabel = '1:1 square';

                    aspectRatioBlock = `${aspectLabel} aspect ratio`.replace(' cinematic aspect ratio', ' aspect ratio').replace(' square aspect ratio', ' aspect ratio').replace(' vertical 9:16', 'vertical 9:16');

                    if (key === 'output.aspect.4_5') aspectRatioBlock = 'vertical 4:5 aspect ratio';
                    if (key === 'output.aspect.1_1') aspectRatioBlock = '1:1 aspect ratio';
                    if (key === 'output.aspect.16_9') aspectRatioBlock = '16:9 aspect ratio';

                    usedKeys.add(key);
                    continue;
                }

                const option = optionIndex.get(key);
                if (!option) continue;

                // Check conflicts implicitly
                let hasConflict = false;
                if (option.conflicts) {
                    for (const conflictKey of option.conflicts) {
                        if (usedKeys.has(conflictKey)) {
                            hasConflict = true;
                            break;
                        }
                    }
                }

                if (!hasConflict && option.prompt && option.prompt !== 'RESERVED_FOR_ENGINE') {
                    currentCategoryPrompts.push(option.prompt.trim());
                    usedKeys.add(key);
                }
            }
        }

        // Deduplicate fragments to ensure no repeated words blindly
        const uniqueFragments = Array.from(new Set(currentCategoryPrompts));

        if (uniqueFragments.length > 0) {
            finalPromptBlocks.push(uniqueFragments.join(', '));
        }

        // 4. Realism / Quality Block
        if (state.promptStyle === 'cinematic') {
            finalPromptBlocks.push("natural skin texture, realistic facial proportions, cinematic photography, high detail");
        } else if (state.promptStyle === 'fashion') {
            finalPromptBlocks.push("natural skin texture, realistic facial proportions, editorial photography, refined styling, high detail");
        } else {
            finalPromptBlocks.push("natural skin texture, realistic facial proportions, lifelike details, professional photography");
        }

        // Append output settings if relevant
        const outputSettingsFlags = [];
        if (state.outputSettings) {
            if (state.outputSettings.rawMode) outputSettingsFlags.push('--style raw');
            if (state.outputSettings.quality) {
                if (state.outputSettings.quality === '2') outputSettingsFlags.push('--q 2');
                if (state.outputSettings.quality === '0.5') outputSettingsFlags.push('--q .5');
            }
        }
        if (outputSettingsFlags.length > 0) {
            // Typically flags go at the very end
            if (aspectRatioBlock) {
                aspectRatioBlock += " " + outputSettingsFlags.join(' ');
            } else {
                aspectRatioBlock = outputSettingsFlags.join(' ');
            }
        }

        // 5. Aspect Ratio Block
        if (aspectRatioBlock) {
            finalPromptBlocks.push(aspectRatioBlock);
        }

        // Filter out empties and join blocks with a double line break
        return finalPromptBlocks.filter(Boolean).join('\n\n');
    }
}
