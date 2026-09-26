<script setup lang="ts">
import type { TalentBuild } from '@entities/talent';

import { ref } from 'vue';

import { sniperTree } from '@entities/talent';
import { TalentPanel } from '@widgets/talent-panel';

const build = ref<TalentBuild>([]);
</script>

<template>
  <main :class="$style.page">
    <TalentPanel v-model="build" :tree="sniperTree" />
  </main>
</template>

<style lang="scss" module>
.page {
  display: flex;
  justify-content: center;
  padding: 24px 16px;
}
</style>
