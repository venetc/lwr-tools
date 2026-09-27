<script setup lang="ts">
import { Trash2 } from '@lucide/vue';
import { useId } from 'vue';

import { HoldButton } from '@shared/ui/hold-button';
import { ScrollArea } from '@shared/ui/scroll-area';

import type { SoldierBuild, SoldierBuildId } from '../model/talents';

interface Props {
  /** Builds to list, in page order. */
  builds: readonly Readonly<SoldierBuild>[]
}

interface Emits {
  /** Requests scrolling to the build panel. */
  select: [buildId: SoldierBuildId]
  /** Requests removal of the build. */
  remove: [buildId: SoldierBuildId]
}

const props = defineProps<Props>();

const emit = defineEmits<Emits>();

const captionId = useId();

/**
 * Requests scrolling to the build panel.
 *
 * @param buildId build id.
 */
const select = (buildId: SoldierBuildId) => emit('select', buildId);

/**
 * Requests removal of the build.
 *
 * @param buildId build id.
 */
const remove = (buildId: SoldierBuildId) => emit('remove', buildId);
</script>

<template>
  <nav :class="$style.nav" :aria-labelledby="captionId">
    <p :id="captionId" :class="$style.caption">
      Click to scroll to a build
    </p>
    <ScrollArea orientation="horizontal">
      <ul :class="$style.list">
        <li
          v-for="build in props.builds"
          :key="build.id"
          :class="$style.entry"
        >
          <button
            :class="$style.item"
            type="button"
            :title="build.name"
            @click="select(build.id)"
          >
            <component
              :is="build.soldierClass.icon"
              :class="$style.icon"
              aria-hidden="true"
            />
            <span :class="$style.name">{{ build.name }}</span>
          </button>
          <HoldButton
            :class="$style.remove"
            :disabled="build.readonly"
            :duration="450"
            title="Hold to remove"
            @hold="remove(build.id)"
          >
            <Trash2 :class="$style.removeIcon" aria-hidden="true" />
            <span :class="$style.visuallyHidden">Remove {{ build.name }}</span>
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
// Fixed row height, so the list keeps its height with any number of builds.
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
  width: $icon-size;
  height: $icon-size;
  color: colors.$accent;
}

.name {
  @include typography.caps-4;
  text-box: trim-both cap alphabetic;
  flex: none;
  inline-size: 12ch;
  overflow: hidden;
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
