<script setup lang="ts">
import { useCssModule, useTemplateRef } from 'vue';

import { createId } from '@shared/lib/id';
import { Button } from '@shared/ui/button';
import { LoadingImage } from '@shared/ui/loading-image';

import { useLoadoutEditor } from '../model/loadout-editor';
import type { UnitCard } from '../model/unit-cards';
import SlotCaption from './SlotCaption.vue';

interface Props {
  /** Unit whose Loadout is edited. */
  card: UnitCard
  /** Id of the tile the dialog was opened from; its slot is selected first. */
  initialSlotId: string
}

const props = defineProps<Props>();

const backButton = useTemplateRef<HTMLButtonElement>('backButton');

const {
  slotFormula,
  rows,
  itemViews,
  details,
  isEquipShown,
  isEquipDisabled,
  isRemoveShown,
  hasReasons,
  hasGrants,
  hasRules,
  lockerCaption,
  lockerTone,
  inventoryClass,
  lockerClass,
  rowRef,
  selectSlot,
  showInventory,
  pickItem,
  equipItem,
  equipPicked,
  removePicked,
} = useLoadoutEditor(
  () => props.card,
  () => props.initialSlotId,
  backButton,
  useCssModule(),
);

const inventoryHeadingId = createId();

const lockerHeadingId = createId();
</script>

<template>
  <div :class="$style.editor">
    <section :class="inventoryClass" :aria-labelledby="inventoryHeadingId">
      <h3 :id="inventoryHeadingId" :class="$style.paneTitle">
        Inventory
      </h3>

      <template v-for="row in rows" :key="row.tile.id">
        <p v-if="row.hasFormulaBefore" :class="$style.formula">
          {{ slotFormula }}
        </p>

        <button
          :ref="rowRef(row.tile.id)"
          :class="row.rowClass"
          type="button"
          :aria-label="row.tile.label"
          :aria-pressed="row.isSelected"
          @click="selectSlot(row.tile)"
        >
          <LoadingImage
            v-if="row.tile.item"
            :class="$style.rowImage"
            :src="row.tile.item.icon"
            :placeholder="row.tile.item.iconPlaceholder"
            alt=""
            aria-hidden="true"
          />
          <span
            v-else
            :class="$style.rowPlaceholder"
            aria-hidden="true"
          />
          <SlotCaption
            :class="$style.caption"
            :caption="row.tile.caption"
            :tone="row.tile.tone"
            aria-hidden="true"
          />
          <span :class="$style.rowName" aria-hidden="true">{{ row.name }}</span>
        </button>
      </template>
    </section>

    <section :class="lockerClass" :aria-labelledby="lockerHeadingId">
      <header :class="$style.lockerHeader">
        <button
          ref="backButton"
          :class="$style.back"
          type="button"
          @click="showInventory"
        >
          ‹ Inventory
        </button>

        <h3 :id="lockerHeadingId" :class="$style.paneTitle">
          Locker · <SlotCaption :caption="lockerCaption" :tone="lockerTone" />
        </h3>
      </header>

      <ul :class="$style.items" aria-label="Locker">
        <li v-for="view in itemViews" :key="view.item.id">
          <button
            :class="view.itemClass"
            type="button"
            :aria-label="view.item.label"
            :aria-pressed="view.isPicked"
            @click="pickItem(view.item)"
            @dblclick="equipItem(view.item)"
          >
            <LoadingImage
              :class="$style.itemImage"
              :src="view.item.icon"
              :placeholder="view.item.iconPlaceholder"
              alt=""
              aria-hidden="true"
            />
            <span :class="$style.itemText" aria-hidden="true">
              <span :class="$style.itemName">{{ view.item.name }}</span>
              <span :class="$style.itemSummary">{{ view.item.summary }}</span>
            </span>
            <span
              v-if="view.item.mark"
              :class="view.markClass"
              aria-hidden="true"
            >{{ view.item.mark }}</span>
          </button>
        </li>
      </ul>

      <section :class="$style.details" aria-label="Item details">
        <template v-if="details">
          <div :class="$style.detailsTop">
            <LoadingImage
              :class="$style.detailsImage"
              :src="details.icon"
              :placeholder="details.iconPlaceholder"
              alt=""
              aria-hidden="true"
            />
            <div>
              <h4 :class="$style.detailsName">
                {{ details.name }}
              </h4>
              <p :class="$style.detailsType">
                {{ details.type }}
              </p>
            </div>
          </div>

          <ul
            v-if="hasReasons"
            :class="$style.reasons"
            aria-label="Reasons"
          >
            <li v-for="reason in details.reasons" :key="reason">
              {{ reason }}
            </li>
          </ul>

          <ul :class="$style.stats" aria-label="Stats">
            <li
              v-for="(stat, index) in details.stats"
              :key="index"
              :class="$style.stat"
            >
              <span :class="$style.statName">{{ stat.name }}</span>
              {{ stat.value }}
            </li>
          </ul>

          <p :class="$style.carriers">
            <span :class="$style.carriersLabel">Carriers</span>
            {{ details.carriers }}
          </p>

          <p v-if="details.info" :class="$style.info">
            {{ details.info }}
          </p>

          <ul
            v-if="hasGrants"
            :class="$style.grants"
            aria-label="Grants"
          >
            <li
              v-for="ability in details.grants"
              :key="ability.id"
              :class="$style.grant"
            >
              <LoadingImage
                :class="$style.grantIcon"
                :src="ability.icon"
                :placeholder="ability.iconPlaceholder"
                alt=""
                aria-hidden="true"
              />
              {{ ability.name }}
            </li>
          </ul>

          <ul
            v-if="hasRules"
            :class="$style.rules"
            aria-label="Rules"
          >
            <li v-for="rule in details.rules" :key="rule">
              {{ rule }}
            </li>
          </ul>

          <div :class="$style.actions">
            <Button
              v-if="isEquipShown"
              variant="primary"
              :disabled="isEquipDisabled"
              @click="equipPicked"
            >
              <span :class="$style.buttonContent">Equip</span>
            </Button>
            <Button
              v-if="isRemoveShown"
              variant="danger"
              @click="removePicked"
            >
              <span :class="$style.buttonContent">Remove</span>
            </Button>
          </div>
        </template>

        <p v-else :class="$style.detailsEmpty">
          Select an item to see its details.
        </p>
      </section>
    </section>
  </div>
</template>

<style lang="scss" module src="./LoadoutEditor.scss" />
