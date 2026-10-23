import { useClipboard } from '@vueuse/core';
import type { MaybeRefOrGetter, Ref } from 'vue';
import { computed, toValue } from 'vue';

import type { LoadoutUnitId } from '@entities/loadout';

import type { BuildDataByKind } from './build-code';
import { encodeBuild } from './build-code';

/**
 * Share code export form: the code of the build, encoded only while the form is open, and copying it.
 *
 * @param kind kind of build code.
 * @param build build to share.
 * @param isOpen whether the form is open.
 */
export const useShareCodeExport = <Kind extends LoadoutUnitId>(
  kind: MaybeRefOrGetter<Kind>,
  build: MaybeRefOrGetter<BuildDataByKind[Kind]>,
  isOpen: Readonly<Ref<boolean>>,
) => {
  const code = computed(() => (isOpen.value ? encodeBuild(toValue(kind), toValue(build)) : ''));

  const hasCode = computed(() => code.value !== null);

  const shownCode = computed(() => code.value ?? '');

  const { copy, copied, isSupported } = useClipboard({ source: shownCode });

  const copyLabel = computed(() => (copied.value ? 'Copied' : 'Copy'));

  /**
   * Selects the whole code so that it can be copied by hand.
   *
   * @param event focus of the code field.
   */
  const selectCode = (event: FocusEvent) => {
    if (event.target instanceof HTMLInputElement) event.target.select();
  };

  /**
   * Copies the code to the clipboard.
   */
  const copyCode = () => copy();

  return { hasCode, shownCode, isSupported, copyLabel, selectCode, copyCode };
};
