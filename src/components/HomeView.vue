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
  <div :class="s.test_class">
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

      <span :class="s.count"> {{ store.count }}</span>

      <button @click="store.decrement">
        Decrement
      </button>
    </div>

    <div :class="s.panel">
      <div :class="s.ox">
        Lorem ipsum dolor sit amet.
      </div>

      <div :class="s.inter">
        Lorem ipsum dolor, sit amet consectetur adipisicing elit. Sequi illum natus eos, maxime fuga unde rerum, iste ad autem incidunt optio saepe ipsa ea rem necessitatibus.
      </div>
    </div>

    <img :src="test.src" alt="test">
  </div>
</template>

<style lang="scss" module="s">
@use 'sass:color';
@use 'styles/colors';
@use 'styles/mixins';

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
  @include mixins.font-body-md;
  color: #dbe4e8;
}

.ox {
  @include mixins.font-ui-xl;
  color: #2fd1de;
  margin-bottom: 10px;
}

.panel {
  background-color: #252e34;
  padding-block: 20px;
  padding-inline: 30px;
  max-width: 600px;
  box-sizing: border-box;
}
</style>
