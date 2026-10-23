# Коды билдов SHIV

[English](shiv-share-codes.en.md) · **Русский**

Билд SHIV в share-коде. Устройство (заголовок, секции, CRC, base64url), результат декодирования и правила для выданных кодов — те же, что у [кодов билдов солдат](share-codes.ru.md); здесь только отличия.

## Формат

`SHARE_CODE_FORMAT.SHIV_BUILD` = `2`. `readShareCode` читает код этого формата как Unit SHIV; Import калькулятора солдат сообщает о нём как о коде другого юнита, а калькулятор SHIV так же сообщает о коде биосолдата или MEC.

## Секции

| Секция | id | Поля | Пишется |
|---|---|---|---|
| `PERKS` | 1 | `count` 3 · `perk` 6 × count | всегда |
| `NAME` | 2 | `nameLength` 5 · UTF-8 | если имя отличается от «SHIV» |
| `LOADOUT` | 3 | `shivType` 8 · `primary` 8 · `secondary` 8 · `utilityCount` 3 · `item` 8 × utilityCount · `moduleCount` 2 · `item` 8 × moduleCount | только в кодах Unit |

Код Unit SHIV — код билда SHIV плюс `LOADOUT` с раскладкой из [Кодов Unit](share-codes.ru.md#коды-unit): первый предмет — `code` SHIV type из `shiv-types.json`, `secondary` и `moduleCount` всегда `0`. Build calculator SHIV берёт из него Build и оставляет Loadout.

`PERKS` хранит выбранные перки набором, без строк дерева. При импорте каждый перк встаёт в свою строку текущего дерева SHIV. Код невалиден, если перк неизвестен или не из дерева либо два перка из одной строки.

Код: `entities/shiv` — Build ↔ коды `shivBuildCodes` / `shivBuildFromCodes`: коды перков по порядку строк, перк в своей строке по Build rule из `selectShivBuildPerk`, раскладка перков по Technology levels. `features/share-build` — только биты: `config/constants.ts` (`SHIV_BUILD_SECTION`, ширины полей), `model/shiv-build-code.ts` (`SHIV_BUILD_LAYOUT`, под `shiv` в `BUILD_CODE_LAYOUTS` из `model/build-code.ts`) поверх счётного списка кодов и `readWholeSection` из `model/section-fields.ts`.

## Нумерация

В кодах хранятся номера `code` перков SHIV (`entities/shiv/config/data/perks.json`), от 1 до 63.

- Новый перк: максимальный `code` + 1.
- Существующий `code` не менять, удалённый не переиспользовать; лучше перки не удалять.
- `0` не назначается.

То же для `SHIV_BUILD_SECTION`.

## Безопасные правки

Переносить и переставлять перки в дереве; переименовывать id (сохраняя `code`); править названия, описания, иконки; добавлять перки и строки.

## Ломающие правки

| Правка | Старые коды |
|---|---|
| изменить или переиспользовать `code` | показывают не тот перк |
| удалить перк | «Invalid code» |
| поставить один перк в две строки | тест схемы не пропустит: у перка одна строка |
| перенести два выбранных перка в одну строку | «Invalid code» у кодов с обоими |
| изменить поля секции или их ширину | «Invalid code» или неверные данные |

Поля секции меняются только в новой секции с суффиксом версии, как у кодов солдат.

## Проверки

`npm test` проверяет диапазон и уникальность `code`, пять строк по три известных перка, одну строку на перк, иконки и сам формат кода.
