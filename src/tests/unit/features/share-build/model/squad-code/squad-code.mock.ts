import type { DecodedLoadout } from '@entities/loadout';
import { defaultShivBuild } from '@entities/shiv';
import type { BiosoldierBuildData } from '@entities/soldier';
import { BIOSOLDIER_CLASSES, defaultBiosoldierBuild, defaultSoldierBuild, MEC_CLASSES } from '@entities/soldier';
import type { BinaryCodeSection } from '@shared/lib/binary-code';

const [FIRST_BIOSOLDIER_CLASS] = BIOSOLDIER_CLASSES;

const [FIRST_MEC_CLASS] = MEC_CLASSES;

/** Sniper build with the last perk of every rank and the first officer perk of every officer rank. */
export const OFFICER_BUILD: BiosoldierBuildData = {
  ...defaultBiosoldierBuild(FIRST_BIOSOLDIER_CLASS),
  perks: ['squadsight', 'in-the-zone', 'disabling-shot', 'executioner', 'precision-shot', 'bring-em-on', 'lone-wolf'],
  officerPerks: ['strength-in-numbers', 'cover-tactics', 'show-em-the-ropes', 'clutch-leadership', 'camaraderie'],
};

/** `OFFICER_BUILD` with the second officer perk of every officer rank. */
export const OTHER_OFFICER_BUILD: BiosoldierBuildData = {
  ...OFFICER_BUILD,
  officerPerks: ['stay-frosty', 'cover-tenacity', 'tricks-of-the-trade', 'natural-leadership', 'combined-arms'],
};

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
