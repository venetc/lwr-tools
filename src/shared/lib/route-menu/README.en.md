# route-menu

**English** · [Русский](README.ru.md)

Menus of links built from route records: a route shows up in a menu by its `meta.title`, so adding a route adds it to every menu of its level.

## Usage

```ts
const items = routeMenuItems(router.options.routes, route);
// [{ label: 'Home', to: '/home', isCurrent: true }]
```

```ts
const { parentTitle, items } = useSiblingRoutes();
// pages next to the current one, under the title of their parent route
```

## API

| Function / type | Arguments | Result |
|---|---|---|
| `routeMenuItems(records, route)` | route records, current route | `RouteMenuItem[]` of the records with `meta.title`, in their order |
| `useSiblingRoutes()` | — | `{ parentTitle, items }`: computed title of the parent route and menu items of its children |
| `RouteMenuItem` | — | `{ label, to, isCurrent }` |

## Behavior

- Records without `meta.title` are skipped: an index page of a section usually has none and is reached through its parent.
- `isCurrent` is the exact page: the item path equals the path of the deepest matched record. A parent is not current on its child pages.
- For a top-level route `useSiblingRoutes` gives an empty title and no items.

## Limitations

- Paths are compared as written in the records, so records need absolute paths; a relative child path never matches.
- One level only: children of children are not listed.
