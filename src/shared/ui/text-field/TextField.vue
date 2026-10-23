<script setup lang="ts">
import type { VNode } from 'vue';

import { Input } from '@shared/ui/input';
import { Label } from '@shared/ui/label';

import { useTextField } from './model/text-field';

interface Props {
  /** Visible label of the field. */
  label: string
  /** Hint shown in the empty field. */
  placeholder?: string
}

const props = withDefaults(defineProps<Props>(), {
  placeholder: '',
});

defineSlots<{
  /** Controls next to the field, such as its submit button. */
  default?: () => VNode[]
}>();

/** Text of the field. */
const text = defineModel<string>({ required: true });

/** Message under the field, linked to it while shown; null without one. Editing the text clears it. */
const error = defineModel<string | null>('error', { default: null });

const { inputId, errorId, isInvalid, errorDescribedBy, clearError } = useTextField(error);
</script>

<template>
  <div :class="$style.textField">
    <Label :class="$style.label" :for="inputId">
      {{ props.label }}
    </Label>
    <div :class="$style.field">
      <Input
        :id="inputId"
        v-model="text"
        :placeholder="props.placeholder"
        :aria-invalid="isInvalid"
        :aria-describedby="errorDescribedBy"
        @update:model-value="clearError"
      />
      <slot />
    </div>
    <p
      v-if="isInvalid"
      :id="errorId"
      :class="$style.error"
      role="alert"
    >
      {{ error }}
    </p>
  </div>
</template>

<style lang="scss" module src="./TextField.scss" />
