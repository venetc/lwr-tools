import type { Page } from '@playwright/test';

/**
 * Stored build record for seeding a Build calculator.
 */
export interface SeededBuild {
  /** Build id. */
  id: string
  /** Share code of the record. */
  code: string
  /** Whether the build is readonly. */
  readonly: boolean
}

/**
 * Saves the build records of a Build calculator before the first page load; later loads of the tab keep what the page
 * saved, and other tabs of the context load what is stored. Each calculator is seeded on its own, next to the Squads.
 *
 * @param page browser page.
 * @param storagePrefix prefix of the stored keys of the calculator, such as `lwr-tools.biosoldier-builds.v1.`.
 * @param builds build records in list order.
 */
export const seedBuilds = (page: Page, storagePrefix: string, builds: SeededBuild[]) => page.addInitScript(({ prefix, seededBuilds }) => {
  const seededKey = `seeded.${prefix}`;

  if (sessionStorage.getItem(seededKey)) return;

  localStorage.setItem(`${prefix}order`, JSON.stringify(seededBuilds.map(build => build.id)));

  for (const build of seededBuilds) {
    localStorage.setItem(`${prefix}build.${build.id}`, JSON.stringify({ code: build.code, readonly: build.readonly }));
  }

  sessionStorage.setItem(seededKey, 'true');
}, { prefix: storagePrefix, seededBuilds: builds });
