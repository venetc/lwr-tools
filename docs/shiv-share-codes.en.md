# SHIV build codes

**English** · [Русский](shiv-share-codes.ru.md)

A SHIV build in a share code. The layout (header, sections, CRC, base64url), the decoding result and the rules for issued codes are the same as for [Soldier build codes](share-codes.en.md); this page covers only what differs.

## Format

`SHARE_CODE_FORMAT.SHIV_BUILD` = `2`. A Biosoldier or MEC code given to the SHIV decoder, and a SHIV code given to a soldier one, decode as `other-unit`.

## Sections

| Section | id | Fields | Written |
|---|---|---|---|
| `PERKS` | 1 | `count` 3 · `perk` 6 × count | always |
| `NAME` | 2 | `nameLength` 5 · UTF-8 | if the name differs from "SHIV" |
| `LOADOUT` | 3 | `shivType` 8 · `primary` 8 · `secondary` 8 · `utilityCount` 3 · `item` 8 × utilityCount · `moduleCount` 2 · `item` 8 × moduleCount | Unit codes only |

A SHIV Unit code is the SHIV build code plus `LOADOUT`, laid out as in [Unit codes](share-codes.en.md#unit-codes): the first item is the `code` of the SHIV type from `shiv-types.json`, `secondary` and `moduleCount` are always `0`. A Build calculator skips `LOADOUT` as unknown.

`PERKS` holds the selected perks as a set, without technology levels. On import each perk goes to its level in the current SHIV tree. The code is invalid if a perk is unknown or outside the tree, or two perks share a level.

Code: `entities/shiv` — Build ↔ codes `shivBuildCodes` / `shivBuildFromCodes`: perk codes in level order, a perk on its level by the Build rule of `selectShivBuildPerk`, the placement of perks on technology levels. `features/share-build` — bits only: `config/constants.ts` (`SHIV_BUILD_SECTION`, field widths), `model/shiv-build-code.ts` (`SHIV_BUILD_LAYOUT` and `encodeShivBuild` / `decodeShivBuild`, its `buildCodec`) over the counted code list and `readWholeSection` of `model/section-fields.ts`.

## Numbering

Codes store the `code` numbers of SHIV perks (`entities/shiv/config/data/perks.json`), from 1 to 63.

- New perk: max `code` + 1.
- Never change an existing `code`, never reuse a deleted one; better, don't delete perks.
- `0` is never assigned.

Same for `SHIV_BUILD_SECTION`.

## Safe edits

Move or reorder perks within the tree; rename ids (keep `code`); edit names, descriptions, icons; add perks and levels.

## Breaking edits

| Edit | Old codes |
|---|---|
| change or reuse a `code` | show the wrong perk |
| delete a perk | "Invalid code" |
| put one perk on two levels | the test schema rejects it: a perk must have one level |
| move two selected perks onto one level | "Invalid code" for codes with both |
| change a section's fields or their widths | "Invalid code" or wrong data |

Section fields change only in a new section with a version suffix, as for Soldier codes.

## Checks

`npm test` checks `code` ranges and uniqueness, five levels of three known perks, one level per perk, icons, and the code format itself.
