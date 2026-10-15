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

<style lang="scss" module>
@use 'styles/colors';
@use 'styles/typography';
@use 'styles/shape';

.panel {
  @include shape.frame(shape.$cut-lg, 2px, colors.$accent, colors.$surface-1);
  display: flex;
  flex-direction: column;
  gap: 12px;
  width: 100%;
  max-width: 440px;
  padding: 12px 14px 18px;
}

.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

.description {
  display: flex;
  flex-direction: column;
  gap: 6px;
  padding: 6px 16px 0;
  text-align: center;
}

.descriptionName {
  @include typography.heading-4;
  display: grid;
  place-items: center;
  block-size: 1.5rem;
  margin: 0;
  color: colors.$text-primary;
}

$descent-overflow: 0.1em;

.descriptionScroll {
  @include typography.body-1;
  block-size: calc(5lh + #{$descent-overflow * 2.5});
}

.descriptionNote {
  @include typography.body-2;
  margin: 0 0 4px;
  padding-inline: 12px;
  color: colors.$text-tertiary;
}

.descriptionText {
  @include typography.body-1;
  color: colors.$text-secondary;
  margin: 0;
  padding-inline: 12px;
  padding-block-end: $descent-overflow;
}

.related {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin: 10px 0 0;
  padding: 10px 12px $descent-overflow;
  border-block-start: 1px solid colors.$border-subtle;
  list-style: none;
}

.relatedItem {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
}

.relatedTitle {
  display: flex;
  align-items: center;
  gap: 8px;
}

.relatedIcon {
  flex: none;
  width: 28px;
  height: 28px;
}

.relatedName {
  @include typography.label-2;
  color: colors.$text-primary;
}

.relatedText {
  @include typography.body-2;
  margin: 0;
  color: colors.$text-secondary;
}
</style>
