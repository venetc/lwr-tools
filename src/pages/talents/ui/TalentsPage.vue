<script setup lang="ts">
import type { SoldierClassId } from '@entities/soldier';
import type { TalentBuild } from '@shared/ui/talent-tree';

import { computed, ref } from 'vue';

import { SOLDIER_CLASSES, soldierClassTree } from '@entities/soldier';
import { TalentTree } from '@shared/ui/talent-tree';

const builds = ref(new Map<SoldierClassId, TalentBuild>(
  SOLDIER_CLASSES.map(soldierClass => [soldierClass.id, []]),
));

const classTrees = SOLDIER_CLASSES.map(soldierClass => ({
  id: soldierClass.id,
  tree: soldierClassTree(soldierClass),
  build: computed<TalentBuild>({
    get: () => builds.value.get(soldierClass.id) ?? [],
    set: (build) => {
      builds.value.set(soldierClass.id, build);
    },
  }),
}));
</script>

<template>
  <main :class="$style.page">
    <TalentTree
      v-for="classTree in classTrees"
      :key="classTree.id"
      v-model="classTree.build.value"
      :tree="classTree.tree"
    />
  </main>
</template>

<style lang="scss" module>
.page {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(min(100%, 400px), 480px));
  justify-content: center;
  align-items: start;
  gap: 24px;
  padding: 24px 16px;
}
</style>
