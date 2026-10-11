# stored-list

**English** · [Русский](README.ru.md)

An ordered list of items that survives reloads and stays in sync between open tabs. Each item is its own `localStorage` record, so a tab writes only what it changed and never overwrites other tabs' edits with a whole snapshot.

## Usage

```ts
const notes = useStoredList<Note>({
  orderKey: 'app.notes.v1.order',
  itemKeyPrefix: 'app.notes.v1.note.',
  serialize: note => ({ text: note.text }),
  parse: (id, record) => (isNoteRecord(record) ? { id, text: record.text } : null),
  defaultItems: () => [{ id: 'welcome', text: 'Hello' }],
});

notes.addItem({ id: createId(), text: '' });

const note = notes.getItem(id);

if (!note) return;

note.text = text;
notes.markItemChanged(id);
```

Call it inside a component setup or a setup store: it listens to window and document events for the lifetime of that scope.

## API

`useStoredList(options)`:

| Option | Meaning |
|---|---|
| `orderKey` | key of the order: a JSON array of ids; its absence means nothing has been saved yet |
| `itemKeyPrefix` | key prefix of an item record, followed by the item id |
| `serialize(item)` | JSON-ready record of the item; `null` keeps its previous record |
| `parse(id, record)` | item of a parsed record; `null` for an invalid record |
| `defaultItems()` | items shown and saved while nothing has been saved yet |

| Result | Meaning |
|---|---|
| `items` | computed items in order |
| `getItem(id)` | the item, mutable in place; `null` if missing |
| `addItem(item)` | adds it last and saves it |
| `removeItem(id)` | removes it and its record |
| `markItemChanged(id)` | saves an item after it was mutated in place |

## Behavior

- Loading: ids from the order first, then records missing from it in storage order. Ids without a record are skipped; a record that is not JSON or that `parse` rejects is skipped and left in the storage; an invalid order counts as `[]`.
- Nothing saved yet: `defaultItems()` are shown and saved right away. Give them fixed ids, so tabs opened at once write the same records.
- Saving: 300 ms after the last change, at least every 2 s during continuous editing, and right away when the page is hidden or closed (`visibilitychange`, `pagehide`). Only the marked records and the order are written.
- Other tabs: their saved changes arrive as the `storage` event and are applied directly, not saved back. A changed record replaces the item in place, a new one is added last, a removed one removes the item. A changed order rearranges the items; items missing from it stay last, and the merged order is saved. An incoming change of an item cancels this tab's pending save of it.

## Limitations

- The same item edited in two tabs at once: the last save wins.
- Clearing the storage from another tab is ignored; this tab writes its records again on its next change.
- Keys need an app prefix: the origin shares one storage (see `local-storage`).
- The record shape is the caller's: a new shape needs new keys (for example a new version in the prefix) and a migration on the caller's side.
