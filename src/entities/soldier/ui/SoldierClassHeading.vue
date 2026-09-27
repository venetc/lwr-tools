<script setup lang="ts">
import { SquarePen } from '@lucide/vue';
import { computed, useId } from 'vue';

import { Label } from '@shared/ui/label';

import type { SoldierClass } from '../model/types';

interface Props {
  /** Soldier class of the build. */
  soldierClass: SoldierClass
  /** Whether the build name cannot be edited. */
  readonly?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  readonly: false,
});

/** Build name; defaults to the class name, also when the field is cleared. */
const name = defineModel<string>('name', { required: true });

const inputId = useId();

const isEditable = computed(() => !props.readonly);

/** Restores the class name if the name field was left blank. */
const restoreBlankName = () => {
  if (name.value.trim() !== '') return;
  name.value = props.soldierClass.name;
};

/**
 * Finishes name editing by removing focus.
 *
 * @param event key press in the field.
 */
const commit = (event: KeyboardEvent) => {
  if (event.target instanceof HTMLInputElement) event.target.blur();
};
</script>

<template>
  <div :class="$style.heading">
    <component
      :is="soldierClass.icon"
      :class="$style.icon"
      aria-hidden="true"
    />
    <div :class="$style.name">
      <input
        :id="inputId"
        v-model="name"
        :class="$style.nameInput"
        type="text"
        spellcheck="false"
        autocomplete="off"
        :readonly="readonly"
        :placeholder="soldierClass.name"
        @blur="restoreBlankName"
        @keydown.enter="commit"
      >
      <Label
        v-if="isEditable"
        :class="$style.edit"
        :for="inputId"
      >
        <SquarePen :class="$style.editIcon" aria-hidden="true" />
        <span :class="$style.visuallyHidden">Rename build</span>
      </Label>
    </div>
  </div>
</template>

<style lang="scss" module>
@use 'styles/colors';
@use 'styles/typography';
@use 'styles/media';

$badge: 34px;

.heading {
  display: flex;
  align-items: center;
  gap: 10px;
  min-width: 0;
  min-height: $badge;
}

.icon {
  flex: none;
  width: $badge;
  height: $badge;
  color: colors.$accent;
}

.name {
  display: flex;
  align-items: center;
  gap: 4px;
  min-width: 0;
}

.nameInput {
  @include typography.caps-1;
  min-inline-size: 4ch;
  max-inline-size: 100%;
  padding: 2px 6px;
  background: none;
  border-radius: 3px;
  color: colors.$text-primary;

  &::placeholder {
    color: colors.$text-disabled;
  }

  &:read-only {
    cursor: default;
  }

  &:read-write:focus-visible {
    outline-width: 1px;
    outline-offset: 0;
  }
}

.edit {
  flex: none;
  display: grid;
  place-items: center;
  padding: 4px;
  cursor: pointer;
  color: colors.$text-tertiary;

  @include media.with-hover {
    &:not(:hover) {
      opacity: 0.35;
    }

    &:hover {
      opacity: 0.8;
    }
  }

  @include media.with-touch {
    opacity: 0.35;
  }
}

.editIcon {
  width: 18px;
  height: 18px;
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
