import type { DecodedLoadout } from '@entities/loadout';
import { defaultShivBuild } from '@entities/shiv/model/build';
import { BIOSOLDIER_CLASSES, MEC_CLASSES } from '@entities/soldier';
import { defaultBiosoldierBuild, defaultSoldierBuild } from '@entities/soldier/model/build';
import type { BinaryCodeSection } from '@shared/lib/binary-code';

const [FIRST_BIOSOLDIER_CLASS] = BIOSOLDIER_CLASSES;

const [FIRST_MEC_CLASS] = MEC_CLASSES;

export const BIOSOLDIER_BUILD = { ...defaultBiosoldierBuild(FIRST_BIOSOLDIER_CLASS), name: 'Overwatch' };

export const MEC_BUILD = { ...defaultSoldierBuild(FIRST_MEC_CLASS), name: 'Walker' };

export const SHIV_BUILD = defaultShivBuild();

export const SERAPH_LOADOUT: DecodedLoadout = {
  armor: 'seraph-armor',
  primary: 'assault-rifle',
  secondary: 'pistol',
  utility: ['he-grenade', null, 'medikit'],
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

export const SQUAD_NAME = 'Alpha';

export const UNKNOWN_FORMAT = 5;

export const SEPARATOR = '.';

export const INVALID_RESULT = { status: 'invalid' };

export const GARBAGE_CODE = 'not a code';

export const UNKNOWN_SECTION: BinaryCodeSection = { id: 20, write: writer => writer.writeUint(0b11, 2) };
