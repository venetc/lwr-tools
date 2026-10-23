import type { DecodedLoadout } from '@entities/loadout';
import { defaultShivBuild } from '@entities/shiv/model/build';
import type { BiosoldierBuildData, SoldierClass } from '@entities/soldier';
import { BIOSOLDIER_CLASSES, MEC_CLASSES, OFFICER_RANKS, selectBiosoldierBuildOfficerPerk, selectBiosoldierBuildPerk } from '@entities/soldier';
import { SOLDIER_RANKS } from '@entities/soldier/config/constants/soldier-ranks';
import { defaultBiosoldierBuild, defaultSoldierBuild } from '@entities/soldier/model/build';
import type { BinaryCodeSection } from '@shared/lib/binary-code';
import type { DeepReadonly } from '@shared/lib/object';

const [FIRST_BIOSOLDIER_CLASS] = BIOSOLDIER_CLASSES;

const [FIRST_MEC_CLASS] = MEC_CLASSES;

/**
 * Biosoldier build of the class with the last perk of every rank and the officer perk of the index at every officer rank.
 *
 * @param soldierClass biosoldier class.
 * @param officerPerkIndex index of the officer perk taken at every officer rank.
 */
const officerBuild = (soldierClass: DeepReadonly<SoldierClass>, officerPerkIndex: number): BiosoldierBuildData => {
  const build = defaultBiosoldierBuild(soldierClass);

  SOLDIER_RANKS.slice(1).forEach((rank, index) => selectBiosoldierBuildPerk(build, index + 1, soldierClass.perks[rank.id].at(-1) ?? null));
  OFFICER_RANKS.forEach((officerRank, officerRankIndex) => {
    selectBiosoldierBuildOfficerPerk(build, officerRankIndex, officerRank.perks[officerPerkIndex] ?? null);
  });

  return build;
};

export const OFFICER_BUILD = officerBuild(FIRST_BIOSOLDIER_CLASS, 0);

export const OTHER_OFFICER_BUILD = officerBuild(FIRST_BIOSOLDIER_CLASS, 1);

export const MEC_BUILD = { ...defaultSoldierBuild(FIRST_MEC_CLASS), name: 'Walker' };

export const SHIV_BUILD = defaultShivBuild();

export const SERAPH_LOADOUT: DecodedLoadout = {
  armor: 'seraph-armor',
  primary: 'assault-rifle',
  secondary: 'pistol',
  utility: ['he-grenade', null, 'medikit'],
  modules: [],
};

export const VEST_LOADOUT: DecodedLoadout = {
  armor: 'tactical-vest',
  primary: 'assault-rifle',
  secondary: 'pistol',
  utility: ['medikit'],
  modules: [],
};

export const MEC_LOADOUT: DecodedLoadout = {
  armor: 'lmec3-vindicator',
  primary: 'minigun',
  secondary: null,
  utility: ['heavy-mags'],
  modules: ['flamethrower', null, 'restorative-mist'],
};

export const SHIV_LOADOUT: DecodedLoadout = {
  armor: 'hover-shiv',
  primary: 'autocannon',
  secondary: null,
  utility: [null, 'motion-tracker'],
  modules: [],
};

export const SHIV_UNIT = { kind: 'shiv', build: SHIV_BUILD, loadout: SHIV_LOADOUT } as const;

export const SQUAD_NAME = 'Alpha';

export const SQUAD_FORMAT = 4;

export const SQUAD_NAME_SECTION_ID = 1;

export const UNKNOWN_SECTION_ID = 20;

export const SEPARATOR = '.';

export const INVALID_RESULT = { status: 'invalid' };

/** `NAME` section of the Squad header: name byte length 5 bits, then the UTF-8 bytes. */
export const NAME_SECTION: BinaryCodeSection = {
  id: SQUAD_NAME_SECTION_ID,
  write: writer => writer.writeString(SQUAD_NAME, 5),
};

export const UNKNOWN_SECTION: BinaryCodeSection = { id: UNKNOWN_SECTION_ID, write: writer => writer.writeUint(0b11, 2) };

export const LONG_NAME_SECTION: BinaryCodeSection = {
  id: SQUAD_NAME_SECTION_ID,
  write: (writer) => {
    writer.writeString(SQUAD_NAME, 5);
    writer.writeUint(0, 1);
  },
};
