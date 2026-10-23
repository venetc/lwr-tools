# Soldier build codes

**English** · [Русский](share-codes.ru.md)

An issued code must always open: we can't update codes players have saved.

Biosoldier and MEC builds share one layout under their own formats: `1` Biosoldier, `3` MEC. A format reads only the classes of its kind of soldier.

SHIV build codes share the layout and rules: [SHIV build codes](shiv-share-codes.en.md).

A Unit code is the build code of its format plus sections: see [Unit codes](#unit-codes).

## Structure

```
format (8) | section … | 0 (5) | padding | crc (8)   → base64url
section = id (5) | length (9) | fields
```

- Sections go by ascending id, each at most once; `0` ends the list.
- Unknown sections are skipped by their length.
- A section that is read must end exactly at its length, otherwise the code is invalid; skipped sections aren't checked.

## Decoding result

A decoder returns `{ status: 'decoded', build }`, or why it failed:

- `{ status: 'other-unit', unit }` — the CRC and header are valid, but `format` belongs to another unit's builds (`SHARE_CODE_FORMAT_UNIT`: `1` Biosoldier, `2` SHIV, `3` MEC). The import shows a toast "This is a <unit> build code" and keeps the form open with the code.
- `{ status: 'invalid' }` — everything else: a broken code, an unknown format, a missing or broken section, an unknown code, a class of another format, or a Build that breaks a Build rule. The rules: each perk on its own rank of the class tree, ranks, Psi levels and Officer ranks in order without gaps, each Gene mod in its own Body part (in `GENE_MODS` Body parts go Brain to Legs, each once), Neural Damping against Psionic abilities, each Officer rank only once the class tree completes its required Rank. The import shows "Invalid code" under the field.

A code opens only with a Build the Build calculator can assemble, and every Build it assembles encodes.

A stored build whose code does not decode is skipped on loading.

Code:

- `entities/soldier` — Build ↔ codes: `biosoldierBuildCodes` / `biosoldierBuildFromCodes`, `mecBuildCodes` / `mecBuildFromCodes`. The entity turns a Build into stable codes and back and gives null for an unknown code, a class of another kind or a Build that breaks a Build rule. From codes it assembles the Build from the Default build step by step with the mutators of the Build calculator; a Build is encoded only if the same pass assembles it.
- `shared/lib/binary-code` — header, sections, CRC; built on `shared/lib/bit-stream`, `base64-url` and `crc8`.
- `features/share-build` — bits only: `config/constants.ts` (format numbers and their units, section ids, field widths), `model/share-code.ts` (decoding result, opening a code of the expected format, the `NAME` section, `BuildCodeLayout` — the format, the sections of a build and reading them back — and `buildCodec`, which turns a layout into the encoder and decoder), `model/section-fields.ts` (a counted code list `writeCodeList` / `readCodeList` and `readWholeSection`, which gives null for a section not read exactly to its end), `model/soldier-build-code.ts` and `model/shiv-build-code.ts` (sections over the build codes; `soldierBuildLayout` builds the layout of a soldier format from the Build ↔ codes pair and its extension, the sections beyond `PERKS` and `NAME`: `BIOSOLDIER_BUILD_LAYOUT` is format 1 with the Gene mods, Psionic abilities and Officer perks extension, `MEC_BUILD_LAYOUT` format 3 without one; `encodeBiosoldierBuild` / `decodeBiosoldierBuild` and `encodeMecBuild` / `decodeMecBuild` are `buildCodec` over them), `model/unit-code.ts` (Unit codes), `model/build-codecs.ts` (the codecs and layouts by kind of build), `model/stored-build.ts` (stored build records over a share code). The feature serves every Build calculator page and stays a separate slice: the format changes for its own reasons and has its own tests and docs.

## Sections

| Section | id | Fields | Written |
|---|---|---|---|
| `PERKS` | 1 | `class` 5 · `count` 3 · `ability` 8 × count | always |
| `NAME` | 2 | `nameLength` 5 · UTF-8 | if the name differs from the class name |
| `GENE_MODS` | 3 | `count` 3 · `ability` 8 × count | Biosoldier only, if the build has Gene mods |
| `PSIONIC` | 4 | `count` 3 · `ability` 8 × count | Biosoldier only, if the build has Psionic abilities |
| `OFFICER` | 5 | `count` 3 · `ability` 8 × count | Biosoldier only, if the build has Officer perks |
| `LOADOUT` | 6 | `armor` 8 · `primary` 8 · `secondary` 8 · `utilityCount` 3 · `item` 8 × utilityCount · `moduleCount` 2 · `item` 8 × moduleCount | Unit codes only |

In `PERKS`, `count` is the number of perks selected beyond the base perk; abilities go by rank, bottom to top. The base perk is taken from the current tree on import.

In `GENE_MODS`, Gene mods go by Body part, Brain to Legs; the Body part of each Gene mod comes from the data, positions are not stored.

In `PSIONIC`, Psionic abilities go by Psi level, Awakened to Master, without gaps; the level of each ability is its position.

In `OFFICER`, Officer perks go by Officer rank, Lieutenant to Field Commander, without gaps; the Officer rank of each perk is its position. A code without `OFFICER` gives an empty Officer tree.

MEC codes never carry `GENE_MODS`, `PSIONIC` or `OFFICER`, and the MEC decoder skips them as unknown.

## Unit codes

A Unit code is the build code of its format plus the `LOADOUT` section with the Loadout of the Unit; Units have no format numbers of their own. The section takes the next id of the format: `6` in the soldier formats, `3` in the SHIV format.

- There is no Officer flag: a Unit is an Officer when the `OFFICER` section of its Build has Officer perks.
- Items are the `code` numbers of the Loadout catalogs of `entities/loadout`: armor and MEC exoskeletons from `armors.json` (a SHIV code: its SHIV type from `shiv-types.json`), weapons from `weapons.json`, Equipment and Modules from `equipment.json`. `0` is an empty slot, also of the secondary weapon.
- Utility slots go by position, Gear Slots and Psi Slots last; Module slots by position.
- The decoder does not check the Loadout against the Build: an unknown item code leaves its slot empty, and Seraph Armor without Officer perks is not invalid. The Squad planner brings the Loadout to the rules with the Unit check on import and tells in a toast what it took off.
- A Build calculator reads a Unit code as a build code: it skips `LOADOUT` as an unknown section. A build code imported as a Unit gets the Default Loadout.
- A new part of a Unit is a new section after `LOADOUT`, by the same rules as a new part of a Build.

Code: `model/unit-code.ts` — `encodeUnit` writes the sections of the layout of the kind (`BUILD_CODE_LAYOUTS`) and `LOADOUT` over `loadoutCodes` of `entities/loadout`; `decodeUnit` takes a code of any build format and gives the kind, the Build and the Loadout of `loadoutFromCodes`, null for a build code.

## Numbering

Codes store the `code` numbers of abilities and classes, not tree positions, so trees can change freely.

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

Add abilities to trees; reorder abilities within a rank; edit names, descriptions, icons; rename ids (keep `code`); add classes; swap the two Gene mods of a Body part; rename Body parts; reorder Psionic abilities within a Psi level; rename Psi levels; swap the two Officer perks of an Officer rank; rename Officer ranks; change an Officer rank's `abbreviation`; lower an Officer rank's `requiredRank`.

## Breaking edits

| Edit | Old codes |
|---|---|
| change or reuse a `code` | show the wrong ability |
| change or reuse a `code` of a Loadout catalog | Unit codes show the wrong item |
| delete a record | "Invalid code" |
| move an ability to another rank, remove it from a tree or replace it | codes that select it: "Invalid code" |
| reorder Body parts, move a Gene mod to another Body part or remove it | codes with it: "Invalid code" or the Gene mod in the wrong Body part |
| reorder Psi levels, move a Psionic ability to another Psi level or remove it | codes with it: "Invalid code" |
| reorder Officer ranks, move an Officer perk to another Officer rank or remove it | codes with it: "Invalid code" |
| raise an Officer rank's `requiredRank` | codes whose class tree does not reach the new Rank: "Invalid code" |
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
3. Write the section in `soldier-build-code.ts`. A part of every soldier goes into `writeBuild` / `readBuild` of `soldierBuildLayout`; a part of one format goes into its extension (`BIOSOLDIER_BUILD_EXTENSION` for Biosoldiers): `write` gives the section only when the codes have the part, `read` reads it with `readWholeSection`; a list of codes is written and read with `writeCodeList` / `readCodeList`. Without the section the part is empty.

Example: Officer perks (Biosoldier only), max section id was 4.

1. `BiosoldierBuildCodes`: `officerPerks`, the codes by Officer rank; codes → Build takes them after Psionic abilities.
2. `SOLDIER_BUILD_SECTION`: `OFFICER: 5`.
3. `BIOSOLDIER_BUILD_EXTENSION`: `write` gives `OFFICER` (`count` 3 · `ability` 8 × count) only for codes with Officer perks; `read` gives its codes, an empty list without the section.

## Checks

`npm test` checks `code` ranges and uniqueness (class ids and codes across both class lists), ids and `grants` cycles, and the code format itself; the pre-push hook runs it with `vue-tsc` and lint, followed by the end-to-end tests.

Changing or reusing a `code` is caught only in review.
