# page-head

**English** · [Русский](README.ru.md)

`<head>` of a page from a list of routes and site data: title, description, canonical, Open Graph, Twitter card and JSON-LD, plus the `<noscript>` content. Plain functions without Vue or DOM, so the same head is built by the app on navigation and by the build in Node.

## Usage

```ts
const routes = [
  { path: '/', description: 'All the tools.' },
  { path: '/guides', title: 'Guides', description: 'How to start.' },
];
const site = { name: 'Site', tagline: 'Tools', url: 'https://example.com', image: '/og.png', touchIcon: '/icon.png', themeColor: '#000000', applicationCategory: 'GameApplication' };

const head = resolvePageHead(routes, site, '/guides');
// { title: 'Guides · Site', canonical: 'https://example.com/guides', robots: null, ... }

pageHeadHtml(head);
// '<title data-page-head>Guides · Site</title>\n<meta name="description" ...'

pageNoscriptHtml(routes, site, '/guides');
// '<noscript>\n<h1>Guides</h1>\n<p>How to start.</p>\n<ul>...</ul>\n</noscript>'
```

```ts
document.head.querySelectorAll(`[${PAGE_HEAD_ATTRIBUTE}]`).forEach(tag => tag.remove());
document.head.insertAdjacentHTML('beforeend', pageHeadHtml(head));
// replaces every tag of the previous head
```

## API

| Function / type | Arguments | Result |
|---|---|---|
| `resolvePageHead(routes, site, path)` | routes, site data, path of the page | `PageHead` |
| `pageHeadHtml(head)` | `PageHead` | HTML of the head tags, one per line |
| `pageNoscriptHtml(routes, site, path)` | routes, site data, path of the page | HTML of the `<noscript>` element |
| `PAGE_HEAD_ATTRIBUTE` | — | `data-page-head`: the attribute of every tag from `pageHeadHtml` |
| `PageRoute` | — | `{ path, title?, description }` |
| `PageSite` | — | `{ name, tagline, url, image, touchIcon, themeColor, applicationCategory }` |
| `PageHead` | — | `{ title, description, canonical, robots, siteName, image, touchIcon, themeColor, jsonLd }` |
| `JsonLd` | — | schema.org object |

## Behavior

- Title: the root gets `<name> – <tagline>`; any other page gets the titles of its chain from the page up to the root joined with ` · `, then the site name: `Deep · Guides · Site`.
- The chain is built from the paths: the ancestors of a page are the routes whose path is its prefix by segments. Routes without a title are skipped; the root stands for itself by the site name.
- Canonical, `og:url` and every link are absolute, without a trailing slash; the root is the site URL with a trailing slash, the address a host serves without a redirect. The image and the home screen icon are absolute too.
- JSON-LD: `WebApplication` of `site.applicationCategory` for the root, `BreadcrumbList` of the chain for any other page.
- A path off the list gets the site name as the title and `noindex`, and no description, canonical or JSON-LD.
- `<noscript>`: a heading with the title of the page (the site name for the root, an untitled page and a path off the list), a paragraph with the description and links to every titled route and the root.
- Text and attributes are escaped; in JSON-LD every `<` is escaped, so `</script>` cannot close the script.

## Limitations

- Paths are compared as written: the path of the page needs the form of the list, absolute and without a trailing slash.
- `site.url` must have no trailing slash, and the image paths must start with `/`.
- An untitled page other than the root gets no link in `<noscript>`.
