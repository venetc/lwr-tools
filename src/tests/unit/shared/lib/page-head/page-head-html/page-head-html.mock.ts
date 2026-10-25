import type { PageHead } from '@shared/lib/page-head';

export const PAGE_HEAD: PageHead = {
  title: 'Tom & <Jerry>',
  description: 'Say "hi" <now>',
  canonical: 'https://example.com/app/guides',
  robots: null,
  siteName: 'Test Site',
  image: 'https://example.com/app/preview.png',
  touchIcon: 'https://example.com/app/touch.png',
  themeColor: '#000000',
  jsonLd: { name: '</script><script>alert(1)</script>' },
};

export const OFF_LIST_HEAD: PageHead = {
  title: 'Test Site',
  description: null,
  canonical: null,
  robots: 'noindex',
  siteName: 'Test Site',
  image: 'https://example.com/app/preview.png',
  touchIcon: 'https://example.com/app/touch.png',
  themeColor: '#000000',
  jsonLd: null,
};

export const ESCAPED_TITLE = '<title data-page-head>Tom &amp; &lt;Jerry&gt;</title>';

export const ESCAPED_DESCRIPTION = '<meta name="description" content="Say &quot;hi&quot; &lt;now&gt;" data-page-head>';

export const ESCAPED_JSON_LD = '<script type="application/ld+json" data-page-head>{"name":"\\u003c/script>\\u003cscript>alert(1)\\u003c/script>"}</script>';

export const CANONICAL = '<link rel="canonical" href="https://example.com/app/guides" data-page-head>';

export const NOINDEX = '<meta name="robots" content="noindex" data-page-head>';

export const CANONICAL_TAG = 'rel="canonical"';
