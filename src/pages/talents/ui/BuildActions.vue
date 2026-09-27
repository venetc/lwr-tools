<script setup lang="ts">
import { Lock, LockOpen, Trash2 } from '@lucide/vue';
import { computed, useCssModule } from 'vue';

import { Toggle } from '@shared/ui/toggle';

interface Emits {
  /** Requests removal of the build. */
  remove: []
}

const emit = defineEmits<Emits>();

const style = useCssModule();

const lockClass = [style.action, style.lock];

const removeClass = [style.action, style.remove];

/** Whether the build is locked for editing. */
const locked = defineModel<boolean>('locked', { required: true });

const lockIcon = computed(() => locked.value ? Lock : LockOpen);

const isRemovable = computed(() => !locked.value);

/**
 * Requests removal of the build.
 */
const requestRemove = () => emit('remove');
</script>

<template>
  <div :class="$style.actions">
    <button
      v-if="isRemovable"
      :class="removeClass"
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

.remove {
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
