<script setup lang="ts">
import { useCssModule } from 'vue';

import { Button } from '@shared/ui/button';
import { LoadingImage } from '@shared/ui/loading-image';
import { ScrollArea } from '@shared/ui/scroll-area';

import type { LoadoutTile } from '../model/loadout-tiles';
import { useSlotLocker } from '../model/slot-locker';
import type { UnitCard } from '../model/unit-cards';

interface Props {
  /** Unit whose Loadout is edited. */
  card: UnitCard
  /** Tile of the slot whose Locker is shown. */
  tile: LoadoutTile
}

interface Emits {
  /** Asks to close the Locker: an item was put in the slot or taken off. */
  close: []
}

const props = defineProps<Props>();

const emit = defineEmits<Emits>();

const {
  lockerName,
  formula,
  tiers,
  isMatrix,
  matrixStyle,
  groupViews,
  details,
  isEquipShown,
  isEquipDisabled,
  isRemoveShown,
  hasReasons,
  hasGrants,
  hasRules,
  pickItem,
  equipItem,
  equipPicked,
  removePicked,
} = useSlotLocker(
  () => props.card,
  () => props.tile,
  useCssModule(),
  () => emit('close'),
);
</script>

<template>
  <div :class="$style.locker">
    <div :class="$style.picker">
      <p v-if="formula" :class="$style.formula">
        {{ formula }}
      </p>

      <ScrollArea :class="$style.scroll">
        <section
          :class="$style.groups"
          :style="matrixStyle"
          :aria-label="lockerName"
        >
          <template v-for="group in groupViews" :key="group.key">
            <h4
              v-if="group.title"
              :id="group.titleId"
              :class="group.titleClass"
            >
              {{ group.title }}
            </h4>

            <div
              v-if="group.isTierHeadShown"
              :class="$style.tierHead"
              aria-hidden="true"
            >
              <span
                v-for="tier in tiers"
                :key="tier"
                :class="$style.tierName"
              >{{ tier }}</span>
            </div>

            <ul :class="group.listClass" v-bind="group.listAttrs">
              <li
                v-for="row in group.rowViews"
                :key="row.key"
                :class="$style.row"
              >
                <span :class="row.nameClass">
                  {{ row.name }}
                  <span v-if="row.reason" :class="$style.rowReason">{{ row.reason }}</span>
                </span>

                <template v-for="cell in row.cellViews" :key="cell.key">
                  <button
                    v-if="cell.view"
                    :class="cell.view.itemClass"
                    type="button"
                    :title="cell.view.item.label"
                    :aria-label="cell.view.item.label"
                    :aria-pressed="cell.view.isPicked"
                    @click="pickItem(cell.view.item)"
                    @dblclick="equipItem(cell.view.item)"
                  >
                    <LoadingImage
                      :class="$style.cellImage"
                      :src="cell.view.item.icon"
                      :placeholder="cell.view.item.iconPlaceholder"
                      alt=""
                      aria-hidden="true"
                    />
                  </button>
                  <span v-else :class="$style.emptyCell" />
                </template>
              </li>

              <li v-for="view in group.itemViews" :key="view.item.id">
                <button
                  v-if="isMatrix"
                  :class="view.itemClass"
                  type="button"
                  :title="view.item.label"
                  :aria-label="view.item.label"
                  :aria-pressed="view.isPicked"
                  @click="pickItem(view.item)"
                  @dblclick="equipItem(view.item)"
                >
                  <LoadingImage
                    :class="$style.cellImage"
                    :src="view.item.icon"
                    :placeholder="view.item.iconPlaceholder"
                    alt=""
                    aria-hidden="true"
                  />
                  <span :class="$style.tileName" aria-hidden="true">{{ view.item.name }}</span>
                  <span
                    v-if="view.item.reasonLabel"
                    :class="view.markClass"
                    aria-hidden="true"
                  >{{ view.item.reasonLabel }}</span>
                </button>
                <button
                  v-else
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
          </template>
        </section>
      </ScrollArea>
    </div>

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

        <ScrollArea :class="$style.detailsScroll">
          <div :class="$style.detailsBody">
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
          </div>
        </ScrollArea>

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
  </div>
</template>

<style lang="scss" module src="./SlotLocker.scss" />
