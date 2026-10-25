import { ITEM_ICON_PLACEHOLDER } from '../config/constants/icon-placeholders';
import { SHIV_TYPE_CONTENT } from '../config/constants/shiv-type-content';
import { SHIV_TYPE_ICON } from '../config/constants/shiv-type-icons';
import type shivTypesJson from '../config/data/shiv-types.json';
import type { LoadoutAbility } from './loadout-abilities';
import { isLoadoutAbilityId, loadoutAbilityById } from './loadout-abilities';
import type { LoadoutIconPlaceholder } from './loadout-icons';

export type ShivTypeId = keyof typeof shivTypesJson;

/**
 * SHIV type record of `shiv-types.json`: full stats of a SHIV built as this type.
 */
export interface ShivTypeContent {
  /** Stable SHIV type number in share codes, from 1: a new SHIV type gets the maximum plus one; never changed or reused. */
  code: number
  /** SHIV type name. */
  name: string
  /** HP of the SHIV. */
  hp: number
  /** Base damage reduction, percent. */
  damageReduction: number
  /** Critical hit resistance. */
  critResist: number
  /** Defense. */
  defense: number
  /** Mobility in tiles, as the game shows it. */
  mobility: number
  /** Aim. */
  aim: number
  /** Utility slots. */
  utilitySlots: number
  /** Flight fuel; 0 for a SHIV type without flight. */
  fuel: number
  /** Tactical info text from the game. */
  info: string
  /** Ids of the non-perk abilities the SHIV type grants. */
  grants?: readonly string[]
}

/**
 * SHIV type with its id, image and granted abilities.
 */
export interface ShivType extends Omit<ShivTypeContent, 'grants'> {
  /** SHIV type id, the key in `shiv-types.json`. */
  id: ShivTypeId
  /** SHIV type image URL. */
  icon: string
  /** Colours of the SHIV type image placeholder shown until the image loads. */
  iconPlaceholder: LoadoutIconPlaceholder
  /** Non-perk abilities the SHIV type grants. */
  grants: LoadoutAbility[]
}

/**
 * Whether the string is a known SHIV type id.
 *
 * @param id SHIV type id candidate.
 */
export const isShivTypeId = (id: string): id is ShivTypeId => Object.hasOwn(SHIV_TYPE_CONTENT, id);

/**
 * SHIV type of a `shiv-types.json` entry; unknown granted ids are skipped.
 *
 * @param entry SHIV type id and its record.
 */
export const shivTypeFromEntry = (entry: [ShivTypeId, ShivTypeContent]): ShivType => {
  const [id, content] = entry;

  return {
    ...content,
    id,
    icon: SHIV_TYPE_ICON[id],
    iconPlaceholder: ITEM_ICON_PLACEHOLDER,
    grants: (content.grants ?? []).filter(isLoadoutAbilityId).map(loadoutAbilityById),
  };
};
