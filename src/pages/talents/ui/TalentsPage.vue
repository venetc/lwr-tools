<script setup lang="ts">
import { Plus } from '@lucide/vue';
import { storeToRefs } from 'pinia';

import { SOLDIER_CLASSES } from '@entities/soldier';
import { Button } from '@shared/ui/button';

import { useTalentsStore } from '../model/talents';
import SoldierBuildTree from './SoldierBuildTree.vue';

const talentsStore = useTalentsStore();

const { builds } = storeToRefs(talentsStore);
</script>

<template>
  <main :class="$style.page">
    <div :class="$style.toolbar">
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

    <div :class="$style.builds">
      <SoldierBuildTree
        v-for="build in builds"
        :key="build.id"
        :build="build"
        @remove="talentsStore.removeBuild"
      />
    </div>
  </main>
</template>

<style lang="scss" module>
.page {
  display: flex;
  flex-direction: column;
  gap: 24px;
  padding: 24px 16px;
}

.toolbar {
  display: grid;
  grid-template-columns: repeat(4, auto);
  justify-content: center;
  gap: 8px;
}

.addContent {
  display: flex;
  align-items: center;
  gap: 2px;
  padding: 8px 14px;
}

.plusIcon {
  width: 20px;
  height: 20px;
}

.classIcon {
  width: 32px;
  height: 32px;
}

.visuallyHidden {
  position: absolute;
  width: 1px;
  height: 1px;
  overflow: hidden;
  clip-path: inset(50%);
  white-space: nowrap;
}

.builds {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(min(100%, 360px), 440px));
  justify-content: center;
  align-items: start;
  gap: 24px;
}
</style>
