<script setup lang="ts">
import { computed, useCssModule } from 'vue';

export type ButtonVariant = 'primary' | 'secondary' | 'danger';

interface Props {
  /** Visual variant. */
  variant?: ButtonVariant
  /** Native button type. */
  type?: 'button' | 'submit' | 'reset'
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'secondary',
  type: 'button',
});

const style = useCssModule();

const buttonClass = computed(() => [style.button, style[props.variant]]);
</script>

<template>
  <button :class="buttonClass" :type="type">
    <slot />
  </button>
</template>

<style lang="scss" module>
@use 'styles/colors';
@use 'styles/typography';
@use 'styles/shape';
@use 'styles/media';

.button {
  @include shape.frame(shape.$cut-sm, 1px, null, null, null);
  @include typography.label-1;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 12px 18px;

  &:enabled {
    cursor: pointer;
  }

  &:disabled {
    @include shape.frame-state(colors.$border, colors.$surface-1);
    color: colors.$text-disabled;
    cursor: not-allowed;
  }
}

@mixin -variant($color, $rest, $hover, $active) {
  color: $color;

  @include media.with-hover {
    &:not(:hover, :active) {
      @include shape.frame-state($rest...);
    }

    &:hover:not(:active) {
      @include shape.frame-state($hover...);
    }
  }

  @include media.with-touch {
    &:not(:active) {
      @include shape.frame-state($rest...);
    }
  }

  &:active {
    @include shape.frame-state($active...);
  }
}

.secondary:enabled {
  @include -variant(
    colors.$accent,
    $rest: (colors.$accent-muted, colors.$surface-1),
    $hover: (colors.$accent-muted, colors.$accent-subtle),
    $active: (colors.$accent-pressed, colors.$accent-subtle)
  );
}

.primary:enabled {
  @include -variant(
    colors.$text-inverse,
    $rest: (colors.$accent, colors.$accent),
    $hover: (colors.$accent-hover, colors.$accent-hover),
    $active: (colors.$accent-pressed, colors.$accent-pressed)
  );
}

.danger:enabled {
  @include -variant(
    colors.$danger,
    $rest: (colors.$danger-muted, colors.$surface-1),
    $hover: (colors.$danger-muted, colors.$danger-subtle),
    $active: (colors.$danger, colors.$danger-subtle)
  );
}
</style>
