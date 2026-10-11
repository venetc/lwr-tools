# panel-scroll

**English** · [Русский](README.ru.md)

Scrolls the page to the panel of an item from a list, for example from a navigation of the panels on the page. Panels are collected through template refs, so nothing is looked up in the document and no element ids are needed.

## Usage

```ts
const { panelRef, scrollToPanel } = usePanelScroll();
```

```vue
<NotePanel v-for="note in notes" :ref="panelRef(note.id)" :key="note.id" />

<NoteNav :notes="notes" @select="scrollToPanel" />
```

## API

| Function | Arguments | Result |
|---|---|---|
| `usePanelScroll()` | — | `{ panelRef, scrollToPanel }` |
| `panelRef(id)` | item id | function template ref for the item panel: an element or a component |
| `scrollToPanel(id)` | item id | scrolls the panel to the top of the viewport |

## Behavior

- Scrolling is smooth, and instant when the user prefers reduced motion.
- A panel that is not rendered, or was unmounted, is ignored.
- The panel's `scroll-margin` sets the gap to the viewport top, for example under a sticky header.

## Limitations

- One call per list: item ids must be unique within it.
- Scrolls the page or the nearest scrolling ancestor, as `scrollIntoView` does.
