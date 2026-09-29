<script setup lang="ts">
import { X } from '@lucide/vue';
import { ToastClose, ToastDescription, ToastProvider, ToastRoot, ToastTitle, ToastViewport } from 'reka-ui';

import { TOAST_DURATION } from './config/constants';
import { useToastQueue } from './model/useToastQueue';

const { messages, dismissToast } = useToastQueue();

/**
 * Removes the notification from the queue once it closes.
 *
 * @param id notification id.
 * @param isOpen whether the notification is open after the change.
 */
const onOpenUpdate = (id: string, isOpen: boolean) => {
  if (isOpen) return;
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
      @update:open="onOpenUpdate(message.id, $event)"
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

<style lang="scss" module>
@use 'styles/colors';
@use 'styles/typography';
@use 'styles/shape';
@use 'styles/media';

.viewport {
  position: fixed;
  z-index: 20;
  inset-block-end: 0;
  inset-inline-end: 0;
  display: flex;
  flex-direction: column;
  gap: 10px;
  width: min(360px, 100vw);
  margin: 0;
  padding: 16px;
  list-style: none;
  outline: none;
}

.toast {
  @include shape.frame(shape.$cut-md, 1px, colors.$highlight-muted, colors.$surface-2, colors.$highlight-glow);
  display: grid;
  grid-template-columns: 1fr auto;
  column-gap: 12px;
  row-gap: 4px;
  padding: 12px 14px 14px 16px;
}

.title {
  @include typography.label-1;
  grid-column: 1;
  color: colors.$highlight;
}

.description {
  @include typography.body-2;
  grid-column: 1;
  color: colors.$text-secondary;
}

.close {
  grid-column: 2;
  grid-row: 1 / span 2;
  align-self: start;
  display: grid;
  place-items: center;
  padding: 2px;
  background: none;
  cursor: pointer;

  & > svg {
    width: 18px;
    height: 18px;
  }

  @include media.with-hover {
    &:not(:hover) {
      color: colors.$text-tertiary;
    }

    &:hover {
      color: colors.$text-primary;
    }
  }

  @include media.with-touch {
    color: colors.$text-tertiary;
  }
}
</style>
