<script setup lang="ts">
import { Trash2 } from '@lucide/vue';
import type { VNode } from 'vue';
import { useCssModule } from 'vue';

import { HoldButton } from '@shared/ui/hold-button';
import { Toggle } from '@shared/ui/toggle';

import { useActionBar } from './model/action-bar';

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

/** Whether editing is locked; the remove button is hidden while locked. */
const locked = defineModel<boolean>('locked', { required: true });

const { lockClass, secondaryClass, removeClass, lockIcon, isEditable, isRemovable } = useActionBar({
  locked,
  removable: () => props.removable,
  style: useCssModule(),
});
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
      @hold="emit('remove')"
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
