import { createSharedComposable } from '@vueuse/core';
import { readonly, shallowRef, triggerRef } from 'vue';

import { createId } from '@shared/lib/id';

export interface ToastMessage {
  id: string
  title: string
  description: string
}

export type ToastContent = Omit<ToastMessage, 'id'>;

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
   */
  const showToast = (content: ToastContent): void => {
    messages.value.push({ ...content, id: createId() });
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

  return { messages: readonly(messages), showToast, dismissToast };
});
