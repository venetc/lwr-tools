import { readonly, shallowRef, triggerRef } from 'vue';

export interface ToastMessage {
  id: number
  title: string
  description: string
}

export type ToastContent = Omit<ToastMessage, 'id'>;

const messages = shallowRef<ToastMessage[]>([]);
let nextId = 0;

export const toastMessages = readonly(messages);

/**
 * Adds a notification to the queue.
 *
 * @param content notification title and text.
 */
export function showToast(content: ToastContent): void {
  messages.value.push({ ...content, id: nextId++ });
  triggerRef(messages);
}

/**
 * Removes the notification from the queue.
 *
 * @param id notification id returned when it was shown.
 */
export function dismissToast(id: number): void {
  const index = messages.value.findIndex(message => message.id === id);
  if (index === -1) return;
  messages.value.splice(index, 1);
  triggerRef(messages);
}
