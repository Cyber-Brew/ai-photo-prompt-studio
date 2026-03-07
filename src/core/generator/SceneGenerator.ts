import { BuilderStateData, PackDef } from '@/types';
import optionsDataJson from '@/data/options.json';
import schemaDataJson from '@/data/schema.json';

const optionsData = optionsDataJson as any;
const schemaData = schemaDataJson as any;

export class SceneGenerator {
    // Simple seeded random to keep it "stable"
    private static random(seed: number) {
        let x = Math.sin(seed++) * 10000;
        return x - Math.floor(x);
    }

    static generateScene(pack: PackDef, seed: number = Date.now()): Record<string, string[]> {
        const selections: { [key: string]: string[] } = {};
        const usedOptions = new Set<string>();

        // Initial assignment from defaults
        for (const [cat, keys] of Object.entries(pack.defaults)) {
            selections[cat] = [...keys];
            keys.forEach(k => usedOptions.add(k));
        }

        // Generate random picks based on pools and generator picks
        let currentSeed = seed;

        for (const [cat, pickSpec] of Object.entries(pack.generator.picks)) {
            const min = pickSpec.min || 0;
            const max = pickSpec.max || 1;

            const categoryOptions = pack.pools[cat] || [];
            if (categoryOptions.length === 0) continue;

            // Determine how many to pick
            const pickCount = Math.floor(this.random(currentSeed++) * (max - min + 1)) + min;
            if (pickCount === 0) continue;

            const selectedForCat: string[] = [];
            const shuffled = [...categoryOptions].sort(() => 0.5 - this.random(currentSeed++));

            for (const optKey of shuffled) {
                if (selectedForCat.length >= pickCount) break;

                // Find option def to check weights and conflicts
                let optDef: any = null;
                const catDef = optionsData.categories[cat];
                if (catDef) {
                    optDef = catDef.options.find((o: any) => o.key === optKey);
                }

                if (!optDef) continue;

                // Check if conflicts with anything already selected in ANY category
                let hasConflict = false;
                if (optDef.conflicts) {
                    for (const c of optDef.conflicts) {
                        if (usedOptions.has(c)) {
                            hasConflict = true;
                            break;
                        }
                    }
                }

                // Check pack rules forbidCombos
                for (const forbid of pack.rules.forbidCombos) {
                    if (forbid.includes(optKey)) {
                        const other = forbid.find(k => k !== optKey);
                        if (other && usedOptions.has(other)) {
                            hasConflict = true;
                            break;
                        }
                    }
                }

                if (!hasConflict) {
                    selectedForCat.push(optKey);
                    usedOptions.add(optKey);
                }
            }

            if (selectedForCat.length > 0) {
                // Overwrite defaults if we picked something, or merge? Let's overwrite for this category to ensure variety.
                selections[cat] = selectedForCat;
            }
        }

        return selections;
    }
}
