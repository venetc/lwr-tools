import type { PageHead, PageRoute, PageSite } from './page-head';
import { pageUrl } from './page-url';

interface ChainLink {
  /** Title of the route, or the site name for the root. */
  name: string
  /** Absolute URL of the route. */
  url: string
}

/**
 * Whether the route is the page or one of its ancestors other than the root: its path is a prefix of the page
 * path by segments.
 *
 * @param route route to check.
 * @param path path of the page.
 */
const isInChain = (route: PageRoute, path: string) => {
  if (route.path === '/') return false;

  return path === route.path || path.startsWith(`${route.path}/`);
};

/**
 * Head of the page at the path. The root is titled with the site name and the tagline and described as a web
 * application. Any other page is titled with the chain of titled routes from it up to the root, then the site
 * name, and gets the chain as breadcrumbs. A path off the route list gets the site name and `noindex` only.
 *
 * @param routes pages of the site.
 * @param site site data.
 * @param path path of the page.
 */
export const resolvePageHead = (
  routes: readonly PageRoute[],
  site: PageSite,
  path: string,
): PageHead => {
  const page = routes.find(route => route.path === path);

  const head: PageHead = {
    title: site.name,
    description: null,
    canonical: null,
    robots: 'noindex',
    siteName: site.name,
    image: `${site.url}${site.image}`,
    touchIcon: `${site.url}${site.touchIcon}`,
    themeColor: site.themeColor,
    jsonLd: null,
  };

  if (!page) return head;

  head.description = page.description;
  head.canonical = pageUrl(site, path);
  head.robots = null;

  if (path === '/') {
    head.title = `${site.name} – ${site.tagline}`;
    head.jsonLd = {
      '@context': 'https://schema.org',
      '@type': 'WebApplication',
      'name': site.name,
      'description': page.description,
      'url': head.canonical,
      'applicationCategory': site.applicationCategory,
      'isAccessibleForFree': true,
      'operatingSystem': 'Any',
    };

    return head;
  }

  const chain = routes
    .filter(route => isInChain(route, path))
    .sort((first, second) => first.path.length - second.path.length)
    .reduce<ChainLink[]>((links, route) => {
      if (route.title) links.push({ name: route.title, url: pageUrl(site, route.path) });

      return links;
    }, [{ name: site.name, url: pageUrl(site, '/') }]);

  head.title = chain.map(link => link.name).reverse().join(' · ');
  head.jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    'itemListElement': chain.map((link, index) => ({
      '@type': 'ListItem',
      'position': index + 1,
      'name': link.name,
      'item': link.url,
    })),
  };

  return head;
};
