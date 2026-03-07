import { PackDef, OptionsData } from '@/types';
import cinematicPortrait from '@/data/packs/cinematic_portrait.json';
import streetPhotography from '@/data/packs/street_photography.json';
import luxuryFashion from '@/data/packs/luxury_fashion.json';

export const availablePacks: PackDef[] = [
    cinematicPortrait as PackDef,
    streetPhotography as PackDef,
    luxuryFashion as PackDef
];

export class PackSystem {
    static getPack(id: string): PackDef | undefined {
        return availablePacks.find(p => p.id === id);
    }

    static getPacks(): PackDef[] {
        return availablePacks;
    }
}
