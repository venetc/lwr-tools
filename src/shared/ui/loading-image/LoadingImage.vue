<script setup lang="ts">
import { useCssModule } from 'vue';

import type { ImagePlaceholder } from './model/loading-image';
import { useLoadingImage } from './model/loading-image';

interface Props {
  /** Image URL. */
  src: string
  /** Placeholder colours shown until the image loads. */
  placeholder: ImagePlaceholder
}

const props = defineProps<Props>();

const { imageClass, placeholderStyle, markLoaded } = useLoadingImage({
  src: () => props.src,
  placeholder: () => props.placeholder,
  style: useCssModule(),
});
</script>

<template>
  <img
    :class="imageClass"
    :style="placeholderStyle"
    :src="props.src"
    @load="markLoaded"
  >
</template>

<style lang="scss" module src="./LoadingImage.scss" />
