<script setup lang="ts" generic="Group extends TieredPickerGroup">
import type { VNode } from 'vue';

import { ScrollArea } from '@shared/ui/scroll-area';
import { Tabs } from '@shared/ui/tabs';

import { usePickerGroups } from './model/picker-groups';
import type { TieredPickerGroup, TieredPickerItem } from './model/tiered-picker';
import TieredPickerTiers from './TieredPickerTiers.vue';

interface Props {
  /** Accessible name of the picker. */
  label: string
  /** Groups of tiers; with more than one, they are shown behind tabs, the first one at start. */
  groups: readonly Group[]
}

interface Emits {
  /** Requests an item selection on a tier of the group; null clears the tier. */
  select: [groupId: string, tierIndex: number, itemId: string | null]
}

interface GroupSlotProps {
  group: Group
}

interface TierSlotProps {
  tier: Group['tiers'][number]
}

interface ItemNameSlotProps {
  item: TieredPickerItem
  group: Group
}

const props = defineProps<Props>();

const emit = defineEmits<Emits>();

defineSlots<{
  'header'?: () => VNode[]
  'tab'?: (props: GroupSlotProps) => VNode[]
  'tier'?: (props: TierSlotProps) => VNode[]
  'item-name'?: (props: ItemNameSlotProps) => VNode[]
}>();

const {
  activeGroup,
  activeGroupId,
  hasTabs,
  described,
  describedNote,
  hasRelated,
  describe,
} = usePickerGroups(() => props.groups);

/**
 * Requests an item selection on a tier of the shown group; only the shown group has its tiers on the page.
 *
 * @param tierIndex tier index in the group.
 * @param itemId selected item id, or null to clear the tier.
 */
const select = (tierIndex: number, itemId: string | null) => {
  if (!activeGroup.value) return;

  emit('select', activeGroup.value.id, tierIndex, itemId);
};
</script>

<template>
  <section
    :class="$style.panel"
    :aria-label="props.label"
  >
    <header :class="$style.header">
      <slot name="header" />
    </header>

    <Tabs
      v-if="hasTabs"
      v-model="activeGroupId"
      :items="props.groups"
      :label="props.label"
    >
      <template #tab="{ item: group }">
        <slot name="tab" :group="group">
          {{ group.name }}
        </slot>
      </template>

      <template #panel="{ item: group }">
        <TieredPickerTiers
          :tiers="group.tiers"
          @select="select"
          @inspect="describe"
        >
          <template #tier="{ tier }">
            <slot name="tier" :tier="tier" />
          </template>
        </TieredPickerTiers>
      </template>
    </Tabs>

    <TieredPickerTiers
      v-else-if="activeGroup"
      :tiers="activeGroup.tiers"
      @select="select"
      @inspect="describe"
    >
      <template #tier="{ tier }">
        <slot name="tier" :tier="tier" />
      </template>
    </TieredPickerTiers>

    <div
      v-if="described"
      :class="$style.description"
      aria-live="polite"
    >
      <p :class="$style.descriptionName">
        <slot
          name="item-name"
          :item="described.item"
          :group="described.group"
        >
          {{ described.item.name }}
        </slot>
      </p>

      <ScrollArea :class="$style.descriptionScroll">
        <p v-if="describedNote" :class="$style.descriptionNote">
          {{ describedNote }}
        </p>

        <p :class="$style.descriptionText">
          {{ described.item.description }}
        </p>

        <ul v-if="hasRelated" :class="$style.related">
          <li
            v-for="relatedItem in described.item.related"
            :key="relatedItem.id"
            :class="$style.relatedItem"
          >
            <span :class="$style.relatedTitle">
              <img
                :class="$style.relatedIcon"
                :src="relatedItem.icon.selected"
                alt=""
              >
              <span :class="$style.relatedName">{{ relatedItem.name }}</span>
            </span>
            <p :class="$style.relatedText">
              {{ relatedItem.description }}
            </p>
          </li>
        </ul>
      </ScrollArea>
    </div>
  </section>
</template>

<style lang="scss" module src="./TieredPicker.scss" />
