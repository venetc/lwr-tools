import { createSharedComposable } from '@vueuse/core';
import { readonly, shallowRef, triggerRef } from 'vue';

import { createId } from '@shared/lib/id';

import { PERSISTENT_TOAST_DURATION, TOAST_DURATION } from '../config/constants';

export interface ToastMessage {
  /** Notification id. */
  id: string
  /** Notification title. */
  title: string
  /** Notification text. */
  description: string
  /** Time the notification stays on screen, in milliseconds. */
  duration: number
  /** Whether the notification is shown; a closed one stays in the queue until its closing animation ends. */
  isOpen: boolean
}

export type ToastContent = Pick<ToastMessage, 'title' | 'description'>;

/**
 * Notification queue shared by every component that uses it: created on the first use, released when none uses it.
 * Call it synchronously in `setup`; the returned functions can then be called from anywhere.
 */
export const useToastQueue = createSharedComposable(() => {
  const messages = shallowRef<ToastMessage[]>([]);

  /**
   * Adds a notification to the queue.
   *
   * @param content notification title and text.
   * @param duration time the notification stays on screen, in milliseconds.
   * @returns notification id.
   */
  const addToast = (content: ToastContent, duration: number) => {
    const id = createId();

    messages.value.push({ ...content, id, duration, isOpen: true });
    triggerRef(messages);

    return id;
  };

  /**
   * Adds a notification that closes by itself after a while.
   *
   * @param content notification title and text.
   */
  const showToast = (content: ToastContent): void => {
    addToast(content, TOAST_DURATION);
  };

  /**
   * Adds a notification that stays until the user or `closeToast` closes it.
   *
   * @param content notification title and text.
   * @returns notification id.
   */
  const showPersistentToast = (content: ToastContent) => addToast(content, PERSISTENT_TOAST_DURATION);

  /**
   * Replaces the title and text of a shown notification.
   *
   * @param id notification id.
   * @param content new title and text.
   * @returns whether the notification is still shown and got the content.
   */
  const updateToast = (id: string, content: ToastContent) => {
    const message = messages.value.find(item => item.id === id);

    if (!message?.isOpen) return false;

    message.title = content.title;
    message.description = content.description;
    triggerRef(messages);

    return true;
  };

  /**
   * Closes the notification with its closing animation.
   *
   * @param id notification id.
   */
  const closeToast = (id: string): void => {
    const message = messages.value.find(item => item.id === id);

    if (!message?.isOpen) return;

    message.isOpen = false;
    triggerRef(messages);
  };

  /**
   * Removes the notification from the queue.
   *
   * @param id notification id.
   */
  const dismissToast = (id: string): void => {
    const index = messages.value.findIndex(message => message.id === id);
    if (index === -1) return;
    messages.value.splice(index, 1);
    triggerRef(messages);
  };

  return { messages: readonly(messages), showToast, showPersistentToast, updateToast, closeToast, dismissToast };
});
