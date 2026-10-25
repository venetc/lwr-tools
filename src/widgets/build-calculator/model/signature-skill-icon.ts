import type { MaybeRefOrGetter } from 'vue';
import { computed, toValue } from 'vue';

import type { SoldierBuildData } from '@entities/soldier';
import { soldierBuildSignatureSkill } from '@entities/soldier';

import { SIGNATURE_SKILL_TEXT } from '../config/constants';

/**
 * Image of the Signature skill of a Biosoldier or MEC build in a list: the selected icon of the perk, its name for
 * the tooltip and the alternative text; null without a Signature skill.
 *
 * @param build build of the row, saved or read from a Share code.
 */
export const useSignatureSkillIcon = (build: MaybeRefOrGetter<Readonly<SoldierBuildData>>) => computed(() => {
  const perk = soldierBuildSignatureSkill(toValue(build));

  if (!perk) return null;

  return {
    src: perk.icon.selected,
    placeholder: perk.icon.placeholder.selected,
    name: perk.name,
    alt: `${SIGNATURE_SKILL_TEXT.labelPrefix}${perk.name}`,
  };
});
