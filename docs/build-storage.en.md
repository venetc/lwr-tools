# Build storage

**English** · [Русский](build-storage.ru.md)

Builds of the talents page survive reloads and reopening: they are saved to `localStorage` and synced between open tabs.

## Keys

```
lwr-tools.talents.v1.order         → ["id1", "id2", …]
lwr-tools.talents.v1.build.<id>    → { "code": "AQx…", "readonly": false }
```

- `code` is the build's [share code](share-codes.en.md): class, talents and name. Its format already keeps old codes readable, so the record only adds the lock.
- One key per build: a tab changes only the records it touched and does not overwrite other tabs' edits with a whole snapshot.
- `order` is the display order. No `order` means nothing has been saved yet, and the page shows the default builds; `[]` means the user removed them all.
- `lwr-tools.` is required: on GitHub Pages every `<user>.github.io` project shares one storage.

Code: `pages/talents/config/constants.ts` (keys, schemas, delays), `model/build-storage.ts` (records and loading), `model/useBuildSync.ts` (saving and sync); storage access is `shared/lib/local-storage`.

## Loading

- Ids from `order` first, then build records missing from it — last, in storage order. Such records appear when two tabs add builds at once.
- Ids from `order` without a record are skipped.
- A record that fails to parse (JSON, shape, share code) is skipped and stays in the storage: a newer app version may read it.
- An invalid `order` counts as `[]`: records are still restored.
- Default builds have fixed ids `default-<classId>` and are saved right away, so tabs opened for the first time at once write the same records.

## Saving

- Store actions mark the changed build and, when builds are added or removed, the order; nothing watches the state.
- Changes are saved 300 ms after the last one, at least every 2 s during continuous editing, and right away when the page is hidden or closed (`visibilitychange`, `pagehide`).
- A build is saved again from its current state; a removed build's record is removed.

## Sync between tabs

A tab gets the `storage` event for changes saved by other tabs and applies them directly, not through actions, so they are not saved back.

- Build record changed → the build is replaced in place; the panel is not remounted. New record → the build is added last. Record removed → the build is removed.
- `order` changed → builds are rearranged; builds of this tab missing from it stay last, and then the merged order is saved.
- An incoming change of a build cancels this tab's pending save of that build.

## Changing the record shape

Keys and the record shape do not change. A new shape gets a new version in the prefix (`v2`): loading reads `v2`, and if it is absent, reads `v1` and saves it as `v2`.

## Limitations

- The same build edited in two tabs at once: the last save wins.
- Clearing the storage from another tab is ignored; this tab writes its records again on its next change.
- A name longer than 31 UTF-8 bytes is cut by the share code, so it comes back cut after a reload.
