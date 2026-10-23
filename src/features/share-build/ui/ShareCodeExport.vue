<script setup lang="ts" generic="Kind extends LoadoutUnitId">
import type { LoadoutUnitId } from '@entities/loadout';
import { createId } from '@shared/lib/id';
import { Button } from '@shared/ui/button';
import { Input } from '@shared/ui/input';
import { Label } from '@shared/ui/label';
import { Popover } from '@shared/ui/popover';

import type { BuildDataByKind } from '../model/build-code';
import { useShareCodeExport } from '../model/share-code-export';

interface Props {
  /** Kind of build code. */
  kind: Kind
  /** Build to share. */
  build: BuildDataByKind[Kind]
}

const props = defineProps<Props>();

/** Whether the popover is open. */
const open = defineModel<boolean>('open', { default: false });

const inputId = createId();

const { hasCode, shownCode, isSupported, copyLabel, selectCode, copyCode } = useShareCodeExport(
  () => props.kind,
  () => props.build,
  open,
);
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

<style lang="scss" module src="./ShareCodeExport.scss" />
