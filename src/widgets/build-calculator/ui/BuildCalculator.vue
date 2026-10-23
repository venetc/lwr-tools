<script setup lang="ts" generic="Kind extends BuildCodeKind, Build extends LockableItem<BuildDataByKind[Kind]>">
import { ClipboardPaste } from '@lucide/vue';
import type { VNode } from 'vue';

import type { BuildCodeKind, BuildDataByKind } from '@features/share-build';
import { ShareCodeImport } from '@features/share-build';
import { usePanelScroll } from '@shared/lib/panel-scroll';
import type { LockableItem } from '@shared/lib/stored-list';
import { Button } from '@shared/ui/button';
import { ListNav } from '@shared/ui/list-nav';
import { PageToolbar } from '@shared/ui/page-toolbar';

import { useBuildCalculatorNav } from '../model/build-calculator';

interface Props {
  /** Builds of the calculator, in page order. */
  builds: readonly Build[]
  /** Kind of build code, for importing a new build. */
  kind: Kind
}

interface Emits {
  /** Requests a new build from imported data. */
  import: [data: BuildDataByKind[Kind]]
  /** Requests removal of the build. */
  remove: [buildId: string]
}

interface BuildSlotProps {
  build: Build
}

const props = defineProps<Props>();

const emit = defineEmits<Emits>();

const slots = defineSlots<{
  'build'?: (props: BuildSlotProps) => VNode[]
  'add'?: () => VNode[]
  'nav-icon'?: (props: BuildSlotProps) => VNode[]
  'nav-badge'?: (props: BuildSlotProps) => VNode[]
}>();

const { panelRef, scrollToPanel } = usePanelScroll();

const { navItems, hasNavIcon } = useBuildCalculatorNav(() => props.builds, slots);
</script>

<template>
  <main :class="$style.page">
    <div :class="$style.builds">
      <div
        v-for="build in props.builds"
        :ref="panelRef(build.id)"
        :key="build.id"
        :class="$style.build"
      >
        <slot name="build" :build="build" />
      </div>
    </div>

    <PageToolbar>
      <template #actions>
        <slot name="add" />

        <ShareCodeImport :kind="props.kind" @import="emit('import', $event)">
          <template #trigger>
            <Button>
              <span :class="$style.importContent">
                <ClipboardPaste :class="$style.importIcon" aria-hidden="true" />
                Import
              </span>
            </Button>
          </template>
        </ShareCodeImport>
      </template>

      <ListNav
        :items="navItems"
        label="Builds"
        @select="scrollToPanel"
        @remove="emit('remove', $event)"
      >
        <template v-if="hasNavIcon" #icon="{ item }">
          <slot name="nav-icon" :build="item.build" />
        </template>

        <template #badge="{ item }">
          <slot name="nav-badge" :build="item.build" />
        </template>
      </ListNav>
    </PageToolbar>
  </main>
</template>

<style lang="scss" module src="./BuildCalculator.scss" />
