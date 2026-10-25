import { Lock, LockOpen } from '@lucide/vue';
import type { Ref } from 'vue';
import { computed } from 'vue';

/**
 * Icon of the lock toggle: a closed lock while locked, an open one otherwise.
 *
 * @param locked whether the toggle is locked.
 */
export const useLockToggle = (locked: Ref<boolean>) => {
  const icon = computed(() => locked.value ? Lock : LockOpen);

  return { icon };
};
