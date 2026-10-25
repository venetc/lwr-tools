import { Lock, LockOpen } from '@lucide/vue';
import type { MaybeRefOrGetter, Ref } from 'vue';
import { computed, toValue } from 'vue';

export interface ActionBarOptions {
  /** Whether editing is locked. */
  locked: Ref<boolean>
  /** Whether the bar offers removal. */
  removable: MaybeRefOrGetter<boolean>
  /** CSS module of the bar. */
  style: Record<string, string>
}

/**
 * Actions of the bar: their classes, the lock icon and which actions are shown; editable actions and removal hide
 * while locked.
 *
 * @param options lock state, removal and styles of the bar.
 */
export const useActionBar = (options: ActionBarOptions) => {
  const { style } = options;

  const lockClass = [style.action, style.lock];

  const secondaryClass = [style.action, style.secondary];

  const holdClass = [style.action, style.hold];

  const lockIcon = computed(() => options.locked.value ? Lock : LockOpen);

  const isEditable = computed(() => !options.locked.value);

  const isRemovable = computed(() => toValue(options.removable) && isEditable.value);

  return { lockClass, secondaryClass, holdClass, lockIcon, isEditable, isRemovable };
};
