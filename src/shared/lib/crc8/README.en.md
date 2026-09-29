# crc8

**English** · [Русский](README.ru.md)

CRC-8 checksum of bytes: one byte that catches accidental changes in data — a mistyped character, a cut or glued code.

Parameters: polynomial `0x07` (x⁸ + x² + x + 1), initial value `0`, no reflection, no final XOR — the common CRC-8 (SMBus).

## Usage

```ts
const payload = Uint8Array.of(1, 2, 3);
const checked = Uint8Array.of(...payload, crc8(payload));

const isIntact = crc8(checked.subarray(0, -1)) === checked[checked.length - 1];
```

## API

| Function | Arguments | Result |
|---|---|---|
| `crc8(bytes)` | checked bytes | checksum, 0–255 |

## What it catches

- Any single changed bit, and any odd number of changed bits.
- Any run of changed bits up to 8 bits long — e.g. one mistyped base64url character.
- Other random damage is missed with a chance of 1 in 256.

It protects against accidents, not tampering: anyone can compute a matching checksum.
