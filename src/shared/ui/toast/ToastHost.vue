<script setup lang="ts">
import { X } from '@lucide/vue';
import { ToastClose, ToastDescription, ToastProvider, ToastRoot, ToastTitle, ToastViewport } from 'reka-ui';

import { TOAST_DURATION } from './config/constants';
import { useToastHost } from './model/toast-host';

const { messages, onAnimationEnd } = useToastHost();
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
