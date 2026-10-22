<script setup lang="ts">
import type { BiosoldierBuildData } from '@entities/soldier';

import { useOfficerRankBadge } from '../model/officer-rank-badge';

interface Props {
  /** Biosoldier build whose senior officer rank the badge shows. */
  build: Readonly<BiosoldierBuildData>
}

const props = defineProps<Props>();

const officerRank = useOfficerRankBadge(() => props.build.officerPerks);
</script>

<template>
  <span
    v-if="officerRank"
    :class="$style.badge"
    role="img"
    :aria-label="officerRank.name"
    :title="officerRank.name"
  >
    {{ officerRank.abbreviation }}
  </span>
</template>

<style lang="scss" module src="./OfficerRankBadge.scss" />
