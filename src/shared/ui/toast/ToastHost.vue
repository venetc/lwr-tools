<script setup lang="ts">
import { X } from '@lucide/vue';
import { ToastClose, ToastDescription, ToastProvider, ToastRoot, ToastTitle, ToastViewport } from 'reka-ui';

import { TOAST_DURATION } from './config/constants';
import { useToastQueue } from './model/toast-queue';

const { messages, dismissToast } = useToastQueue();

/**
 * Removes the notification from the queue once its closing animation ends: removing it on close would cut the
 * animation off.
 *
 * @param id notification id.
 * @param event animation end event of the notification.
 */
const onAnimationEnd = (id: string, event: AnimationEvent) => {
  const toast = event.currentTarget as HTMLElement;
  if (toast.dataset.state !== 'closed') return;
  dismissToast(id);
};
</script>

<template>
  <ToastProvider :duration="TOAST_DURATION" swipe-direction="right">
    <ToastRoot
      v-for="message in messages"
      :key="message.id"
      :class="$style.toast"
      :default-open="true"
      @animationend="onAnimationEnd(message.id, $event)"
    >
      <ToastTitle :class="$style.title">
        {{ message.title }}
      </ToastTitle>
      <ToastDescription :class="$style.description">
        {{ message.description }}
      </ToastDescription>
      <ToastClose :class="$style.close" aria-label="Close">
        <X aria-hidden="true" />
      </ToastClose>
    </ToastRoot>

    <ToastViewport :class="$style.viewport" />
  </ToastProvider>
</template>

<style lang="scss" module src="./ToastHost.scss" />
