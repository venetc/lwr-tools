export const ROUTES = [
  { path: '/', description: 'Home description.' },
  { path: '/guides', title: 'Guides', description: 'Guides <description>.' },
  { path: '/guides/untitled', description: 'Untitled description.' },
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

export const UNKNOWN_PATH = '/missing';

export const PAGE_HEADING = '<h1>Guides</h1>';

export const ROOT_HEADING = '<h1>Test Site</h1>';

export const PAGE_PARAGRAPH = '<p>Guides &lt;description&gt;.</p>';

export const PARAGRAPH_TAG = '<p>';

export const LINKS = [
  '<ul>',
  '<li><a href="https://example.com/app/">Test Site</a></li>',
  '<li><a href="https://example.com/app/guides">Guides</a></li>',
  '<li><a href="https://example.com/app/about">About</a></li>',
  '</ul>',
].join('\n');
