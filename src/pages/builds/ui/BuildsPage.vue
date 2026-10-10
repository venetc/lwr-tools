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

<style lang="scss" module>
@use 'styles/colors';
@use 'styles/media';
@use 'styles/typography';

.page {
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 24px 16px;
}

.title {
  @include typography.heading-1;
  margin: 0;
}

.list {
  @include typography.label-1;
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin: 0;
  padding: 0;
  list-style: none;
}

.link {
  text-decoration: none;

  @include media.with-hover {
    &:not(:hover) {
      color: colors.$text-accent;
    }

    &:hover {
      color: colors.$accent-hover;
    }
  }

  @include media.with-touch {
    color: colors.$text-accent;
  }
}
</style>
