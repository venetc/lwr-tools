<script setup lang="ts">
import { Lock, LockOpen, Trash2 } from '@lucide/vue';
import type { VNode } from 'vue';
import { computed, useCssModule } from 'vue';

import { HoldButton } from '@shared/ui/hold-button';
import { Toggle } from '@shared/ui/toggle';

interface Props {
  /** Accessible label of the remove button. */
  removeLabel: string
  /** Accessible label of the lock toggle. */
  lockLabel: string
  /** Whether the bar offers removal; the remove button still hides while locked. */
  removable?: boolean
}

interface Emits {
  /** Requests removal once the remove button is held. */
  remove: []
}

interface DefaultSlotProps {
  /** Class that styles a button like the bar's own actions. */
  actionClass: string[]
}

const props = withDefaults(defineProps<Props>(), {
  removable: false,
});

const emit = defineEmits<Emits>();

defineSlots<{
  editable?: (props: DefaultSlotProps) => VNode[]
  default?: (props: DefaultSlotProps) => VNode[]
}>();

const style = useCssModule();

const lockClass = [style.action, style.lock];

const secondaryClass = [style.action, style.secondary];

const removeClass = [style.action, style.remove];

/** Whether editing is locked; the remove button is hidden while locked. */
const locked = defineModel<boolean>('locked', { required: true });

const lockIcon = computed(() => locked.value ? Lock : LockOpen);

const isEditable = computed(() => !locked.value);

const isRemovable = computed(() => props.removable && isEditable.value);

/**
 * Requests removal.
 */
const requestRemove = () => emit('remove');
</script>

<template>
  <div :class="$style.actions">
    <slot
      v-if="isEditable"
      name="editable"
      :action-class="secondaryClass"
    />

    <HoldButton
      v-if="isRemovable"
      :class="removeClass"
      title="Hold to remove"
      @hold="requestRemove"
    >
      <Trash2 :class="$style.icon" aria-hidden="true" />
      <span :class="$style.visuallyHidden">{{ props.removeLabel }}</span>
    </HoldButton>

    <slot :action-class="secondaryClass" />

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

<style lang="scss" module src="./ActionBar.scss" />
