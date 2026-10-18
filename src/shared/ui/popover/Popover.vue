<script setup lang="ts">
import { PopoverArrow, PopoverContent, PopoverPortal, PopoverRoot, PopoverTrigger } from 'reka-ui';

export type PopoverAlign = 'start' | 'center' | 'end';

interface Props {
  /** Content alignment relative to the trigger. */
  align?: PopoverAlign
}

withDefaults(defineProps<Props>(), {
  align: 'center',
});

/** Whether the popover is open. */
const open = defineModel<boolean>('open', { default: false });
</script>

<template>
  <PopoverRoot v-model:open="open">
    <PopoverTrigger as-child>
      <slot name="trigger" />
    </PopoverTrigger>

    <PopoverPortal>
      <PopoverContent
        :class="$style.content"
        side="bottom"
        :side-offset="8"
        :collision-padding="16"
        :align="align"
      >
        <slot />
        <PopoverArrow
          :class="$style.arrow"
          :width="14"
          :height="7"
        />
      </PopoverContent>
    </PopoverPortal>
  </PopoverRoot>
</template>

<style lang="scss" module src="./Popover.scss" />
