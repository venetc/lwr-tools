<script setup lang="ts" generic="Item extends ListNavItem">
import { Trash2 } from '@lucide/vue';
import type { VNode } from 'vue';

import { HoldButton } from '@shared/ui/hold-button';
import { ScrollArea } from '@shared/ui/scroll-area';

import type { ListNavItem } from './model/list-nav';
import { useListNav } from './model/list-nav';

interface Props {
  /** Items to list, in page order. */
  items: readonly Item[]
  /** Accessible name of the navigation. */
  label: string
}

interface Emits {
  /** Requests going to the item. */
  select: [id: string]
  /** Requests removal of the item. */
  remove: [id: string]
}

interface IconSlotProps {
  item: Item
}

const props = defineProps<Props>();

const emit = defineEmits<Emits>();

const slots = defineSlots<{
  icon?: (props: IconSlotProps) => VNode[]
}>();

const { hasIcon, isRemoveDisabled } = useListNav(slots);
</script>

<template>
  <nav :class="$style.nav" :aria-label="props.label">
    <ScrollArea orientation="horizontal">
      <ul :class="$style.list">
        <li
          v-for="item in props.items"
          :key="item.id"
          :class="$style.entry"
        >
          <button
            :class="$style.item"
            type="button"
            :title="item.label"
            @click="emit('select', item.id)"
          >
            <span
              v-if="hasIcon"
              :class="$style.icon"
              aria-hidden="true"
            >
              <slot name="icon" :item="item" />
            </span>
            <span :class="$style.name">{{ item.label }}</span>
          </button>
          <HoldButton
            :class="$style.remove"
            :disabled="isRemoveDisabled(item)"
            title="Hold to remove"
            @hold="emit('remove', item.id)"
          >
            <Trash2 :class="$style.removeIcon" aria-hidden="true" />
            <span :class="$style.visuallyHidden">Remove {{ item.label }}</span>
          </HoldButton>
        </li>
      </ul>
    </ScrollArea>
  </nav>
</template>

<style lang="scss" module src="./ListNav.scss" />
