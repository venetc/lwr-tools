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

    <!-- Typography showcase: реальные кейсы «заголовок + текст», несколько вариантов -->
    <section :class="s.typeScale" aria-label="Типографика">
      <!-- 1. Карточка статьи -->
      <div :class="s.demo">
        <p :class="s.exOverline">
          Lorem
        </p>
        <h2 :class="s.exHeading">
          Lorem, ipsum dolor.
        </h2>
        <p :class="s.exBody">
          Lorem ipsum dolor, sit amet consectetur adipisicing elit. Sequi illum natus eos, maxime fuga unde rerum, iste ad autem incidunt optio saepe ipsa ea rem necessitatibus.
        </p>
        <p :class="s.exCaption">
          Lorem: 22.09.2026
        </p>
      </div>

      <!-- 2. Секция с лидом -->
      <div :class="s.demo">
        <h3 :class="s.exHeadingLg">
          Lorem, ipsum.
        </h3>
        <p :class="s.exBodyLg">
          Lorem ipsum dolor, sit amet consectetur adipisicing elit. Sequi illum natus eos, maxime fuga unde rerum, iste ad autem incidunt optio saepe ipsa ea rem necessitatibus.
        </p>
        <p :class="s.exBodySm">
          Lorem ipsum dolor, sit amet consectetur adipisicing elit. Sequi illum natus eos, maxime fuga unde rerum, iste ad autem incidunt optio saepe ipsa ea rem necessitatibus.
        </p>
      </div>

      <!-- 3. Метрика -->
      <div :class="s.demo">
        <p :class="s.exLabel">
          Lorem, ipsum dolor.
        </p>
        <p :class="s.exHeadingMd">
          12 / 24
        </p>
        <p :class="s.exBody">
          Lorem ipsum dolor sit amet, consectetur adipisicing elit. Deserunt!
        </p>
      </div>
    </section>

    <img :src="test.src" alt="test">
  </div>
</template>

<style lang="scss" module="s">
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

// Typography showcase — реальные кейсы «заголовок + текст»
.typeScale {
  display: flex;
  flex-direction: column;
  gap: 4px;
  width: 100%;
  max-width: 600px;
  margin-block: 10px;
}

// Отдельный кейс: заголовок + текст; верхняя граница как разделитель
// (нейтральный цвет — не зависит от фона страницы)
.demo {
  display: flex;
  flex-direction: column;
  gap: 6px;
  padding-block-start: 16px;
  border-block-start: 1px solid hsl(200 8% 50% / 0.15);
}

.exOverline {
  @include mixins.overline;
}
.exHeading {
  @include mixins.heading;
}
.exHeadingLg {
  @include mixins.heading-lg;
}
.exHeadingMd {
  @include mixins.heading-md;
}
.exLabel {
  @include mixins.label;
}
.exBody {
  @include mixins.body;
}
.exBodyLg {
  @include mixins.body-lg;
}
.exBodySm {
  @include mixins.body-sm;
}
.exCaption {
  @include mixins.caption;
}
</style>
