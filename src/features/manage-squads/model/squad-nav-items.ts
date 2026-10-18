import type { MaybeRefOrGetter } from 'vue';
import { computed, toValue } from 'vue';

import type { ListNavItem } from '@shared/ui/list-nav';

import type { Squad } from './squad';

/**
 * Squads as navigation items: name as the label, the number of Units as the detail, the open Squad current;
 * every Squad is removable.
 *
 * @param squads Squads in list order.
 * @param openSquadId id of the open Squad; null if none is open.
 */
export const useSquadNavItems = (squads: MaybeRefOrGetter<readonly Squad[]>, openSquadId: MaybeRefOrGetter<string | null>) => {
  return computed(() => toValue(squads).map((squad): ListNavItem => ({
    id: squad.id,
    label: squad.name,
    detail: String(squad.units.length),
    isRemovable: true,
    isCurrent: squad.id === toValue(openSquadId),
  })));
};
