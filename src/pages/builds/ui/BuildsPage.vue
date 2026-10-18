<script setup lang="ts">
import { useSiblingRoutes } from '@shared/lib/route-menu';

const { parentTitle, items } = useSiblingRoutes();
</script>

<template>
  <main :class="$style.page">
    <h1 :class="$style.title">
      {{ parentTitle }}
    </h1>

    <ul :class="$style.list">
      <li
        v-for="item in items"
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

<style lang="scss" module src="./BuildsPage.scss" />
