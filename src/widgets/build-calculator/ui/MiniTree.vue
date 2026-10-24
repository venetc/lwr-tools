<script setup lang="ts">
import { useCssModule } from 'vue';

import type { MiniTreeRow } from '../model/mini-tree';
import { useMiniTreeViews } from '../model/mini-tree-views';

interface Props {
  /** Rows of the mini-tree, one per branch. */
  rows: readonly MiniTreeRow[]
}

const props = defineProps<Props>();

const rowViews = useMiniTreeViews(() => props.rows, useCssModule());
</script>

<template>
  <div :class="$style.tree">
    <div
      v-for="view in rowViews"
      :key="view.row.id"
      :class="$style.row"
    >
      <span :class="view.titleClass" aria-hidden="true">{{ view.row.title }}</span>

      <ul :class="$style.steps" :aria-label="view.row.title">
        <li
          v-for="stepView in view.steps"
          :key="stepView.step.id"
          :class="$style.step"
          :aria-label="stepView.step.label"
        >
          <span :class="stepView.cellClass" aria-hidden="true">
            <img
              v-if="stepView.step.icon"
              :class="stepView.iconClass"
              :src="stepView.step.icon"
              alt=""
              draggable="false"
            >
          </span>
          <span :class="$style.caption" aria-hidden="true">{{ stepView.step.caption }}</span>
        </li>
      </ul>
    </div>
  </div>
</template>

<style lang="scss" module src="./MiniTree.scss" />
