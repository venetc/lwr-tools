import { PAGE_HEAD_ATTRIBUTE } from './constants';
import { escapeHtml } from './escape-html';
import type { PageHead, PageRoute, PageSite } from './page-head';
import { pageUrl } from './page-url';

/**
 * Meta tag with a `name` or a `property`.
 *
 * @param key attribute that names the meta.
 * @param name name of the meta.
 * @param content value of the meta.
 */
const metaTag = (key: 'name' | 'property', name: string, content: string) =>
  `<meta ${key}="${escapeHtml(name)}" content="${escapeHtml(content)}" ${PAGE_HEAD_ATTRIBUTE}>`;

/**
 * Link tag.
 *
 * @param rel relation of the link.
 * @param href target of the link.
 */
const linkTag = (rel: string, href: string) => `<link rel="${escapeHtml(rel)}" href="${escapeHtml(href)}" ${PAGE_HEAD_ATTRIBUTE}>`;

/**
 * Tags of the page head as HTML, one per line, each marked with `PAGE_HEAD_ATTRIBUTE`: title, description,
 * robots, canonical, theme color, home screen icon, Open Graph, Twitter card and structured data. Text and
 * attributes are escaped; the structured data has every `<` escaped, so it cannot close its script.
 *
 * @param head page head.
 */
export const pageHeadHtml = (head: PageHead) => {
  const tags = [`<title ${PAGE_HEAD_ATTRIBUTE}>${escapeHtml(head.title)}</title>`];

  if (head.description) tags.push(metaTag('name', 'description', head.description));
  if (head.robots) tags.push(metaTag('name', 'robots', head.robots));
  if (head.canonical) tags.push(linkTag('canonical', head.canonical));

  tags.push(
    metaTag('name', 'theme-color', head.themeColor),
    linkTag('apple-touch-icon', head.touchIcon),
    metaTag('property', 'og:type', 'website'),
    metaTag('property', 'og:site_name', head.siteName),
    metaTag('property', 'og:title', head.title),
  );

  if (head.description) tags.push(metaTag('property', 'og:description', head.description));
  if (head.canonical) tags.push(metaTag('property', 'og:url', head.canonical));

  tags.push(
    metaTag('property', 'og:image', head.image),
    metaTag('name', 'twitter:card', 'summary_large_image'),
    metaTag('name', 'twitter:title', head.title),
  );

  if (head.description) tags.push(metaTag('name', 'twitter:description', head.description));

  tags.push(metaTag('name', 'twitter:image', head.image));

  if (head.jsonLd) {
    tags.push(`<script type="application/ld+json" ${PAGE_HEAD_ATTRIBUTE}>${JSON.stringify(head.jsonLd).replaceAll('<', '\\u003c')}</script>`);
  }

  return tags.join('\n');
};

/**
 * Content of the page for clients without JavaScript, as a `<noscript>` element: a heading with the title of
 * the page (the site name for the root and paths off the list), a paragraph with its description and links to
 * every titled route, the root by the site name. Text and attributes are escaped.
 *
 * @param routes pages of the site.
 * @param site site data.
 * @param path path of the page.
 */
export const pageNoscriptHtml = (routes: readonly PageRoute[], site: PageSite, path: string) => {
  const page = routes.find(route => route.path === path);

  const lines = ['<noscript>', `<h1>${escapeHtml(page?.title ?? site.name)}</h1>`];

  if (page) lines.push(`<p>${escapeHtml(page.description)}</p>`);

  lines.push('<ul>');

  routes.forEach((route) => {
    const label = route.path === '/' ? site.name : route.title;

    if (!label) return;

    lines.push(`<li><a href="${escapeHtml(pageUrl(site, route.path))}">${escapeHtml(label)}</a></li>`);
  });

  lines.push('</ul>', '</noscript>');

  return lines.join('\n');
};
