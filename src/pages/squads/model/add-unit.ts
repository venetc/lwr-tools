import { storeToRefs } from 'pinia';
import type { AcceptableValue } from 'reka-ui';
import { computed, ref } from 'vue';

import type { Loadout } from '@entities/loadout';
import type { SquadUnitBuild } from '@features/manage-squads';
import { useSquadsStore } from '@features/manage-squads';
import type { TabsItem } from '@shared/ui/tabs';
import { useToastQueue } from '@shared/ui/toast';

import { ADD_UNIT_TAB, ADD_UNIT_TABS, UNIT_CHECK_LINE_BREAK } from '../config/constants';
import { changeNotes } from './loadout-edit';
import type { NewBuildOption } from './new-build';
import type { SavedBuildKind, SavedBuildRow } from './saved-builds';
import { matchingBuilds, savedBuildFilters, savedBuildGroups } from './saved-builds';
import type { SquadBuild } from './squad-build';
import { buildListName } from './squad-build';
import { importSquadBuild, useSquadBuilds } from './squad-builds';
import { checkUnit } from './unit-check';
import { useUnitCodeField } from './unit-code-field';
import { importUnits } from './unit-import';

/**
 * Add Unit dialog of the open Squad: its tabs, the search and filter of saved builds, and adding a Unit of a saved build,
 * of a new Default build or of a Share code. A new Unit gets the Default Loadout, a Unit code brings its own through the
 * Unit check; the dialog closes and a toast tells where the build is and what the check took off.
 */
export const useAddUnit = () => {
  const squadsStore = useSquadsStore();

  const { openSquad } = storeToRefs(squadsStore);

  const { squadBuilds, findSquadBuild, addDefaultBuild } = useSquadBuilds();

  const { showToast } = useToastQueue();

  const isOpen = ref(false);

  const tab = ref<string>(ADD_UNIT_TABS[0].id);

  const query = ref('');

  const kind = ref<SavedBuildKind>('all');

  const codeField = useUnitCodeField();

  const matches = computed(() => matchingBuilds(squadBuilds.value, query.value));

  const filters = computed(() => savedBuildFilters(matches.value));

  const groups = computed(() => savedBuildGroups(matches.value, kind.value, openSquad.value?.units ?? []));

  const emptyNote = computed(() => {
    if (groups.value.length) return null;

    return query.value.trim() ? `No builds match “${query.value.trim()}”.` : 'No saved builds.';
  });

  const kindFilter = computed({
    get: () => kind.value,
    set: (value: AcceptableValue) => {
      const filter = filters.value.find(item => item.id === value);

      if (!filter) return;

      kind.value = filter.id;
    },
  });

  /**
   * Whether the tab lists the saved builds.
   *
   * @param item tab of the dialog.
   */
  const isSavedBuildsTab = (item: TabsItem) => item.id === ADD_UNIT_TAB.saved.id;

  /**
   * Whether the tab offers new Default builds.
   *
   * @param item tab of the dialog.
   */
  const isNewBuildTab = (item: TabsItem) => item.id === ADD_UNIT_TAB.new.id;

  /**
   * Opens or closes the dialog; closing brings back the first tab and clears the search, the filter and the Share code.
   *
   * @param isNextOpen whether the dialog becomes open.
   */
  const setOpen = (isNextOpen: boolean) => {
    isOpen.value = isNextOpen;

    if (isNextOpen) return;

    tab.value = ADD_UNIT_TABS[0].id;
    query.value = '';
    kind.value = 'all';
    codeField.reset();
  };

  /**
   * Puts a Unit with the checked Loadout last in the open Squad and closes the dialog.
   *
   * @param build kind and id of the saved build of the Unit.
   * @param loadout Loadout that fits the build.
   * @returns name of the Squad the Unit is added to; null if no Squad is open.
   */
  const placeUnit = (build: SquadUnitBuild, loadout: Loadout) => {
    const squad = openSquad.value;

    if (!squad) return null;

    squadsStore.addUnit(squad.id, build, loadout);
    setOpen(false);

    return squad.name;
  };

  /**
   * Adds a Unit of the saved build last in the open Squad with the Default Loadout of the Unit check.
   *
   * @param squadBuild build of the new Unit.
   * @returns name of the Squad the Unit is added to; null if no Squad is open or no Loadout fits the build.
   */
  const addUnit = (squadBuild: SquadBuild) => {
    const checked = checkUnit(null, squadBuild);

    if (!checked) return null;

    return placeUnit({ kind: squadBuild.kind, id: squadBuild.build.id }, checked.loadout);
  };

  /**
   * Adds a Unit of the saved build; the same build may be added again.
   *
   * @param row saved build of the list.
   */
  const addSavedBuild = (row: SavedBuildRow) => {
    const squadName = addUnit(row.squadBuild);

    if (!squadName) return;

    showToast({ title: 'Unit added', description: `${row.squadBuild.build.name} added to ${squadName}.` });
  };

  /**
   * Adds a Default build of the option to its Build calculator and a Unit of it.
   *
   * @param option class of a biosoldier or MEC, or a SHIV.
   */
  const addNewBuild = (option: NewBuildOption) => {
    if (!openSquad.value) return;

    const build = addDefaultBuild(option);
    const squadBuild = build ? findSquadBuild(build) : null;
    const squadName = squadBuild ? addUnit(squadBuild) : null;

    if (!squadName) return;

    showToast({
      title: 'Unit added',
      description: `New ${option.name} build added to ${squadName} and to ${buildListName(option.kind)}.`,
    });
  };

  /**
   * Adds the build of the entered Share code to its Build calculator and a Unit of it: a Unit code with its Loadout,
   * a Build code with the Default Loadout, both through the Unit check of the import. A code no Loadout fits adds
   * nothing. The toast tells what the Unit check took off, without repeats; an invalid code shows the error.
   */
  const importUnitCode = () => {
    if (!openSquad.value) return;

    const unit = codeField.readUnit();
    const [imported] = unit ? importUnits({ builds: [unit], units: [{ buildIndex: 0, loadout: unit.loadout }] }, importSquadBuild) : [];
    const squadName = imported ? placeUnit(imported.build, imported.loadout) : null;

    if (!imported || !squadName) return;

    const lines = [`${imported.buildName} added to ${squadName} and to ${buildListName(imported.build.kind)}.`];

    if (imported.changes.length) lines.push(changeNotes(imported.changes).join(' '));

    showToast({ title: 'Unit added', description: lines.join(UNIT_CHECK_LINE_BREAK) });
  };

  return {
    isOpen,
    tab,
    query,
    kindFilter,
    filters,
    groups,
    emptyNote,
    code: codeField.code,
    codeError: codeField.error,
    codePreview: codeField.preview,
    isSavedBuildsTab,
    isNewBuildTab,
    setOpen,
    addSavedBuild,
    addNewBuild,
    importUnitCode,
  };
};
