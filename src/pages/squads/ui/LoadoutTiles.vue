<script setup lang="ts">
import { useCssModule } from 'vue';

import { useLoadoutTileViews } from '../model/loadout-tile-views';
import type { LoadoutTile } from '../model/loadout-tiles';
import SlotCaption from './SlotCaption.vue';

interface Props {
  /** Tiles of the Loadout in inventory order. */
  tiles: readonly LoadoutTile[]
}

interface Emits {
  /** Requests the Loadout dialog on the slot of the clicked tile. */
  select: [tile: LoadoutTile]
}

const props = defineProps<Props>();

const emit = defineEmits<Emits>();

const tileViews = useLoadoutTileViews(() => props.tiles, useCssModule());
</script>

<template>
  <ul :class="$style.tiles" aria-label="Loadout">
    <li
      v-for="view in tileViews"
      :key="view.tile.id"
      :class="view.cellClass"
    >
      <button
        :class="view.tileClass"
        type="button"
        :aria-label="view.tile.label"
        @click="emit('select', view.tile)"
      >
        <img
          v-if="view.tile.item"
          :class="view.imageClass"
          :src="view.tile.item.icon"
          alt=""
          aria-hidden="true"
        >
        <span
          v-else
          :class="$style.plus"
          aria-hidden="true"
        >+</span>

        <span :class="$style.text" aria-hidden="true">
          <SlotCaption
            :class="$style.caption"
            :caption="view.tile.caption"
            :tone="view.tile.tone"
          />
          <span v-if="view.tile.item" :class="$style.name">{{ view.tile.item.name }}</span>
        </span>
      </button>
    </li>
  </ul>
</template>

<style lang="scss" module src="./LoadoutTiles.scss" />
