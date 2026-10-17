<template>
  <footer :class="$style.footer">
    <div :class="$style.links">
      <ul :class="$style.group">
        <li :class="$style.item">
          <a
            :class="$style.link"
            href="https://www.nexusmods.com/xcom/mods/686"
            target="_blank"
            rel="noopener noreferrer"
          >Long War Rebalance</a>
        </li>
        <li :class="$style.item">
          requires
          <a
            :class="$style.link"
            href="https://www.nexusmods.com/xcom/mods/88"
            target="_blank"
            rel="noopener noreferrer"
          >Long War 1.0</a>
        </li>
      </ul>
      <ul :class="$style.group">
        <li :class="$style.item">
          <a
            :class="$style.link"
            href="https://www.ufopaedia.org/Change_Log_(LWR)"
            target="_blank"
            rel="noopener noreferrer"
          >Changelog</a>
        </li>
        <li :class="$style.item">
          Data:
          <a
            :class="$style.link"
            href="https://www.ufopaedia.org/Long_War_Rebalance"
            target="_blank"
            rel="noopener noreferrer"
          >UFOpaedia</a>
        </li>
      </ul>
    </div>
    <p :class="$style.disclaimer">
      Unofficial fan tool, not affiliated with Firaxis Games or 2K. XCOM is a trademark of its respective owners.
    </p>
  </footer>
</template>

<style lang="scss" module>
@use 'styles/colors';
@use 'styles/typography';
@use 'styles/media';

// Footer width from which both link groups fit in one line.
$links-row-min-width: 600px;

.footer {
  container-type: inline-size;
  display: flex;
  flex-direction: column;
  gap: 6px;
  padding: 12px 16px;
  background: colors.$surface-1;
  border-block-start: 1px solid colors.$border-subtle;
}

@mixin -separator {
  content: '·' / '';
  padding-inline: 8px;
  color: colors.$text-tertiary;
}

.links {
  @include typography.body-2;
  display: flex;
  align-items: center;
  justify-content: center;
  color: colors.$text-secondary;

  @container (width >= #{$links-row-min-width}) {
    flex-direction: row;
  }

  @container (width < #{$links-row-min-width}) {
    flex-direction: column;
  }
}

.group {
  display: flex;
  margin: 0;
  padding: 0;
  list-style: none;

  @container (width >= #{$links-row-min-width}) {
    &:not(:first-child)::before {
      @include -separator;
    }
  }
}

.item {
  white-space: nowrap;

  &:not(:first-child)::before {
    @include -separator;
  }
}

.disclaimer {
  @include typography.caption;
  margin: 0;
  color: colors.$text-tertiary;
  text-align: center;
}

.link {
  text-decoration: underline;
  text-underline-position: from-font;
  text-decoration-thickness: from-font;

  @include media.with-hover {
    &:not(:hover) {
      color: colors.$accent;
    }

    &:hover {
      color: colors.$accent-hover;
    }
  }

  @include media.with-touch {
    color: colors.$accent;
  }
}
</style>
