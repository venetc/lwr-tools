# Soldier build codes

**English** · [Русский](share-codes.ru.md)

An issued code must always open: we can't update codes players have saved.

Biosoldier and MEC builds share one layout under their own formats: `1` Biosoldier, `3` MEC. A format reads only the classes of its kind of soldier.

SHIV build codes share the layout and rules: [SHIV build codes](shiv-share-codes.en.md).

A Unit code is the build code of its format plus sections: see [Unit codes](#unit-codes).

A whole Squad is a chain of Unit codes behind a Squad header: [Squad codes](squad-share-codes.en.md).

## Structure

```
format (8) | section … | 0 (5) | padding | crc (8)   → base64url
section = id (5) | length (9) | fields
```

- Sections go by ascending id, each at most once; `0` ends the list.
- Unknown sections are skipped by their length.
- A section that is read must end exactly at its length, otherwise the code is invalid; skipped sections aren't checked.

## Decoding result

Every place that takes a code reads it with `readShareCode(code)`. It opens the frame of each part once, tells the kind of code by the `format` of the first part, and gives:

- `{ status: 'unit', unit }` — a build code or a Unit code: `unit` is `{ kind, build, loadout }`, with `loadout: null` for a build code. The unit type comes from the format of its build layout (`1` Biosoldier, `2` SHIV, `3` MEC).
- `{ status: 'squad', squad }` — a [Squad code](squad-share-codes.en.md).
- `{ status: 'invalid' }` — everything else: a broken part, an unknown format, several parts without a Squad header, a missing or broken section, an unknown code, a class of another format, a step count or a variant index the current tree does not have, a selection whose ability is not the one the tree has at its place, or a Build that breaks a Build rule. The rules: the base perk on the first rank, one selection per step, Neural Damping against Psionic abilities. Ranks, Psi levels and Officer ranks are taken in any order and may stay empty; an Officer rank does not need its Rank.

Each place checks the result with one condition. The Import of a Build calculator takes a `unit` of its own kind and keeps its Build; a `unit` of another kind shows a toast "This is a <unit> build code" with the unit type name of `entities/loadout`, a `squad` shows a toast "This is a Squad code. Import it in the Squad planner.", both keeping the form open; `invalid` shows "Invalid code" under the field. The Squad planner places are in [Squad codes](squad-share-codes.en.md#decoding).

A code opens only with a Build the Build calculator can assemble, and every Build it assembles encodes.

A stored build is read the same way: a record whose code is no build of the kind of its Build calculator is skipped on loading.

Code:

- `entities/soldier` — Build ↔ codes: `biosoldierBuildCodes` / `biosoldierBuildFromCodes`, `mecBuildCodes` / `mecBuildFromCodes`. The entity turns a Build into stable codes and back: each selection as its variant index on the step and the `code` of its ability. It gives null for an unknown code, a class of another kind, steps or a variant the tree does not have, an ability off its place or a Build that breaks a Build rule. From codes it assembles the Build from the Default build step by step with the mutators of the Build calculator; a Build is encoded only if the same pass assembles it.
- `shared/lib/binary-code` — header, sections, CRC; built on `shared/lib/bit-stream`, `base64-url` and `crc8`.
- `features/share-build` — bits only. Public API: `readShareCode`, `encodeBuild(kind, build)`, `encodeUnit`, `encodeSquad`, `storedBuildCodec(kind)`, the `ShareCodeImport` and `ShareCodeExport` components and the types. Inside: `config/constants.ts` (format numbers, section ids, field widths), `model/share-code.ts` (`readShareCode` and its result), `model/build-code.ts` (`BuildDataByKind`, `BuildCodeLayout` — the format, the sections of a build and reading them back — `BUILD_CODE_LAYOUTS` by unit type of `LoadoutUnitId`, so a unit type without a layout does not compile, and `encodeBuild`), `model/section-fields.ts` (a counted code list `writeCodeList` / `readCodeList`, a step list `writeStepList` / `readStepList`, the `NAME` section and `readWholeSection`, which gives null for a section not read exactly to its end), `model/soldier-build-code.ts` and `model/shiv-build-code.ts` (sections over the build codes; `soldierBuildLayout` builds the layout of a soldier format from the Build ↔ codes pair and its extension, the sections beyond `PERKS` and `NAME`: `BIOSOLDIER_BUILD_LAYOUT` is format 1 with the Gene mods, Psionic abilities and Officer perks extension, `MEC_BUILD_LAYOUT` format 3 without one), `model/unit-code.ts` (Unit codes), `model/squad-code.ts` (Squad codes), `model/stored-build.ts` (stored build records over a share code). The feature serves every Build calculator page and stays a separate slice: the format changes for its own reasons and has its own tests and docs.

## Sections

| Section | id | Fields | Written |
|---|---|---|---|
| `PERKS` | 1 | `class` 5 · steps, `variant` 2 | always |
| `NAME` | 2 | `nameLength` 5 · UTF-8 | if the name differs from the class name |
| `GENE_MODS` | 3 | steps, `variant` 1 | Biosoldier only, if the build has a Gene mod |
| `PSIONIC` | 4 | steps, `variant` 2 | Biosoldier only, if the build has a Psionic ability |
| `OFFICER` | 5 | steps, `variant` 1 | Biosoldier only, if the build has an Officer perk |
| `LOADOUT` | 6 | `armor` 8 · `primary` 8 · `secondary` 8 · `utilityCount` 3 · `item` 8 × utilityCount · `moduleCount` 2 · `item` 8 × moduleCount | Unit codes only |

Steps are a list of every step of the tree: `count` 3, then per step `selected` 1 and, for a selection, `variant` (its index among the variants of the step, in tree order) and `ability` 8. Empty steps keep their place, so a Build with gaps comes back as it was.

In `PERKS`, the steps are the ranks bottom to top, from the second one: the base perk is taken from the current tree on import. In `GENE_MODS`, the Body parts Brain to Legs; in `PSIONIC`, the Psi levels Awakened to Master; in `OFFICER`, the Officer ranks Lieutenant to Field Commander. A code without one of these sections gives empty steps there; a present one always has steps.

The ability of a selection must be the one the current tree has at its step and variant, and the step count must be the one of the tree; otherwise the code is invalid.

MEC codes never carry `GENE_MODS`, `PSIONIC` or `OFFICER`, and the MEC decoder skips them as unknown.

## Unit codes

A Unit code is the build code of its format plus the `LOADOUT` section with the Loadout of the Unit; Units have no format numbers of their own. The section takes the next id of the format: `6` in the soldier formats, `3` in the SHIV format.

- There is no Officer flag: a Unit is an Officer when the `OFFICER` section of its Build has an Officer perk.
- Items are the `code` numbers of the Loadout catalogs of `entities/loadout`: armor and MEC exoskeletons from `armors.json` (a SHIV code: its SHIV type from `shiv-types.json`), weapons from `weapons.json`, Equipment and Modules from `equipment.json`. `0` is an empty slot, also of the secondary weapon.
- Utility slots go by position, Gear Slots and Psi Slots last; Module slots by position.
- The decoder does not check the Loadout against the Build: an unknown item code leaves its slot empty, and Seraph Armor without Officer perks is not invalid. The Squad planner brings the Loadout to the rules with the Unit check on import and tells in a toast what it took off.
- A Build calculator takes the Build of a Unit code of its kind and leaves the Loadout. A build code added as a Unit gets the Default Loadout.
- A new part of a Unit is a new section after `LOADOUT`, by the same rules as a new part of a Build.

Code: `model/unit-code.ts` — `encodeUnit` writes the sections of the layout of the kind (`BUILD_CODE_LAYOUTS`) and `LOADOUT` over `loadoutCodes` of `entities/loadout`; `readUnit`, called by `readShareCode`, reads an opened code of any build format into the kind, the Build and the Loadout of `loadoutFromCodes`, null for a build code.

## Numbering

Codes store classes by their `code` and each selection by its place in the tree, the step and the variant index, with the `code` of its ability. So the number of ranks, of perks on each rank of a class and of variants on each Body part, Psi level and Officer rank stays the same between mod versions.

- New record: max `code` + 1. Class codes are unique across the Biosoldier and MEC class lists: a new class of either kind gets the max class `code` of both + 1.
- Never change an existing `code`.
- Never reuse a deleted record's `code`; better, don't delete records.
- `0` is never assigned: for abilities and classes it means "unknown", for sections — the end of the list.

Same for `SOLDIER_BUILD_SECTION` and `SHARE_CODE_FORMAT`, and for the `code` numbers of the Loadout catalogs, which Unit codes store in 8 bits: from 1 to 255.

Example: new ability, max `code` is N.

1. `abilities.json`: `"deadeye": { "code": N + 1, "name": "Deadeye", "description": "…" }`.
2. `config/constants/ability-icons.ts`: `deadeye` icon in `ABILITY_ICON`.
3. `biosoldier-classes.json` or `mec-classes.json`: `"deadeye"` on the class rank.
4. `npm test`.

## Safe edits

Edit names, descriptions, icons; rename ids (keep `code`); add classes; rename Body parts, Psi levels and Officer ranks; change an Officer rank's `abbreviation` or `requiredRank`, which is only a hint.

## Breaking edits

| Edit | Old codes |
|---|---|
| change or reuse a `code` | show the wrong ability |
| change or reuse a `code` of a Loadout catalog | Unit codes show the wrong item |
| delete a record | "Invalid code" |
| move an ability to another step or variant, remove it from a tree or replace it | codes that select it: "Invalid code" |
| reorder Body parts, Psi levels or Officer ranks | codes with a selection there: "Invalid code" |
| change the number of ranks, Body parts, Psi levels or Officer ranks | codes of that tree: "Invalid code" |
| remove a variant from a step | codes that select a variant past the new end of the step: "Invalid code" |
| change a section's fields or their widths | "Invalid code" or wrong data |
| change the section layout, CRC or base64url | every code is invalid |

Section fields change only in a new section:

1. Add the next id to `SOLDIER_BUILD_SECTION` with a version suffix.
2. Write the new section instead of the current one; keep reading the current one.
3. `readBuild` of `soldierBuildLayout` reads whichever of the two sections the code has, each with `readWholeSection`.

Readers of old sections stay forever. The section layout itself changes only with a new number in `SHARE_CODE_FORMAT`.

Example: `PERKS` gets a new field, max section id is 6.

1. `SOLDIER_BUILD_SECTION`: `PERKS_V2: 7`.
2. The new field goes into `SoldierBuildCodes` of `entities/soldier`.
3. `writeBuild` of `soldierBuildLayout` writes `PERKS_V2` instead of `PERKS`.
4. `readBuild` of `soldierBuildLayout`: `PERKS` with the new field defaulted, `PERKS_V2` with the new field.

## New part

1. Add the part to the build codes of `entities/soldier`: `SoldierBuildCodes` for every soldier, `BiosoldierBuildCodes` for Biosoldiers. Build → codes writes its codes; codes → Build takes them step by step with the mutators, so the Build rules check them.
2. Add the next id to `SOLDIER_BUILD_SECTION`.
3. Write the section in `soldier-build-code.ts`. A part of every soldier goes into `writeBuild` / `readBuild` of `soldierBuildLayout`; a part of one format goes into its extension (`BIOSOLDIER_BUILD_EXTENSION` for Biosoldiers): `write` gives the section only when the codes have the part, `read` reads it with `readWholeSection`; a list of codes is written and read with `writeCodeList` / `readCodeList`, a list of steps with `writeStepList` / `readStepList`. Without the section the part is empty.

Example: Officer perks (Biosoldier only), max section id was 4.

1. `BiosoldierBuildCodes`: `officerPerks`, the selections by Officer rank; codes → Build takes them after Psionic abilities.
2. `SOLDIER_BUILD_SECTION`: `OFFICER: 5`.
3. `BIOSOLDIER_BUILD_EXTENSION`: `write` gives `OFFICER` (steps with `OFFICER_RANK_STEP_BITS`) only for codes with an Officer perk; `read` gives its steps, an empty list without the section.

## Checks

`npm test` checks `code` ranges and uniqueness (class ids and codes across both class lists), ids and `grants` cycles, and the code format itself; the pre-push hook runs it with `vue-tsc` and lint, followed by the end-to-end tests.

Changing or reusing a `code` is caught only in review.
