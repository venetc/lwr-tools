# page-head

[English](README.en.md) · **Русский**

`<head>` страницы из списка маршрутов и данных сайта: title, description, canonical, Open Graph, Twitter card и JSON-LD, а также содержимое `<noscript>`. Обычные функции без Vue и DOM, поэтому один и тот же `<head>` собирают и приложение при навигации, и сборка в Node.

## Использование

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
// заменяет все теги предыдущего <head>
```

## API

| Функция / тип | Аргументы | Результат |
|---|---|---|
| `resolvePageHead(routes, site, path)` | маршруты, данные сайта, путь страницы | `PageHead` |
| `pageHeadHtml(head)` | `PageHead` | HTML тегов `<head>`, по одному на строку |
| `pageNoscriptHtml(routes, site, path)` | маршруты, данные сайта, путь страницы | HTML элемента `<noscript>` |
| `PAGE_HEAD_ATTRIBUTE` | — | `data-page-head`: атрибут каждого тега из `pageHeadHtml` |
| `PageRoute` | — | `{ path, title?, description }` |
| `PageSite` | — | `{ name, tagline, url, image, touchIcon, themeColor, applicationCategory }` |
| `PageHead` | — | `{ title, description, canonical, robots, siteName, image, touchIcon, themeColor, jsonLd }` |
| `JsonLd` | — | объект schema.org |

## Поведение

- Title: у корня — `<имя> – <слоган>`; у остальных — title цепочки от страницы к корню через ` · `, в конце имя сайта: `Deep · Guides · Site`.
- Цепочка строится по путям: предки страницы — маршруты, чей путь — её префикс по сегментам. Маршруты без title пропускаются, корень представлен именем сайта.
- Canonical, `og:url` и все ссылки абсолютные, без завершающего слэша; корень — URL сайта со слэшем: так хостинг отдаёт его без редиректа. Картинка и иконка домашнего экрана тоже абсолютные.
- JSON-LD: `WebApplication` категории `site.applicationCategory` у корня, `BreadcrumbList` по цепочке у остальных.
- Путь вне списка получает имя сайта в title и `noindex`, без description, canonical и JSON-LD.
- `<noscript>`: заголовок с title страницы (имя сайта у корня, у страницы без title и у пути вне списка), абзац с description и ссылки на все маршруты с title и на корень.
- Текст и атрибуты экранируются; в JSON-LD экранируется каждый `<`, поэтому `</script>` не закроет скрипт.

## Ограничения

- Пути сравниваются как записаны: путь страницы нужен в форме списка, абсолютный и без завершающего слэша.
- `site.url` — без завершающего слэша, пути картинок — с `/` в начале.
- Страница без title, кроме корня, не получает ссылки в `<noscript>`.
