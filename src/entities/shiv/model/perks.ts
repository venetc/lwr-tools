import { SHIV_PERK_CONTENT } from '../config/constants/perk-content';
import { SHIV_PERK_ICON } from '../config/constants/perk-icons';
import type perksJson from '../config/data/perks.json';

export type ShivPerkId = keyof typeof perksJson;

export interface ShivPerkIcon {
  /** Original icon, shown for a selected perk. */
  original: string
  /** Icon tinted for a perk available to select. */
  available: string
  /** Icon tinted for a perk that cannot be selected. */
  disabled: string
}

/**
 * Perk record of `perks.json`.
 */
export interface ShivPerkContent {
  /** Stable perk number in share codes, from 1: a new perk gets the maximum plus one; never changed or reused. */
  code: number
  /** Perk name. */
  name: string
  /** Perk description. */
  description: string
}

export interface ShivPerk {
  id: ShivPerkId
  code: number
  name: string
  description: string
  icon: ShivPerkIcon
}

/**
 * Whether the string is a known SHIV perk id.
 *
 * @param id perk id candidate.
 */
export const isShivPerkId = (id: string): id is ShivPerkId => Object.hasOwn(SHIV_PERK_CONTENT, id);

/**
 * SHIV perk with its content and icon.
 *
 * @param id perk id.
 */
export const shivPerkById = (id: ShivPerkId): ShivPerk => {
  const content: ShivPerkContent = SHIV_PERK_CONTENT[id];

  return { id, code: content.code, name: content.name, description: content.description, icon: SHIV_PERK_ICON[id] };
};
