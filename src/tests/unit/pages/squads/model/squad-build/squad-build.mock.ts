import type { SelectedGeneMods, SelectedOfficerPerks, SelectedPsionicAbilities, SoldierClass } from '@entities/soldier';
import type { SquadBuild } from '@pages/squads/model/squad-build';

/**
 * Class with only the fields the Squad planner reads.
 *
 * @param id class id.
 * @param name class name.
 */
const soldierClassMock = (id: SoldierClass['id'], name: string) => ({ id, name } as SoldierClass);

/**
 * Biosoldier build of the Sniper class.
 *
 * @param build fields that differ from a build without gene mods, psionic abilities and officer perks.
 * @param build.geneMods gene mods by body part.
 * @param build.psionicAbilities psionic abilities by psi level.
 * @param build.officerPerks officer perks by officer rank.
 */
export const createBiosoldierBuildMock = (
  build: { geneMods?: SelectedGeneMods, psionicAbilities?: SelectedPsionicAbilities, officerPerks?: SelectedOfficerPerks } = {},
): SquadBuild => ({
  kind: 'biosoldier',
  build: {
    id: 'sniper-build',
    name: 'Overwatch Sniper',
    readonly: false,
    soldierClass: soldierClassMock('sniper', 'Sniper'),
    perks: [],
    geneMods: build.geneMods ?? [null, null, null, null, null],
    psionicAbilities: build.psionicAbilities ?? [],
    officerPerks: build.officerPerks ?? [],
  },
});

export const MEC_BUILD: SquadBuild = {
  kind: 'mec',
  build: { id: 'mec-build', name: 'Goliath Wall', readonly: false, soldierClass: soldierClassMock('goliath', 'Goliath'), perks: [] },
};

export const SHIV_BUILD: SquadBuild = {
  kind: 'shiv',
  build: { id: 'shiv-build', name: 'Alloy Support', readonly: false, perks: [] },
};

export const GENE_MODS: SelectedGeneMods = [null, 'ram', null, null, null];

export const PSIONIC_ABILITIES: SelectedPsionicAbilities = ['mind-fray'];

export const OFFICER_PERKS: SelectedOfficerPerks = ['stay-frosty'];

export const SNIPER_WEARER = { unit: 'biosoldier', classId: 'sniper', hasGeneMod: false, hasPsionicAbility: false, isOfficer: false };

export const MEC_WEARER = { unit: 'mec', classId: 'goliath', hasGeneMod: false, hasPsionicAbility: false, isOfficer: false };

export const SHIV_WEARER = { unit: 'shiv', classId: null, hasGeneMod: false, hasPsionicAbility: false, isOfficer: false };
