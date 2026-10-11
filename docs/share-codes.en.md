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
- `decodeBiosoldierBuild(code, parts)` and `decodeMecBuild(code, parts)` read only the requested parts; the rest get defaults.

## Decoding result

A decoder returns `{ status: 'decoded', build }`, or why it failed:

- `{ status: 'other-unit', unit }` — the CRC and header are valid, but `format` belongs to another unit's builds (`SHARE_CODE_FORMAT_UNIT`: `1` Biosoldier, `2` SHIV, `3` MEC). The import shows a toast "This is a <unit> build code" and keeps the form open with the code.
- `{ status: 'invalid' }` — everything else: a broken code, an unknown format, a missing or broken section, a class of another format, a perk not offered on its rank of the class tree. The import shows "Invalid code" under the field.

A stored build whose code does not decode is skipped on loading.

Code: `shared/lib/binary-code` (header, sections, CRC; built on `shared/lib/bit-stream`, `base64-url` and `crc8`) and the `features/share-build` feature: `config/constants.ts` (format numbers and their units, section ids, field widths), `model/share-code.ts` (decoding result, opening a code of the expected format), `model/soldier-build-code.ts` and `model/shiv-build-code.ts` (fields and build parts; `soldierBuildCodec` builds the encoder and decoder of a soldier format from its classes by code, `encodeBiosoldierBuild` / `decodeBiosoldierBuild` are its format 1 pair, `encodeMecBuild` / `decodeMecBuild` its format 3 pair), `model/stored-build.ts` (stored build records over a share code). Lookups by `code` (abilities, the classes of each soldier format, SHIV perks) come from `entities/soldier` and `entities/shiv`. The feature serves every Build calculator page and stays a separate slice: the format changes for its own reasons and has its own tests and docs.

## Sections

| Section | id | Fields | Written |
|---|---|---|---|
| `PERKS` | 1 | `class` 5 · `count` 3 · `ability` 8 × count | always |
| `NAME` | 2 | `nameLength` 5 · UTF-8 | if the name differs from the class name |

`count` is the number of perks selected beyond the base perk; abilities go by rank, bottom to top. The base perk is taken from the current tree on import.

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

Add, move, reorder or remove abilities in trees; edit names, descriptions, icons; rename ids (keep `code`); add classes.

If an ability on a rank is replaced by a different one, keep the old record. Old codes still open, with that rank shown as passed but empty.

## Breaking edits

| Edit | Old codes |
|---|---|
| change or reuse a `code` | show the wrong ability |
| delete a record | "Invalid code" |
| change a section's fields or their widths | "Invalid code" or wrong data |
| change the section layout, CRC or base64url | every code is invalid |

Section fields change only in a new section:

1. Add the next id to `SOLDIER_BUILD_SECTION` with a version suffix.
2. Add the version suffix to the current section reader's name; delete its writer.
3. Write the new writer and reader; `decode` of `soldierBuildCodec` reads whichever of the two sections the code has.

Readers of old sections stay forever. The section layout itself changes only with a new number in `SHARE_CODE_FORMAT`.

Example: `PERKS` gets a new field, max section id is 2.

1. `SOLDIER_BUILD_SECTION`: `PERKS_V2: 3`.
2. `soldier-build-code.ts`: `readPerks` → `readPerksV1`, `writePerks` deleted.
3. New `writePerks` / `readPerks`; `encode` of `soldierBuildCodec` writes `PERKS_V2`.
4. `decode` of `soldierBuildCodec`: `PERKS` → `readPerksV1` with the new field defaulted, `PERKS_V2` → `readPerks`.

## New part

1. Add the next id to `SOLDIER_BUILD_SECTION`.
2. Write the writer and reader in `soldier-build-code.ts`; `encode` of `soldierBuildCodec` writes the section only when the build has the part.
3. Add the part to `SoldierBuildPart`; `decode` of `soldierBuildCodec` reads the section only if the part is requested, otherwise gives the default.

Example: officer tree, max section id is 2.

1. `SOLDIER_BUILD_SECTION`: `OFFICER: 3`.
2. `writeOfficer` / `readOfficer`; no section for a non-officer.
3. `SoldierBuildPart`: `'officer'`; without the section or the part the build has no officer tree.

## Checks

`npm test` checks `code` ranges and uniqueness (class ids and codes across both class lists), ids and `grants` cycles, and the code format itself; the pre-push hook runs it with `vue-tsc` and lint.

Changing or reusing a `code` is caught only in review.
