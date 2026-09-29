# object

**English** · [Русский](README.ru.md)

Typed operations on static objects written in code — dictionaries of content, icons, settings.

`Object.entries` and friends type keys as `string`, because at runtime an object may have more keys than its type says. For objects written in code that cannot happen, and these helpers keep the key type.

## Usage

```ts
const ranks = typedEntries(SOLDIER_RANK_CONTENT).map(([rankId, content]) => ({ id: rankId, name: content.name }));
// rankId: SoldierRankId, not string
```

## API

| Function | Arguments | Result |
|---|---|---|
| `typedEntries(object)` | static object | `[key, value][]` with the key type kept, in the object's key order |

## Only for static objects

For runtime data — parsed JSON, user input, API responses — extra keys are possible and the kept type would lie. Runtime key → value collections use `Map`.
