import type { ShivOutdatedSelection } from '@entities/shiv';
import { defaultSoldierBuild, MEC_CLASSES } from '@entities/soldier';
import { encodeBinaryCode } from '@shared/lib/binary-code';
import type { BinaryCodeSection } from '@shared/lib/binary-code';
import type { SavedBuild } from '@widgets/build-calculator/model/build-list';

const [FIRST_MEC_CLASS] = MEC_CLASSES;

export const BUILD_ID = 'build-1';

export const INVALID_CODE = 'invalid-code';

export const SHIV_BUILD = { perks: [null, null, null, null, null], name: 'Tank', id: BUILD_ID, readonly: true, outdated: null };

export const UNENCODABLE_SHIV_BUILD = { ...SHIV_BUILD, perks: ['unknown-perk', null, null] };

export const MEC_BUILD = defaultSoldierBuild(FIRST_MEC_CLASS);

/** Stored Jaeger build with only Extra Conditioning, the first perk of Master Sergeant. */
export const GAPPED_MEC_BUILD: SavedBuild<'mec'> = {
  ...defaultSoldierBuild(FIRST_MEC_CLASS),
  perks: ['hunter', null, null, null, null, null, 'extra-conditioning'],
  id: BUILD_ID,
  readonly: false,
  outdated: null,
};

/** Stored Jaeger build with Lone Wolf, not selected in it, as the Signature skill. */
export const SIGNATURE_MEC_BUILD: SavedBuild<'mec'> = {
  ...defaultSoldierBuild(FIRST_MEC_CLASS),
  signatureSkill: 'lone-wolf',
  id: BUILD_ID,
  readonly: false,
  outdated: null,
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

/** SHIV build code with Lock N' Load and Repair Servos, two perks of Basic Config, and Holo Rounds between them. */
const COLLISION_CODE = encodeBinaryCode(2, [rawShivPerksSection([1, 4, 2])]) ?? '';

/** Outdated selections of `COLLISION_CODE`. */
export const COLLISION_SELECTIONS: ShivOutdatedSelection[] = [
  { perkId: 'lock-n-load', reason: 'collision', levelIndex: 0 },
  { perkId: 'repair-servos', reason: 'collision', levelIndex: 0 },
];

/** Stored editable record of `COLLISION_CODE`. */
export const COLLISION_RECORD = { code: COLLISION_CODE, readonly: false };

/** Outdated build of `COLLISION_RECORD`: Holo Rounds kept, Basic Config left empty. */
export const COLLISION_BUILD: SavedBuild<'shiv'> = {
  perks: [null, 'holo-rounds', null, null, null],
  name: 'SHIV',
  id: BUILD_ID,
  readonly: false,
  outdated: { code: COLLISION_CODE, selections: COLLISION_SELECTIONS },
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
export const OUTDATED_MEC_BUILD: SavedBuild<'mec'> = {
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
