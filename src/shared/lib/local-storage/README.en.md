# local-storage

**English** · [Русский](README.ru.md)

Access to `localStorage` that never throws. The storage can be unavailable (private mode, site data blocked by the browser or settings) or full; any access then throws, including reading `localStorage` itself. Here every such case turns into an empty result.

## Usage

```ts
writeLocalStorage('app.settings', JSON.stringify(settings));

const value = readLocalStorage('app.settings');

if (value === null) return defaults;

const keys = localStorageKeys('app.drafts.');

keys.forEach(removeLocalStorage);
```

## API

| Function | Arguments | Result |
|---|---|---|
| `readLocalStorage(key)` | key | stored value; `null` if the key is absent or the storage is unavailable |
| `writeLocalStorage(key, value)` | key, value | `true` if stored; `false` if the storage is unavailable or full |
| `removeLocalStorage(key)` | key | `true` if removed or absent; `false` if the storage is unavailable |
| `localStorageKeys(prefix)` | key prefix | keys starting with the prefix; `[]` if the storage is unavailable |

## Behavior

- An absent key and an unavailable storage both read as `null`: the caller falls back to defaults either way.
- Key order in `localStorageKeys` is the browser's and is not guaranteed; keep order in the data if it matters.
- Values are strings only; serialization is up to the caller.

## Limitations

- The origin shares one storage: on GitHub Pages every `<user>.github.io` project shares it too, so keys need an app prefix.
- About 5 MB per origin, synchronous access: fine for small records, not for big data.
- Changes from other tabs come as the `window` `storage` event; the module does not listen to it.
