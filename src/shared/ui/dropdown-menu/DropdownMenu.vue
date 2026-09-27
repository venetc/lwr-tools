<script setup lang="ts">
import { DropdownMenuContent, DropdownMenuPortal, DropdownMenuRoot, DropdownMenuTrigger } from 'reka-ui';

export type DropdownMenuAlign = 'start' | 'center' | 'end';

interface Props {
  /** Menu alignment relative to the trigger. */
  align?: DropdownMenuAlign
}

withDefaults(defineProps<Props>(), {
  align: 'start',
});

/** Whether the menu is open. */
const open = defineModel<boolean>('open', { default: false });
</script>

<template>
  <DropdownMenuRoot v-model:open="open">
    <DropdownMenuTrigger as-child>
      <slot name="trigger" />
    </DropdownMenuTrigger>

    <DropdownMenuPortal>
      <DropdownMenuContent
        :class="$style.content"
        side="bottom"
        :side-offset="8"
        :collision-padding="16"
        :align="align"
      >
        <slot />
      </DropdownMenuContent>
    </DropdownMenuPortal>
  </DropdownMenuRoot>
</template>

<style lang="scss" module>
@use 'styles/colors';
@use 'styles/shape';

.content {
  @include shape.frame(shape.$cut-sm, 1px, colors.$accent-muted, colors.$surface-2, colors.$accent-glow);
  z-index: 10;
  display: flex;
  flex-direction: column;
  gap: 2px;
  min-inline-size: 180px;
  max-inline-size: calc(100vw - 32px);
  padding: 6px;
}
</style>
