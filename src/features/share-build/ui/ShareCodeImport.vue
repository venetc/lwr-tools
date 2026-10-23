<script setup lang="ts" generic="Kind extends LoadoutUnitId">
import type { LoadoutUnitId } from '@entities/loadout';
import { Button } from '@shared/ui/button';
import { Popover } from '@shared/ui/popover';
import { TextField } from '@shared/ui/text-field';

import type { BuildDataByKind } from '../model/build-code';
import { useShareCodeImport } from '../model/share-code-import';
import OutdatedSelectionsDialog from './OutdatedSelectionsDialog.vue';

interface Props {
  /** Kind of build code the form accepts. */
  kind: Kind
}

interface Emits {
  /** Build decoded from a valid code, without the Outdated selections the dialog confirmed. */
  import: [build: BuildDataByKind[Kind]]
}

const props = defineProps<Props>();

const emit = defineEmits<Emits>();

const {
  isOpen,
  code,
  error,
  isOutdatedOpen,
  outdatedGroups,
  setOpen,
  setOutdatedOpen,
  confirmOutdated,
  submit,
} = useShareCodeImport(
  () => props.kind,
  build => emit('import', build),
);
</script>

<template>
  <Popover :open="isOpen" @update:open="setOpen">
    <template #trigger>
      <slot name="trigger" />
    </template>

    <form :class="$style.form" @submit.prevent="submit">
      <TextField
        v-model="code"
        v-model:error="error"
        label="Code"
        placeholder="Paste code"
      >
        <Button type="submit">
          <span :class="$style.buttonContent">Import</span>
        </Button>
      </TextField>
    </form>
  </Popover>

  <OutdatedSelectionsDialog
    :open="isOutdatedOpen"
    mode="import"
    :groups="outdatedGroups"
    @update:open="setOutdatedOpen"
    @confirm="confirmOutdated"
  />
</template>

<style lang="scss" module src="./ShareCodeImport.scss" />
