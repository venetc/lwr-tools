import { beforeEach, describe, expect, it, vi } from 'vitest';

import { defaultLoadout, fitLoadout } from '@entities/loadout';
import type { SquadBuildData } from '@pages/squads/model/squad-build';
import { importUnits, squadImportToast } from '@pages/squads/model/unit-import';

import {
  BIOSOLDIER_SQUAD_BUILD,
  CHANGED_UNITS,
  CHANGES_TOAST,
  COUNTS_TOAST,
  DEFAULT_LOADOUT,
  EMPTY_SQUAD_TOAST,
  IMPORTED_UNITS,
  SERAPH_LOADOUT,
  SERAPH_REPLACED,
  SHIV_SQUAD_BUILD,
  SQUAD_NAME,
} from './unit-import.mock';

vi.mock('@entities/loadout', async () => {
  const mock = await import('./unit-import.mock');

  return {
    LOADOUT_UNITS: mock.LOADOUT_UNITS_STUB,
    defaultLoadout: vi.fn(),
    findLoadoutItem: mock.findLoadoutItemStub,
    fitLoadout: vi.fn(),
  };
});

/**
 * Records the builds it is asked to save and gives each a new id.
 */
const createSaveBuild = () => vi.fn((squadBuild: SquadBuildData) => ({ kind: squadBuild.kind, id: `saved-${squadBuild.build.name}` }));

beforeEach(() => {
  vi.mocked(defaultLoadout).mockReturnValue(DEFAULT_LOADOUT);
  vi.mocked(fitLoadout).mockReturnValue({ loadout: DEFAULT_LOADOUT, changes: [SERAPH_REPLACED] });
});

describe('importUnits', () => {
  it('saves a build shared by two Units once', () => {
    const saveBuild = createSaveBuild();

    importUnits({ builds: [BIOSOLDIER_SQUAD_BUILD], units: [{ buildIndex: 0, loadout: null }, { buildIndex: 0, loadout: null }] }, saveBuild);

    expect(saveBuild).toHaveBeenCalledTimes(1);
  });

  it('leaves out a Unit that no armor or primary weapon fits', () => {
    vi.mocked(defaultLoadout).mockReturnValue(null);

    const units = importUnits({ builds: [SHIV_SQUAD_BUILD], units: [{ buildIndex: 0, loadout: null }] }, createSaveBuild());

    expect(units).toEqual([]);
  });

  it('does not save the build of a left-out Unit', () => {
    vi.mocked(defaultLoadout).mockReturnValue(null);
    const saveBuild = createSaveBuild();

    importUnits({ builds: [SHIV_SQUAD_BUILD], units: [{ buildIndex: 0, loadout: null }] }, saveBuild);

    expect(saveBuild).not.toHaveBeenCalled();
  });

  it('saves the build once when its first Unit is left out and the second stays', () => {
    vi.mocked(defaultLoadout).mockReturnValueOnce(null);
    const saveBuild = createSaveBuild();

    importUnits({ builds: [BIOSOLDIER_SQUAD_BUILD], units: [{ buildIndex: 0, loadout: null }, { buildIndex: 0, loadout: null }] }, saveBuild);

    expect(saveBuild).toHaveBeenCalledTimes(1);
  });

  it('keeps the Squad order of the Units', () => {
    const units = importUnits({
      builds: [BIOSOLDIER_SQUAD_BUILD, SHIV_SQUAD_BUILD],
      units: [{ buildIndex: 1, loadout: null }, { buildIndex: 0, loadout: null }],
    }, createSaveBuild());

    expect(units.map(unit => unit.buildName)).toEqual(['Tank', 'Overwatch']);
  });

  it('gives each Unit the saved build', () => {
    const units = importUnits({ builds: [SHIV_SQUAD_BUILD], units: [{ buildIndex: 0, loadout: null }] }, createSaveBuild());

    expect(units[0]?.build).toEqual({ kind: 'shiv', id: 'saved-Tank' });
  });

  it('gives the changes of the Unit check', () => {
    const units = importUnits({ builds: [BIOSOLDIER_SQUAD_BUILD], units: [{ buildIndex: 0, loadout: SERAPH_LOADOUT }] }, createSaveBuild());

    expect(units[0]?.changes).toEqual([SERAPH_REPLACED]);
  });
});

describe('squadImportToast', () => {
  it('tells how many new builds went to each Build calculator', () => {
    const toast = squadImportToast(SQUAD_NAME, IMPORTED_UNITS);

    expect(toast).toEqual(COUNTS_TOAST);
  });

  it('adds a line on each build whose Units the Unit check changed', () => {
    const toast = squadImportToast(SQUAD_NAME, CHANGED_UNITS);

    expect(toast).toEqual(CHANGES_TOAST);
  });

  it('tells only the opened Squad without Units', () => {
    const toast = squadImportToast(SQUAD_NAME, []);

    expect(toast).toEqual(EMPTY_SQUAD_TOAST);
  });
});
