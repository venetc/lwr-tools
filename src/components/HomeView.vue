<script setup lang="ts">
import test_image from '@assets/hero.png';

import { Camera } from '@lucide/vue';
import { useCounterStore } from './store';

const test = {
  src: test_image,
};

const store = useCounterStore();
</script>

<template>
  <div :class="$style.test_class">
    <div>home</div>

    <Camera
      color="#3e9392"
      :size="64"
      :stroke-width="1"
    />

    <div>
      <button @click="store.increment">
        Increment
      </button>

      <span :class="$style.count"> {{ store.count }}</span>

      <button @click="store.decrement">
        Decrement
      </button>
    </div>

    <div>
      <div :class="$style.inter">
        Lorem ipsum dolor sit amet.
      </div>

      <div :class="$style.ox">
        Lorem ipsum dolor sit amet.
      </div>
    </div>

    <img :src="test.src" alt="test">
  </div>
</template>

<style lang="scss" module>
@use 'sass:color';

.test_class {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 40px;
}

.count {
  display: inline-block;
  min-width: 50px;
  text-align: center;
}

.inter {
  font-family: 'Inter', sans-serif;
  font-size: 60px;
  font-weight: 400;
}

.ox {
  font-family: 'Oxanium', sans-serif;
  font-size: 60px;
  font-weight: 400;
}
</style>
