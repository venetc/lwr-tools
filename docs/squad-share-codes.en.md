# Squad codes

**English** · [Русский](squad-share-codes.ru.md)

A whole Squad in one share code: its name and every Unit with its Build and Loadout. The rules for issued codes are the same as for [Soldier build codes](share-codes.en.md): an issued code must always open.

## Structure

```
<Squad header>.<Unit code>.<Unit code>…
```

- The Squad header is a binary code of format `4` (`SHARE_CODE_FORMAT.SQUAD`) with the `NAME` section; the layout of its frame is in [Soldier build codes](share-codes.en.md#structure).
- Then a [Unit code](share-codes.en.md#unit-codes) per Unit, in Squad order. A part may also be a build code: that Unit gets the Default Loadout.
- Parts are joined with a dot: base64url has none, and one frame can't hold a large Squad (31 sections of 511 bits).
- An empty Squad is the header alone. About 60–80 characters per Unit, no limit on Units.

| Section | id | Fields | Written |
|---|---|---|---|
| `NAME` | 1 | `nameLength` 5 · UTF-8 | always |

The name is cut to 31 bytes. A header without `NAME` is invalid; unknown sections of the header are skipped.

## Decoding

`readShareCode` tells a Squad code by the format `4` of its first part and gives `{ status: 'squad', squad }`; a Unit code or a build code gives `{ status: 'unit', unit }`, anything else `{ status: 'invalid' }` (see [Decoding result](share-codes.en.md#decoding-result)).

- Every part has its own CRC. Any broken part — the header, a Unit, an empty part — makes the whole code invalid: no partial import.
- `squad` has the `name`, the `builds` and the `units` in Squad order; a Unit refers to its build by `buildIndex` and carries its Loadout, null for a build code part.
- Units whose build sections are the same — kind and data, name and `OFFICER` included — share one build. The same Class tree with other Officer perks makes two builds.
- The Loadout is not checked against the build, as in a Unit code.

## Where codes go

| Place | Squad code | Unit or build code | Broken code |
|---|---|---|---|
| Import in the Squad planner toolbar | a new Squad, opened | under the field: "This is a Unit code. Add it through an empty cell." | under the field: "Invalid code. Copy the Share code again and paste it whole." |
| Share code tab of Add Unit | under the field: "This is a Squad code. Use Import in the toolbar." | a new Unit | the same error |
| Import of a Build calculator | toast "This is a Squad code. Import it in the Squad planner." | the build of its kind | "Invalid code" |

Import of a Squad code:

- creates a new Squad with the name of the code, last in the list; names may repeat;
- adds each shared build once to its Build calculator: Squad import always creates new Builds;
- brings each Unit to the rules of its build with the Unit check;
- opens the Squad and tells in a toast how many Builds went to each Build calculator and what the check took off.

The Share code button next to the Squad name copies the code of the open Squad: its name and the Units of its cards.

## Code

`features/share-build`:

- `model/squad-code.ts` — `encodeSquad` writes the header and the Unit codes of `encodeUnit`, null if a Unit code can't be written; `readSquad`, called by `readShareCode` with the opened header and parts, reads them back and merges Units into builds by their build sections.
- `model/share-code.ts` — `readShareCode`: every place that takes a code checks its result with one condition, as in the table above.

`pages/squads` turns a read Squad into a Squad: `model/squad-import.ts` (Import in the toolbar), `model/squad-code-copy.ts` (the Share code button).

## Evolving the format

- A new part of the whole Squad is a new header section with the next id in `SQUAD_SECTION`.
- A new part of a Unit goes into its Unit code, by the rules of [Unit codes](share-codes.en.md#unit-codes).
- The dot and the order of parts change only with a new format number.
