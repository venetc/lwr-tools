import { MEC_CLASSES } from '@entities/soldier';
import { defaultSoldierBuild, selectSoldierBuildPerk } from '@entities/soldier/model/build';
import type { StoredBuildOf } from '@features/share-build/model/stored-build';
import { encodeBinaryCode } from '@shared/lib/binary-code';
import type { BinaryCodeSection } from '@shared/lib/binary-code';

const [FIRST_MEC_CLASS] = MEC_CLASSES;

export const BUILD_ID = 'build-1';

export const INVALID_CODE = 'invalid-code';

export const SHIV_BUILD = { perks: [null, null, null, null, null], name: 'Tank', id: BUILD_ID, readonly: true, outdated: null };

export const UNENCODABLE_SHIV_BUILD = { ...SHIV_BUILD, perks: ['unknown-perk', null, null] };

export const MEC_BUILD = defaultSoldierBuild(FIRST_MEC_CLASS);

/**
 * Stored MEC build with only the last rank selected.
 */
const createGappedMecBuild = () => {
  const build = { ...defaultSoldierBuild(FIRST_MEC_CLASS), id: BUILD_ID, readonly: false, outdated: null };

  selectSoldierBuildPerk(build, 6, FIRST_MEC_CLASS.perks['master-sergeant'][0] ?? null);

  return build;
};

export const GAPPED_MEC_BUILD = createGappedMecBuild();

/** SHIV build code with Lock N' Load and Repair Servos, two perks of Basic Config. */
export const COLLISION_CODE = 'Agg9AhAAnQ';

/** Outdated selections of `COLLISION_CODE`. */
export const COLLISION_SELECTIONS = [
  { perkId: 'lock-n-load', reason: 'collision', levelIndex: 0 },
  { perkId: 'repair-servos', reason: 'collision', levelIndex: 0 },
];

/** SHIV tree records without Smart Macrophages, as after a mod update that removes it. */
export const TECHNOLOGY_LEVEL_CONTENT_MOCK = {
  'base-configuration': { name: 'Basic Config', perks: ['lock-n-load', 'repair-servos', 'platform-stability'] },
  'advancements-1': { name: 'Advancements I', perks: ['holo-rounds', 'shredder', 'damage-control'] },
  'advancements-2': { name: 'Advancements II', perks: ['reactive-targeting-sensors', 'light-em-up', 'close-combat-specialist'] },
  'advancements-3a': { name: 'Advancements IIIa', perks: ['critical-system-targeting', 'fortified', 'absorption-fields'] },
  'advancements-3b': { name: 'Advancements IIIb', perks: ['vital-point-targeting', 'bring-em-on'] },
};

/**
 * SHIV `PERKS` section with raw numbers: perk count 3 bits, then the perk numbers 6 bits each.
 *
 * @param perkCodes perk numbers in any order.
 */
const rawShivPerksSection = (perkCodes: readonly number[]): BinaryCodeSection => ({
  id: 1,
  write: (writer) => {
    writer.writeUint(perkCodes.length, 3);
    perkCodes.forEach(perkCode => writer.writeUint(perkCode, 6));
  },
});

/** SHIV build code with Holo Rounds and Smart Macrophages, which the mocked SHIV tree no longer has. */
const REMOVED_PERK_CODE = encodeBinaryCode(2, [rawShivPerksSection([4, 15])]) ?? '';

/** Stored editable record of `REMOVED_PERK_CODE`. */
export const REMOVED_PERK_RECORD = { code: REMOVED_PERK_CODE, readonly: false };

/** Outdated build of `REMOVED_PERK_RECORD`: Holo Rounds kept, Smart Macrophages left out. */
export const REMOVED_PERK_BUILD: StoredBuildOf<'shiv'> = {
  perks: [null, 'holo-rounds', null, null, null],
  name: 'SHIV',
  id: BUILD_ID,
  readonly: false,
  outdated: {
    code: REMOVED_PERK_CODE,
    selections: [{ perkId: 'smart-macrophages', reason: 'removed' }],
  },
};

/**
 * Jaeger build code with raw numbers: Sharpshooter, a perk of Corporal, on Lance Corporal (outdated), and Lone Wolf
 * on Gunnery Sergeant. `PERKS`: class 5 bits, step count 3 bits, then per rank a selection bit, a variant index of
 * 2 bits and an ability number of 8 bits.
 */
export const OUTDATED_MEC_CODE = encodeBinaryCode(3, [{
  id: 1,
  write: (writer) => {
    writer.writeUint(9, 5);
    writer.writeUint(6, 3);
    [[0, 59], null, null, null, [0, 33], null].forEach((step) => {
      writer.writeUint(step ? 1 : 0, 1);

      if (!step) return;

      writer.writeUint(step[0] ?? 0, 2);
      writer.writeUint(step[1] ?? 0, 8);
    });
  },
}]) ?? '';

/** Stored readonly record of `OUTDATED_MEC_CODE`. */
export const OUTDATED_MEC_RECORD = { code: OUTDATED_MEC_CODE, readonly: true };

/** Outdated build of `OUTDATED_MEC_RECORD`: Lone Wolf kept, Lance Corporal empty. */
export const OUTDATED_MEC_BUILD: StoredBuildOf<'mec'> = {
  ...defaultSoldierBuild(FIRST_MEC_CLASS),
  name: 'Jaeger',
  perks: ['hunter', null, null, null, null, 'lone-wolf', null],
  id: BUILD_ID,
  readonly: true,
  outdated: {
    code: OUTDATED_MEC_CODE,
    selections: [{ stepKind: 'rank', stepIndex: 1, variantIndex: 0, abilityId: 'sharpshooter', currentAbilityId: 'rapid-fire' }],
  },
};
