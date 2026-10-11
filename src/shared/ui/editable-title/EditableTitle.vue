<script setup lang="ts">
import { SquarePen } from '@lucide/vue';
import type { VNode } from 'vue';
import { computed, useId } from 'vue';

import { Label } from '@shared/ui/label';

interface Props {
  /** Title shown as the placeholder and restored when the field is left blank. */
  fallback: string
  /** Accessible label of the edit button. */
  editLabel: string
  /** Whether the title cannot be edited. */
  readonly?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  readonly: false,
});

defineSlots<{
  icon?: () => VNode[]
}>();

/** Title text; the fallback is restored when the field is left blank. */
const title = defineModel<string>({ required: true });

const inputId = useId();

const isEditable = computed(() => !props.readonly);

/** Restores the fallback if the field was left blank. */
const restoreBlankTitle = () => {
  if (title.value.trim() !== '') return;

  title.value = props.fallback;
};

/**
 * Finishes editing by removing focus.
 *
 * @param event key press in the field.
 */
const finishEditing = (event: KeyboardEvent) => {
  if (event.target instanceof HTMLInputElement) event.target.blur();
};
</script>

<template>
  <div :class="$style.heading">
    <slot name="icon" />
    <div :class="$style.name">
      <input
        :id="inputId"
        v-model="title"
        :class="$style.nameInput"
        type="text"
        spellcheck="false"
        autocomplete="off"
        :readonly="props.readonly"
        :placeholder="props.fallback"
        @blur="restoreBlankTitle"
        @keydown.enter="finishEditing"
      >
      <Label
        v-if="isEditable"
        :class="$style.edit"
        :for="inputId"
      >
        <SquarePen :class="$style.editIcon" aria-hidden="true" />
        <span :class="$style.visuallyHidden">{{ props.editLabel }}</span>
      </Label>
    </div>
  </div>
</template>

<style lang="scss" module>
@use 'styles/colors';
@use 'styles/typography';
@use 'styles/media';

// Row height of a title with a leading icon, kept without one so titles line up.
$row-height: 34px;

.heading {
  display: flex;
  align-items: center;
  gap: 10px;
  min-width: 0;
  min-height: $row-height;
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
  padding: 3px 6px 1px;
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
