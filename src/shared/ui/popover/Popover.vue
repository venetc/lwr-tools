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

<style lang="scss" module>
@use 'styles/colors';
@use 'styles/shape';

.content {
  @include shape.frame(shape.$cut-md, 1px, colors.$accent-muted, colors.$surface-2, colors.$accent-glow);
  z-index: 10;
  display: flex;
  flex-direction: column;
  gap: 10px;
  width: min(320px, calc(100vw - 32px));
  padding: 14px 16px 16px;
}

.arrow {
  fill: colors.$accent-muted;
}
</style>
