# bit-stream

**English** · [Русский](README.ru.md)

Writing and reading values packed bit by bit, with no byte alignment: a 5-bit number takes exactly 5 bits. Used to keep binary codes short.

Bits go most significant first, both within a value and within a byte.

## Usage

```ts
const writer = createBitWriter();

writer.writeUint(3, 5);
writer.writeString('Overwatch', 5);

const reader = createBitReader(writer.toBytes());
const classCode = reader.readUint(5);
const name = reader.readString(5);
```

## Writer

`createBitWriter()` returns a `BitWriter`:

| Member | What it does |
|---|---|
| `writeUint(value, bits)` | writes the lowest `bits` bits of the value; higher bits are dropped |
| `writeString(text, lengthBits)` | writes the UTF-8 byte length in `lengthBits` bits, then the bytes; a text longer than `2^lengthBits − 1` bytes is cut at a character boundary, never inside one |
| `append(writer)` | appends everything written to another writer, without its padding |
| `toBytes()` | written bits as bytes; the last byte is padded with zeros |
| `bitLength` | number of written bits |

## Reader

`createBitReader(bytes, bitStart = 0, bitEnd = bytes.length * 8)` returns a `BitReader` over that bit range:

| Member | What it does |
|---|---|
| `readUint(bits)` | reads an unsigned number |
| `readString(lengthBits)` | reads a string written by `writeString` |
| `readSection(bitCount)` | returns a reader limited to the next `bitCount` bits and moves this reader past them |
| `isOverrun` | some read went past the end |
| `remainingBits` | bits left after the current position |
| `isComplete` | the data was read exactly to its end: nothing left, no overrun |

## Reading past the end

The reader never throws. A read past the end gives `0` or an empty string, moves the position to the end and sets `isOverrun`. So a parser reads all fields in a row and checks the result once — `isComplete` or `isOverrun` — instead of checking every read.

A section reader has its own range: reading past the section end sets `isOverrun` on the section reader only. A `readSection` past the parent's end gives an empty reader and sets `isOverrun` on the parent.
