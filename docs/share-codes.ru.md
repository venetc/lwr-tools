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

Каждое место ввода читает код через `readShareCode(code)`. Он открывает рамку каждой части один раз, определяет вид кода по `format` первой части и отдаёт:

- `{ status: 'unit', unit }` — код Build или код Unit: `unit` — `{ kind, build, outdated, loadout }`, у кода Build `loadout: null`. `outdated` — Outdated selection кода, их нет в `build`; у кода, который ложится на текущие деревья, список пуст. SHIV: [коды билдов SHIV](shiv-share-codes.ru.md#секции). Вид Unit — по формату его раскладки (`1` Biosoldier, `2` SHIV, `3` MEC).
- `{ status: 'squad', squad }` — [код Squad](squad-share-codes.ru.md).
- `{ status: 'invalid' }` — всё остальное: битая часть, неизвестный формат, несколько частей без заголовка Squad, отсутствующая или битая секция, неизвестный код, класс другого формата, число шагов или индекс варианта, которых нет в текущем дереве, или Build, нарушающий Build rule. Правила: базовый перк на первом ранге, один выбор на шаг, Neural Damping против Psionic abilities. Ранги, Psi levels и Officer ranks берутся в любом порядке и могут оставаться пустыми; Officer rank не требует своего Rank.

Каждое место проверяет результат одним условием. Import калькулятора:

- `unit` своего вида — берёт его Build. При Outdated selection сначала открывает поверх формы модалку «Outdated selections» с карточкой на шаг: «Import» берёт Build и закрывает обе, «Cancel» — только модалку.
- `unit` другого вида — тост «This is a <unit> build code» с именем вида Unit из `entities/loadout`; форма остаётся открытой.
- `squad` — тост «This is a Squad code. Import it in the Squad planner.»; форма остаётся открытой.
- `invalid` — «Invalid code» под полем.

Места Squad planner — в [кодах Squad](squad-share-codes.ru.md#декодирование).

Код открывается, только если такой Build можно собрать в калькуляторе, и любой собранный в калькуляторе Build кодируется.

Сохранённый билд читается так же: запись, чей код — не Build вида своего калькулятора, при загрузке пропускается, а код с Outdated selection загружается как [Outdated build](build-storage.ru.md#outdated-build).

Код:

- `entities/soldier` — Build ↔ коды: `biosoldierBuildCodes` / `biosoldierBuildFromCodes`, `mecBuildCodes` / `mecBuildFromCodes`. Entity переводит Build в стабильные коды и обратно: каждый выбор — индекс варианта на шаге и `code` его абилки. Она отдаёт null на неизвестный код, класс другого вида, шаги или вариант, которых нет в дереве, или Build, нарушающий Build rule. Из кодов она отдаёт и Outdated selection (`SoldierOutdatedSelection`: вид и индекс шага, индекс варианта, абилка кода и абилка дерева на этом месте), оставляя их шаги пустыми. Из кодов она собирает Build от Default build по шагам мутаторами калькулятора; Build кодируется, только если его собирает тот же проход.
- `shared/lib/binary-code` — заголовок, секции, CRC; поверх `shared/lib/bit-stream`, `base64-url` и `crc8`.
- `features/share-build` — только биты. Публичный API: `readShareCode`, `encodeBuild(kind, build)`, `encodeUnit`, `encodeSquad`, `storedBuildCodec(kind)`, `useOutdatedImport`, `useOutdatedUpdate`, компоненты `ShareCodeImport`, `ShareCodeExport` и `OutdatedSelectionsDialog` и типы. Внутри: `config/constants.ts` (номера форматов, id секций, ширины полей), `model/share-code.ts` (`readShareCode` и его результат), `model/build-code.ts` (`BuildDataByKind`, `BuildCodeLayout` — формат, секции билда и их чтение, — `BUILD_CODE_LAYOUTS` по видам Unit из `LoadoutUnitId`, так что вид без раскладки не компилируется, и `encodeBuild`), `model/section-fields.ts` (счётный список кодов `writeCodeList` / `readCodeList`, список шагов `writeStepList` / `readStepList`, секция `NAME` и `readWholeSection`, который отдаёт null для секции, прочитанной не ровно до конца), `model/soldier-build-code.ts` и `model/shiv-build-code.ts` (секции поверх кодов билда; `soldierBuildLayout` собирает раскладку формата солдат из пары Build ↔ коды и расширения — секций сверх `PERKS` и `NAME`: `BIOSOLDIER_BUILD_LAYOUT` — формат 1 с расширением Gene mods, Psionic abilities и Officer perks, `MEC_BUILD_LAYOUT` — формат 3 без расширения), `model/unit-code.ts` (коды Unit), `model/squad-code.ts` (коды Squad), `model/stored-build.ts` (записи хранилища поверх share-кода; код с Outdated selection читается как Outdated build, который хранит свою запись), `model/outdated-selection-cards.ts`, `model/outdated-import.ts`, `model/outdated-update.ts` и `ui/OutdatedSelectionsDialog.vue` (карточки, импорт через модалку, обновление Outdated build через неё и сама модалка Outdated selection). Фича обслуживает все страницы калькуляторов и остаётся отдельным слайсом: формат меняется по своим причинам, у него свои тесты и доки.

## Секции

| Секция | id | Поля | Пишется |
|---|---|---|---|
| `PERKS` | 1 | `class` 5 · шаги, `variant` 2 | всегда |
| `NAME` | 2 | `nameLength` 5 · UTF-8 | если имя отличается от названия класса |
| `GENE_MODS` | 3 | шаги, `variant` 1 | только у биосолдат, если у билда есть Gene mod |
| `PSIONIC` | 4 | шаги, `variant` 2 | только у биосолдат, если у билда есть Psionic ability |
| `OFFICER` | 5 | шаги, `variant` 1 | только у биосолдат, если у билда есть Officer perk |
| `LOADOUT` | 6 | `armor` 8 · `primary` 8 · `secondary` 8 · `utilityCount` 3 · `item` 8 × utilityCount · `moduleCount` 2 · `item` 8 × moduleCount | только в кодах Unit |

Шаги — список всех шагов дерева: `count` 3, затем на каждый шаг `selected` 1 и, при выборе, `variant` (его индекс среди вариантов шага, в порядке дерева) и `ability` 8. Пустые шаги сохраняют своё место, поэтому Build с пропусками возвращается таким, каким был.

В `PERKS` шаги — ранги снизу вверх, со второго: базовый перк при импорте берётся из текущего дерева. В `GENE_MODS` — Body parts от Brain к Legs, в `PSIONIC` — Psi levels от Awakened к Master, в `OFFICER` — Officer ranks от Lieutenant к Field Commander. Код без одной из этих секций даёт там пустые шаги; в имеющейся секции шаги есть всегда.

Число шагов должно быть как в дереве, а индекс варианта — существовать на своём шаге; иначе код невалиден. Выбор, чью абилку его шаг предлагает, берётся под любым индексом варианта: перестановка вариантов шага ничего не меняет. Абилка, которой на шаге больше нет, — Outdated selection: шаг остаётся пустым, а карточка модалки показывает шаг, абилку кода и абилку, что стоит в дереве на её варианте сейчас. Базового перка в коде нет, поэтому он не бывает Outdated selection.

Коды MEC не пишут `GENE_MODS`, `PSIONIC` и `OFFICER`, декодер MEC пропускает их как неизвестные.

## Коды Unit

Код Unit — код Build своего формата плюс секция `LOADOUT` с Loadout этого Unit; своих номеров форматов у Unit нет. Секция берёт следующий id формата: `6` у форматов солдат, `3` у формата SHIV.

- Отметки Officer нет: Unit — Officer, если в секции `OFFICER` его Build есть Officer perk.
- Предметы — номера `code` каталогов Loadout из `entities/loadout`: броня и MEC exoskeletons из `armors.json` (в коде SHIV — его SHIV type из `shiv-types.json`), оружие из `weapons.json`, Equipment и Modules из `equipment.json`. `0` — пустой слот, в том числе Secondary.
- Utility slots идут по позициям, Gear Slots и Psi Slots последними; Module slots — по позициям.
- Декодер не сверяет Loadout с Build: неизвестный код предмета оставляет слот пустым, Seraph Armor без Officer perks — не `invalid`. Squad planner при импорте приводит Loadout к правилам проверкой Unit и сообщает тостом, что снято.
- Build calculator берёт Build из кода Unit своего вида и оставляет Loadout. Код Build, добавленный как Unit, получает Default Loadout.
- Новая часть Unit — новая секция после `LOADOUT`, по тем же правилам, что новая часть Build.

Код: `model/unit-code.ts` — `encodeUnit` пишет секции раскладки своего вида (`BUILD_CODE_LAYOUTS`) и `LOADOUT` поверх `loadoutCodes` из `entities/loadout`; `readUnit`, который вызывает `readShareCode`, читает открытый код любого формата билдов в вид, Build и Loadout из `loadoutFromCodes`, null — у кода Build.

## Нумерация

Коды хранят классы по `code`, а каждый выбор — по его месту в дереве, шагу и индексу варианта, вместе с `code` его абилки. Поэтому число рангов, перков на каждом ранге класса и вариантов на каждой Body part, Psi level и Officer rank между версиями мода не меняется.

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

Менять названия, описания, иконки; переименовывать id (с прежним `code`); переставлять варианты шага; добавлять классы; переименовывать Body parts, Psi levels и Officer ranks; менять `abbreviation` и `requiredRank` у Officer rank — последний только подсказка.

## Ломающие правки

| Правка | Старые коды |
|---|---|
| сменить или переиспользовать `code` | покажут не ту абилку |
| сменить или переиспользовать `code` каталога Loadout | коды Unit покажут не тот предмет |
| удалить запись | «Invalid code» |
| перенести абилку на другой шаг, убрать из дерева или заменить другой | коды, где она выбрана: Outdated selection |
| переставить Body parts, Psi levels или Officer ranks | коды с выбором там: Outdated selection |
| изменить число рангов, Body parts, Psi levels или Officer ranks | коды этого дерева: «Invalid code» |
| убрать вариант с шага | коды, где выбран вариант за новым концом шага: «Invalid code» |
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
3. Написать секцию в `soldier-build-code.ts`. Часть любого солдата идёт в `writeBuild` / `readBuild` из `soldierBuildLayout`, часть одного формата — в его расширение (`BIOSOLDIER_BUILD_EXTENSION` у биосолдат): `write` отдаёт секцию, только если в кодах есть эта часть, `read` читает её через `readWholeSection`; список кодов пишется и читается через `writeCodeList` / `readCodeList`, список шагов — через `writeStepList` / `readStepList`. Без секции часть пустая.

Пример: Officer perks (только биосолдаты), максимальный id секции был 4.

1. `BiosoldierBuildCodes`: `officerPerks` — выборы по Officer ranks; коды → Build берёт их после Psionic abilities.
2. `SOLDIER_BUILD_SECTION`: `OFFICER: 5`.
3. `BIOSOLDIER_BUILD_EXTENSION`: `write` отдаёт `OFFICER` (шаги с `OFFICER_RANK_STEP_BITS`) только для кодов с Officer perk; `read` отдаёт её шаги, без секции — пустой список.

## Проверки

`npm test` проверяет диапазон и уникальность `code` (id и коды классов — по обоим спискам классов), id и циклы `grants`, а также сам формат кодов; хук перед пушем запускает его вместе с `vue-tsc` и линтером, а после него — e2e-тесты.

Смену или переиспользование `code` ловит только ревью.
