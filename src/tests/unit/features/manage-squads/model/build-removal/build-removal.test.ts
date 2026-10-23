import { createPinia, setActivePinia } from 'pinia';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { useBuildRemoval } from '@features/manage-squads/model/build-removal';
import { useSquadsStore } from '@features/manage-squads/model/squads';

import { stubPage } from '../../../../shared/lib/stored-list/stored-list/stored-list.mock';
import { createCalculator, FREE_BUILD_ID, LOADOUT, NOTE, SQUAD_BUILD, TITLE } from './build-removal.mock';

beforeEach(() => {
  vi.useFakeTimers();
  setActivePinia(createPinia());
  stubPage();
  const store = useSquadsStore();
  store.addUnit(store.squads[0]?.id ?? '', SQUAD_BUILD, LOADOUT);
  store.addUnit(store.squads[0]?.id ?? '', SQUAD_BUILD, LOADOUT);
});

afterEach(() => {
  vi.useRealTimers();
  vi.unstubAllGlobals();
});

describe('removeBuild', () => {
  it('removes a build in no Squad at once', () => {
    const calculator = createCalculator();
    const removal = useBuildRemoval('biosoldier', calculator);

    removal.removeBuild(FREE_BUILD_ID);

    expect(calculator.builds.map(build => build.id)).toEqual([SQUAD_BUILD.id]);
  });

  it('keeps a build in a Squad', () => {
    const calculator = createCalculator();
    const removal = useBuildRemoval('biosoldier', calculator);

    removal.removeBuild(SQUAD_BUILD.id);

    expect(calculator.builds).toHaveLength(2);
  });

  it('opens the dialog for a build in a Squad', () => {
    const removal = useBuildRemoval('biosoldier', createCalculator());

    removal.removeBuild(SQUAD_BUILD.id);

    expect(removal.isDialogOpen.value).toBe(true);
  });

  it('keeps the dialog closed for a build in no Squad', () => {
    const removal = useBuildRemoval('biosoldier', createCalculator());

    removal.removeBuild(FREE_BUILD_ID);

    expect(removal.isDialogOpen.value).toBe(false);
  });

  it('removes a build of another kind with the id at once', () => {
    const calculator = createCalculator();
    const removal = useBuildRemoval('mec', calculator);

    removal.removeBuild(SQUAD_BUILD.id);

    expect(calculator.builds).toHaveLength(1);
  });
});

describe('dialog', () => {
  it('names the build in the title', () => {
    const removal = useBuildRemoval('biosoldier', createCalculator());

    removal.removeBuild(SQUAD_BUILD.id);

    expect(removal.title.value).toBe(TITLE);
  });

  it('tells the Squads and the Units that go with the build', () => {
    const removal = useBuildRemoval('biosoldier', createCalculator());

    removal.removeBuild(SQUAD_BUILD.id);

    expect(removal.note.value).toBe(NOTE);
  });
});

describe('confirmRemoval', () => {
  it('removes the build', () => {
    const calculator = createCalculator();
    const removal = useBuildRemoval('biosoldier', calculator);
    removal.removeBuild(SQUAD_BUILD.id);

    removal.confirmRemoval();

    expect(calculator.builds.map(build => build.id)).toEqual([FREE_BUILD_ID]);
  });

  it('removes the Units of the build', () => {
    const removal = useBuildRemoval('biosoldier', createCalculator());
    removal.removeBuild(SQUAD_BUILD.id);

    removal.confirmRemoval();

    expect(useSquadsStore().squads[0]?.units).toEqual([]);
  });

  it('closes the dialog', () => {
    const removal = useBuildRemoval('biosoldier', createCalculator());
    removal.removeBuild(SQUAD_BUILD.id);

    removal.confirmRemoval();

    expect(removal.isDialogOpen.value).toBe(false);
  });

  it('keeps the build once the dialog is closed', () => {
    const calculator = createCalculator();
    const removal = useBuildRemoval('biosoldier', calculator);
    removal.removeBuild(SQUAD_BUILD.id);
    removal.isDialogOpen.value = false;

    removal.confirmRemoval();

    expect(calculator.builds).toHaveLength(2);
  });
});
