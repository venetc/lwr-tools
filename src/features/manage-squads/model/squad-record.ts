import type { z } from 'zod';

import { isLoadoutUnitId, loadoutCodes, loadoutFromCodes } from '@entities/loadout';

import { STORED_SQUAD_SCHEMA, STORED_UNIT_SCHEMA } from '../config/constants';
import type { Squad, SquadUnit } from './squad';

type StoredUnit = z.infer<typeof STORED_UNIT_SCHEMA>;

/**
 * Stored record of the Unit.
 *
 * @param unit Unit of a Squad.
 */
const serializeUnit = (unit: Readonly<SquadUnit>): StoredUnit => ({
  id: unit.id,
  build: { kind: unit.build.kind, id: unit.build.id },
  loadout: loadoutCodes(unit.loadout, unit.build.kind),
});

/**
 * Unit of the stored record; null if the record does not match the schema or its build kind is unknown.
 *
 * @param record stored record.
 */
const parseUnit = (record: unknown): SquadUnit | null => {
  const storedUnit = STORED_UNIT_SCHEMA.safeParse(record);

  if (!storedUnit.success) return null;

  const { id, build, loadout } = storedUnit.data;

  if (!isLoadoutUnitId(build.kind)) return null;

  return {
    id,
    build: { kind: build.kind, id: build.id },
    loadout: loadoutFromCodes(loadout, build.kind),
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
