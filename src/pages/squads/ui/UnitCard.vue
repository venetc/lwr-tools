<script setup lang="ts">
import { Trash2 } from '@lucide/vue';

import { createId } from '@shared/lib/id';
import { HoldButton } from '@shared/ui/hold-button';

import type { UnitCard } from '../model/unit-cards';
import LoadoutTiles from './LoadoutTiles.vue';
import UnitBuild from './UnitBuild.vue';
import UnitBuildIcon from './UnitBuildIcon.vue';

interface Props {
  /** Unit to show. */
  card: UnitCard
}

interface Emits {
  /** Requests removal of the Unit from the Squad once the trash button is held. */
  remove: []
}

const props = defineProps<Props>();

const emit = defineEmits<Emits>();

const headingId = createId();
</script>

<template>
  <article :class="$style.card" :aria-labelledby="headingId">
    <header :class="$style.header">
      <UnitBuildIcon :class="$style.icon" :squad-build="props.card.squadBuild" />

      <div :class="$style.heading">
        <h2 :id="headingId" :class="$style.name">
          {{ props.card.squadBuild.build.name }}
        </h2>
        <p :class="$style.caption">
          {{ props.card.caption }}
        </p>
      </div>

      <HoldButton
        :class="$style.remove"
        title="Hold to remove"
        @hold="emit('remove')"
      >
        <Trash2 :class="$style.removeIcon" aria-hidden="true" />
        <span :class="$style.visuallyHidden">Remove {{ props.card.squadBuild.build.name }}</span>
      </HoldButton>
    </header>

    <UnitBuild :squad-build="props.card.squadBuild" />

    <LoadoutTiles :tiles="props.card.tiles" />
  </article>
</template>

<style lang="scss" module src="./UnitCard.scss" />
