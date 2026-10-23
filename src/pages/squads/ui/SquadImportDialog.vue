<script setup lang="ts">
import { ClipboardPaste } from '@lucide/vue';

import { Button } from '@shared/ui/button';
import { Dialog } from '@shared/ui/dialog';
import { TextField } from '@shared/ui/text-field';

import { useSquadImport } from '../model/squad-import';

const { isOpen, code, error, setOpen, importSquadCode } = useSquadImport();
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

      <TextField
        v-model="code"
        v-model:error="error"
        label="Share code"
        placeholder="Paste a Squad code"
      >
        <Button type="submit">
          <span :class="$style.submitContent">Import</span>
        </Button>
      </TextField>
    </form>
  </Dialog>
</template>

<style lang="scss" module src="./SquadImportDialog.scss" />
