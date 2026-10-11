<script setup lang="ts" generic="Item extends ListNavItem">
import { Trash2 } from '@lucide/vue';
import type { VNode } from 'vue';
import { useId } from 'vue';

import { HoldButton } from '@shared/ui/hold-button';
import { ScrollArea } from '@shared/ui/scroll-area';

import type { ListNavItem } from './model/list-nav';

interface Props {
  /** Items to list, in page order. */
  items: readonly Item[]
  /** Caption above the list; also the accessible name of the navigation. */
  caption: string
}

interface Emits {
  /** Requests going to the item. */
  select: [id: string]
  /** Requests removal of the item. */
  remove: [id: string]
}

interface IconSlotProps {
  item: Item
}

const props = defineProps<Props>();

const emit = defineEmits<Emits>();

const slots = defineSlots<{
  icon?: (props: IconSlotProps) => VNode[]
}>();

const captionId = useId();

const hasIcon = Boolean(slots.icon);

/**
 * Requests going to the item.
 *
 * @param id item id.
 */
const select = (id: string) => emit('select', id);

/**
 * Requests removal of the item.
 *
 * @param id item id.
 */
const remove = (id: string) => emit('remove', id);

/**
 * Whether the item cannot be removed.
 *
 * @param item listed item.
 */
const isRemoveDisabled = (item: Item) => !item.isRemovable;
</script>

<template>
  <nav :class="$style.nav" :aria-labelledby="captionId">
    <p :id="captionId" :class="$style.caption">
      {{ props.caption }}
    </p>
    <ScrollArea orientation="horizontal">
      <ul :class="$style.list">
        <li
          v-for="item in props.items"
          :key="item.id"
          :class="$style.entry"
        >
          <button
            :class="$style.item"
            type="button"
            :title="item.label"
            @click="select(item.id)"
          >
            <span
              v-if="hasIcon"
              :class="$style.icon"
              aria-hidden="true"
            >
              <slot name="icon" :item="item" />
            </span>
            <span :class="$style.name">{{ item.label }}</span>
          </button>
          <HoldButton
            :class="$style.remove"
            :disabled="isRemoveDisabled(item)"
            :duration="450"
            title="Hold to remove"
            @hold="remove(item.id)"
          >
            <Trash2 :class="$style.removeIcon" aria-hidden="true" />
            <span :class="$style.visuallyHidden">Remove {{ item.label }}</span>
          </HoldButton>
        </li>
      </ul>
    </ScrollArea>
  </nav>
</template>

<style lang="scss" module>
@use 'styles/colors';
@use 'styles/typography';
@use 'styles/media';

$icon-size: 20px;
$item-padding: 4px;
// Fixed row height, so the list keeps its height with any number of items.
$row-height: $icon-size + $item-padding * 2;

.nav {
  display: grid;
  gap: 2px;
  min-inline-size: 0;
}

.caption {
  @include typography.caption;
  margin: 0;
  color: colors.$text-tertiary;
}

.list {
  display: grid;
  grid-template-rows: repeat(2, $row-height);
  grid-auto-flow: column;
  grid-auto-columns: auto;
  justify-content: start;
  gap: 2px 4px;
  inline-size: max-content;
  margin: 0;
  padding: 0 0 8px;
  list-style: none;
}

.entry {
  display: flex;
  align-items: center;
  border-radius: 3px;

  @include media.with-hover {
    &:not(:hover) {
      background: none;
    }

    &:hover {
      background: colors.$surface-2;
    }
  }
}

.item {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: $item-padding;
  background: none;
  cursor: pointer;

  @include media.with-hover {
    .entry:not(:hover) & {
      color: colors.$text-secondary;
    }

    .entry:hover & {
      color: colors.$text-primary;
    }
  }

  @include media.with-touch {
    color: colors.$text-secondary;
  }
}

.icon {
  flex: none;
  display: grid;
  place-items: center;
  width: $icon-size;
  height: $icon-size;
}

.name {
  @include typography.caps-4;
  text-box: trim-both cap alphabetic;
  flex: none;
  inline-size: 12ch;
  // Clip only the inline axis: the text-box trimmed block edges cut glyphs in Safari.
  overflow-x: clip;
  overflow-y: visible;
  text-align: start;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.remove {
  display: grid;
  place-items: center;
  padding: 4px;
  background: none;

  &[data-state='idle'] {
    color: colors.$text-tertiary;
  }

  &[data-state='holding'] {
    color: colors.$danger;
  }

  &:enabled {
    cursor: pointer;

    @include media.with-hover {
      .entry:not(:hover, :has(:focus-visible)) & {
        opacity: 0;
      }

      .entry:is(:hover, :has(:focus-visible)) &:not(:hover) {
        opacity: 0.5;
      }

      &:hover {
        opacity: 1;
      }
    }

    @include media.with-touch {
      &[data-state='idle'] {
        opacity: 0.35;
      }

      &[data-state='holding'] {
        opacity: 1;
      }
    }
  }

  &:disabled {
    visibility: hidden;
  }
}

.removeIcon {
  width: 16px;
  height: 16px;
}

.visuallyHidden {
  position: absolute;
  width: 1px;
  height: 1px;
  overflow: hidden;
  clip-path: inset(50%);
  white-space: nowrap;
}
</style>
