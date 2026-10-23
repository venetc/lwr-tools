<script setup lang="ts">
import { Button } from '@shared/ui/button';
import { Dialog, DialogClose } from '@shared/ui/dialog';

interface Props {
  /** Dialog title that names the build: `Delete «Assault Ace»?` */
  title: string
  /** Squads the build stands in and the Units that go with it. */
  note: string
}

interface Emits {
  /** Requests removal of the build with its Units. */
  delete: []
}

const props = defineProps<Props>();

const emit = defineEmits<Emits>();

/** Whether the dialog is open; closing it keeps the build. */
const open = defineModel<boolean>('open', { default: false });
</script>

<template>
  <Dialog
    v-model:open="open"
    :title="props.title"
  >
    <p :class="$style.note">
      {{ props.note }}
    </p>

    <div :class="$style.actions">
      <Button variant="danger" @click="emit('delete')">
        <span :class="$style.buttonContent">Delete</span>
      </Button>
      <DialogClose>
        <Button>
          <span :class="$style.buttonContent">Cancel</span>
        </Button>
      </DialogClose>
    </div>
  </Dialog>
</template>

<style lang="scss" module src="./BuildRemovalDialog.scss" />
