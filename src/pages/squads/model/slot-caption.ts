import type { MaybeRefOrGetter } from 'vue';
import { computed, toValue } from 'vue';

import type { UtilitySlotKind } from '@entities/loadout';

/**
 * Class list of a slot caption: Gear Slots and Psi Slots have their own colour.
 *
 * @param tone kind of the slot for its colour.
 * @param style CSS module of the caption.
 */
export const useSlotCaptionClass = (tone: MaybeRefOrGetter<UtilitySlotKind>, style: Record<string, string>) => {
  const toneClass: Record<UtilitySlotKind, string | undefined> = {
    'regular': style.regular,
    'gear-slot': style.gearSlot,
    'psi-slot': style.psiSlot,
  };

  return computed(() => toneClass[toValue(tone)]);
};
