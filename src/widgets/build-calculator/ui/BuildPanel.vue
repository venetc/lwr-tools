<script setup lang="ts" generic="Kind extends BuildCodeKind, Group extends TieredPickerGroup">
import { ClipboardPaste, RotateCcw, Share2 } from '@lucide/vue';
import type { VNode } from 'vue';

import type { ListedBuild } from '@features/manage-builds';
import type { BuildCodeKind, BuildDataByKind } from '@features/share-build';
import { ShareCodeExport, ShareCodeImport } from '@features/share-build';
import { ActionBar } from '@shared/ui/action-bar';
import { EditableTitle } from '@shared/ui/editable-title';
import type { TieredPickerGroup, TieredPickerItem, TieredPickerTier } from '@shared/ui/tiered-picker';
import { TieredPicker } from '@shared/ui/tiered-picker';

import { useBuildPanelFields } from '../model/build-panel';

interface Props {
  /** Kind of build code, for sharing and importing the build. */
  kind: Kind
  /** Build to render. */
  build: ListedBuild<BuildDataByKind[Kind]>
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
  /** Requests resetting the build to a new one; the name stays. */
  reset: []
  /** Requests removal of the build. */
  remove: []
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
  'tier'?: (props: TierSlotProps) => VNode[]
  'tab'?: (props: GroupSlotProps) => VNode[]
  'item-name'?: (props: ItemNameSlotProps) => VNode[]
}>();

const { name, readonly } = useBuildPanelFields(() => props.build, {
  onRename: value => emit('rename', value),
  onLock: isReadonly => emit('lock', isReadonly),
});

/**
 * Requests replacing the build with imported data.
 *
 * @param data imported build data.
 */
const requestReplace = (data: BuildDataByKind[Kind]) => emit('replace', data);

/**
 * Requests resetting the build to a new one.
 */
const requestReset = () => emit('reset');

/**
 * Requests removal of the build.
 */
const requestRemove = () => emit('remove');

/**
 * Requests an item selection on a tier of the group.
 *
 * @param groupId group id.
 * @param tierIndex tier index in the group.
 * @param itemId selected item id, or null to clear the tier.
 */
const requestSelect = (groupId: string, tierIndex: number, itemId: string | null) => emit('select', groupId, tierIndex, itemId);

/**
 * Checks whether the tier is open for selection.
 *
 * @param tier picker tier.
 */
const isTierHighlighted = (tier: TieredPickerTier) => tier.state === 'available';
</script>

<template>
  <TieredPicker
    :label="props.label"
    :groups="props.groups"
    @select="requestSelect"
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
        :removable="props.removable"
        @remove="requestRemove"
      >
        <template #editable="{ actionClass }">
          <ShareCodeImport :kind="props.kind" @import="requestReplace">
            <template #trigger>
              <button :class="actionClass" type="button">
                <ClipboardPaste :class="$style.actionIcon" aria-hidden="true" />
                <span :class="$style.visuallyHidden">Import build</span>
              </button>
            </template>
          </ShareCodeImport>

          <button
            :class="actionClass"
            type="button"
            @click="requestReset"
          >
            <RotateCcw :class="$style.actionIcon" aria-hidden="true" />
            <span :class="$style.visuallyHidden">Reset build</span>
          </button>
        </template>

        <template #default="{ actionClass }">
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
