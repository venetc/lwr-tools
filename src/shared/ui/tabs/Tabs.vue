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

<style lang="scss" module src="./Tabs.scss" />
