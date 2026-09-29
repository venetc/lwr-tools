# base64-url

**English** · [Русский](README.ru.md)

Bytes ↔ base64url text: the text form of binary codes.

base64url uses `-` and `_` instead of `+` and `/` and drops the `=` padding, so a code goes into a URL, a chat message or a file name as is, without escaping.

## Usage

```ts
const text = toBase64Url(Uint8Array.of(1, 2, 3));
const bytes = fromBase64Url(text);
```

## API

| Function | Arguments | Result |
|---|---|---|
| `toBase64Url(bytes)` | bytes | base64url text without padding |
| `fromBase64Url(text)` | text without padding | bytes; `null` for an empty text, characters outside base64url or a length no bytes encode to |

Decoding does not trim whitespace: the caller trims the text it got from the user.
