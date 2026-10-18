import type { MaybeElementRef } from '@vueuse/core';
import { onLongPress } from '@vueuse/core';
import type { MaybeRefOrGetter } from 'vue';
import { computed, ref, toValue } from 'vue';

export type HoldButtonState = 'idle' | 'holding';

export interface HoldOptions {
  /** Time in milliseconds the target has to be held to fire. */
  duration: MaybeRefOrGetter<number>
  /** Whether holding is ignored. */
  disabled: MaybeRefOrGetter<boolean>
  /** Fires once the target is held for the full duration or activated from the keyboard. */
  onHold: () => void
}

/**
 * Press-and-hold gesture on the target: tracks the hold and fires after the full duration;
 * keyboard activation, which has no pointer to hold, fires at once.
 * The hold state and its duration are given for styling the progress.
 *
 * @param target element to hold.
 * @param options hold duration, disabled state and the action.
 */
export const useHold = (target: MaybeElementRef, options: HoldOptions) => {
  const isHolding = ref(false);

  const state = computed<HoldButtonState>(() => isHolding.value ? 'holding' : 'idle');

  const progressStyle = computed(() => ({ '--hold-duration': `${toValue(options.duration)}ms` }));

  /**
   * Starts tracking the hold when the pointer presses the target.
   */
  const startHold = () => {
    if (toValue(options.disabled)) return;

    isHolding.value = true;
  };

  /**
   * Stops tracking the hold when the pointer is released or leaves the target.
   */
  const stopHold = () => {
    isHolding.value = false;
  };

  /**
   * Fires the action once the hold lasted the full duration.
   */
  const completeHold = () => {
    isHolding.value = false;

    if (toValue(options.disabled)) return;

    options.onHold();
  };

  /**
   * Fires the action on keyboard activation.
   *
   * @param event click event; `detail` is 0 for keyboard activation.
   */
  const activateFromKeyboard = (event: MouseEvent) => {
    if (event.detail !== 0) return;

    options.onHold();
  };

  onLongPress(target, completeHold, {
    delay: () => toValue(options.duration),
    distanceThreshold: false,
    onMouseUp: stopHold,
  });

  return { state, progressStyle, startHold, activateFromKeyboard };
};
