<script setup lang="ts">
import { ClipboardPaste, Plus } from '@lucide/vue';
import { storeToRefs } from 'pinia';

import { BIOSOLDIER_CLASSES } from '@entities/biosoldier';
import { ImportBiosoldierBuild } from '@features/share-build';
import { usePanelScroll } from '@shared/lib/panel-scroll';
import { Button } from '@shared/ui/button';
import { ListNav } from '@shared/ui/list-nav';

import { useBiosoldierBuildsStore } from '../model/biosoldier-builds';
import { useBiosoldierBuildNavItems } from '../model/useBiosoldierBuildNavItems';
import BiosoldierBuildTree from './BiosoldierBuildTree.vue';

const biosoldierBuildsStore = useBiosoldierBuildsStore();

const { builds } = storeToRefs(biosoldierBuildsStore);

const { panelRef, scrollToPanel } = usePanelScroll();

const navItems = useBiosoldierBuildNavItems(builds);
</script>

<template>
  <main :class="$style.page">
    <div :class="$style.builds">
      <BiosoldierBuildTree
        v-for="build in builds"
        :ref="panelRef(build.id)"
        :key="build.id"
        :class="$style.build"
        :build="build"
        @remove="biosoldierBuildsStore.removeBuild"
      />
    </div>

    <div :class="$style.toolbar">
      <div :class="$style.toolbarContent">
        <div :class="$style.addButtons">
          <Button
            v-for="biosoldierClass in BIOSOLDIER_CLASSES"
            :key="biosoldierClass.id"
            @click="biosoldierBuildsStore.addBuild(biosoldierClass)"
          >
            <span :class="$style.addContent">
              <Plus :class="$style.plusIcon" aria-hidden="true" />
              <component
                :is="biosoldierClass.icon"
                :class="$style.classIcon"
                aria-hidden="true"
              />
              <span :class="$style.visuallyHidden">Add {{ biosoldierClass.name }}</span>
            </span>
          </Button>
        </div>

        <ImportBiosoldierBuild @import="biosoldierBuildsStore.importBuild">
          <template #trigger>
            <Button :class="$style.import">
              <span :class="$style.importContent">
                <ClipboardPaste :class="$style.importIcon" aria-hidden="true" />
                Import
              </span>
            </Button>
          </template>
        </ImportBiosoldierBuild>

        <ListNav
          :class="$style.nav"
          :items="navItems"
          caption="Click to scroll to a build"
          @select="scrollToPanel"
          @remove="biosoldierBuildsStore.removeBuild"
        >
          <template #icon="{ item }">
            <component :is="item.icon" :class="$style.navIcon" />
          </template>
        </ListNav>
      </div>
    </div>
  </main>
</template>

<style lang="scss" module>
@use 'styles/colors';
@use 'styles/layout';

// Toolbar width from which the add buttons and the build list fit in one row.
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

.addButtons {
  grid-area: add;
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 4px;
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

.addContent {
  display: flex;
  align-items: center;
  gap: 1px;
  padding-block: 3px;

  @container (width >= #{$toolbar-row-min-width}) {
    padding-inline: 8px;
  }
}

.navIcon {
  width: 100%;
  height: 100%;
  color: colors.$accent;
}

.plusIcon {
  flex: none;
  width: 14px;
  height: 14px;
}

.classIcon {
  flex: none;
  width: 22px;
  height: 22px;
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
