# Soldier build codes

**English** · [Русский](share-codes.ru.md)

An issued code must always open: we can't update codes players have saved.

## Structure

```
format (8) | section … | 0 (5) | padding | crc (8)   → base64url
section = id (5) | length (9) | fields
```

- Sections go by ascending id, each at most once; `0` ends the list.
- Unknown sections are skipped by their length.
- A section that is read must end exactly at its length, otherwise the code is invalid; skipped sections aren't checked.
- `decodeSoldierBuild(code, parts)` reads only the requested parts; the rest get defaults.

Code: `shared/lib/share-code` (bits, sections, CRC, base64url) and the `features/share-build` feature: `config/share-code-format.ts` (format numbers), `config/soldier-build-section.ts` (section ids), `model/soldier-build-code.ts` (fields), `model/types.ts` (`SoldierBuildPart`). Lookups by `code` come from `entities/soldier`.

## Sections

| Section | id | Fields | Written |
|---|---|---|---|
| `TALENTS` | 1 | `class` 5 · `count` 3 · `ability` 8 × count | always |
| `NAME` | 2 | `nameLength` 5 · UTF-8 | if the name differs from the class name |

`count` is the number of talents selected beyond the granted one; abilities go by rank, bottom to top. The granted talent is taken from the current tree on import.

## Numbering

Codes store the `code` numbers of abilities and classes, not tree positions, so trees can change freely.

- New record: max `code` + 1.
- Never change an existing `code`.
- Never reuse a deleted record's `code`; better, don't delete records.
- `0` is never assigned: for abilities and classes it means "unknown", for sections — the end of the list.

Same for `SOLDIER_BUILD_SECTION` and `SHARE_CODE_FORMAT`.

Example: new ability, max `code` is 73.

1. `abilities.json`: `"deadeye": { "code": 74, "name": "Deadeye", "description": "…" }`.
2. `config/constants/ability-icons.ts`: `deadeye` icon in `ABILITY_ICON`.
3. `classes.json`: `"deadeye"` on the class rank.
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
3. Write the new writer and reader; `decodeSoldierBuild` reads whichever of the two sections the code has.

Readers of old sections stay forever. The section layout itself changes only with a new number in `SHARE_CODE_FORMAT`.

Example: `TALENTS` gets a new field, max section id is 2.

1. `SOLDIER_BUILD_SECTION`: `TALENTS_V2: 3`.
2. `soldier-build-code.ts`: `readTalents` → `readTalentsV1`, `writeTalents` deleted.
3. New `writeTalents` / `readTalents`; `encodeSoldierBuild` writes `TALENTS_V2`.
4. `decodeSoldierBuild`: `TALENTS` → `readTalentsV1` with the new field defaulted, `TALENTS_V2` → `readTalents`.

## New part

1. Add the next id to `SOLDIER_BUILD_SECTION`.
2. Write the writer and reader in `soldier-build-code.ts`; `encodeSoldierBuild` writes the section only when the build has the part.
3. Add the part to `SoldierBuildPart`; `decodeSoldierBuild` reads the section only if the part is requested, otherwise gives the default.

Example: officer tree, max section id is 2.

1. `SOLDIER_BUILD_SECTION`: `OFFICER: 3`.
2. `writeOfficer` / `readOfficer`; no section for a non-officer.
3. `SoldierBuildPart`: `'officer'`; without the section or the part the build has no officer tree.

## Checks

`npm test` checks `code` ranges and uniqueness, ids and `grants` cycles, and the code format itself; the pre-push hook runs it with `vue-tsc` and lint.

Changing or reusing a `code` is caught only in review.
