# Build storage

**English** · [Русский](build-storage.ru.md)

Builds of the Build calculators survive reloads and reopening: they are saved to `localStorage` and synced between open tabs. Each calculator has its own prefix and list: `lwr-tools.biosoldier-builds.v1.`, `lwr-tools.mec-builds.v1.` and `lwr-tools.shiv-builds.v1.`; keys and records below are shown for Biosoldiers and are the same for MECs and SHIVs.

## Keys

```
lwr-tools.biosoldier-builds.v1.order         → ["id1", "id2", …]
lwr-tools.biosoldier-builds.v1.build.<id>    → { "code": "AQx…", "readonly": false }
```

- `code` is the build's [share code](share-codes.en.md): class, perks, Gene mods, Psionic abilities, Officer perks, name and Signature skill. Its format already keeps old codes readable, so the record only adds the lock.
- One key per build: a tab changes only the records it touched and does not overwrite other tabs' edits with a whole snapshot.
- `order` is the display order. No `order` means nothing has been saved yet, and the page shows the default builds; `[]` means the user removed them all.
- `lwr-tools.` is required: on GitHub Pages every `<user>.github.io` project shares one storage.

Code: [`shared/lib/stored-list`](../src/shared/lib/stored-list/README.en.md) (loading, saving, sync between tabs, delays), the `widgets/build-calculator` widget: `config/constants.ts` (keys and record schema), `model/build-list.ts` (the `SavedBuild` type and build list operations: rename, lock, import, replace, remove, update of an Outdated build), `model/stored-build.ts` (build record ↔ build through the public share code API of `features/share-build`; a code with Outdated selections reads as an Outdated build), `model/build-editor.ts` (editing of one build from its tree, for Biosoldiers and MECs with its Signature skill) and the stores `model/biosoldier-builds.ts` / `model/mec-builds.ts` / `model/shiv-builds.ts` (default builds, tree rules). The stores are read by several pages, which do not import each other: the widget is the lowest layer that fits.

## Loading

- Ids from `order` first, then build records missing from it — last, in storage order. Such records appear when two tabs add builds at once.
- Ids from `order` without a record are skipped.
- A record that fails to parse (JSON, shape, share code) is skipped and stays in the storage: a newer app version may read it.
- A record whose code has [Outdated selections](share-codes.en.md#decoding-result) loads as an Outdated build: the build without them, with the record (`code`) and the Outdated selections in `outdated`; a regular build has `outdated: null`.
- A Signature skill whose perk is no longer in the Class tree loads as none; the record drops it on the next save of the build, without a migration.
- An invalid `order` counts as `[]`: records are still restored.
- Default builds have fixed ids (`default-<classId>` for Biosoldiers and MECs, `default-shiv` for SHIVs) and are saved right away, so tabs opened for the first time at once write the same records.

## Saving

- Store actions mark the changed build and, when builds are added or removed, the order; nothing watches the state.
- Changes are saved 300 ms after the last one, at least every 2 s during continuous editing, and right away when the page is hidden or closed (`visibilitychange`, `pagehide`).
- A build is saved again from its current state; a removed build's record is removed.

## Outdated build

An Outdated build is frozen until the player updates it: selections, the Signature skill, rename, Reset, import, the lock toggle and export do nothing, removal works. Its record is saved back as it was loaded, without re-encoding.

- Panel: the saved tree (the current tree, readonly; on a step of an Outdated selection the ability of the code stands in the cell of its variant, selected, with a dashed danger frame, a semi-transparent icon and an «OLD» label; its description notes «Outdated selection: in this mod version <step> has <Ability> here.»), the chip «N outdated selections» and the «Update» button in the header row; a danger triangle after the name in the build list.
- Its Signature skill comes from the stored code and stands on the disabled button in the header; the update keeps it, and the new code carries it.
- SHIV: both perks of a collision stand selected and marked on their technology level; their description notes «Outdated selection: in this mod version <Perk> and <Perk> are both on <Technology level>.». A perk gone from the SHIV tree has no cell: a plate under the tree lists it as «<Perk> — removed from the SHIV tree».
- «Update» opens the «Update build» dialog with a card per Outdated selection and the empty cell «Empty» on the right. Confirming it (`updateBuild`) drops `outdated` and saves the build with its new code; the steps of the Outdated selections stay empty. The lock is kept: a readonly build stays readonly.
- The update reaches other tabs as any record change.
- Squad planner: the Unit check skips a Unit of an Outdated build — the Unit stays, its Loadout is not changed or saved and is frozen (its tiles open nothing), it gets no toast line. Its card reads «Build outdated · update it in the Build» in place of the caption, and the mini-tree shows the saved tree with the outdated steps dashed in danger. The Build dialog shows the same chip and «Update»; after the update the usual Unit check runs on closing the dialog or opening the Squad. In Add Unit the row of an Outdated build is disabled with «Update the build first».

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
