import type { ToastContent } from '@shared/ui/toast';

import { LIST_SEPARATOR, SQUAD_CODE_BLOCK_TITLE, UNIT_CODE_BLOCK_TITLE } from '../config/constants';
import { squadBuildKey } from './squad-build';
import type { UnitCard } from './unit-cards';

/**
 * Fields of a Unit card that tell whether its Share code can be copied.
 */
export type CopiedCard = Pick<UnitCard, 'squadBuild' | 'isOutdated'>;

/**
 * Why the Unit code of the card is not copied: its build is an Outdated build, so the code would share an outdated
 * Build.
 *
 * @param card card of the Unit.
 * @returns toast with the hint; null if the code can be copied.
 */
export const unitCodeCopyBlock = (card: Readonly<CopiedCard>): ToastContent | null => {
  if (!card.isOutdated) return null;

  return { title: UNIT_CODE_BLOCK_TITLE, description: `${card.squadBuild.build.name} is outdated. Update it in the Build first.` };
};

/**
 * Why the Squad code is not copied: the Squad has Units of Outdated builds, and a Squad is shared whole or not at all.
 *
 * @param cards cards of the Units of the Squad, in Squad order.
 * @returns toast that names each Outdated build once, in Squad order; null if the code can be copied.
 */
export const squadCodeCopyBlock = (cards: readonly Readonly<CopiedCard>[]): ToastContent | null => {
  const namesByKey = cards.reduce((acc, card) => {
    if (!card.isOutdated) return acc;

    const { kind, build } = card.squadBuild;

    acc.set(squadBuildKey({ kind, id: build.id }), build.name);

    return acc;
  }, new Map<string, string>());

  if (!namesByKey.size) return null;

  const names = [...namesByKey.values()].join(LIST_SEPARATOR);
  const description = namesByKey.size === 1
    ? `Outdated build: ${names}. Update it in the Build first.`
    : `Outdated builds: ${names}. Update them in the Build first.`;

  return { title: SQUAD_CODE_BLOCK_TITLE, description };
};
