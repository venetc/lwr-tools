<script setup lang="ts">
import { ChevronRight } from '@lucide/vue';
import { computed } from 'vue';

import type { BreadcrumbItem } from './model/types';

interface Props {
  /** Trail from the root to the current page; the last item is the current page. */
  items: BreadcrumbItem[]
}

const props = defineProps<Props>();

const linkItems = computed(() => props.items.slice(0, -1));
const currentItem = computed(() => props.items.at(-1) ?? null);
</script>

<template>
  <nav aria-label="Breadcrumb">
    <ol :class="$style.list">
      <li
        v-for="item in linkItems"
        :key="item.label"
        :class="$style.item"
      >
        <RouterLink :class="$style.link" :to="item.to">
          {{ item.label }}
        </RouterLink>
        <ChevronRight :class="$style.separator" aria-hidden="true" />
      </li>
      <li v-if="currentItem" :class="$style.item">
        <span :class="$style.current" aria-current="page">{{ currentItem.label }}</span>
      </li>
    </ol>
  </nav>
</template>

<style lang="scss" module>
@use 'styles/colors';
@use 'styles/typography';
@use 'styles/media';

.list {
  @include typography.caps-3;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 4px;
  margin: 0;
  padding: 0;
  list-style: none;
}

.item {
  display: flex;
  align-items: center;
  gap: 4px;
}

.link {
  text-decoration: none;

  @include media.with-hover {
    &:not(:hover) {
      color: colors.$text-secondary;
    }

    &:hover {
      color: colors.$accent-hover;
    }
  }

  @include media.with-touch {
    color: colors.$text-secondary;
  }
}

.separator {
  flex: none;
  width: 14px;
  height: 14px;
  color: colors.$text-tertiary;
}

.current {
  color: colors.$text-accent;
}
</style>
