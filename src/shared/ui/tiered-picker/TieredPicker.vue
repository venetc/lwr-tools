<script setup lang="ts" generic="Tier extends TieredPickerTier">
import type { VNode } from 'vue';
import { useCssModule } from 'vue';

import { ScrollArea } from '@shared/ui/scroll-area';
import { ToggleGroup, ToggleGroupOption } from '@shared/ui/toggle-group';

import { useTierGrid } from './lib/tier-grid';
import { useDescribedItem } from './model/described-item';
import { useTierSelection } from './model/tier-selection';
import type { TieredPickerItem, TieredPickerTier } from './model/tiered-picker';
import TieredPickerCell from './TieredPickerCell.vue';

interface Props {
  /** Accessible name of the picker. */
  label: string
  /** Tiers from lowest to highest. */
  tiers: Tier[]
  /** Item described while the user inspects none. */
  defaultItem?: TieredPickerItem | null
}

interface Emits {
  /** Requests an item selection on the tier; null clears the tier. */
  select: [tierIndex: number, itemId: string | null]
}

interface TierSlotProps {
  tier: Tier
}

const props = withDefaults(defineProps<Props>(), {
  defaultItem: null,
});

const emit = defineEmits<Emits>();

defineSlots<{
  header?: () => VNode[]
  tier?: (props: TierSlotProps) => VNode[]
}>();

const style = useCssModule();

const { describedItem, describedNote, hasRelated, describe } = useDescribedItem(() => props.tiers, () => props.defaultItem);

const { toggle, getAriaDisabled } = useTierSelection((tierIndex, itemId) => emit('select', tierIndex, itemId));

const { gridStyle, getOptionStyle } = useTierGrid(() => props.tiers);

/**
 * Tier classes based on its state.
 *
 * @param tier tier with its state.
 */
const getTierClass = (tier: Tier) => {
  return [style.tier, style[tier.state]];
};
</script>

<template>
  <section
    :class="$style.panel"
    :style="gridStyle"
    :aria-label="label"
  >
    <header :class="$style.header">
      <slot name="header" />
    </header>

    <ol :class="$style.tiers">
      <li
        v-for="(tier, tierIndex) in tiers"
        :key="tier.id"
        :class="getTierClass(tier)"
      >
        <span :class="$style.tierLabel">
          <slot name="tier" :tier="tier" />
        </span>

        <ToggleGroup
          :class="$style.items"
          :model-value="tier.selectedId"
          :roving-focus="false"
          :aria-label="tier.name"
          @update:model-value="toggle(tier, tierIndex, $event)"
        >
          <ToggleGroupOption
            v-for="(option, optionIndex) in tier.options"
            :key="option.item.id"
            :class="$style.item"
            :style="getOptionStyle(tier, optionIndex)"
            :value="option.item.id"
            :aria-disabled="getAriaDisabled(tier, option)"
            @pointerenter="describe(tier, option)"
            @focus="describe(tier, option)"
          >
            <TieredPickerCell
              :icon="option.item.icon"
              :name="option.item.name"
              :appearance="option.appearance"
            />
          </ToggleGroupOption>
        </ToggleGroup>
      </li>
    </ol>

    <div
      v-if="describedItem"
      :class="$style.description"
      aria-live="polite"
    >
      <p :class="$style.descriptionName">
        {{ describedItem.name }}
      </p>

      <ScrollArea :class="$style.descriptionScroll">
        <p v-if="describedNote" :class="$style.descriptionNote">
          {{ describedNote }}
        </p>

        <p :class="$style.descriptionText">
          {{ describedItem.description }}
        </p>

        <ul v-if="hasRelated" :class="$style.related">
          <li
            v-for="relatedItem in describedItem.related"
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
@use 'styles/media';

$cell: 40px;

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

.tiers {
  display: flex;
  flex-direction: column;
  gap: 5px;
  margin: 0;
  padding: 0;
  list-style: none;
}

.tier {
  display: grid;
  grid-template-columns: 1fr auto;
  align-items: center;
  gap: 12px;
  padding: 4px 8px 4px 10px;
  background: colors.$surface-2;
  border-width: 1px;
  border-style: solid;
  border-radius: 3px;
}

.completed {
  border-color: colors.$border;

  .tierLabel {
    color: colors.$text-secondary;
  }
}

.available {
  border-color: colors.$highlight-muted;
  box-shadow: 0 0 8px colors.$highlight-glow;

  .tierLabel {
    color: colors.$highlight;
  }
}

.locked {
  border-color: colors.$border;

  .tierLabel {
    color: colors.$text-disabled;
  }
}

.tierLabel {
  display: flex;
  align-items: center;
  min-width: 0;
}

.items {
  display: grid;
  grid-template-columns: repeat(var(--tier-columns), $cell);
  gap: 10px;
}

.item {
  display: block;
  width: $cell;
  height: $cell;
  padding: 0;
  background: none;
  transition: filter 0.12s ease-out;
  will-change: filter;

  @include media.with-hover {
    &:hover:not(:focus-visible) {
      filter: brightness(1.3);
    }
  }

  &:not([aria-disabled='true']) {
    cursor: pointer;
  }

  &[aria-disabled='true'] {
    cursor: not-allowed;
  }

  &:focus-visible {
    filter: brightness(1.3);
    outline-offset: 6px;
  }
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
