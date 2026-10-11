<script setup lang="ts">
import { Lock, LockOpen, Trash2 } from '@lucide/vue';
import type { VNode } from 'vue';
import { computed, useCssModule } from 'vue';

import { Toggle } from '@shared/ui/toggle';

interface Props {
  /** Accessible label of the remove button. */
  removeLabel: string
  /** Accessible label of the lock toggle. */
  lockLabel: string
}

interface Emits {
  /** Requests removal. */
  remove: []
}

interface DefaultSlotProps {
  /** Class that styles a button like the bar's own actions. */
  actionClass: string[]
}

const props = defineProps<Props>();

const emit = defineEmits<Emits>();

defineSlots<{
  default?: (props: DefaultSlotProps) => VNode[]
}>();

const style = useCssModule();

const lockClass = [style.action, style.lock];

const secondaryClass = [style.action, style.secondary];

/** Whether editing is locked; the remove button is hidden while locked. */
const locked = defineModel<boolean>('locked', { required: true });

const lockIcon = computed(() => locked.value ? Lock : LockOpen);

const isEditable = computed(() => !locked.value);

/**
 * Requests removal.
 */
const requestRemove = () => emit('remove');
</script>

<template>
  <div :class="$style.actions">
    <slot :action-class="secondaryClass" />

    <button
      v-if="isEditable"
      :class="secondaryClass"
      type="button"
      @click="requestRemove"
    >
      <Trash2 :class="$style.icon" aria-hidden="true" />
      <span :class="$style.visuallyHidden">{{ props.removeLabel }}</span>
    </button>

    <Toggle v-model="locked" :class="lockClass">
      <component
        :is="lockIcon"
        :class="$style.icon"
        aria-hidden="true"
      />
      <span :class="$style.visuallyHidden">{{ props.lockLabel }}</span>
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
