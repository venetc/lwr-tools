<script setup lang="ts">
import type { RouteLocationRaw } from 'vue-router';

interface LinkMenuItem {
  /** Visible label, unique in the menu. */
  label: string
  /** Link target. */
  to: RouteLocationRaw
}

interface Props {
  /** Page title above the links. */
  title: string
  /** Links in menu order. */
  items: readonly LinkMenuItem[]
}

const props = defineProps<Props>();
</script>

<template>
  <main :class="$style.page">
    <h1 :class="$style.title">
      {{ props.title }}
    </h1>

    <ul :class="$style.list">
      <li
        v-for="item in props.items"
        :key="item.label"
      >
        <RouterLink
          :class="$style.link"
          :to="item.to"
        >
          {{ item.label }}
        </RouterLink>
      </li>
    </ul>
  </main>
</template>

<style lang="scss" module src="./LinkMenu.scss" />
