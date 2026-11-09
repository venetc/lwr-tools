import type { MaybeElementRef } from '@vueuse/core';
import { unrefElement } from '@vueuse/core';

import { useToastQueue } from './toast-queue';

/**
 * Notifications of the host: the queue, their closing, and their removal once the closing animation ends, since
 * removing a notification on close would cut the animation off.
 *
 * @param viewport element that holds the notifications.
 */
export const useToastHost = (viewport: MaybeElementRef) => {
  const { messages, closeToast, dismissToast } = useToastQueue();

  let escapedToastId: string | null = null;

  /**
   * Marks the notification to stay open if Escape was pressed outside the notifications, such as the one that closes
   * a dialog: reka-ui closes every notification on any Escape right after this event, so a note the dialog has just
   * shown would be gone before the user reads it. Escape pressed in the notifications closes them as usual.
   *
   * @param id notification id.
   * @param event key event of the Escape.
   */
  const onEscapeKeyDown = (id: string, event: KeyboardEvent) => {
    const element = unrefElement(viewport);
    const isInViewport = event.target instanceof Node && Boolean(element?.contains(event.target));

    escapedToastId = isInViewport || event.defaultPrevented ? null : id;
  };

  /**
   * Closes the notification once its timer runs out or the user closes it; the close that follows an Escape pressed
   * outside the notifications is skipped, and the timer still closes the notification.
   *
   * @param id notification id.
   * @param isOpen whether the notification stays shown.
   */
  const onOpenChange = (id: string, isOpen: boolean) => {
    if (isOpen) return;

    if (escapedToastId === id) {
      escapedToastId = null;

      return;
    }

    closeToast(id);
  };

  /**
   * Removes the notification from the queue once its closing animation ends.
   *
   * @param id notification id.
   * @param event animation end event of the notification.
   */
  const onAnimationEnd = (id: string, event: AnimationEvent) => {
    const toast = event.currentTarget as HTMLElement;
    if (toast.dataset.state !== 'closed') return;
    dismissToast(id);
  };

  return { messages, onEscapeKeyDown, onOpenChange, onAnimationEnd };
};
