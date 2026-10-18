import { storeToRefs } from 'pinia';
import type { AcceptableValue } from 'reka-ui';
import { computed, ref } from 'vue';

import { defaultLoadout } from '@entities/loadout';
import { useSquadsStore } from '@features/manage-squads';
import type { TabsItem } from '@shared/ui/tabs';
import { useToastQueue } from '@shared/ui/toast';

import { ADD_UNIT_TABS } from '../config/constants';
import type { NewBuildOption } from './new-build';
import type { SavedBuildKind, SavedBuildRow } from './saved-builds';
import { matchingBuilds, savedBuildFilters, savedBuildGroups } from './saved-builds';
import type { SquadBuild } from './squad-build';
import { buildListName, unitWearer } from './squad-build';
import { useSquadBuilds } from './squad-builds';

/**
 * Add Unit dialog of the open Squad: its tabs, the search and filter of saved builds, and adding a Unit of a saved build
 * or of a new Default build. A new Unit gets the Default Loadout; the dialog closes and a toast tells where the build is.
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
   * Whether the tab lists the saved builds; the other one offers new Default builds.
   *
   * @param item tab of the dialog.
   */
  const isSavedBuildsTab = (item: TabsItem) => item.id === ADD_UNIT_TABS[0].id;

  /**
   * Opens or closes the dialog; closing brings back the first tab and clears the search and filter.
   *
   * @param isNextOpen whether the dialog becomes open.
   */
  const setOpen = (isNextOpen: boolean) => {
    isOpen.value = isNextOpen;

    if (isNextOpen) return;

    tab.value = ADD_UNIT_TABS[0].id;
    query.value = '';
    kind.value = 'all';
  };

  /**
   * Adds a Unit of the build with the Default Loadout last in the open Squad.
   *
   * @param squadBuild build of the new Unit.
   * @returns name of the Squad the Unit is added to; null if no Squad is open or no Loadout fits the build.
   */
  const addUnit = (squadBuild: SquadBuild) => {
    const squad = openSquad.value;
    const loadout = defaultLoadout(unitWearer(squadBuild, false));

    if (!squad || !loadout) return null;

    squadsStore.addUnit(squad.id, { kind: squadBuild.kind, id: squadBuild.build.id }, loadout);
    setOpen(false);

    return squad.name;
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

    const squadBuild = findSquadBuild(addDefaultBuild(option));
    const squadName = squadBuild ? addUnit(squadBuild) : null;

    if (!squadName) return;

    showToast({
      title: 'Unit added',
      description: `New ${option.name} build added to ${squadName} and to ${buildListName(option.kind)}.`,
    });
  };

  return { isOpen, tab, query, kindFilter, filters, groups, emptyNote, isSavedBuildsTab, setOpen, addSavedBuild, addNewBuild };
};
