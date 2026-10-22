import type { ArmorId } from '../../model/armors';
import type { WeaponType } from '../../model/weapons';

/** Why an item does not fit a Loadout slot, in the order the reasons are listed; `wrong-unit` items are not for this unit or slot at all. */
export const LOADOUT_BLOCK_REASONS = [
  'wrong-unit',
  'class-limited',
  'needs-gene-mod',
  'needs-psionic',
  'needs-officer',
  'max-one',
  'cant-stack',
  'unsupported-weapon',
  'needs-module',
  'gear-slot-passive-only',
  'psi-slot-psi-only',
] as const;

/** Kinds of utility slots: regular ones, Gear Slots for passive gear only, Psi Slots for passive psionic gear only. */
export const UTILITY_SLOT_KINDS = ['regular', 'gear-slot', 'psi-slot'] as const;

/** Utility slots that Tactical Rigging adds to biosoldier armor; the project counts the Foundry project as always researched. */
export const TACTICAL_RIGGING_SLOTS = 1;

/** Biosoldier armor that Tactical Rigging does not add a slot to: it already has its own prototype rigging. */
export const ARMORS_WITHOUT_TACTICAL_RIGGING: readonly ArmorId[] = ['phalanx-armor'];

/** Most utility slots a unit has, Gear Slots and Psi Slots included. */
export const MAX_UTILITY_SLOTS = 4;

/** Secondary weapon types that are never left empty: a class that can carry one always does, as the Rocketeer its rocket launcher. */
export const REQUIRED_SECONDARY_WEAPON_TYPES: readonly WeaponType[] = ['rocket-launcher'];
