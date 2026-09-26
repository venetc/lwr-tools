<template>
  <footer :class="$style.footer">
    <p :class="$style.download">
      Get
      <a
        :class="$style.downloadLink"
        href="https://www.nexusmods.com/xcom/mods/686"
        target="_blank"
        rel="noopener noreferrer"
      >Long War Rebalance</a>
      on Nexus Mods — requires
      <a
        :class="$style.downloadLink"
        href="https://www.nexusmods.com/xcom/mods/88"
        target="_blank"
        rel="noopener noreferrer"
      >Long War 1.0</a>.
      See the
      <a
        :class="$style.downloadLink"
        href="https://www.ufopaedia.org/Change_Log_(LWR)"
        target="_blank"
        rel="noopener noreferrer"
      >Long War Rebalance changelog</a>.
    </p>
    <p :class="$style.disclaimer">
      Unofficial fan-made tool, not affiliated with or endorsed by Firaxis Games, 2K or Take-Two Interactive.
      XCOM and all related names, images and game assets are trademarks and property of their respective owners.
      Long War Rebalance is a community mod by its authors. Ability data from
      <a
        :class="$style.link"
        href="https://www.ufopaedia.org/Long_War_Rebalance"
        target="_blank"
        rel="noopener noreferrer"
      >UFOpaedia</a>.
    </p>
  </footer>
</template>

<style lang="scss" module>
@use 'styles/colors';
@use 'styles/typography';
@use 'styles/media';

.footer {
  display: flex;
  flex-direction: column;
  gap: 6px;
  padding: 12px 16px;
  background: colors.$surface-1;
  border-block-start: 1px solid colors.$border-subtle;
}

.download {
  @include typography.body-2;
  margin: 0;
  color: colors.$text-secondary;
  text-align: center;
}

.disclaimer {
  @include typography.caption;
  max-width: 960px;
  margin: 0 auto;
  color: colors.$text-tertiary;
  text-align: center;
}

@mixin -link($color, $hover-color) {
  text-decoration: underline;
  text-underline-position: from-font;
  text-decoration-thickness: from-font;

  @include media.with-hover {
    &:not(:hover) {
      color: $color;
    }

    &:hover {
      color: $hover-color;
    }
  }

  @include media.with-touch {
    color: $color;
  }
}

.link {
  @include -link(colors.$text-secondary, colors.$accent);
}

.downloadLink {
  @include -link(colors.$accent, colors.$accent-hover);
}
</style>
