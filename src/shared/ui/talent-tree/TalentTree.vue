<script setup lang="ts" generic="Rank extends TalentRank">
import type { AcceptableValue } from 'reka-ui';
import type { VNode } from 'vue';
import { computed, useCssModule } from 'vue';

import { ScrollArea } from '@shared/ui/scroll-area';
import { ToggleGroup, ToggleGroupOption } from '@shared/ui/toggle-group';

import { selectTalent } from './model/build';
import type { TalentBuild, TalentRank, TalentRankState, TalentTreeData } from './model/types';
import { useDescribedTalent } from './model/useDescribedTalent';
import type { RankEntry, TalentEntry } from './model/useTalentRanks';
import { useTalentRanks } from './model/useTalentRanks';
import TalentCell from './TalentCell.vue';

interface Props {
  tree: TalentTreeData<Rank>
}

interface RankSlotProps {
  rank: Rank
  state: TalentRankState
}

const props = defineProps<Props>();

const slots = defineSlots<{
  header?: () => VNode[]
  rank?: (props: RankSlotProps) => VNode[]
}>();

const build = defineModel<TalentBuild>({ required: true });

const style = useCssModule();

const rankEntries = useTalentRanks(() => props.tree, build);

const hasHeader = computed(() => slots.header !== undefined);

const { describedTalent, hasGrants, describe } = useDescribedTalent(() => props.tree, build);

/**
 * Применяет выбор таланта на ранге к билду.
 *
 * @param rankIndex индекс ранга в дереве.
 * @param toggledValue id выбранного таланта; null или пусто — выбор снят.
 */
function onRankUpdate(rankIndex: number, toggledValue: AcceptableValue | null) {
  const talentId = typeof toggledValue === 'string' ? toggledValue : null;
  selectTalent(build.value, rankIndex, talentId);
}

/**
 * Классы ранга по его состоянию.
 *
 * @param rankEntry ранг с состоянием.
 */
function getRankClass(rankEntry: RankEntry<Rank>) {
  return [style.rank, style[rankEntry.state]];
}

/**
 * aria-disabled для закрытого ранга.
 *
 * @param rankEntry ранг с состоянием.
 */
function getAriaDisabled(rankEntry: RankEntry<Rank>) {
  return rankEntry.state === 'locked' ? 'true' : null;
}

/**
 * Колонка сетки для таланта.
 *
 * @param talentEntry талант с рассчитанной колонкой.
 */
function getTalentStyle(talentEntry: TalentEntry) {
  return { gridColumn: talentEntry.column };
}
</script>

<template>
  <section :class="$style.panel" :aria-label="tree.name">
    <header v-if="hasHeader" :class="$style.header">
      <slot name="header" />
    </header>

    <ol :class="$style.ranks">
      <li
        v-for="(rankEntry, rankIndex) in rankEntries"
        :key="rankEntry.rank.id"
        :class="getRankClass(rankEntry)"
      >
        <span :class="$style.rankLabel">
          <slot
            name="rank"
            :rank="rankEntry.rank"
            :state="rankEntry.state"
          />
        </span>

        <ToggleGroup
          :class="$style.talents"
          :model-value="rankEntry.selectedId"
          :roving-focus="false"
          :aria-label="rankEntry.rank.name"
          @update:model-value="onRankUpdate(rankIndex, $event)"
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

    <div
      v-if="describedTalent"
      :class="$style.description"
      aria-live="polite"
    >
      <p :class="$style.descriptionName">
        {{ describedTalent.name }}
      </p>

      <ScrollArea
        :key="describedTalent.id"
        :class="$style.descriptionScroll"
        auto-scroll
      >
        <p :class="$style.descriptionText">
          {{ describedTalent.description }}
        </p>

        <ul v-if="hasGrants" :class="$style.grants">
          <li
            v-for="grantedTalent in describedTalent.grants"
            :key="grantedTalent.id"
            :class="$style.grant"
          >
            <span :class="$style.grantTitle">
              <img
                :class="$style.grantIcon"
                :src="grantedTalent.icon"
                alt=""
              >
              <span :class="$style.grantName">{{ grantedTalent.name }}</span>
            </span>
            <p :class="$style.grantText">
              {{ grantedTalent.description }}
            </p>
          </li>
        </ul>
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

  .rankLabel {
    color: colors.$text-secondary;
  }
}

.available {
  border-color: colors.$highlight-muted;
  box-shadow: 0 0 8px colors.$highlight-glow;

  .rankLabel {
    color: colors.$highlight;
  }
}

.locked {
  border-color: colors.$border;

  .rankLabel {
    color: colors.$text-disabled;
  }
}

.rankLabel {
  display: flex;
  align-items: center;
  min-width: 0;
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
    &:hover:not(:focus-visible) {
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

.grants {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin: 10px 0 0;
  padding: 10px 12px $descent-overflow;
  border-block-start: 1px solid colors.$border-subtle;
  list-style: none;
}

.grant {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
}

.grantTitle {
  display: flex;
  align-items: center;
  gap: 8px;
}

.grantIcon {
  flex: none;
  width: 28px;
  height: 28px;
}

.grantName {
  @include typography.label-2;
  color: colors.$text-primary;
}

.grantText {
  @include typography.body-2;
  margin: 0;
  color: colors.$text-secondary;
}
</style>
