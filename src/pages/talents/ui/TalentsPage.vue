<script setup lang="ts">
import { ref } from 'vue';

import type { SoldierClass, SoldierTalentRank } from '@entities/soldier';
import { SOLDIER_CLASSES, SoldierClassHeading, soldierClassTree, SoldierRankLabel } from '@entities/soldier';
import type { TalentBuild, TalentTreeData } from '@shared/ui/talent-tree';
import { TalentTree } from '@shared/ui/talent-tree';

import LockToggle from './LockToggle.vue';

interface BuildPanel {
  soldierClass: SoldierClass
  tree: TalentTreeData<SoldierTalentRank>
  talents: TalentBuild
  name: string
  readonly: boolean
}

const panels = ref<BuildPanel[]>(SOLDIER_CLASSES.map((soldierClass) => {
  const tree = soldierClassTree(soldierClass);

  return {
    soldierClass,
    tree,
    talents: [...tree.baseBuild],
    name: soldierClass.name,
    readonly: false,
  };
}));
</script>

<template>
  <main :class="$style.page">
    <TalentTree
      v-for="panel in panels"
      :key="panel.soldierClass.id"
      v-model="panel.talents"
      :tree="panel.tree"
      :readonly="panel.readonly"
    >
      <template #header>
        <div :class="$style.header">
          <SoldierClassHeading
            v-model:name="panel.name"
            :soldier-class="panel.soldierClass"
            :readonly="panel.readonly"
          />
          <LockToggle v-model="panel.readonly" />
        </div>
      </template>

      <template #rank="{ rank }">
        <SoldierRankLabel :rank="rank" />
      </template>
    </TalentTree>
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

.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  inline-size: 100%;
}
</style>
