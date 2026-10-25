<script setup lang="ts">
import { Check, Plus } from '@lucide/vue';
import { useCssModule } from 'vue';

import { Button } from '@shared/ui/button';
import { Dialog } from '@shared/ui/dialog';
import { LoadingImage } from '@shared/ui/loading-image';

import { SIGNATURE_SKILL_TEXT } from '../config/constants';
import type { SavedBuild } from '../model/build-list';
import { useSignatureSkillButton } from '../model/signature-skill-button';

interface Props {
  /** Biosoldier or MEC build of the panel; a Read-only or Outdated build keeps its Signature skill. */
  build: Readonly<SavedBuild<'biosoldier' | 'mec'>>
}

interface Emits {
  /** Requests a new Signature skill of the build; null clears it. */
  select: [perkId: string | null]
}

const props = defineProps<Props>();

const emit = defineEmits<Emits>();

const {
  isOpen,
  perk,
  isFrozen,
  isShown,
  label,
  buttonClass,
  isClearDisabled,
  tiles,
  isMarked,
  getTileClass,
  open,
  mark,
  clear,
  save,
} = useSignatureSkillButton(() => props.build, useCssModule(), {
  onSelect: perkId => emit('select', perkId),
});
</script>

<template>
  <button
    v-if="isShown"
    :class="buttonClass"
    type="button"
    :disabled="isFrozen"
    :title="label"
    :aria-label="label"
    @click="open"
  >
    <LoadingImage
      v-if="perk"
      :class="$style.image"
      :src="perk.icon.selected"
      :placeholder="perk.icon.placeholder.selected"
      alt=""
    />
    <Plus
      v-else
      :class="$style.plus"
      aria-hidden="true"
    />
  </button>

  <Dialog v-model:open="isOpen" :title="SIGNATURE_SKILL_TEXT.dialogTitle">
    <div :class="$style.grid">
      <button
        v-for="tile in tiles"
        :key="tile.perk.id"
        :class="getTileClass(tile.perk.id)"
        type="button"
        :aria-pressed="isMarked(tile.perk.id)"
        @click="mark(tile.perk.id)"
      >
        <span :class="$style.tileIcon">
          <LoadingImage
            :class="$style.image"
            :src="tile.perk.icon.selected"
            :placeholder="tile.perk.icon.placeholder.selected"
            alt=""
          />
          <Check
            v-if="tile.isInBuild"
            :class="$style.inBuild"
            role="img"
            :aria-label="SIGNATURE_SKILL_TEXT.inBuild"
          />
        </span>
        <span :class="$style.tileName">{{ tile.perk.name }}</span>
      </button>
    </div>

    <div :class="$style.actions">
      <Button :disabled="isClearDisabled" @click="clear">
        <span :class="$style.buttonContent">Clear</span>
      </Button>
      <Button variant="primary" @click="save">
        <span :class="$style.buttonContent">Save</span>
      </Button>
    </div>
  </Dialog>
</template>

<style lang="scss" module src="./SignatureSkillButton.scss" />
