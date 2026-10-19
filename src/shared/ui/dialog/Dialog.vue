<script setup lang="ts">
import { X } from '@lucide/vue';
import { DialogClose, DialogContent, DialogOverlay, DialogPortal, DialogRoot, DialogTitle } from 'reka-ui';
import { useCssModule } from 'vue';

import { useDialogContentClass } from './model/dialog';

interface Props {
  /** Dialog title, also its accessible name. */
  title: string
  /** Whether the dialog is wide, for content laid out in columns; on a phone every dialog takes the whole screen. */
  wide?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  wide: false,
});

const contentClass = useDialogContentClass(() => props.wide, useCssModule());

/** Whether the dialog is open. */
const open = defineModel<boolean>('open', { default: false });
</script>

<template>
  <DialogRoot v-model:open="open">
    <DialogPortal>
      <DialogOverlay :class="$style.overlay" />

      <DialogContent :class="contentClass" :aria-describedby="undefined">
        <div :class="$style.frame">
          <header :class="$style.header">
            <DialogTitle :class="$style.title">
              {{ props.title }}
            </DialogTitle>

            <DialogClose :class="$style.close" aria-label="Close">
              <X :class="$style.closeIcon" aria-hidden="true" />
            </DialogClose>
          </header>

          <div :class="$style.body">
            <slot />
          </div>
        </div>
      </DialogContent>
    </DialogPortal>
  </DialogRoot>
</template>

<style lang="scss" module src="./Dialog.scss" />
