export interface NavPage {
  /** Visible label of the page in the header navigation. */
  label: string
  /** Path to open the page by. */
  path: string
  /** URL the page is at. */
  url: RegExp
}

export interface PlainPage {
  /** Name of the page in test titles. */
  name: string
  /** Path to open the page by. */
  path: string
}

export const NAV_NAME = 'Main';

export const BRAND_NAME = 'LWR Tools';

export const ROOT_URL = /\/$/;

export const BIOSOLDIER: NavPage = { label: 'Biosoldier', path: '/builds/biosoldier', url: /\/builds\/biosoldier$/ };

export const MEC: NavPage = { label: 'MEC', path: '/builds/mec', url: /\/builds\/mec$/ };

export const SHIV: NavPage = { label: 'SHIV', path: '/builds/shiv', url: /\/builds\/shiv$/ };

export const SQUADS: NavPage = { label: 'Squads', path: '/squads', url: /\/squads$/ };

export const NAV_PAGES: NavPage[] = [BIOSOLDIER, MEC, SHIV, SQUADS];

export const HOME: PlainPage = { name: 'home page', path: '/' };

export const BUILDS: PlainPage = { name: 'Build calculator menu', path: '/builds' };

export const PLAIN_PAGES: PlainPage[] = [HOME, BUILDS];

export const SOURCES_TO_SQUADS: PlainPage[] = [
  BUILDS,
  { name: 'Biosoldier calculator', path: BIOSOLDIER.path },
  { name: 'MEC calculator', path: MEC.path },
  { name: 'SHIV calculator', path: SHIV.path },
];

export const PHONE_WIDTHS = [360, 393];

export const PHONE_HEIGHT = 852;

export const SHORT_VIEWPORT_HEIGHT = 480;

export const SCROLL_OFFSET = 300;
