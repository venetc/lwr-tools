<script setup lang="ts">
import { Plus } from '@lucide/vue';

import { createId } from '@shared/lib/id';
import { Button } from '@shared/ui/button';
import { Dialog } from '@shared/ui/dialog';
import { Input } from '@shared/ui/input';
import { Label } from '@shared/ui/label';
import { Tabs } from '@shared/ui/tabs';
import { ToggleGroup, ToggleGroupOption } from '@shared/ui/toggle-group';

import { ADD_UNIT_TABS, INVALID_UNIT_CODE_TEXT, NEW_BUILD_GROUPS } from '../config/constants';
import { useAddUnit } from '../model/add-unit';
import UnitBuildIcon from './UnitBuildIcon.vue';
import UnitOfficerRankBadge from './UnitOfficerRankBadge.vue';

const {
  isOpen,
  tab,
  query,
  kindFilter,
  filters,
  groups,
  emptyNote,
  code,
  isCodeInvalid,
  codeErrorId,
  codeErrorDescribedBy,
  codePreview,
  clearCodeError,
  isSavedBuildsTab,
  isNewBuildTab,
  setOpen,
  addSavedBuild,
  addNewBuild,
  importUnitCode,
} = useAddUnit();

const codeInputId = createId();
</script>

<template>
  <button
    :class="$style.addCell"
    type="button"
    @click="setOpen(true)"
  >
    <Plus :class="$style.addCellIcon" aria-hidden="true" />
    Add Unit
  </button>

  <Dialog
    :open="isOpen"
    title="Add Unit"
    @update:open="setOpen"
  >
    <Tabs
      v-model="tab"
      :items="ADD_UNIT_TABS"
      label="Build source"
    >
      <template #panel="{ item }">
        <div v-if="isSavedBuildsTab(item)" :class="$style.panel">
          <Input
            v-model="query"
            :class="$style.search"
            aria-label="Search builds"
            placeholder="Search by name or Class"
          />

          <ToggleGroup
            v-model="kindFilter"
            :class="$style.filters"
            aria-label="Unit type"
          >
            <ToggleGroupOption
              v-for="filter in filters"
              :key="filter.id"
              :class="$style.filter"
              :value="filter.id"
            >
              {{ filter.name }}
              <span :class="$style.filterCount">{{ filter.count }}</span>
            </ToggleGroupOption>
          </ToggleGroup>

          <p v-if="emptyNote" :class="$style.note">
            {{ emptyNote }}
          </p>

          <section
            v-for="group in groups"
            :key="group.id"
            :class="$style.group"
          >
            <h3 :class="$style.groupTitle">
              {{ group.title }}
              <span aria-hidden="true">{{ group.rows.length }}</span>
            </h3>

            <ul :class="$style.rows" :aria-label="group.title">
              <li v-for="row in group.rows" :key="row.id">
                <button
                  :class="$style.row"
                  type="button"
                  @click="addSavedBuild(row)"
                >
                  <UnitBuildIcon :class="$style.rowIcon" :squad-build="row.squadBuild" />
                  <span :class="$style.rowTitle">
                    <span :class="$style.rowName">{{ row.squadBuild.build.name }}</span>
                    <UnitOfficerRankBadge :squad-build="row.squadBuild" />
                  </span>
                  <span v-if="row.inSquadCount" :class="$style.badge">In Squad ×{{ row.inSquadCount }}</span>
                  <span :class="$style.rowClass">{{ row.className }}</span>
                </button>
              </li>
            </ul>
          </section>
        </div>

        <div v-else-if="isNewBuildTab(item)" :class="$style.panel">
          <p :class="$style.note">
            A new Default build also appears in its Build calculator.
          </p>

          <section
            v-for="group in NEW_BUILD_GROUPS"
            :key="group.id"
            :class="$style.group"
          >
            <h3 :class="$style.groupTitle">
              {{ group.title }}
            </h3>

            <ul :class="$style.options" :aria-label="group.title">
              <li v-for="option in group.options" :key="option.id">
                <button
                  :class="$style.option"
                  type="button"
                  @click="addNewBuild(option)"
                >
                  <component
                    :is="option.icon"
                    v-if="option.icon"
                    :class="$style.optionIcon"
                    aria-hidden="true"
                  />
                  {{ option.name }}
                </button>
              </li>
            </ul>
          </section>
        </div>

        <form
          v-else
          :class="$style.panel"
          @submit.prevent="importUnitCode"
        >
          <p :class="$style.note">
            A Build code comes with the Default Loadout, a Unit code with its own. The Build also appears in its Build calculator.
          </p>

          <Label :class="$style.codeLabel" :for="codeInputId">
            Share code
          </Label>
          <div :class="$style.codeField">
            <Input
              :id="codeInputId"
              v-model="code"
              placeholder="Paste a Build or Unit code"
              :aria-invalid="isCodeInvalid"
              :aria-describedby="codeErrorDescribedBy"
              @update:model-value="clearCodeError"
            />
            <Button type="submit">
              <span :class="$style.importContent">Import</span>
            </Button>
          </div>

          <p
            v-if="isCodeInvalid"
            :id="codeErrorId"
            :class="$style.error"
            role="alert"
          >
            {{ INVALID_UNIT_CODE_TEXT }}
          </p>

          <output
            :class="$style.preview"
            :for="codeInputId"
            aria-label="Preview"
          >
            <span v-if="codePreview" :class="$style.previewRow">
              <UnitBuildIcon :class="$style.rowIcon" :squad-build="codePreview.squadBuild" />
              <span :class="$style.previewName">{{ codePreview.name }}</span>
              <span :class="$style.rowClass">{{ codePreview.caption }}</span>
            </span>
          </output>
        </form>
      </template>
    </Tabs>
  </Dialog>
</template>

<style lang="scss" module src="./AddUnitDialog.scss" />
