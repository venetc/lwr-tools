import type { MaybeRefOrGetter } from 'vue';
import { computed, ref, toValue } from 'vue';

import { classTree, soldierBuildSignatureSkill } from '@entities/soldier';

import { SIGNATURE_SKILL_TEXT } from '../config/constants';
import type { SavedBuild } from './build-list';

/**
 * Requests of the Signature skill button to its owner.
 */
export interface SignatureSkillButtonRequests {
  /** Requests a new Signature skill of the build; null clears it. */
  onSelect: (perkId: string | null) => void
}

/**
 * Signature skill button of a Biosoldier or MEC build panel and its «Select signature skill:» dialog: the perk on the
 * button, its name, the tiles of the perks of the class tree and the perk marked in the dialog.
 *
 * @description A Read-only or Outdated build shows its Signature skill on a disabled button and hides the button
 * without one. Opening the dialog marks the current Signature skill; a tile click only moves the mark, Clear drops it,
 * and Save requests the marked perk, or none, and closes. Closing the dialog otherwise changes nothing.
 *
 * @param build build of the panel.
 * @param style CSS module of the button.
 * @param requests requests to the button owner.
 */
export const useSignatureSkillButton = (
  build: MaybeRefOrGetter<Readonly<SavedBuild<'biosoldier' | 'mec'>>>,
  style: Record<string, string>,
  requests: SignatureSkillButtonRequests,
) => {
  const isOpen = ref(false);

  const markedId = ref<string | null>(null);

  const tree = computed(() => classTree(toValue(build).soldierClass));

  const perk = computed(() => soldierBuildSignatureSkill(toValue(build)));

  const currentPerkId = computed(() => (perk.value ? perk.value.id : null));

  const isFrozen = computed(() => toValue(build).readonly || toValue(build).outdated !== null);

  const isShown = computed(() => !isFrozen.value || perk.value !== null);

  const label = computed(() => (perk.value ? `${SIGNATURE_SKILL_TEXT.labelPrefix}${perk.value.name}` : SIGNATURE_SKILL_TEXT.select));

  const buttonClass = computed(() => [style.button, perk.value ? style.filled : style.empty]);

  const isClearDisabled = computed(() => markedId.value === null);

  const tiles = computed(() => {
    const { perks } = toValue(build);

    return tree.value.ranks.flatMap((rank, rankIndex) => rank.perks.map(rankPerk => ({
      perk: rankPerk,
      isInBuild: perks[rankIndex] === rankPerk.id,
    })));
  });

  /**
   * Checks whether the perk is marked in the dialog.
   *
   * @param perkId perk id.
   */
  const isMarked = (perkId: string) => markedId.value === perkId;

  /**
   * Class list of the tile: framed for the marked perk.
   *
   * @param perkId perk id of the tile.
   */
  const getTileClass = (perkId: string) => [style.tile, isMarked(perkId) ? style.markedTile : style.unmarkedTile];

  /**
   * Opens the dialog with the current Signature skill marked; a frozen build stays as it is.
   */
  const open = () => {
    if (isFrozen.value) return;

    markedId.value = currentPerkId.value;
    isOpen.value = true;
  };

  /**
   * Marks the perk in the dialog.
   *
   * @param perkId perk id.
   */
  const mark = (perkId: string) => {
    markedId.value = perkId;
  };

  /**
   * Drops the mark in the dialog.
   */
  const clear = () => {
    markedId.value = null;
  };

  /**
   * Requests the marked perk, or none, as the Signature skill unless it already is, and closes the dialog.
   */
  const save = () => {
    isOpen.value = false;

    if (markedId.value === currentPerkId.value) return;

    requests.onSelect(markedId.value);
  };

  return { isOpen, perk, isFrozen, isShown, label, buttonClass, isClearDisabled, tiles, isMarked, getTileClass, open, mark, clear, save };
};
