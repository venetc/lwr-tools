<script setup lang="ts">
import { Plus } from '@lucide/vue';

import { SQUAD_NAME } from '@features/manage-squads';
import { Button } from '@shared/ui/button';
import { EditableTitle } from '@shared/ui/editable-title';
import { ListNav } from '@shared/ui/list-nav';
import { PageToolbar } from '@shared/ui/page-toolbar';

import { useSquadsPage } from '../model/squads-page';
import { useUnitCards } from '../model/unit-cards';
import AddUnitDialog from './AddUnitDialog.vue';
import UnitCard from './UnitCard.vue';

const { openSquad, name, summary, navItems, switchSquad, addSquad, removeSquad } = useSquadsPage();

const { unitCards, removeUnit } = useUnitCards();
</script>

<template>
  <main :class="$style.page">
    <div :class="$style.squad">
      <header v-if="openSquad" :class="$style.header">
        <EditableTitle
          v-model="name"
          :fallback="SQUAD_NAME"
          edit-label="Rename Squad"
        />
        <p :class="$style.summary">
          {{ summary }}
        </p>
      </header>

      <div :class="$style.units">
        <UnitCard
          v-for="card in unitCards"
          :key="card.id"
          :card="card"
          @remove="removeUnit(card)"
        />

        <AddUnitDialog />
      </div>
    </div>

    <PageToolbar>
      <template #actions>
        <Button @click="addSquad">
          <span :class="$style.newContent">
            <Plus :class="$style.plusIcon" aria-hidden="true" />
            New Squad
          </span>
        </Button>
      </template>

      <ListNav
        :items="navItems"
        label="Squads"
        @select="switchSquad"
        @remove="removeSquad"
      />
    </PageToolbar>
  </main>
</template>

<style lang="scss" module src="./SquadsPage.scss" />
