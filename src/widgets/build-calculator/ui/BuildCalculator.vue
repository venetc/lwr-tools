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
      <div :class="$style.toolbarContent">
        <div :class="$style.add">
          <slot name="add" />
        </div>

        <ShareCodeImport :kind="props.kind" @import="requestImport">
          <template #trigger>
            <Button :class="$style.import">
              <span :class="$style.importContent">
                <ClipboardPaste :class="$style.importIcon" aria-hidden="true" />
                Import
              </span>
            </Button>
          </template>
        </ShareCodeImport>

        <ListNav
          :class="$style.nav"
          :items="navItems"
          caption="Click to scroll to a build"
          @select="scrollToPanel"
          @remove="requestRemove"
        >
          <template v-if="hasNavIcon" #icon="{ item }">
            <slot name="nav-icon" :build="item.build" />
          </template>
        </ListNav>
      </div>
    </div>
  </main>
</template>

<style lang="scss" module>
@use 'styles/colors';
@use 'styles/layout';

// Toolbar width from which the add buttons, the import button and the build list fit in one row.
$toolbar-row-min-width: 720px;

.page {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.builds {
  flex: 1;
  display: grid;
  padding: 24px 16px;
  grid-template-columns: repeat(auto-fill, minmax(min(100%, 360px), 440px));
  justify-content: center;
  align-content: start;
  align-items: start;
  gap: 24px;
}

.build {
  scroll-margin-block-start: calc(#{layout.$site-header-height} + 16px);
}

.toolbar {
  position: sticky;
  inset-block-end: 0;
  z-index: 4;
  container-type: inline-size;
  padding: 8px 16px max(8px, env(safe-area-inset-bottom));
  background: colors.$surface-translucent;
  backdrop-filter: blur(8px);
  border-block-start: 1px solid colors.$border-subtle;
}

.toolbarContent {
  display: grid;
  gap: 8px;

  @container (width >= #{$toolbar-row-min-width}) {
    grid-template-columns: auto auto minmax(0, 1fr);
    grid-template-areas: 'add import nav';
    align-items: center;
  }

  @container (width < #{$toolbar-row-min-width}) {
    grid-template-columns: minmax(0, 1fr) auto;
    grid-template-areas: 'nav nav' 'add import';
  }
}

.add {
  grid-area: add;
}

.import {
  grid-area: import;
}

.importContent {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 3px 10px;
}

.importIcon {
  flex: none;
  width: 16px;
  height: 16px;
}

.nav {
  grid-area: nav;

  @container (width >= #{$toolbar-row-min-width}) {
    padding-inline-start: 8px;
    border-inline-start: 1px solid colors.$border-subtle;
  }
}
</style>
