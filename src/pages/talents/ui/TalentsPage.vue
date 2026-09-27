<script setup lang="ts">
import { Plus } from '@lucide/vue';
import { usePreferredReducedMotion } from '@vueuse/core';
import { storeToRefs } from 'pinia';
import { computed } from 'vue';

import { SOLDIER_CLASSES } from '@entities/soldier';
import { Button } from '@shared/ui/button';

import type { SoldierBuildId } from '../model/talents';
import { useTalentsStore } from '../model/talents';
import BuildNav from './BuildNav.vue';
import SoldierBuildTree from './SoldierBuildTree.vue';

const talentsStore = useTalentsStore();

const { builds } = storeToRefs(talentsStore);

const reducedMotion = usePreferredReducedMotion();

const scrollBehavior = computed<ScrollBehavior>(() => reducedMotion.value === 'reduce' ? 'auto' : 'smooth');

/**
 * Element id of the build panel.
 *
 * @param buildId build id.
 */
const panelId = (buildId: SoldierBuildId) => `build-${buildId}`;

/**
 * Scrolls the page to the build panel.
 *
 * @param buildId build id.
 */
const scrollToBuild = (buildId: SoldierBuildId) => {
  const panel = document.getElementById(panelId(buildId));

  if (!panel) return;

  panel.scrollIntoView({ behavior: scrollBehavior.value, block: 'start' });
};
</script>

<template>
  <main :class="$style.page">
    <div :class="$style.builds">
      <SoldierBuildTree
        v-for="build in builds"
        :id="panelId(build.id)"
        :key="build.id"
        :class="$style.build"
        :build="build"
        @remove="talentsStore.removeBuild"
      />
    </div>

    <div :class="$style.toolbar">
      <div :class="$style.toolbarContent">
        <div :class="$style.addButtons">
          <Button
            v-for="soldierClass in SOLDIER_CLASSES"
            :key="soldierClass.id"
            @click="talentsStore.addBuild(soldierClass)"
          >
            <span :class="$style.addContent">
              <Plus :class="$style.plusIcon" aria-hidden="true" />
              <component
                :is="soldierClass.icon"
                :class="$style.classIcon"
                aria-hidden="true"
              />
              <span :class="$style.visuallyHidden">Add {{ soldierClass.name }}</span>
            </span>
          </Button>
        </div>

        <BuildNav
          :class="$style.nav"
          :builds="builds"
          @select="scrollToBuild"
          @remove="talentsStore.removeBuild"
        />
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
    grid-template-columns: auto minmax(0, 1fr);
    grid-template-areas: 'add nav';
    align-items: center;
  }

  @container (width < #{$toolbar-row-min-width}) {
    grid-template-columns: minmax(0, 1fr);
    grid-template-areas: 'nav' 'add';
  }
}

.addButtons {
  grid-area: add;
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 4px;
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
