<script setup lang="ts" generic="Tier extends TieredPickerTier">
import type { VNode } from 'vue';
import { useCssModule } from 'vue';

import { ToggleGroup, ToggleGroupOption } from '@shared/ui/toggle-group';

import { useTierGrid } from './lib/tier-grid';
import { useTierAppearance } from './model/tier-appearance';
import { useTierSelection } from './model/tier-selection';
import type { TieredPickerOption, TieredPickerTier } from './model/tiered-picker';
import TieredPickerCell from './TieredPickerCell.vue';

interface Props {
  /** Tiers from lowest to highest. */
  tiers: readonly Tier[]
}

interface Emits {
  /** Requests an item selection on the tier; null clears the tier. */
  select: [tierIndex: number, itemId: string | null]
  /** Reports an option the user points at or focuses. */
  inspect: [tier: Tier, option: TieredPickerOption]
}

interface TierSlotProps {
  tier: Tier
}

const props = defineProps<Props>();

const emit = defineEmits<Emits>();

defineSlots<{
  tier?: (props: TierSlotProps) => VNode[]
}>();

const { toggle, getAriaDisabled } = useTierSelection((tierIndex, itemId) => emit('select', tierIndex, itemId));

const { gridStyle, getOptionStyle } = useTierGrid(() => props.tiers);

const { getTierClass } = useTierAppearance(useCssModule());
</script>

<template>
  <ol :class="$style.tiers" :style="gridStyle">
    <li
      v-for="(tier, tierIndex) in props.tiers"
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
          @pointerenter="emit('inspect', tier, option)"
          @focus="emit('inspect', tier, option)"
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
</template>

<style lang="scss" module src="./TieredPickerTiers.scss" />
