import { storeToRefs } from 'pinia';
import type { AcceptableValue } from 'reka-ui';
import { computed, ref } from 'vue';

import type { DecodedLoadout } from '@entities/loadout';
import { useSquadsStore } from '@features/manage-squads';
import type { TabsItem } from '@shared/ui/tabs';
import { useToastQueue } from '@shared/ui/toast';

import { ADD_UNIT_TAB, ADD_UNIT_TABS, UNIT_CHECK_LINE_BREAK } from '../config/constants';
import { changeNote } from './loadout-edit';
import type { NewBuildOption } from './new-build';
import type { SavedBuildKind, SavedBuildRow } from './saved-builds';
import { matchingBuilds, savedBuildFilters, savedBuildGroups } from './saved-builds';
import type { SquadBuild } from './squad-build';
import { buildListName } from './squad-build';
import { importSquadBuild, useSquadBuilds } from './squad-builds';
import { checkUnit } from './unit-check';
import { useUnitCodeField } from './unit-code-field';

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
   * Adds a Unit of the build last in the open Squad, with the Loadout brought to the rules of the build by the Unit check.
   *
   * @param squadBuild build of the new Unit.
   * @param loadout Loadout of the new Unit; null for the Default Loadout.
   * @returns name of the Squad the Unit is added to and what the check changed in the Loadout; null if no Squad is open
   * or no Loadout fits the build.
   */
  const addUnit = (squadBuild: SquadBuild, loadout: Readonly<DecodedLoadout> | null) => {
    const squad = openSquad.value;
    const checked = checkUnit(loadout, squadBuild);

    if (!squad || !checked) return null;

    squadsStore.addUnit(squad.id, { kind: squadBuild.kind, id: squadBuild.build.id }, checked.loadout);
    setOpen(false);

    return { squadName: squad.name, changes: checked.changes };
  };

  /**
   * Adds a Unit of the saved build; the same build may be added again.
   *
   * @param row saved build of the list.
   */
  const addSavedBuild = (row: SavedBuildRow) => {
    const added = addUnit(row.squadBuild, null);

    if (!added) return;

    showToast({ title: 'Unit added', description: `${row.squadBuild.build.name} added to ${added.squadName}.` });
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
    const added = squadBuild ? addUnit(squadBuild, null) : null;

    if (!added) return;

    showToast({
      title: 'Unit added',
      description: `New ${option.name} build added to ${added.squadName} and to ${buildListName(option.kind)}.`,
    });
  };

  /**
   * Adds the build of the entered Share code to its Build calculator and a Unit of it: a Unit code with its Loadout,
   * a Build code with the Default Loadout. The Unit is checked before the build is saved, so a code no Loadout fits
   * adds nothing. The toast tells what the Unit check took off, without repeats; an invalid code shows the error.
   */
  const importUnitCode = () => {
    if (!openSquad.value) return;

    const unit = codeField.readUnit();
    const checked = unit && checkUnit(unit.loadout, unit);

    if (!unit || !checked) return;

    const squadBuild = findSquadBuild(importSquadBuild(unit));
    const added = squadBuild && addUnit(squadBuild, checked.loadout);

    if (!added || !squadBuild) return;

    const lines = [`${squadBuild.build.name} added to ${added.squadName} and to ${buildListName(squadBuild.kind)}.`];

    if (checked.changes.length) lines.push([...new Set(checked.changes.map(changeNote))].join(' '));

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
    isCodeInvalid: codeField.isInvalid,
    codeErrorId: codeField.errorId,
    codeErrorDescribedBy: codeField.errorDescribedBy,
    codePreview: codeField.preview,
    clearCodeError: codeField.clearError,
    isSavedBuildsTab,
    isNewBuildTab,
    setOpen,
    addSavedBuild,
    addNewBuild,
    importUnitCode,
  };
};
