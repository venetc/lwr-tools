<script setup lang="ts" generic="Item extends TabsItem">
import type { StringOrNumber } from 'reka-ui';
import { TabsContent, TabsList, TabsRoot, TabsTrigger } from 'reka-ui';
import type { VNode } from 'vue';

import type { TabsItem } from './model/tabs';

interface Props {
  /** Tabs in order. */
  items: readonly Item[]
  /** Accessible name of the tab list. */
  label: string
}

interface ItemSlotProps {
  item: Item
}

const props = defineProps<Props>();

defineSlots<{
  tab?: (props: ItemSlotProps) => VNode[]
  panel?: (props: ItemSlotProps) => VNode[]
}>();

/** Id of the active tab. */
const activeId = defineModel<StringOrNumber>({ required: true });
</script>

<template>
  <TabsRoot v-model="activeId" :class="$style.tabs">
    <TabsList :class="$style.list" :aria-label="props.label">
      <TabsTrigger
        v-for="item in props.items"
        :key="item.id"
        :class="$style.tab"
        :value="item.id"
        :aria-label="item.name"
      >
        <slot name="tab" :item="item">
          {{ item.name }}
        </slot>
      </TabsTrigger>
    </TabsList>

    <div :class="$style.panels">
      <TabsContent
        v-for="item in props.items"
        :key="item.id"
        :class="$style.panel"
        :value="item.id"
        force-mount
      >
        <slot name="panel" :item="item" />
      </TabsContent>
    </div>
  </TabsRoot>
</template>

<style lang="scss" module>
@use 'styles/colors';
@use 'styles/typography';
@use 'styles/media';

.tabs {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.list {
  display: grid;
  grid-auto-columns: minmax(0, 1fr);
  grid-auto-flow: column;
  border-block-end: 1px solid colors.$border-subtle;
}

.tab {
  @include typography.label-2;
  padding: 6px 4px;
  color: colors.$text-secondary;
  background: none;
  border: none;
  border-block-end: 2px solid transparent;
  margin-block-end: -1px;
  cursor: pointer;

  &[data-state='active'] {
    color: colors.$text-primary;
    border-block-end-color: colors.$accent;
  }

  @include media.with-hover {
    &[data-state='inactive']:hover {
      color: colors.$text-primary;
    }
  }

  &:focus-visible {
    outline-offset: -2px;
  }
}

// Every panel stays rendered in one grid cell, so the tabs take the height of the tallest panel and switching tabs
// never moves what follows them.
.panels {
  display: grid;
}

.panel {
  grid-area: 1 / 1;

  &[data-state='inactive'] {
    visibility: hidden;
  }
}
</style>
