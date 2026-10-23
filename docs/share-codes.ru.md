# Коды билдов солдат

[English](share-codes.en.md) · **Русский**

Выданный код должен открываться всегда: коды, сохранённые игроками, мы обновить не можем.

Билды биосолдат и MEC устроены одинаково, но у каждого свой формат: `1` Biosoldier, `3` MEC. Формат читает только классы своего вида солдат.

У кодов билдов SHIV то же устройство и правила: [коды билдов SHIV](shiv-share-codes.ru.md).

Код Unit — код Build своего формата плюс секции: см. [Коды Unit](#коды-unit).

Весь Squad — цепочка кодов Unit за заголовком Squad: [коды Squad](squad-share-codes.ru.md).

## Устройство

```
format (8) | секция … | 0 (5) | padding | crc (8)   → base64url
секция = id (5) | length (9) | поля
```

- Секции идут по возрастанию id, каждая не больше одного раза; `0` завершает список.
- Неизвестные секции пропускаются по длине.
- Прочитанная секция должна закончиться ровно на своей длине, иначе код невалиден; пропущенные секции не проверяются.

## Результат декодирования

Декодер возвращает `{ status: 'decoded', build }` или причину неудачи:

- `{ status: 'other-unit', unit }` — CRC и заголовок валидны, но `format` принадлежит билдам другого юнита (`SHARE_CODE_FORMAT_UNIT`: `1` Biosoldier, `2` SHIV, `3` MEC). Импорт показывает toast «This is a <unit> build code» и оставляет форму открытой с кодом.
- `{ status: 'invalid' }` — всё остальное: битый код, неизвестный формат, отсутствующая или битая секция, неизвестный код, класс другого формата или Build, нарушающий Build rule. Правила: каждый перк на своём ранге дерева класса, ранги, Psi levels и Officer ranks по порядку без пропусков, каждый Gene mod в своей Body part (в `GENE_MODS` Body parts идут от Brain к Legs, каждая один раз), Neural Damping против Psionic abilities, Officer rank — только когда дерево класса завершает его нужный Rank. Импорт показывает «Invalid code» под полем.

Импорт калькулятора декодирует через `decodeBuildImport`: код, невалидный для декодера билда, но валидный код Squad, даёт `{ status: 'squad-code' }`, и импорт показывает тост «This is a Squad code. Import it in the Squad planner.» и оставляет форму открытой.

Код открывается, только если такой Build можно собрать в калькуляторе, и любой собранный в калькуляторе Build кодируется.

Сохранённый билд, чей код не декодируется, при загрузке пропускается.

Код:

- `entities/soldier` — Build ↔ коды: `biosoldierBuildCodes` / `biosoldierBuildFromCodes`, `mecBuildCodes` / `mecBuildFromCodes`. Entity переводит Build в стабильные коды и обратно и отдаёт null на неизвестный код, класс другого вида или Build, нарушающий Build rule. Из кодов она собирает Build от Default build по шагам мутаторами калькулятора; Build кодируется, только если его собирает тот же проход.
- `shared/lib/binary-code` — заголовок, секции, CRC; поверх `shared/lib/bit-stream`, `base64-url` и `crc8`.
- `features/share-build` — только биты: `config/constants.ts` (номера форматов и их юниты, id секций, ширины полей), `model/share-code.ts` (результат декодирования, открытие кода ожидаемого формата, секция `NAME`, `BuildCodeLayout` — формат, секции билда и их чтение — и `buildCodec`, который делает из раскладки кодер и декодер), `model/section-fields.ts` (счётный список кодов `writeCodeList` / `readCodeList` и `readWholeSection`, который отдаёт null для секции, прочитанной не ровно до конца), `model/soldier-build-code.ts` и `model/shiv-build-code.ts` (секции поверх кодов билда; `soldierBuildLayout` собирает раскладку формата солдат из пары Build ↔ коды и расширения — секций сверх `PERKS` и `NAME`: `BIOSOLDIER_BUILD_LAYOUT` — формат 1 с расширением Gene mods, Psionic abilities и Officer perks, `MEC_BUILD_LAYOUT` — формат 3 без расширения; `encodeBiosoldierBuild` / `decodeBiosoldierBuild` и `encodeMecBuild` / `decodeMecBuild` — `buildCodec` поверх них), `model/unit-code.ts` (коды Unit), `model/squad-code.ts` (коды Squad), `model/build-import.ts` (декодер импорта калькулятора), `model/build-codecs.ts` (кодеки и раскладки по видам билдов), `model/stored-build.ts` (записи хранилища поверх share-кода). Фича обслуживает все страницы калькуляторов и остаётся отдельным слайсом: формат меняется по своим причинам, у него свои тесты и доки.

## Секции

| Секция | id | Поля | Пишется |
|---|---|---|---|
| `PERKS` | 1 | `class` 5 · `count` 3 · `ability` 8 × count | всегда |
| `NAME` | 2 | `nameLength` 5 · UTF-8 | если имя отличается от названия класса |
| `GENE_MODS` | 3 | `count` 3 · `ability` 8 × count | только у биосолдат, если у билда есть Gene mods |
| `PSIONIC` | 4 | `count` 3 · `ability` 8 × count | только у биосолдат, если у билда есть Psionic abilities |
| `OFFICER` | 5 | `count` 3 · `ability` 8 × count | только у биосолдат, если у билда есть Officer perks |
| `LOADOUT` | 6 | `armor` 8 · `primary` 8 · `secondary` 8 · `utilityCount` 3 · `item` 8 × utilityCount · `moduleCount` 2 · `item` 8 × moduleCount | только в кодах Unit |

В `PERKS` `count` — число перков, выбранных сверх базового; абилки идут по рангам снизу вверх. Базовый перк при импорте берётся из текущего дерева.

В `GENE_MODS` Gene mods идут по Body part от Brain к Legs; Body part каждого Gene mod берётся из данных, позиции не хранятся.

В `PSIONIC` Psionic abilities идут по Psi level от Awakened к Master, без пропусков; уровень абилки — её позиция.

В `OFFICER` Officer perks идут по Officer rank от Lieutenant к Field Commander, без пропусков; Officer rank перка — его позиция. Код без `OFFICER` даёт пустое Officer tree.

Коды MEC не пишут `GENE_MODS`, `PSIONIC` и `OFFICER`, декодер MEC пропускает их как неизвестные.

## Коды Unit

Код Unit — код Build своего формата плюс секция `LOADOUT` с Loadout этого Unit; своих номеров форматов у Unit нет. Секция берёт следующий id формата: `6` у форматов солдат, `3` у формата SHIV.

- Отметки Officer нет: Unit — Officer, если в секции `OFFICER` его Build есть Officer perks.
- Предметы — номера `code` каталогов Loadout из `entities/loadout`: броня и MEC exoskeletons из `armors.json` (в коде SHIV — его SHIV type из `shiv-types.json`), оружие из `weapons.json`, Equipment и Modules из `equipment.json`. `0` — пустой слот, в том числе Secondary.
- Utility slots идут по позициям, Gear Slots и Psi Slots последними; Module slots — по позициям.
- Декодер не сверяет Loadout с Build: неизвестный код предмета оставляет слот пустым, Seraph Armor без Officer perks — не `invalid`. Squad planner при импорте приводит Loadout к правилам проверкой Unit и сообщает тостом, что снято.
- Build calculator читает код Unit как код Build: `LOADOUT` он пропускает как неизвестную секцию. Код Build, импортированный как Unit, получает Default Loadout.
- Новая часть Unit — новая секция после `LOADOUT`, по тем же правилам, что новая часть Build.

Код: `model/unit-code.ts` — `encodeUnit` пишет секции раскладки своего вида (`BUILD_CODE_LAYOUTS`) и `LOADOUT` поверх `loadoutCodes` из `entities/loadout`; `decodeUnit` принимает код любого формата билдов и отдаёт вид, Build и Loadout из `loadoutFromCodes`, null — у кода Build.

## Нумерация

Коды хранят номера `code` абилок и классов, а не позиции в дереве, поэтому деревья можно менять свободно.

- Новая запись: максимальный `code` + 1. Коды классов уникальны по обоим спискам, биосолдат и MEC: новый класс любого вида получает максимальный `code` классов обоих списков + 1.
- Существующий `code` не менять.
- `code` удалённой записи не переиспользовать; лучше записи не удалять.
- `0` не выдаётся: у абилок и классов это «неизвестно», у секций — конец списка.

То же для `SOLDIER_BUILD_SECTION` и `SHARE_CODE_FORMAT`, а также для номеров `code` каталогов Loadout, которые коды Unit хранят в 8 битах: от 1 до 255.

Пример: новая абилка, максимальный `code` — N.

1. `abilities.json`: `"deadeye": { "code": N + 1, "name": "Deadeye", "description": "…" }`.
2. `config/constants/ability-icons.ts`: иконка `deadeye` в `ABILITY_ICON`.
3. `biosoldier-classes.json` или `mec-classes.json`: `"deadeye"` на ранге класса.
4. `npm test`.

## Безопасные правки

Добавлять абилки в деревья; переставлять абилки внутри ранга; менять названия, описания, иконки; переименовывать id (с прежним `code`); добавлять классы; менять местами два Gene mod одной Body part; переименовывать Body part; переставлять Psionic abilities внутри Psi level; переименовывать Psi level; менять местами два Officer perk одного Officer rank; переименовывать Officer ranks; менять `abbreviation` у Officer rank; понижать `requiredRank` у Officer rank.

## Ломающие правки

| Правка | Старые коды |
|---|---|
| сменить или переиспользовать `code` | покажут не ту абилку |
| сменить или переиспользовать `code` каталога Loadout | коды Unit покажут не тот предмет |
| удалить запись | «Invalid code» |
| перенести абилку на другой ранг, убрать из дерева или заменить другой | коды, где она выбрана: «Invalid code» |
| переставить Body part, перенести Gene mod в другую Body part или удалить его | коды с ним: «Invalid code» или Gene mod не в той Body part |
| переставить Psi level, перенести Psionic ability на другой Psi level или удалить её | коды с ней: «Invalid code» |
| переставить Officer ranks, перенести Officer perk на другой Officer rank или удалить его | коды с ним: «Invalid code» |
| повысить `requiredRank` у Officer rank | коды, где дерево класса не доходит до нового Rank: «Invalid code» |
| изменить поля секции или их ширины | «Invalid code» или неверные данные |
| изменить разметку секций, CRC или base64url | недействительны все коды |

Поля секции меняются только новой секцией:

1. Добавить в `SOLDIER_BUILD_SECTION` следующий id с суффиксом версии.
2. Писать новую секцию вместо текущей; чтение текущей оставить.
3. `readBuild` из `soldierBuildLayout` читает ту из двух секций, что есть в коде, обе через `readWholeSection`.

Чтение старых секций остаётся навсегда. Сама разметка секций меняется только новым номером в `SHARE_CODE_FORMAT`.

Пример: в `PERKS` добавляется поле, максимальный id секции — 6.

1. `SOLDIER_BUILD_SECTION`: `PERKS_V2: 7`.
2. Новое поле — в `SoldierBuildCodes` из `entities/soldier`.
3. `writeBuild` из `soldierBuildLayout` пишет `PERKS_V2` вместо `PERKS`.
4. `readBuild` из `soldierBuildLayout`: `PERKS` — с новым полем по умолчанию, `PERKS_V2` — с новым полем.

## Новая часть

1. Добавить часть в коды билда в `entities/soldier`: `SoldierBuildCodes` для любого солдата, `BiosoldierBuildCodes` для биосолдат. Build → коды пишет её коды; коды → Build берёт их по шагам мутаторами, поэтому их проверяют Build rules.
2. Добавить в `SOLDIER_BUILD_SECTION` следующий id.
3. Написать секцию в `soldier-build-code.ts`. Часть любого солдата идёт в `writeBuild` / `readBuild` из `soldierBuildLayout`, часть одного формата — в его расширение (`BIOSOLDIER_BUILD_EXTENSION` у биосолдат): `write` отдаёт секцию, только если в кодах есть эта часть, `read` читает её через `readWholeSection`; список кодов пишется и читается через `writeCodeList` / `readCodeList`. Без секции часть пустая.

Пример: Officer perks (только биосолдаты), максимальный id секции был 4.

1. `BiosoldierBuildCodes`: `officerPerks` — коды по Officer ranks; коды → Build берёт их после Psionic abilities.
2. `SOLDIER_BUILD_SECTION`: `OFFICER: 5`.
3. `BIOSOLDIER_BUILD_EXTENSION`: `write` отдаёт `OFFICER` (`count` 3 · `ability` 8 × count) только для кодов с Officer perks; `read` отдаёт её коды, без секции — пустой список.

## Проверки

`npm test` проверяет диапазон и уникальность `code` (id и коды классов — по обоим спискам классов), id и циклы `grants`, а также сам формат кодов; хук перед пушем запускает его вместе с `vue-tsc` и линтером, а после него — e2e-тесты.

Смену или переиспользование `code` ловит только ревью.
