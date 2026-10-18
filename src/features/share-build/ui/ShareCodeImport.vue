<script setup lang="ts" generic="Kind extends BuildCodeKind">
import { computed, useId } from 'vue';

import { Button } from '@shared/ui/button';
import { Input } from '@shared/ui/input';
import { Label } from '@shared/ui/label';
import { Popover } from '@shared/ui/popover';

import type { BuildCodeKind, BuildDataByKind } from '../model/build-codecs';
import { useShareCodeImport } from '../model/share-code-import';

interface Props {
  /** Kind of build code the form accepts. */
  kind: Kind
}

interface Emits {
  /** Build decoded from a valid code. */
  import: [build: BuildDataByKind[Kind]]
}

const props = defineProps<Props>();

const emit = defineEmits<Emits>();

const inputId = useId();

const errorId = useId();

const { isOpen, code, isInvalid, clearError, setOpen, submit } = useShareCodeImport(
  () => props.kind,
  build => emit('import', build),
);

const errorDescribedBy = computed(() => isInvalid.value ? errorId : undefined);
</script>

<template>
  <Popover :open="isOpen" @update:open="setOpen">
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
          @update:model-value="clearError"
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

<style lang="scss" module src="./ShareCodeImport.scss" />
