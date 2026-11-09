# route-menu

**English** · [Русский](README.ru.md)

Menus of links built from route records: a route shows up in a menu by its `meta.title`, so adding a route adds it to every menu of its level.

## Usage

```ts
const items = routeMenuItems(router.options.routes);
// [{ label: 'Home', to: '/home' }]
```

```ts
const { parentTitle, items } = useSiblingRoutes();
// pages next to the current one, under the title of their parent route
```

```ts
const { items } = useTopLevelRoutes();
// top-level pages of the app, for a home menu
```

## API

| Function / type | Arguments | Result |
|---|---|---|
| `routeMenuItems(records)` | route records | `RouteMenuItem[]` of the records with `meta.title`, in their order |
| `useSiblingRoutes()` | — | `{ parentTitle, items }`: computed title of the parent route and menu items of its children |
| `useTopLevelRoutes()` | — | `{ items }`: menu items of the top-level routes of the router |
| `RouteMenuItem` | — | `{ label, to }` |

## Behavior

- Records without `meta.title` are skipped: an index page of a section usually has none and is reached through its parent.
- For a top-level route `useSiblingRoutes` gives an empty title and no items.

## Limitations

- Items link to the paths as written in the records, so records need absolute paths; a relative child path does not lead to the page.
- `useTopLevelRoutes` builds its items once: routes added to the router later are not listed.
- One level only: children of children are not listed.
