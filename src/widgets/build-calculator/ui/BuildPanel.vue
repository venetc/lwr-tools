<script setup lang="ts" generic="Kind extends LoadoutUnitId, Group extends TieredPickerGroup<BuildTreeTier>">
import { ClipboardPaste, RotateCcw, Share2, TriangleAlert } from '@lucide/vue';
import type { VNode } from 'vue';
import { useCssModule } from 'vue';

import type { LoadoutUnitId } from '@entities/loadout';
import type { BuildDataByKind } from '@features/share-build';
import { OutdatedSelectionsDialog, ShareCodeExport, ShareCodeImport, useOutdatedUpdate } from '@features/share-build';
import { ActionBar } from '@shared/ui/action-bar';
import { Button } from '@shared/ui/button';
import { EditableTitle } from '@shared/ui/editable-title';
import { HoldButton } from '@shared/ui/hold-button';
import type { TieredPickerGroup, TieredPickerItem } from '@shared/ui/tiered-picker';
import { TieredPicker, TieredPickerCell } from '@shared/ui/tiered-picker';

import type { SavedBuild } from '../model/build-list';
import { useBuildPanel } from '../model/build-panel';
import type { BuildTreeTier } from '../model/saved-tree';

interface Props {
  /** Kind of build code, for sharing and importing the build. */
  kind: Kind
  /** Build to render; an Outdated build is frozen until the update. */
  build: SavedBuild<Kind>
  /** Accessible name of the build tree. */
  label: string
  /** Name restored when the build name is left blank. */
  fallbackName: string
  /** Groups of tiers, such as trees; with more than one, they are shown behind tabs. */
  groups: readonly Group[]
  /** Whether the panel offers removal of the build. */
  removable?: boolean
}

interface Emits {
  /** Requests a new build name. */
  rename: [name: string]
  /** Requests locking or unlocking the build. */
  lock: [isReadonly: boolean]
  /** Requests replacing the build with imported data. */
  replace: [data: BuildDataByKind[Kind]]
  /** Requests resetting the build to a new one once the reset button is held; the name stays. */
  reset: []
  /** Requests removal of the build. */
  remove: []
  /** Requests the update of the Outdated build, once confirmed in the «Update build» dialog. */
  update: []
  /** Requests an item selection on a tier of the group; null clears the tier. */
  select: [groupId: string, tierIndex: number, itemId: string | null]
}

interface TierSlotProps {
  tier: Group['tiers'][number]
  /** Whether the tier is open for selection, for the label to stand out. */
  highlighted: boolean
}

interface GroupSlotProps {
  group: Group
}

interface ItemNameSlotProps {
  item: TieredPickerItem
  group: Group
}

const props = withDefaults(defineProps<Props>(), {
  removable: false,
});

const emit = defineEmits<Emits>();

defineSlots<{
  'icon'?: () => VNode[]
  'badge'?: () => VNode[]
  'tier'?: (props: TierSlotProps) => VNode[]
  'tab'?: (props: GroupSlotProps) => VNode[]
  'item-name'?: (props: ItemNameSlotProps) => VNode[]
}>();

const {
  name,
  readonly,
  isOutdated,
  isEditable,
  isTitleReadonly,
  outdatedCountText,
  select,
  isTierHighlighted,
  isOutdatedCell,
  getCellClass,
  getCellIconClass,
} = useBuildPanel(() => props.build, useCssModule(), {
  onRename: value => emit('rename', value),
  onLock: isReadonly => emit('lock', isReadonly),
  onSelect: (groupId, tierIndex, itemId) => emit('select', groupId, tierIndex, itemId),
});

const {
  isOpen: isUpdateOpen,
  groups: updateGroups,
  open: openUpdate,
  confirm: confirmUpdate,
} = useOutdatedUpdate(() => props.kind, () => props.build.outdated, () => emit('update'));
</script>

<template>
  <TieredPicker
    :label="props.label"
    :groups="props.groups"
    @select="select"
  >
    <template #header>
      <EditableTitle
        v-model="name"
        :fallback="props.fallbackName"
        edit-label="Rename build"
        :readonly="isTitleReadonly"
      >
        <template #icon>
          <slot name="icon" />
        </template>

        <template #badge>
          <slot name="badge" />
        </template>
      </EditableTitle>
      <div v-if="isOutdated" :class="$style.outdated">
        <span :class="$style.outdatedChip">
          <TriangleAlert :class="$style.outdatedChipIcon" aria-hidden="true" />
          {{ outdatedCountText }}
        </span>
        <Button variant="primary" @click="openUpdate">
          <span :class="$style.buttonContent">Update</span>
        </Button>
      </div>
      <ActionBar
        v-model:locked="readonly"
        remove-label="Remove build"
        lock-label="Lock build"
        :removable="props.removable"
        :lockable="isEditable"
        @remove="emit('remove')"
      >
        <template v-if="isEditable" #editable="{ actionClass, holdActionClass }">
          <ShareCodeImport :kind="props.kind" @import="emit('replace', $event)">
            <template #trigger>
              <button :class="actionClass" type="button">
                <ClipboardPaste :class="$style.actionIcon" aria-hidden="true" />
                <span :class="$style.visuallyHidden">Import build</span>
              </button>
            </template>
          </ShareCodeImport>

          <HoldButton
            :class="holdActionClass"
            title="Hold to reset"
            @hold="emit('reset')"
          >
            <RotateCcw :class="$style.actionIcon" aria-hidden="true" />
            <span :class="$style.visuallyHidden">Reset build</span>
          </HoldButton>
        </template>

        <template v-if="isEditable" #default="{ actionClass }">
          <ShareCodeExport :kind="props.kind" :build="props.build">
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

    <template #tab="{ group }">
      <slot name="tab" :group="group">
        {{ group.name }}
      </slot>
    </template>

    <template #tier="{ tier }">
      <slot
        name="tier"
        :tier="tier"
        :highlighted="isTierHighlighted(tier)"
      />
    </template>

    <template #cell="{ tier, option }">
      <span :class="getCellClass(tier, option)">
        <TieredPickerCell
          :class="getCellIconClass(tier, option)"
          :icon="option.item.icon"
          :name="option.item.name"
          :appearance="option.appearance"
        />
        <span
          v-if="isOutdatedCell(tier, option)"
          :class="$style.outdatedLabel"
          aria-hidden="true"
        >OLD</span>
      </span>
    </template>

    <template #item-name="{ item, group }">
      <slot
        name="item-name"
        :item="item"
        :group="group"
      >
        {{ item.name }}
      </slot>
    </template>
  </TieredPicker>

  <OutdatedSelectionsDialog
    v-model:open="isUpdateOpen"
    mode="update"
    :groups="updateGroups"
    @confirm="confirmUpdate"
  />
</template>

<style lang="scss" module src="./BuildPanel.scss" />
