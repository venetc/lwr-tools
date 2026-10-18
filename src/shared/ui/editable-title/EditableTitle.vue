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

<style lang="scss" module src="./EditableTitle.scss" />
