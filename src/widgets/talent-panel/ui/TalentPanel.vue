<script setup lang="ts">
import type { AcceptableValue } from 'reka-ui';
import type { TalentBuild, TalentTree } from '@entities/talent';
import type { RankEntry, TalentEntry } from '../model/useTalentRanks';

import { useCssModule } from 'vue';

import { selectTalent, TalentCell } from '@entities/talent';
import { ScrollArea } from '@shared/ui/scroll-area';
import { ToggleGroup, ToggleGroupOption } from '@shared/ui/toggle-group';

import { useDescribedTalent } from '../model/useDescribedTalent';
import { useTalentRanks } from '../model/useTalentRanks';

interface Props {
  tree: TalentTree
}

const props = defineProps<Props>();

const build = defineModel<TalentBuild>({ required: true });

const style = useCssModule();

const { rankEntries } = useTalentRanks(() => props.tree, build);

const {
  descriptionName,
  descriptionText,
  descriptionKey,
  describe,
} = useDescribedTalent(() => props.tree, build);

function onRankUpdate(rankIndex: number, toggledValue: AcceptableValue | null) {
  const talentId = typeof toggledValue === 'string' ? toggledValue : null;
  selectTalent(build.value, rankIndex, talentId);
}

function getRankClass(rankEntry: RankEntry) {
  return [style.rank, style[rankEntry.state]];
}

function getAriaDisabled(rankEntry: RankEntry) {
  return rankEntry.state === 'locked' ? 'true' : null;
}

function getTalentStyle(talentEntry: TalentEntry) {
  return { gridColumn: talentEntry.column };
}
</script>

<template>
  <section :class="$style.panel" :aria-label="tree.title">
    <header :class="$style.header">
      <img
        :class="$style.classIcon"
        :src="tree.icon"
        alt=""
      >
      <h2 :class="$style.title">
        {{ tree.title }}
      </h2>
    </header>

    <ol :class="$style.ranks">
      <li
        v-for="rankEntry in rankEntries"
        :key="rankEntry.rank.title"
        :class="getRankClass(rankEntry)"
      >
        <span :class="$style.rankTitle">
          <img
            :class="$style.rankIcon"
            :src="rankEntry.rank.icon"
            alt=""
          >
          <span :class="$style.rankName">{{ rankEntry.rank.title }}</span>
        </span>

        <ToggleGroup
          :class="$style.talents"
          :model-value="rankEntry.selectedId"
          :roving-focus="false"
          :aria-label="rankEntry.rank.title"
          @update:model-value="onRankUpdate(rankEntry.rankIndex, $event)"
        >
          <ToggleGroupOption
            v-for="talentEntry in rankEntry.talentEntries"
            :key="talentEntry.talent.id"
            :class="$style.talent"
            :style="getTalentStyle(talentEntry)"
            :value="talentEntry.talent.id"
            :aria-disabled="getAriaDisabled(rankEntry)"
            @pointerenter="describe(talentEntry.talent)"
            @focus="describe(talentEntry.talent)"
          >
            <TalentCell
              :icon="talentEntry.talent.icon"
              :name="talentEntry.talent.name"
              :rank-state="rankEntry.state"
              :selected="talentEntry.isSelected"
            />
          </ToggleGroupOption>
        </ToggleGroup>
      </li>
    </ol>

    <div :class="$style.description" aria-live="polite">
      <p :class="$style.descriptionName">
        {{ descriptionName }}
      </p>

      <ScrollArea
        :key="descriptionKey"
        :class="$style.descriptionScroll"
        auto-scroll
      >
        <p :class="$style.descriptionText">
          {{ descriptionText }}
        </p>
      </ScrollArea>
    </div>
  </section>
</template>

<style lang="scss" module>
@use 'styles/colors';
@use 'styles/typography';
@use 'styles/shape';
@use 'styles/media';

$cell: 44px;
$badge: 38px;

.panel {
  @include shape.frame(shape.$cut-lg, 2px, colors.$accent, colors.$surface-1);
  display: flex;
  flex-direction: column;
  gap: 14px;
  width: 100%;
  max-width: 480px;
  padding: 14px 16px 20px;
}

.header {
  display: flex;
  align-items: center;
  gap: 12px;
  min-height: $badge;
}

.classIcon {
  flex: none;
  width: $badge;
  height: $badge;
}

.title {
  @include typography.caps-1;
  color: colors.$text-primary;
  text-box: trim-both cap alphabetic;
}

.ranks {
  display: flex;
  flex-direction: column;
  gap: 6px;
  margin: 0;
  padding: 0;
  list-style: none;
}

.rank {
  display: grid;
  grid-template-columns: 1fr auto;
  align-items: center;
  gap: 16px;
  padding: 5px 10px 5px 12px;
  background: colors.$surface-2;
  border-width: 1px;
  border-style: solid;
  border-radius: 3px;
}

.completed {
  border-color: colors.$border;

  .rankTitle {
    color: colors.$text-secondary;
  }
}

.available {
  border-color: colors.$highlight-muted;
  box-shadow: 0 0 8px colors.$highlight-glow;

  .rankTitle {
    color: colors.$highlight;
  }
}

.locked {
  border-color: colors.$border;

  .rankTitle {
    color: colors.$text-disabled;
  }
}

.rankTitle {
  @include typography.caps-2;
  display: flex;
  align-items: center;
  gap: 10px;
}

.rankName {
  text-box: trim-both cap alphabetic;
}

.rankIcon {
  width: 30px;
  height: 30px;
}

.talents {
  display: grid;
  grid-template-columns: repeat(3, $cell);
  gap: 12px;
}

.talent {
  display: block;
  width: $cell;
  height: $cell;
  padding: 0;
  background: none;
  transition: filter 0.12s ease-out;

  @include media.with-hover {
    &:hover {
      filter: brightness(1.3);
    }
  }

  &:not([aria-disabled='true']) {
    cursor: pointer;
  }

  &[aria-disabled='true'] {
    cursor: not-allowed;
  }

  &:focus-visible {
    filter: brightness(1.3);
    outline-offset: 6px;
  }
}

.description {
  display: flex;
  flex-direction: column;
  gap: 6px;
  padding: 6px 16px 0;
  text-align: center;
}

.descriptionName {
  @include typography.heading-4;
  display: grid;
  place-items: center;
  block-size: 1.5rem;
  margin: 0;
  color: colors.$text-primary;
}

$descent-overflow: 0.1em;

.descriptionScroll {
  @include typography.body-1;
  block-size: calc(5lh + #{$descent-overflow * 2.5});
}

.descriptionText {
  @include typography.body-1;
  color: colors.$text-secondary;
  margin: 0;
  padding-inline: 12px;
  padding-block-end: $descent-overflow;
}
</style>
