<script setup lang="ts">
import { SquarePen } from '@lucide/vue';
import { useId } from 'vue';

import { Label } from '@shared/ui/label';

import type { SoldierClass } from '../model/types';

interface Props {
  soldierClass: SoldierClass
}

const props = defineProps<Props>();

/** Имя билда; по умолчанию и после очистки поля — название класса. */
const name = defineModel<string>('name', { required: true });

const inputId = useId();

/** Возвращает название класса, если поле имени оставили пустым. */
function restoreBlankName() {
  if (name.value.trim() !== '') return;
  name.value = props.soldierClass.name;
}

/**
 * Завершает редактирование имени снятием фокуса.
 *
 * @param event нажатие клавиши в поле.
 */
function commit(event: KeyboardEvent) {
  if (event.target instanceof HTMLInputElement) event.target.blur();
}
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
        :placeholder="soldierClass.name"
        @blur="restoreBlankName"
        @keydown.enter="commit"
      >
      <Label :class="$style.edit" :for="inputId">
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

$badge: 38px;

.heading {
  display: flex;
  align-items: center;
  gap: 12px;
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

  &:focus-visible {
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
