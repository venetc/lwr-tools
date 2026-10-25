export const ROUTES = [
  { path: '/', description: 'Home description.' },
  { path: '/guides', title: 'Guides', description: 'Guides description.' },
  { path: '/guides/untitled', description: 'Untitled description.' },
  { path: '/guides/untitled/deep', title: 'Deep', description: 'Deep description.' },
  { path: '/about', title: 'About', description: 'About description.' },
];

export const SITE = {
  name: 'Test Site',
  tagline: 'Test tagline',
  url: 'https://example.com/app',
  image: '/preview.png',
  touchIcon: '/touch.png',
  themeColor: '#000000',
  applicationCategory: 'TestApplication',
};

export const ROOT_TITLE = 'Test Site – Test tagline';

export const PAGE_TITLE = 'Guides · Test Site';

export const NESTED_TITLE = 'Deep · Guides · Test Site';

export const ROOT_URL = 'https://example.com/app/';

export const GUIDES_URL = 'https://example.com/app/guides';

export const IMAGE_URL = 'https://example.com/app/preview.png';

export const ROOT_JSON_LD = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  'name': 'Test Site',
  'description': 'Home description.',
  'url': 'https://example.com/app/',
  'applicationCategory': 'TestApplication',
  'isAccessibleForFree': true,
  'operatingSystem': 'Any',
};

export const NESTED_JSON_LD = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  'itemListElement': [
    { '@type': 'ListItem', 'position': 1, 'name': 'Test Site', 'item': 'https://example.com/app/' },
    { '@type': 'ListItem', 'position': 2, 'name': 'Guides', 'item': 'https://example.com/app/guides' },
    { '@type': 'ListItem', 'position': 3, 'name': 'Deep', 'item': 'https://example.com/app/guides/untitled/deep' },
  ],
};

export const UNKNOWN_PATH = '/guides/missing';
