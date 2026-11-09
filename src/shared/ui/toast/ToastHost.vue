<script setup lang="ts">
import { X } from '@lucide/vue';
import { ToastClose, ToastDescription, ToastProvider, ToastRoot, ToastTitle, ToastViewport } from 'reka-ui';
import { useTemplateRef } from 'vue';

import { useToastHost } from './model/toast-host';

const viewport = useTemplateRef('viewport');

const { messages, onEscapeKeyDown, onOpenChange, onAnimationEnd } = useToastHost(viewport);
</script>

<template>
  <ToastProvider swipe-direction="right">
    <ToastRoot
      v-for="message in messages"
      :key="message.id"
      :class="$style.toast"
      :open="message.isOpen"
      :duration="message.duration"
      @escape-key-down="onEscapeKeyDown(message.id, $event)"
      @update:open="onOpenChange(message.id, $event)"
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

    <ToastViewport ref="viewport" :class="$style.viewport" />
  </ToastProvider>
</template>

<style lang="scss" module src="./ToastHost.scss" />
