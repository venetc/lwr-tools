# Soldier build codes

**English** · [Русский](share-codes.ru.md)

An issued code must always open: we can't update codes players have saved.

Biosoldier and MEC builds share one layout under their own formats: `1` Biosoldier, `3` MEC. A format reads only the classes of its kind of soldier.

SHIV build codes share the layout and rules: [SHIV build codes](shiv-share-codes.en.md).

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
- `features/share-build` — bits only: `config/constants.ts` (format numbers and their units, section ids, field widths), `model/share-code.ts` (decoding result, opening a code of the expected format, the `NAME` section), `model/section-fields.ts` (a counted code list `writeCodeList` / `readCodeList` and `readWholeSection`, which gives null for a section not read exactly to its end), `model/soldier-build-code.ts` and `model/shiv-build-code.ts` (sections over the build codes; `soldierBuildCodec` builds the encoder and decoder of a soldier format from the Build ↔ codes pair and its extension, the sections beyond `PERKS` and `NAME`; `encodeBiosoldierBuild` / `decodeBiosoldierBuild` are its format 1 pair with the Gene mods, Psionic abilities and Officer perks extension, `encodeMecBuild` / `decodeMecBuild` its format 3 pair without one), `model/stored-build.ts` (stored build records over a share code). The feature serves every Build calculator page and stays a separate slice: the format changes for its own reasons and has its own tests and docs.

## Sections

| Section | id | Fields | Written |
|---|---|---|---|
| `PERKS` | 1 | `class` 5 · `count` 3 · `ability` 8 × count | always |
| `NAME` | 2 | `nameLength` 5 · UTF-8 | if the name differs from the class name |
| `GENE_MODS` | 3 | `count` 3 · `ability` 8 × count | Biosoldier only, if the build has Gene mods |
| `PSIONIC` | 4 | `count` 3 · `ability` 8 × count | Biosoldier only, if the build has Psionic abilities |
| `OFFICER` | 5 | `count` 3 · `ability` 8 × count | Biosoldier only, if the build has Officer perks |

In `PERKS`, `count` is the number of perks selected beyond the base perk; abilities go by rank, bottom to top. The base perk is taken from the current tree on import.

In `GENE_MODS`, Gene mods go by Body part, Brain to Legs; the Body part of each Gene mod comes from the data, positions are not stored.

In `PSIONIC`, Psionic abilities go by Psi level, Awakened to Master, without gaps; the level of each ability is its position.

In `OFFICER`, Officer perks go by Officer rank, Lieutenant to Field Commander, without gaps; the Officer rank of each perk is its position. A code without `OFFICER` gives an empty Officer tree.

MEC codes never carry `GENE_MODS`, `PSIONIC` or `OFFICER`, and the MEC decoder skips them as unknown.

## Numbering

Codes store the `code` numbers of abilities and classes, not tree positions, so trees can change freely.

- New record: max `code` + 1. Class codes are unique across the Biosoldier and MEC class lists: a new class of either kind gets the max class `code` of both + 1.
- Never change an existing `code`.
- Never reuse a deleted record's `code`; better, don't delete records.
- `0` is never assigned: for abilities and classes it means "unknown", for sections — the end of the list.

Same for `SOLDIER_BUILD_SECTION` and `SHARE_CODE_FORMAT`.

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
3. `decode` of `soldierBuildCodec` reads whichever of the two sections the code has, each with `readWholeSection`.

Readers of old sections stay forever. The section layout itself changes only with a new number in `SHARE_CODE_FORMAT`.

Example: `PERKS` gets a new field, max section id is 5.

1. `SOLDIER_BUILD_SECTION`: `PERKS_V2: 6`.
2. The new field goes into `SoldierBuildCodes` of `entities/soldier`.
3. `encode` of `soldierBuildCodec` writes `PERKS_V2` instead of `PERKS`.
4. `decode` of `soldierBuildCodec`: `PERKS` with the new field defaulted, `PERKS_V2` with the new field.

## New part

1. Add the part to the build codes of `entities/soldier`: `SoldierBuildCodes` for every soldier, `BiosoldierBuildCodes` for Biosoldiers. Build → codes writes its codes; codes → Build takes them step by step with the mutators, so the Build rules check them.
2. Add the next id to `SOLDIER_BUILD_SECTION`.
3. Write the section in `soldier-build-code.ts`. A part of every soldier goes into `encode` / `decode` of `soldierBuildCodec`; a part of one format goes into its extension (`BIOSOLDIER_BUILD_EXTENSION` for Biosoldiers): `write` gives the section only when the codes have the part, `read` reads it with `readWholeSection`; a list of codes is written and read with `writeCodeList` / `readCodeList`. Without the section the part is empty.

Example: Officer perks (Biosoldier only), max section id was 4.

1. `BiosoldierBuildCodes`: `officerPerks`, the codes by Officer rank; codes → Build takes them after Psionic abilities.
2. `SOLDIER_BUILD_SECTION`: `OFFICER: 5`.
3. `BIOSOLDIER_BUILD_EXTENSION`: `write` gives `OFFICER` (`count` 3 · `ability` 8 × count) only for codes with Officer perks; `read` gives its codes, an empty list without the section.

## Checks

`npm test` checks `code` ranges and uniqueness (class ids and codes across both class lists), ids and `grants` cycles, and the code format itself; the pre-push hook runs it with `vue-tsc` and lint, followed by the end-to-end tests.

Changing or reusing a `code` is caught only in review.
