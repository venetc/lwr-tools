<script setup lang="ts">
import { Lock, LockOpen } from '@lucide/vue';
import { computed } from 'vue';

import { Toggle } from '@shared/ui/toggle';

/** Whether the build is locked for editing. */
const locked = defineModel<boolean>({ required: true });

const lockIcon = computed(() => locked.value ? Lock : LockOpen);
</script>

<template>
  <Toggle v-model="locked" :class="$style.lock">
    <component
      :is="lockIcon"
      :class="$style.icon"
      aria-hidden="true"
    />
    <span :class="$style.visuallyHidden">Lock build</span>
  </Toggle>
</template>

<style lang="scss" module>
@use 'styles/colors';
@use 'styles/media';

.lock {
  flex: none;
  display: grid;
  place-items: center;
  padding: 4px;
  background: none;
  cursor: pointer;

  &[data-state='off'] {
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

  &[data-state='on'] {
    color: colors.$text-secondary;
  }
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
