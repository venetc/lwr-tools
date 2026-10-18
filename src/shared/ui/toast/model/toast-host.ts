import { useToastQueue } from './toast-queue';

/**
 * Notifications of the host: the queue and their removal once the closing animation ends, since removing a
 * notification on close would cut the animation off.
 */
export const useToastHost = () => {
  const { messages, dismissToast } = useToastQueue();

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

  return { messages, onAnimationEnd };
};
