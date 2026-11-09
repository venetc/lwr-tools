<script setup lang="ts">
import { SITE_NAME } from '@shared/config/site';

import { HOME_LOCATION, SITE_MARK_SRC, SITE_NAV_GROUPS } from '../config/constants';
</script>

<template>
  <header :class="$style.header">
    <RouterLink :class="$style.brand" :to="HOME_LOCATION">
      <img
        :class="$style.mark"
        :src="SITE_MARK_SRC"
        alt=""
      >
      <span :class="$style.name">{{ SITE_NAME }}</span>
    </RouterLink>

    <nav :class="$style.nav" aria-label="Main">
      <ul
        v-for="(group, index) in SITE_NAV_GROUPS"
        :key="index"
        :class="$style.group"
      >
        <li
          v-for="link in group"
          :key="link.label"
          :class="$style.item"
        >
          <RouterLink
            :class="$style.link"
            :exact-active-class="$style.current"
            :to="link.to"
          >
            {{ link.label }}
          </RouterLink>
        </li>
      </ul>
    </nav>
  </header>
</template>

<style lang="scss" module src="./SiteHeader.scss" />
