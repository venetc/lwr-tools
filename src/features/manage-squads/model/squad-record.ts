import type { z } from 'zod';

import type { LoadoutItemId, LoadoutUnitId } from '@entities/loadout';
import {
  ARMOR_BY_ID,
  ARMOR_ID_BY_CODE,
  EQUIPMENT_BY_ID,
  EQUIPMENT_ID_BY_CODE,
  isLoadoutUnitId,
  SHIV_TYPE_BY_ID,
  SHIV_TYPE_ID_BY_CODE,
  WEAPON_BY_ID,
  WEAPON_ID_BY_CODE,
} from '@entities/loadout';

import { STORED_SQUAD_SCHEMA, STORED_UNIT_SCHEMA } from '../config/constants';
import type { Squad, SquadUnit, UnitLoadout } from './squad';

type StoredUnit = z.infer<typeof STORED_UNIT_SCHEMA>;

type StoredLoadout = StoredUnit['loadout'];

/**
 * Stored code of an item: its `code` in the catalog; null for an empty slot or an item missing from the catalog.
 *
 * @param catalog items of the catalog by id.
 * @param id item id, or null for an empty slot.
 */
const itemCode = (catalog: ReadonlyMap<LoadoutItemId, { readonly code: number }>, id: LoadoutItemId | null) => {
  if (id === null) return null;

  return catalog.get(id)?.code ?? null;
};

/**
 * Item of a stored code; null for an empty slot or a code missing from the catalog.
 *
 * @param idByCode item ids of the catalog by code.
 * @param code stored code, or null for an empty slot.
 */
const itemId = <Id extends LoadoutItemId>(idByCode: ReadonlyMap<number, Id>, code: number | null) => {
  if (code === null) return null;

  return idByCode.get(code) ?? null;
};

/**
 * Stored Loadout: items as their catalog codes; a SHIV keeps its SHIV type in the armor slot.
 *
 * @param kind kind of the build of the Unit.
 * @param loadout Loadout of the Unit.
 */
const serializeLoadout = (kind: LoadoutUnitId, loadout: Readonly<UnitLoadout>): StoredLoadout => ({
  armor: itemCode(kind === 'shiv' ? SHIV_TYPE_BY_ID : ARMOR_BY_ID, loadout.armor),
  primary: itemCode(WEAPON_BY_ID, loadout.primary),
  secondary: itemCode(WEAPON_BY_ID, loadout.secondary),
  utility: loadout.utility.map(item => itemCode(EQUIPMENT_BY_ID, item)),
  modules: loadout.modules.map(item => itemCode(EQUIPMENT_BY_ID, item)),
});

/**
 * Loadout of the stored codes; an unknown code leaves its slot empty.
 *
 * @param kind kind of the build of the Unit.
 * @param loadout stored Loadout.
 */
const parseLoadout = (kind: LoadoutUnitId, loadout: StoredLoadout): UnitLoadout => ({
  armor: kind === 'shiv' ? itemId(SHIV_TYPE_ID_BY_CODE, loadout.armor) : itemId(ARMOR_ID_BY_CODE, loadout.armor),
  primary: itemId(WEAPON_ID_BY_CODE, loadout.primary),
  secondary: itemId(WEAPON_ID_BY_CODE, loadout.secondary),
  utility: loadout.utility.map(code => itemId(EQUIPMENT_ID_BY_CODE, code)),
  modules: loadout.modules.map(code => itemId(EQUIPMENT_ID_BY_CODE, code)),
});

/**
 * Stored record of the Unit; only a Biosoldier keeps the Officer mark.
 *
 * @param unit Unit of a Squad.
 */
const serializeUnit = (unit: Readonly<SquadUnit>) => {
  const record: StoredUnit = {
    id: unit.id,
    build: { kind: unit.build.kind, id: unit.build.id },
    loadout: serializeLoadout(unit.build.kind, unit.loadout),
  };

  if (unit.build.kind === 'biosoldier') record.isOfficer = unit.isOfficer;

  return record;
};

/**
 * Unit of the stored record; null if the record does not match the schema or its build kind is unknown.
 *
 * @param record stored record.
 */
const parseUnit = (record: unknown): SquadUnit | null => {
  const storedUnit = STORED_UNIT_SCHEMA.safeParse(record);

  if (!storedUnit.success) return null;

  const { id, build, isOfficer, loadout } = storedUnit.data;

  if (!isLoadoutUnitId(build.kind)) return null;

  return {
    id,
    build: { kind: build.kind, id: build.id },
    isOfficer: build.kind === 'biosoldier' && isOfficer === true,
    loadout: parseLoadout(build.kind, loadout),
  };
};

/**
 * Stored record of the Squad: its name and Units, items as their catalog codes.
 *
 * @param squad Squad.
 */
export const serializeSquad = (squad: Readonly<Squad>) => ({
  name: squad.name,
  units: squad.units.map(serializeUnit),
});

/**
 * Squad of the stored record; null if the record does not match the schema. Invalid Units are dropped,
 * and the others stay.
 *
 * @param id Squad id.
 * @param record stored record.
 */
export const parseSquad = (id: string, record: unknown): Squad | null => {
  const storedSquad = STORED_SQUAD_SCHEMA.safeParse(record);

  if (!storedSquad.success) return null;

  return {
    id,
    name: storedSquad.data.name,
    units: storedSquad.data.units.map(parseUnit).filter(unit => unit !== null),
  };
};
