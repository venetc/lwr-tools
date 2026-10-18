<script setup lang="ts" generic="Kind extends BuildCodeKind, Build extends ListedBuild<BuildDataByKind[Kind]>">
import { ClipboardPaste } from '@lucide/vue';
import type { VNode } from 'vue';

import type { ListedBuild } from '@features/manage-builds';
import { useBuildNavItems } from '@features/manage-builds';
import type { BuildCodeKind, BuildDataByKind } from '@features/share-build';
import { ShareCodeImport } from '@features/share-build';
import { usePanelScroll } from '@shared/lib/panel-scroll';
import { Button } from '@shared/ui/button';
import { ListNav } from '@shared/ui/list-nav';

interface Props {
  /** Builds of the calculator, in page order. */
  builds: readonly Build[]
  /** Kind of build code, for importing a new build. */
  kind: Kind
}

interface Emits {
  /** Requests a new build from imported data. */
  import: [data: BuildDataByKind[Kind]]
  /** Requests removal of the build. */
  remove: [buildId: string]
}

interface BuildSlotProps {
  build: Build
}

const props = defineProps<Props>();

const emit = defineEmits<Emits>();

const slots = defineSlots<{
  'build'?: (props: BuildSlotProps) => VNode[]
  'add'?: () => VNode[]
  'nav-icon'?: (props: BuildSlotProps) => VNode[]
}>();

const { panelRef, scrollToPanel } = usePanelScroll();

const navItems = useBuildNavItems(() => props.builds);

const hasNavIcon = Boolean(slots['nav-icon']);

/**
 * Requests a new build from imported data.
 *
 * @param data imported build data.
 */
const requestImport = (data: BuildDataByKind[Kind]) => emit('import', data);

/**
 * Requests removal of the build.
 *
 * @param buildId build id.
 */
const requestRemove = (buildId: string) => emit('remove', buildId);
</script>

<template>
  <main :class="$style.page">
    <div :class="$style.builds">
      <div
        v-for="build in props.builds"
        :ref="panelRef(build.id)"
        :key="build.id"
        :class="$style.build"
      >
        <slot name="build" :build="build" />
      </div>
    </div>

    <div :class="$style.toolbar">
      <div :class="$style.actions">
        <slot name="add" />

        <ShareCodeImport :kind="props.kind" @import="requestImport">
          <template #trigger>
            <Button>
              <span :class="$style.importContent">
                <ClipboardPaste :class="$style.importIcon" aria-hidden="true" />
                Import
              </span>
            </Button>
          </template>
        </ShareCodeImport>
      </div>

      <ListNav
        :class="$style.nav"
        :items="navItems"
        label="Builds"
        @select="scrollToPanel"
        @remove="requestRemove"
      >
        <template v-if="hasNavIcon" #icon="{ item }">
          <slot name="nav-icon" :build="item.build" />
        </template>
      </ListNav>
    </div>
  </main>
</template>

<style lang="scss" module src="./BuildCalculator.scss" />
