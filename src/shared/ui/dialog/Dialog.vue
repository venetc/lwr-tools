<script setup lang="ts">
import { DialogContent, DialogOverlay, DialogPortal, DialogRoot, DialogTitle } from 'reka-ui';
import { useCssModule } from 'vue';

import DialogCloseButton from './DialogCloseButton.vue';
import type { DialogWidth } from './model/dialog';
import { useDialog } from './model/dialog';

interface Props {
  /** Dialog title, also its accessible name. */
  title: string
  /** Width of the dialog beyond a phone; on a phone every dialog takes the whole screen. */
  width?: DialogWidth
  /** Whether the dialog draws no header: the title is only its accessible name, and the content brings its own header with a `DialogCloseButton`. */
  headerless?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  width: 'regular',
  headerless: false,
});

const { contentClass, focusOnOpen } = useDialog(() => props.width, () => props.headerless, useCssModule());

/** Whether the dialog is open. */
const open = defineModel<boolean>('open', { default: false });
</script>

<template>
  <DialogRoot v-model:open="open">
    <DialogPortal>
      <DialogOverlay :class="$style.overlay" />

      <DialogContent
        :class="contentClass"
        :aria-describedby="undefined"
        @open-auto-focus="focusOnOpen"
      >
        <div :class="$style.frame">
          <DialogTitle v-if="props.headerless" :class="$style.visuallyHidden">
            {{ props.title }}
          </DialogTitle>

          <header v-else :class="$style.header">
            <DialogTitle :class="$style.title">
              {{ props.title }}
            </DialogTitle>

            <DialogCloseButton />
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
