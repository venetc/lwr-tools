import type { AbilityContent } from '@entities/soldier/model/abilities';
import type { BodyPartContent } from '@entities/soldier/model/body-parts';
import type { BiosoldierBuildData, SoldierBuildData } from '@entities/soldier/model/build';
import type { SoldierClass } from '@entities/soldier/model/classes';
import type { SoldierRankContent } from '@entities/soldier/model/ranks';

export const SOLDIER_RANK_CONTENT_MOCK: Record<string, SoldierRankContent> = {
  first: { name: 'First' },
  second: { name: 'Second' },
  third: { name: 'Third' },
};

export const SOLDIER_CLASS_MOCK = {
  id: 'tester',
  code: 3,
  name: 'Tester',
  perks: { first: ['granted'], second: ['left', 'right'], third: ['top'] },
  basePerk: 'granted',
} as unknown as SoldierClass;

export const BASE_PERKS = ['granted'];

export const FULL_PERKS = ['granted', 'right', 'top'];

/**
 * Fresh build of the mock class with its own perks array.
 *
 * @param perks selected perks by rank.
 */
export const createBuildMock = (perks: string[]): SoldierBuildData => ({
  soldierClass: SOLDIER_CLASS_MOCK,
  perks: [...perks],
  name: 'Tester',
});

export const ABILITY_CONTENT_MOCK: Record<string, AbilityContent> = {
  'head-first': { code: 20, name: 'Head First', description: 'First head option.' },
  'head-second': { code: 21, name: 'Head Second', description: 'Second head option.' },
  'feet-first': { code: 22, name: 'Feet First', description: 'First feet option.' },
  'feet-second': { code: 23, name: 'Feet Second', description: 'Second feet option.' },
};

export const BODY_PART_CONTENT_MOCK: Record<string, BodyPartContent> = {
  head: { name: 'Head', geneMods: ['head-first', 'head-second'] },
  feet: { name: 'Feet', geneMods: ['feet-first', 'feet-second'] },
};

/**
 * Fresh biosoldier build of the mock class with its own gene mods array.
 *
 * @param geneMods gene mods by body part.
 */
export const createBiosoldierBuildMock = (geneMods: (string | null)[]): BiosoldierBuildData => ({
  ...createBuildMock(BASE_PERKS),
  geneMods: [...geneMods] as BiosoldierBuildData['geneMods'],
});
