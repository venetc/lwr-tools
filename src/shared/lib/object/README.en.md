# object

**English** · [Русский](README.ru.md)

Types and typed operations for static objects written in code — dictionaries of content, icons, settings.

`Object.entries` and friends type keys as `string`, because at runtime an object may have more keys than its type says. For objects written in code that cannot happen, and these helpers keep the key type.

## Usage

```ts
const ranks = typedEntries(SOLDIER_RANK_CONTENT).map(([rankId, content]) => ({ id: rankId, name: content.name }));
// rankId: SoldierRankId, not string
```

Constants never change at runtime, and `DeepReadonly` says so in the type:

```ts
export const ARMORS: DeepReadonly<Armor[]> = typedEntries(ARMOR_CONTENT).flatMap(armorsFromEntry);
// ARMORS.push(…) and ARMORS[0].hp = 1 are type errors
```

## API

| Function / type | Arguments | Result |
|---|---|---|
| `typedEntries(object)` | static object | `[key, value][]` with the key type kept, in the object's key order |
| `DeepReadonly<Value>` | type of a static value | the same type with every property and array readonly at any depth |

## DeepReadonly

- Primitives (branded strings like `string & {}` too) and functions — components, callbacks — are kept as they are.
- Type level only: nothing is frozen at runtime.
- A `Map` turns into an object type: declare maps as `ReadonlyMap<Key, Value>` instead.
- For a literal written in code, `as const satisfies Type` gives the same and keeps literal types.
- A readonly array can't go where a mutable one is expected: such parameters and fields are declared `readonly T[]`, or the receiver gets a copy.

## Only for static objects

For runtime data — parsed JSON, user input, API responses — extra keys are possible and the kept type would lie. Runtime key → value collections use `Map`.
