<script setup lang="ts" generic="Data extends NamedBuildData, Tier extends TieredPickerTier">
import { ClipboardPaste, Share2 } from '@lucide/vue';
import type { VNode } from 'vue';
import { computed } from 'vue';

import type { BuildEditorActions, ListedBuild, NamedBuildData } from '@features/manage-builds';
import { useBuildEditor } from '@features/manage-builds';
import type { ShareCodeDecodeResult } from '@features/share-build';
import { ShareCodeExport, ShareCodeImport } from '@features/share-build';
import { ActionBar } from '@shared/ui/action-bar';
import { EditableTitle } from '@shared/ui/editable-title';
import type { TieredPickerItem, TieredPickerTier } from '@shared/ui/tiered-picker';
import { TieredPicker } from '@shared/ui/tiered-picker';

interface Props {
  /** Build to render and edit. */
  build: Readonly<ListedBuild<Data>>
  /** Accessible name of the build tree. */
  label: string
  /** Name restored when the build name is left blank. */
  fallbackName: string
  /** Tree tiers from lowest to highest. */
  tiers: Tier[]
  /** Item described while the user inspects none. */
  defaultItem: TieredPickerItem | null
  /** Store actions that edit the build. */
  actions: BuildEditorActions<Data>
  /** Share code of the build data; null if it cannot be shared. */
  encode: (data: Data) => string | null
  /** Build data of a share code. */
  decode: (code: string) => ShareCodeDecodeResult<Data>
}

interface TierSlotProps {
  tier: Tier
  /** Whether the tier is open for selection, for the label to stand out. */
  highlighted: boolean
}

const props = defineProps<Props>();

defineSlots<{
  icon?: () => VNode[]
  tier?: (props: TierSlotProps) => VNode[]
}>();

const { name, readonly, selectPerk, replace, remove } = useBuildEditor(() => props.build, props.actions);

const isEditable = computed(() => !readonly.value);

/**
 * Checks whether the tier is open for selection.
 *
 * @param tier picker tier.
 */
const isTierHighlighted = (tier: Tier) => tier.state === 'available';
</script>

<template>
  <TieredPicker
    :label="props.label"
    :tiers="props.tiers"
    :default-item="props.defaultItem"
    @select="selectPerk"
  >
    <template #header>
      <EditableTitle
        v-model="name"
        :fallback="props.fallbackName"
        edit-label="Rename build"
        :readonly="readonly"
      >
        <template #icon>
          <slot name="icon" />
        </template>
      </EditableTitle>
      <ActionBar
        v-model:locked="readonly"
        remove-label="Remove build"
        lock-label="Lock build"
        @remove="remove"
      >
        <template #default="{ actionClass }">
          <ShareCodeImport
            v-if="isEditable"
            :decode="props.decode"
            @import="replace"
          >
            <template #trigger>
              <button :class="actionClass" type="button">
                <ClipboardPaste :class="$style.actionIcon" aria-hidden="true" />
                <span :class="$style.visuallyHidden">Import build</span>
              </button>
            </template>
          </ShareCodeImport>

          <ShareCodeExport :value="props.build" :encode="props.encode">
            <template #trigger>
              <button :class="actionClass" type="button">
                <Share2 :class="$style.actionIcon" aria-hidden="true" />
                <span :class="$style.visuallyHidden">Export build</span>
              </button>
            </template>
          </ShareCodeExport>
        </template>
      </ActionBar>
    </template>

    <template #tier="{ tier }">
      <slot
        name="tier"
        :tier="tier"
        :highlighted="isTierHighlighted(tier)"
      />
    </template>
  </TieredPicker>
</template>

<style lang="scss" module>
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
