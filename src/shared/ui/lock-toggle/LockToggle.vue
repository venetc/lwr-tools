<script setup lang="ts">
import { Toggle } from '@shared/ui/toggle';

import { useLockToggle } from './model/lock-toggle';

interface Props {
  /** Accessible label of the toggle. */
  label: string
}

const props = defineProps<Props>();

/** Whether the toggle is locked. */
const locked = defineModel<boolean>({ required: true });

const { icon } = useLockToggle(locked);
</script>

<template>
  <Toggle v-model="locked" :class="$style.lock">
    <component
      :is="icon"
      :class="$style.icon"
      aria-hidden="true"
    />
    <span :class="$style.visuallyHidden">{{ props.label }}</span>
  </Toggle>
</template>

<style lang="scss" module src="./LockToggle.scss" />
