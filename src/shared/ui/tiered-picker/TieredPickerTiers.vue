<script setup lang="ts" generic="Tier extends TieredPickerTier">
import type { VNode } from 'vue';
import { useCssModule } from 'vue';

import { useTierGrid } from './lib/tier-grid';
import { useTierAppearance } from './model/tier-appearance';
import { useTierSelection } from './model/tier-selection';
import type { TieredPickerOption, TieredPickerTier } from './model/tiered-picker';

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

interface CellSlotProps {
  tier: Tier
  option: TieredPickerOption
}

const props = defineProps<Props>();

const emit = defineEmits<Emits>();

defineSlots<{
  tier?: (props: TierSlotProps) => VNode[]
  cell?: (props: CellSlotProps) => VNode[]
}>();

const { isPressed, toggle, getAriaDisabled } = useTierSelection((tierIndex, itemId) => emit('select', tierIndex, itemId));

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

      <div
        :class="$style.items"
        role="group"
        :aria-label="tier.name"
      >
        <button
          v-for="(option, optionIndex) in tier.options"
          :key="option.item.id"
          :class="$style.item"
          :style="getOptionStyle(tier, optionIndex)"
          type="button"
          :aria-pressed="isPressed(option)"
          :aria-disabled="getAriaDisabled(tier, option)"
          @click="toggle(tier, tierIndex, option)"
          @pointerenter="emit('inspect', tier, option)"
          @focus="emit('inspect', tier, option)"
        >
          <slot
            name="cell"
            :tier="tier"
            :option="option"
          />
        </button>
      </div>
    </li>
  </ol>
</template>

<style lang="scss" module src="./TieredPickerTiers.scss" />
