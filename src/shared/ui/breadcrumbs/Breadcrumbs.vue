<script setup lang="ts">
import { ChevronDown, ChevronRight } from '@lucide/vue';
import { computed } from 'vue';

import { DropdownMenu, DropdownMenuLink } from '@shared/ui/dropdown-menu';

import type { BreadcrumbItem } from './model/breadcrumbs';

interface Props {
  /** Trail from the root to the current page; the last item is the current page. */
  items: BreadcrumbItem[]
}

const props = defineProps<Props>();

const crumbs = computed(() => props.items.map((item, index) => {
  const isCurrent = index === props.items.length - 1;

  return { ...item, isCurrent, hasSeparator: !isCurrent };
}));
</script>

<template>
  <nav aria-label="Breadcrumb">
    <ol :class="$style.list">
      <li
        v-for="crumb in crumbs"
        :key="crumb.label"
        :class="$style.item"
      >
        <DropdownMenu v-if="crumb.menu">
          <template #trigger>
            <button type="button" :class="$style.trigger">
              {{ crumb.label }}
              <ChevronDown :class="$style.triggerIcon" aria-hidden="true" />
            </button>
          </template>

          <DropdownMenuLink
            v-for="menuItem in crumb.menu"
            :key="menuItem.label"
            :to="menuItem.to"
            :current="menuItem.isCurrent"
          >
            {{ menuItem.label }}
          </DropdownMenuLink>
        </DropdownMenu>
        <span
          v-else-if="crumb.isCurrent"
          :class="$style.current"
          aria-current="page"
        >
          {{ crumb.label }}
        </span>
        <RouterLink
          v-else
          :class="$style.link"
          :to="crumb.to"
        >
          {{ crumb.label }}
        </RouterLink>
        <ChevronRight
          v-if="crumb.hasSeparator"
          :class="$style.separator"
          aria-hidden="true"
        />
      </li>
    </ol>
  </nav>
</template>

<style lang="scss" module src="./Breadcrumbs.scss" />
