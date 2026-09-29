# binary-code

**English** · [Русский](README.ru.md)

Compact binary code for data that users copy and paste: short, checked for typos, and readable by future versions of the app.

A code has a format number and a list of sections. The owner of the data decides which sections to write and what goes into them; this module handles the frame around them: section ids and lengths, the checksum and the text form.

## Layout

```
format (8) | section … | 0 (5) | padding | crc8 (8)   → base64url
section = id (5) | length (9) | fields
```

- `format` — what kind of data the code holds; the reader checks it before reading sections.
- Each section is prefixed by its id and length in bits, so a reader that does not know a section skips it.
- Id `0` ends the list; the last byte is padded with zeros.
- `crc8` covers every byte before it and catches mistyped or cut codes.

## Usage

```ts
const code = encodeBinaryCode(FORMAT, [
  { id: SECTION.TALENTS, write: (writer) => {
    writer.writeUint(classCode, 5);
    writer.writeUint(talentCount, 3);
  } },
  { id: SECTION.NAME, write: writer => writer.writeString(name, 5) },
]);

const opened = openBinaryCode(code);

if (!opened || opened.format !== FORMAT) return null;

const reader = opened.sections.get(SECTION.TALENTS) ?? null;

if (!reader) return null;

const classCode = reader.readUint(5);
const talentCount = reader.readUint(3);

if (!reader.isComplete) return null;
```

## API

| Function | Arguments | Result |
|---|---|---|
| `encodeBinaryCode(format, sections)` | format number 0–255; sections in any order, each with an `id` and a `write(writer)` that writes its fields into a fresh `BitWriter` | base64url code; `null` if a section is longer than 511 bits |
| `openBinaryCode(code)` | code text; surrounding whitespace is ignored | `{ format, sections }`: a `BitReader` per section id; `null` if the code is invalid |

Types: `BinaryCodeSection`, `OpenedBinaryCode`; `BitReader` and `BitWriter` are re-exported from `bit-stream`.

## Validation

`openBinaryCode` returns `null` when:

- the text is not base64url or shorter than two bytes;
- the CRC does not match;
- section ids are not strictly ascending (this also rules out duplicates);
- a section or the end id runs past the data;
- whole bytes follow the end id — only the padding of the last byte may remain.

It does not check section fields: it does not know them. After reading a section, the caller checks `reader.isComplete` — the section was read exactly to its end. A missing field or an extra one makes the section invalid.

## Evolving a format

- A new kind of data is a new section with the next id; old readers skip it.
- Fields of an existing section never change: a changed section gets a new id, and the reader of the old one stays.
- The frame itself (widths of id and length, CRC, base64url) changes only with a new format number.
- Format numbers and section ids are never reused.

How this applies to soldier builds: [docs/share-codes](../../../../docs/share-codes.en.md).

## Limits

| What | Limit |
|---|---|
| format number | 0–255 |
| section id | 1–31 |
| section length | 511 bits; a longer section makes `encodeBinaryCode` return `null` — the owner keeps its sections within the limit |
