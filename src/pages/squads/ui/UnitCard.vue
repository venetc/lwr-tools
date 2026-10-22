<script setup lang="ts">
import { Trash2 } from '@lucide/vue';

import { createId } from '@shared/lib/id';
import { HoldButton } from '@shared/ui/hold-button';

import type { UnitCard } from '../model/unit-cards';
import UnitBuild from './UnitBuild.vue';
import UnitBuildIcon from './UnitBuildIcon.vue';
import UnitLoadout from './UnitLoadout.vue';
import UnitOfficerRankBadge from './UnitOfficerRankBadge.vue';

interface Props {
  /** Unit to show. */
  card: UnitCard
}

interface Emits {
  /** Requests removal of the Unit from the Squad once the trash button is held. */
  remove: []
  /** Tells of an edit of what the Build of the Unit holds, made in the Build dialog. */
  buildChange: []
  /** Tells that the Build dialog of the Unit closed, so the edits made in it can be checked against the Loadouts. */
  buildClose: []
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
        <div :class="$style.title">
          <h2 :id="headingId" :class="$style.name">
            {{ props.card.squadBuild.build.name }}
          </h2>
          <UnitOfficerRankBadge :squad-build="props.card.squadBuild" />
        </div>
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

    <UnitBuild
      :squad-build="props.card.squadBuild"
      :close-note="props.card.closeNote"
      @change="emit('buildChange')"
      @close="emit('buildClose')"
    />

    <UnitLoadout :card="props.card" />
  </article>
</template>

<style lang="scss" module src="./UnitCard.scss" />
