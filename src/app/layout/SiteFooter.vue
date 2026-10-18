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

<style lang="scss" module src="./SiteFooter.scss" />
