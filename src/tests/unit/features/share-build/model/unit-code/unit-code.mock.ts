import type { DecodedLoadout } from '@entities/loadout';
import { defaultShivBuild } from '@entities/shiv/model/build';
import type { BiosoldierBuildData, SoldierClass } from '@entities/soldier';
import {
  BIOSOLDIER_CLASSES,
  biosoldierBuildCodes,
  MEC_CLASSES,
  OFFICER_RANKS,
  selectBiosoldierBuildOfficerPerk,
  selectSoldierBuildPerk,
} from '@entities/soldier';
import { SOLDIER_RANKS } from '@entities/soldier/config/constants/soldier-ranks';
import { defaultBiosoldierBuild, defaultSoldierBuild } from '@entities/soldier/model/build';
import type { BinaryCodeSection, BitWriter } from '@shared/lib/binary-code';
import type { DeepReadonly } from '@shared/lib/object';

const [FIRST_BIOSOLDIER_CLASS] = BIOSOLDIER_CLASSES;

const [FIRST_MEC_CLASS] = MEC_CLASSES;

/**
 * Biosoldier build of the class with the last perk of every rank, selected with the mutators.
 *
 * @param soldierClass biosoldier class.
 */
const fullTreeBiosoldierBuild = (soldierClass: DeepReadonly<SoldierClass>): BiosoldierBuildData => {
  const build = defaultBiosoldierBuild(soldierClass);

  SOLDIER_RANKS.slice(1).forEach((rank, index) => selectSoldierBuildPerk(build, index + 1, soldierClass.perks[rank.id].at(-1) ?? null));

  return build;
};

/**
 * Biosoldier build with a full class tree and the first officer perk of every officer rank.
 */
const createOfficerBuild = () => {
  const build = fullTreeBiosoldierBuild(FIRST_BIOSOLDIER_CLASS);

  OFFICER_RANKS.forEach((officerRank, officerRankIndex) => selectBiosoldierBuildOfficerPerk(build, officerRankIndex, officerRank.perks[0] ?? null));

  return build;
};

export const OFFICER_BUILD = createOfficerBuild();

export const PLAIN_BIOSOLDIER_BUILD = defaultBiosoldierBuild(FIRST_BIOSOLDIER_CLASS);

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

export const BIOSOLDIER_FORMAT = 1;

export const UNKNOWN_FORMAT = 5;

export const SOLDIER_PERKS_SECTION_ID = 1;

export const SOLDIER_LOADOUT_SECTION_ID = 6;

export const UNKNOWN_SECTION_ID = 20;

export const UNKNOWN_ITEM_CODE = 200;

export const INVALID_RESULT = { status: 'invalid' };

export const GARBAGE_CODE = 'not a code';

/** `SERAPH_LOADOUT` as catalog codes: Seraph Armor, Assault Rifle, Pistol, HE Grenade, an empty slot and Medikit. */
const SERAPH_LOADOUT_CODES = { armor: 10, primary: 1, secondary: 13, utility: [1, 0, 11], modules: [] };

/**
 * `LOADOUT` section with raw numbers: armor, primary and secondary 8 bits each, utility count 3 bits, Module count
 * 2 bits, item codes 8 bits each.
 *
 * @param codes item codes, 0 for an empty slot.
 * @param codes.armor armor code.
 * @param codes.primary primary weapon code.
 * @param codes.secondary secondary weapon code.
 * @param codes.utility utility item codes.
 * @param codes.modules Module codes.
 * @param extraBits number of zero bits written after the fields.
 */
export const loadoutSection = (
  codes: { armor: number, primary: number, secondary: number, utility: number[], modules: number[] },
  extraBits = 0,
): BinaryCodeSection => ({
  id: SOLDIER_LOADOUT_SECTION_ID,
  write: (writer: BitWriter) => {
    writer.writeUint(codes.armor, 8);
    writer.writeUint(codes.primary, 8);
    writer.writeUint(codes.secondary, 8);
    writer.writeUint(codes.utility.length, 3);
    codes.utility.forEach(code => writer.writeUint(code, 8));
    writer.writeUint(codes.modules.length, 2);
    codes.modules.forEach(code => writer.writeUint(code, 8));
    writer.writeUint(0, extraBits);
  },
});

export const SERAPH_LOADOUT_SECTION = loadoutSection(SERAPH_LOADOUT_CODES);

/** Codes of `PLAIN_BIOSOLDIER_BUILD`: its class and base perk, no name of its own and no other parts. */
const PLAIN_BUILD_CODES = biosoldierBuildCodes(PLAIN_BIOSOLDIER_BUILD);

/**
 * `PERKS` section of `PLAIN_BIOSOLDIER_BUILD` with raw numbers: class 5 bits, rank count 3 bits, then per rank a bit
 * for a selection and, for a selection, its variant index 2 bits and its ability number 8 bits.
 */
export const PLAIN_PERKS_SECTION: BinaryCodeSection = {
  id: SOLDIER_PERKS_SECTION_ID,
  write: (writer: BitWriter) => {
    const perks = PLAIN_BUILD_CODES?.perks ?? [];

    writer.writeUint(PLAIN_BUILD_CODES?.classCode ?? 0, 5);
    writer.writeUint(perks.length, 3);
    perks.forEach((step) => {
      writer.writeUint(step ? 1 : 0, 1);

      if (!step) return;

      writer.writeUint(step.variantIndex, 2);
      writer.writeUint(step.code, 8);
    });
  },
};

export const UNKNOWN_ARMOR_SECTION = loadoutSection({ ...SERAPH_LOADOUT_CODES, armor: UNKNOWN_ITEM_CODE });

export const LONG_LOADOUT_SECTION = loadoutSection(SERAPH_LOADOUT_CODES, 1);

export const CUT_LOADOUT_SECTION: BinaryCodeSection = { id: SOLDIER_LOADOUT_SECTION_ID, write: writer => writer.writeUint(10, 8) };

export const UNKNOWN_SECTION: BinaryCodeSection = { id: UNKNOWN_SECTION_ID, write: writer => writer.writeUint(0b11, 2) };

export const UNKNOWN_ARMOR_LOADOUT: DecodedLoadout = { ...SERAPH_LOADOUT, armor: null };

export const OVERFULL_LOADOUT: DecodedLoadout = { ...SERAPH_LOADOUT, utility: Array.from<null>({ length: 8 }).fill(null) };
