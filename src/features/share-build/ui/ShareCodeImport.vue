<script setup lang="ts" generic="Value">
import { computed, ref, useId, watch } from 'vue';

import { Button } from '@shared/ui/button';
import { Input } from '@shared/ui/input';
import { Label } from '@shared/ui/label';
import { Popover } from '@shared/ui/popover';

interface Props {
  /** Decodes a pasted code; null for an invalid code. */
  decode: (code: string) => Value | null
}

interface Emits {
  /** Value decoded from a valid code. */
  import: [value: Value]
}

const props = defineProps<Props>();

const emit = defineEmits<Emits>();

const inputId = useId();

const errorId = useId();

const isOpen = ref(false);

const code = ref('');

const isInvalid = ref(false);

const errorDescribedBy = computed(() => isInvalid.value ? errorId : undefined);

watch(code, () => {
  isInvalid.value = false;
});

watch(isOpen, () => {
  if (isOpen.value) return;

  code.value = '';
});

/**
 * Decodes the pasted code: shows an error for an invalid code, otherwise emits the value and closes.
 */
const submit = () => {
  const value = props.decode(code.value);

  if (value === null) {
    isInvalid.value = true;

    return;
  }

  emit('import', value);
  isOpen.value = false;
};
</script>

<template>
  <Popover v-model:open="isOpen">
    <template #trigger>
      <slot name="trigger" />
    </template>

    <form :class="$style.form" @submit.prevent="submit">
      <Label :class="$style.label" :for="inputId">Code</Label>
      <div :class="$style.field">
        <Input
          :id="inputId"
          v-model="code"
          placeholder="Paste code"
          :aria-invalid="isInvalid"
          :aria-describedby="errorDescribedBy"
        />
        <Button type="submit">
          <span :class="$style.buttonContent">Import</span>
        </Button>
      </div>
      <p
        v-if="isInvalid"
        :id="errorId"
        :class="$style.error"
        role="alert"
      >
        Invalid code
      </p>
    </form>
  </Popover>
</template>

<style lang="scss" module>
@use 'styles/colors';
@use 'styles/typography';

.form {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.label {
  @include typography.caption;
  color: colors.$text-secondary;
}

.field {
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto;
  gap: 8px;
}

.buttonContent {
  padding: 6px 12px;
}

.error {
  @include typography.caption;
  color: colors.$danger;
}
</style>
