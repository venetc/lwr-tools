import { SHIV_PERK_CONTENT } from '../config/constants/perk-content';
import { SHIV_PERK_ICON } from '../config/constants/perk-icons';
import type perksJson from '../config/data/perks.json';

export type ShivPerkId = keyof typeof perksJson;

/**
 * Colours of an icon variant, shown as a placeholder while the image loads.
 */
export interface ShivPerkIconColors {
  /** Background of the icon. */
  backdrop: string
  /** Main colour of the icon glyph. */
  glyph: string
}

/**
 * Placeholder colours of the icon variants; shared by every icon of one tint.
 */
export interface ShivPerkIconPlaceholder {
  /** Colours of the selected icon. */
  selected: ShivPerkIconColors
  /** Colours of the available icon. */
  available: ShivPerkIconColors
  /** Colours of the disabled icon. */
  disabled: ShivPerkIconColors
}

export interface ShivPerkIcon {
  /** Icon of a selected perk. */
  selected: string
  /** Icon of a perk available to select. */
  available: string
  /** Icon of a perk that is locked or not selected. */
  disabled: string
  /** Colours of each variant for the placeholder shown until the image loads. */
  placeholder: ShivPerkIconPlaceholder
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
