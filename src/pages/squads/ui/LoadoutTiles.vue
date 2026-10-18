<script setup lang="ts">
import { useCssModule } from 'vue';

import { useLoadoutTileViews } from '../model/loadout-tile-views';
import type { LoadoutTile } from '../model/loadout-tiles';

interface Props {
  /** Tiles of the Loadout in inventory order. */
  tiles: readonly LoadoutTile[]
}

const props = defineProps<Props>();

const tileViews = useLoadoutTileViews(() => props.tiles, useCssModule());
</script>

<template>
  <ul :class="$style.tiles" aria-label="Loadout">
    <li
      v-for="view in tileViews"
      :key="view.tile.id"
      :class="view.tileClass"
      :aria-label="view.tile.label"
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
        <span :class="view.captionClass">{{ view.tile.caption }}</span>
        <span v-if="view.tile.item" :class="$style.name">{{ view.tile.item.name }}</span>
      </span>
    </li>
  </ul>
</template>

<style lang="scss" module src="./LoadoutTiles.scss" />
