import type { SoldierClass } from '@entities/soldier';
import type { SquadBuild } from '@pages/squads/model/squad-build';

/**
 * Class with only the fields the Squad planner reads.
 *
 * @param id class id.
 * @param name class name.
 */
const soldierClassMock = (id: string, name: string) => ({ id, name } as SoldierClass);

export const SNIPER_SQUAD_BUILD: SquadBuild = {
  kind: 'biosoldier',
  build: {
    id: 'sniper-build',
    name: 'Overwatch Sniper',
    readonly: false,
    outdated: null,
    soldierClass: soldierClassMock('sniper', 'Sniper'),
    perks: [],
    signatureSkill: null,
    geneMods: [],
    psionicAbilities: [],
    officerPerks: [],
  },
};

export const GOLIATH_SQUAD_BUILD: SquadBuild = {
  kind: 'mec',
  build: { id: 'mec-build', name: 'Goliath Wall', readonly: false, outdated: null, soldierClass: soldierClassMock('goliath', 'Goliath'), perks: [], signatureSkill: null },
};

export const SHIV_SQUAD_BUILD: SquadBuild = {
  kind: 'shiv',
  build: { id: 'shiv-build', name: 'Alloy Support', readonly: false, outdated: null, perks: [] },
};
