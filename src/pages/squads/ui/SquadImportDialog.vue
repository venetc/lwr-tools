<script setup lang="ts">
import { ClipboardPaste } from '@lucide/vue';

import { createId } from '@shared/lib/id';
import { Button } from '@shared/ui/button';
import { Dialog } from '@shared/ui/dialog';
import { Input } from '@shared/ui/input';
import { Label } from '@shared/ui/label';

import { useSquadImport } from '../model/squad-import';

const { isOpen, code, error, isInvalid, errorDescribedBy, errorId, clearError, setOpen, importSquadCode } = useSquadImport();

const codeInputId = createId();
</script>

<template>
  <Button @click="setOpen(true)">
    <span :class="$style.triggerContent">
      <ClipboardPaste :class="$style.triggerIcon" aria-hidden="true" />
      Import
    </span>
  </Button>

  <Dialog
    :open="isOpen"
    title="Import Squad"
    @update:open="setOpen"
  >
    <form :class="$style.form" @submit.prevent="importSquadCode">
      <p :class="$style.note">
        A Squad code becomes a new Squad. Its Builds also appear in their Build calculators.
      </p>

      <Label :class="$style.label" :for="codeInputId">
        Share code
      </Label>
      <div :class="$style.field">
        <Input
          :id="codeInputId"
          v-model="code"
          placeholder="Paste a Squad code"
          :aria-invalid="isInvalid"
          :aria-describedby="errorDescribedBy"
          @update:model-value="clearError"
        />
        <Button type="submit">
          <span :class="$style.submitContent">Import</span>
        </Button>
      </div>

      <p
        v-if="error"
        :id="errorId"
        :class="$style.error"
        role="alert"
      >
        {{ error }}
      </p>
    </form>
  </Dialog>
</template>

<style lang="scss" module src="./SquadImportDialog.scss" />
