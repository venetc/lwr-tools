# Коды Squad

[English](squad-share-codes.en.md) · **Русский**

Весь Squad в одном share-коде: имя и каждый Unit с его Build и Loadout. Правила для выданных кодов те же, что у [кодов билдов солдат](share-codes.ru.md): выданный код должен открываться всегда.

## Устройство

```
<заголовок Squad>.<код Unit>.<код Unit>…
```

- Заголовок Squad — бинарный код формата `4` (`SHARE_CODE_FORMAT.SQUAD`) с секцией `NAME`; устройство рамки — в [кодах билдов солдат](share-codes.ru.md#устройство).
- Дальше [код Unit](share-codes.ru.md#коды-unit) на каждый Unit в порядке Squad. Частью может быть и код Build: такой Unit получает Default Loadout.
- Части склеены через точку: её нет в base64url, а одна рамка не вмещает большой Squad (31 секция по 511 бит).
- Пустой Squad — один заголовок. Около 60–80 символов на Unit, лимита Units нет.

| Секция | id | Поля | Пишется |
|---|---|---|---|
| `NAME` | 1 | `nameLength` 5 · UTF-8 | всегда |

Имя обрезается до 31 байта. Заголовок без `NAME` невалиден; неизвестные секции заголовка пропускаются.

## Декодирование

`readShareCode` узнаёт код Squad по формату `4` первой части и отдаёт `{ status: 'squad', squad }`; код Unit или код Build даёт `{ status: 'unit', unit }`, всё остальное — `{ status: 'invalid' }` (см. [Результат декодирования](share-codes.ru.md#результат-декодирования)).

- У каждой части свой CRC. Любая битая часть — заголовок, Unit, пустая часть — делает невалидным весь код: частичного импорта нет.
- В `squad` — `name`, `builds` и `units` в порядке Squad. Build — `{ kind, build, outdated }`, `outdated` — как в коде Unit. Unit ссылается на свой Build через `buildIndex` и несёт Loadout, null у части с кодом Build.
- Units с одинаковыми секциями Build — вид и данные, включая имя, `OFFICER` и `SIGNATURE_SKILL`, — и одинаковыми Outdated selection делят один Build. Одинаковый Class tree с другими Officer perks или другим Signature skill — два Builds.
- Loadout с Build не сверяется, как и в коде Unit.

## Где какой код принимается

| Место | Код Squad | Код Unit или Build | Битый код |
|---|---|---|---|
| Import в тулбаре Squad planner | новый Squad, открывается | под полем: «This is a Unit code. Add it through an empty cell.» | под полем: «Invalid code. Copy the Share code again and paste it whole.» |
| Вкладка Share code в Add Unit | под полем: «This is a Squad code. Use Import in the toolbar.» | новый Unit | та же ошибка |
| Import калькулятора | тост «This is a Squad code. Import it in the Squad planner.» | Build своего вида | «Invalid code» |

Импорт кода Squad:

- при Outdated selection хотя бы в одном Build сначала открывает одну модалку «Outdated selections» на весь Squad: карточки каждого такого Build под его именем, по разу на Build, так что Units одного Build делят их. «Cancel» ничего не импортирует, код остаётся в поле; «Import» продолжает импорт с Builds без Outdated selection. Код Unit во вкладке Share code в Add Unit открывает ту же модалку с карточками своего Build;
- создаёт новый Squad с именем из кода, последним в списке; имена могут повторяться;
- добавляет каждый общий Build один раз в его калькулятор: импорт Squad всегда создаёт новые Builds;
- приводит каждый Unit к правилам его Build проверкой Unit;
- открывает Squad и пишет в тосте, сколько Builds попало в каждый калькулятор и что сняла проверка.

Кнопка Share code рядом с именем Squad копирует код открытого Squad: его имя и Units его карточек. Squad, где есть Unit с Outdated build, не копируется, частичного экспорта нет: toast перечисляет Outdated builds. Кнопка копирования на карточке Unit с Outdated build так же ничего не копирует и говорит почему.

## Код

`features/share-build`:

- `model/squad-code.ts` — `encodeSquad` пишет заголовок и коды Unit из `encodeUnit`, null, если код Unit не записать; `readSquad`, который вызывает `readShareCode` с открытыми заголовком и частями, читает их обратно и склеивает Units в Builds по секциям Build.
- `model/share-code.ts` — `readShareCode`: каждое место ввода проверяет его результат одним условием, как в таблице выше.

- `model/outdated-import.ts` — `useOutdatedImport`: импортирует прочитанный код сразу или сначала открывает модалку «Outdated selections» с группами карточек его Builds (`outdatedSelectionGroups` из `model/outdated-selection-cards.ts`); через него импортируют калькуляторы и Squad planner.

`pages/squads` превращает прочитанный Squad в Squad: `model/squad-import.ts` (Import в тулбаре), `model/add-unit.ts` (вкладка Share code в Add Unit), `model/squad-code-copy.ts` (кнопка Share code), `model/code-copy-block.ts` (почему код Unit или Squad с Outdated builds не копируется).

## Развитие формата

- Новая часть всего Squad — новая секция заголовка со следующим id в `SQUAD_SECTION`.
- Новая часть Unit идёт в его код Unit по правилам [кодов Unit](share-codes.ru.md#коды-unit).
- Точка и порядок частей меняются только с новым номером формата.
