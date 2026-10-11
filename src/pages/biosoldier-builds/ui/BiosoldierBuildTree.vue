<script setup lang="ts">
import { ClipboardPaste, Share2 } from '@lucide/vue';
import { computed } from 'vue';

import { ExportBiosoldierBuild, ImportBiosoldierBuild } from '@features/share-build';
import { ActionBar } from '@shared/ui/action-bar';
import { EditableTitle } from '@shared/ui/editable-title';
import { TieredPicker } from '@shared/ui/tiered-picker';

import type { BiosoldierBuild, BiosoldierBuildId } from '../model/biosoldier-builds';
import { useBiosoldierBuildEditor } from '../model/useBiosoldierBuildEditor';
import type { BiosoldierRankTier } from '../model/useBiosoldierBuildTiers';
import { useBiosoldierBuildTiers } from '../model/useBiosoldierBuildTiers';
import SoldierRankLabel from './SoldierRankLabel.vue';

interface Props {
  /** Biosoldier build to render and edit. */
  build: Readonly<BiosoldierBuild>
}

interface Emits {
  /** Requests removal of the build. */
  remove: [buildId: BiosoldierBuildId]
}

const props = defineProps<Props>();

const emit = defineEmits<Emits>();

const { tree, tiers, featuredItem } = useBiosoldierBuildTiers(() => props.build);

const { name, readonly, selectPerk, replace } = useBiosoldierBuildEditor(() => props.build);

const isEditable = computed(() => !readonly.value);

/**
 * Requests removal of the build.
 */
const requestRemove = () => emit('remove', props.build.id);

/**
 * Checks whether the rank is the one currently open for selection.
 *
 * @param tier picker tier of the rank.
 */
const isRankHighlighted = (tier: BiosoldierRankTier) => tier.state === 'available';
</script>

<template>
  <TieredPicker
    :key="props.build.biosoldierClass.id"
    :label="tree.name"
    :tiers="tiers"
    :default-item="featuredItem"
    @select="selectPerk"
  >
    <template #header>
      <EditableTitle
        v-model="name"
        :fallback="props.build.biosoldierClass.name"
        edit-label="Rename build"
        :readonly="readonly"
      >
        <template #icon>
          <component
            :is="props.build.biosoldierClass.icon"
            :class="$style.classIcon"
            aria-hidden="true"
          />
        </template>
      </EditableTitle>
      <ActionBar
        v-model:locked="readonly"
        remove-label="Remove build"
        lock-label="Lock build"
        @remove="requestRemove"
      >
        <template #default="{ actionClass }">
          <ImportBiosoldierBuild v-if="isEditable" @import="replace">
            <template #trigger>
              <button :class="actionClass" type="button">
                <ClipboardPaste :class="$style.actionIcon" aria-hidden="true" />
                <span :class="$style.visuallyHidden">Import build</span>
              </button>
            </template>
          </ImportBiosoldierBuild>

          <ExportBiosoldierBuild :build="props.build">
            <template #trigger>
              <button :class="actionClass" type="button">
                <Share2 :class="$style.actionIcon" aria-hidden="true" />
                <span :class="$style.visuallyHidden">Export build</span>
              </button>
            </template>
          </ExportBiosoldierBuild>
        </template>
      </ActionBar>
    </template>

    <template #tier="{ tier }">
      <SoldierRankLabel :rank="tier.rank" :highlighted="isRankHighlighted(tier)" />
    </template>
  </TieredPicker>
</template>

<style lang="scss" module>
@use 'styles/colors';

.classIcon {
  flex: none;
  width: 34px;
  height: 34px;
  color: colors.$accent;
}

.actionIcon {
  width: 18px;
  height: 18px;
}

.visuallyHidden {
  position: absolute;
  width: 1px;
  height: 1px;
  overflow: hidden;
  clip-path: inset(50%);
  white-space: nowrap;
}
</style>
