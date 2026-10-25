<script setup lang="ts">
import { ArrowRight } from '@lucide/vue';

import { Button } from '@shared/ui/button';
import { Dialog, DialogClose } from '@shared/ui/dialog';
import { LoadingImage } from '@shared/ui/loading-image';

import type { OutdatedSelectionGroup } from '../model/outdated-selection-cards';
import type { OutdatedSelectionsDialogMode } from '../model/outdated-selections-dialog';
import { useOutdatedSelectionsDialog } from '../model/outdated-selections-dialog';

interface Props {
  /** What the dialog confirms: the import of a code or the update of an Outdated build. */
  mode: OutdatedSelectionsDialogMode
  /** Cards by build, under the build name if the group has one. */
  groups: readonly OutdatedSelectionGroup[]
}

interface Emits {
  /** Confirms the import or the update. */
  confirm: []
}

const props = defineProps<Props>();

const emit = defineEmits<Emits>();

/** Whether the dialog is open; closing it cancels. */
const open = defineModel<boolean>('open', { default: false });

const { text } = useOutdatedSelectionsDialog(() => props.mode);
</script>

<template>
  <Dialog v-model:open="open" :title="text.title">
    <p :class="$style.intro">
      {{ text.intro }}
    </p>

    <div :class="$style.groups">
      <section
        v-for="group in props.groups"
        :key="group.id"
        :class="$style.group"
      >
        <h3 v-if="group.name" :class="$style.groupName">
          {{ group.name }}
        </h3>

        <ol :class="$style.cards">
          <li
            v-for="card in group.cards"
            :key="card.id"
            :class="$style.card"
          >
            <span :class="$style.step">
              <component
                :is="card.stepIcon"
                v-if="card.stepIcon"
                :class="$style.stepIcon"
                aria-hidden="true"
              />
              <LoadingImage
                v-else-if="card.stepImage"
                :class="$style.stepIcon"
                :src="card.stepImage.src"
                :placeholder="card.stepImage.placeholder"
                alt=""
              />
              <span :class="$style.stepText">
                <span :class="$style.section">{{ card.section }}</span>
                <span v-if="card.stepName">{{ card.stepName }}</span>
              </span>
            </span>

            <span :class="$style.change">
              <figure
                v-for="ability in card.codeAbilities"
                :key="ability.id"
                :class="$style.figure"
              >
                <LoadingImage
                  :class="$style.icon"
                  :src="ability.icon"
                  :placeholder="ability.iconPlaceholder"
                  alt=""
                />
                <figcaption :class="$style.caption">
                  {{ ability.name }}
                </figcaption>
              </figure>

              <ArrowRight :class="$style.arrow" aria-hidden="true" />

              <figure v-if="card.current" :class="$style.figure">
                <LoadingImage
                  :class="$style.icon"
                  :src="card.current.icon"
                  :placeholder="card.current.iconPlaceholder"
                  alt=""
                />
                <figcaption :class="$style.caption">
                  {{ card.current.name }}
                </figcaption>
              </figure>
              <figure v-else :class="$style.figure">
                <span :class="$style.emptyCell" />
                <figcaption :class="$style.caption">
                  {{ card.note }}
                </figcaption>
              </figure>
            </span>
          </li>
        </ol>
      </section>
    </div>

    <div :class="$style.actions">
      <DialogClose>
        <Button>
          <span :class="$style.buttonContent">Cancel</span>
        </Button>
      </DialogClose>
      <Button variant="primary" @click="emit('confirm')">
        <span :class="$style.buttonContent">{{ text.confirmLabel }}</span>
      </Button>
    </div>
  </Dialog>
</template>

<style lang="scss" module src="./OutdatedSelectionsDialog.scss" />
