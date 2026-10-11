<script setup lang="ts" generic="Value">
import { useClipboard } from '@vueuse/core';
import { computed, useId } from 'vue';

import { Button } from '@shared/ui/button';
import { Input } from '@shared/ui/input';
import { Label } from '@shared/ui/label';
import { Popover } from '@shared/ui/popover';

interface Props {
  /** Value to share. */
  value: Value
  /** Encodes the value; null if it cannot be shared. */
  encode: (value: Value) => string | null
}

const props = defineProps<Props>();

/** Whether the popover is open. */
const open = defineModel<boolean>('open', { default: false });

const inputId = useId();

/** Share code of the value while the popover is open: encoded on demand, not on every change. */
const code = computed(() => open.value ? props.encode(props.value) : '');

const hasCode = computed(() => code.value !== null);

const shownCode = computed(() => code.value ?? '');

const { copy, copied, isSupported } = useClipboard({ source: shownCode });

const copyLabel = computed(() => copied.value ? 'Copied' : 'Copy');

/**
 * Selects the whole code so that it can be copied by hand.
 *
 * @param event focus of the code field.
 */
const selectCode = (event: FocusEvent) => {
  if (event.target instanceof HTMLInputElement) event.target.select();
};

/**
 * Copies the code to the clipboard.
 */
const copyCode = () => copy();
</script>

<template>
  <Popover v-model:open="open">
    <template #trigger>
      <slot name="trigger" />
    </template>

    <template v-if="hasCode">
      <Label :class="$style.label" :for="inputId">Code</Label>
      <div :class="$style.field">
        <Input
          :id="inputId"
          :model-value="shownCode"
          readonly
          @focus="selectCode"
        />
        <Button v-if="isSupported" @click="copyCode">
          <span :class="$style.buttonContent">{{ copyLabel }}</span>
        </Button>
      </div>
    </template>
    <p
      v-else
      :class="$style.error"
      role="alert"
    >
      Cannot share this build
    </p>
  </Popover>
</template>

<style lang="scss" module>
@use 'styles/colors';
@use 'styles/typography';

.label {
  @include typography.caption;
  color: colors.$text-secondary;
}

.field {
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto;
  gap: 8px;
}

.error {
  @include typography.caption;
  color: colors.$danger;
}

.buttonContent {
  min-inline-size: 7ch;
  padding: 6px 12px;
  text-align: center;
}
</style>
