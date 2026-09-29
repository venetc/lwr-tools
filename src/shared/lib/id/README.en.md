# id

**English** · [Русский](README.ru.md)

Random ids for objects created while the app runs: builds on the page, notifications. They tell objects apart within one session and are never stored or shared.

## Usage

```ts
const build = { id: createId(), name: 'Tester' };
```

## API

| Function | Result |
|---|---|
| `createId()` | random UUID v4, e.g. `3f2b8c1e-9a4d-4e7f-b2c6-5d8e1f0a7b93` |

## Why not `crypto.randomUUID`

`crypto.randomUUID` exists only in secure contexts (HTTPS, localhost) and newer browsers; opening the dev server by a LAN IP breaks it. `createId` builds the same UUID v4 on `crypto.getRandomValues`, which works everywhere.

## Not for stored data

Data that goes into codes, files or storage needs numbers that stay the same across versions — like the `code` numbers of abilities and classes. A random id changes on every run and would break everything saved with it.
