import type { MaybeRefOrGetter } from 'vue';
import { computed, shallowRef, toValue } from 'vue';

/**
 * Colours of the placeholder an image shows while it loads, taken from the image itself.
 */
export interface ImagePlaceholder {
  /** Background of the image; `transparent` for an image without one. */
  backdrop: string
  /** Main colour of the image content, shown as a soft glow. */
  glyph: string
}

export interface LoadingImageOptions {
  /** Image URL. */
  src: MaybeRefOrGetter<string>
  /** Placeholder colours of the image. */
  placeholder: MaybeRefOrGetter<ImagePlaceholder>
  /** CSS module of the image. */
  style: Record<string, string>
}

/**
 * Placeholder of an image until its current URL loads: the image keeps the placeholder background, so a transparent
 * image does not show it once loaded.
 *
 * @param options image URL, placeholder colours and styles of the image.
 */
export const useLoadingImage = (options: LoadingImageOptions) => {
  const { style } = options;

  const loadedSrc = shallowRef<string | null>(null);

  const isLoaded = computed(() => loadedSrc.value === toValue(options.src));

  const imageClass = computed(() => isLoaded.value ? null : style.loading);

  const placeholderStyle = computed(() => {
    if (isLoaded.value) return null;

    const placeholder = toValue(options.placeholder);

    return { '--placeholder-backdrop': placeholder.backdrop, '--placeholder-glyph': placeholder.glyph };
  });

  /**
   * Marks the current URL as loaded, removing the placeholder.
   */
  const markLoaded = () => {
    loadedSrc.value = toValue(options.src);
  };

  return { imageClass, placeholderStyle, markLoaded };
};
