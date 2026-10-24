import type { SquadBuild } from '@pages/squads/model/squad-build';

/**
 * SHIV build, outdated or not.
 *
 * @param id build id.
 * @param name build name.
 * @param isOutdated whether the build is an Outdated build.
 */
const shivBuildMock = (id: string, name: string, isOutdated: boolean): SquadBuild => ({
  kind: 'shiv',
  build: { id, name, readonly: false, outdated: isOutdated ? { code: 'old-code', selections: [] } : null, perks: [] },
});

/**
 * Card fields the copy block reads.
 *
 * @param squadBuild build of the Unit.
 */
const cardMock = (squadBuild: SquadBuild) => ({ squadBuild, isOutdated: squadBuild.build.outdated !== null });

const ALLOY_SUPPORT = shivBuildMock('shiv-build', 'Alloy Support', false);

const OLD_SUPPORT = shivBuildMock('old-build', 'Old Support', true);

const OLD_SCOUT = shivBuildMock('old-scout-build', 'Old Scout', true);

export const CURRENT_CARD = cardMock(ALLOY_SUPPORT);

export const OUTDATED_CARD = cardMock(OLD_SUPPORT);

export const SECOND_OUTDATED_CARD = cardMock(OLD_SCOUT);

export const UNIT_BLOCK = {
  title: 'Unit code not copied',
  description: 'Old Support is outdated. Update it in the Build first.',
};

export const SQUAD_BLOCK_TITLE = 'Squad code not copied';

export const ONE_OUTDATED_TEXT = 'Outdated build: Old Support. Update it in the Build first.';

export const TWO_OUTDATED_TEXT = 'Outdated builds: Old Support, Old Scout. Update them in the Build first.';
