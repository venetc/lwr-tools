<script setup lang="ts">
import { ClipboardPaste, Lock, LockOpen, Share2, Trash2 } from '@lucide/vue';
import { computed, useCssModule } from 'vue';

import type { SoldierBuildData } from '@entities/soldier';
import { ExportSoldierBuild, ImportSoldierBuild } from '@features/share-build';
import { Toggle } from '@shared/ui/toggle';

interface Props {
  /** Build to export. */
  build: SoldierBuildData
}

interface Emits {
  /** Requests removal of the build. */
  remove: []
  /** Requests replacing the build with imported data. */
  import: [build: SoldierBuildData]
}

const props = defineProps<Props>();

const emit = defineEmits<Emits>();

const style = useCssModule();

const lockClass = [style.action, style.lock];

const secondaryClass = [style.action, style.secondary];

/** Whether the build is locked for editing. */
const locked = defineModel<boolean>('locked', { required: true });

const lockIcon = computed(() => locked.value ? Lock : LockOpen);

const isEditable = computed(() => !locked.value);

/**
 * Requests removal of the build.
 */
const requestRemove = () => emit('remove');

/**
 * Requests replacing the build with imported data.
 *
 * @param build imported build data.
 */
const requestImport = (build: SoldierBuildData) => emit('import', build);
</script>

<template>
  <div :class="$style.actions">
    <ImportSoldierBuild v-if="isEditable" @import="requestImport">
      <template #trigger>
        <button :class="secondaryClass" type="button">
          <ClipboardPaste :class="$style.icon" aria-hidden="true" />
          <span :class="$style.visuallyHidden">Import build</span>
        </button>
      </template>
    </ImportSoldierBuild>

    <ExportSoldierBuild :build="props.build">
      <template #trigger>
        <button :class="secondaryClass" type="button">
          <Share2 :class="$style.icon" aria-hidden="true" />
          <span :class="$style.visuallyHidden">Export build</span>
        </button>
      </template>
    </ExportSoldierBuild>

    <button
      v-if="isEditable"
      :class="secondaryClass"
      type="button"
      @click="requestRemove"
    >
      <Trash2 :class="$style.icon" aria-hidden="true" />
      <span :class="$style.visuallyHidden">Remove build</span>
    </button>

    <Toggle v-model="locked" :class="lockClass">
      <component
        :is="lockIcon"
        :class="$style.icon"
        aria-hidden="true"
      />
      <span :class="$style.visuallyHidden">Lock build</span>
    </Toggle>
  </div>
</template>

<style lang="scss" module>
@use 'styles/colors';
@use 'styles/media';

@mixin -dimmed {
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

.actions {
  flex: none;
  display: flex;
  align-items: center;
  gap: 4px;
}

.action {
  display: grid;
  place-items: center;
  padding: 4px;
  background: none;
  cursor: pointer;
}

.lock {
  &[data-state='off'] {
    @include -dimmed;
    color: colors.$text-tertiary;
  }

  &[data-state='on'] {
    color: colors.$text-secondary;
  }
}

.secondary {
  @include -dimmed;
  color: colors.$text-tertiary;
}

.icon {
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
