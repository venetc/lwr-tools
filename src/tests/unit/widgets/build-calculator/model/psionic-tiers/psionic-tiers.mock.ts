import type { AbilityContent } from '@entities/soldier/model/abilities';
import type { BodyPartContent } from '@entities/soldier/model/body-parts';
import type { PsiLevelContent } from '@entities/soldier/model/psi-levels';
import type { PsionicTreeBuild } from '@widgets/build-calculator/model/psionic-tiers';

export const ABILITY_CONTENT_MOCK: Record<string, AbilityContent> = {
  'neural-damping': { code: 20, name: 'Neural Damping', description: 'Damps the brain.' },
  'head-second': { code: 21, name: 'Head Second', description: 'Second head option.' },
  'low-left': { code: 30, name: 'Low Left', description: 'Left low option.' },
  'low-right': { code: 31, name: 'Low Right', description: 'Right low option.' },
  'middle': { code: 32, name: 'Middle', description: 'Only middle option.' },
  'high-left': { code: 33, name: 'High Left', description: 'Left high option.' },
  'high-right': { code: 34, name: 'High Right', description: 'Right high option.' },
};

export const BODY_PART_CONTENT_MOCK: Record<string, BodyPartContent> = {
  head: { name: 'Head', geneMods: ['neural-damping', 'head-second'] },
};

export const PSI_LEVEL_CONTENT_MOCK: Record<string, PsiLevelContent> = {
  low: { name: 'Low', abilities: ['low-left', 'low-right'] },
  middle: { name: 'Middle', abilities: ['middle'] },
  high: { name: 'High', abilities: ['high-left', 'high-right'] },
};

/**
 * Build with the gene mods and psionic abilities.
 *
 * @param geneMods gene mods by body part.
 * @param psionicAbilities psionic abilities by psi level; null for an empty psi level.
 * @param readonly whether the build is readonly.
 */
export const createBuildMock = (geneMods: (string | null)[], psionicAbilities: (string | null)[], readonly = false): PsionicTreeBuild => ({
  geneMods: geneMods as PsionicTreeBuild['geneMods'],
  psionicAbilities: psionicAbilities as PsionicTreeBuild['psionicAbilities'],
  readonly,
});

export const NO_GENE_MODS = [null];

export const NEURAL_DAMPING_GENE_MODS = ['neural-damping'];

export const NO_PSIONICS = [null, null, null];

export const LOW_PSIONICS = ['low-right', null, null];

export const LOW_AND_HIGH_PSIONICS = ['low-right', null, 'high-left'];

const UNAVAILABLE_NOTE = 'Unavailable with Neural Damping';

export const ALL_UNAVAILABLE_NOTES = [UNAVAILABLE_NOTE, UNAVAILABLE_NOTE, UNAVAILABLE_NOTE, UNAVAILABLE_NOTE, UNAVAILABLE_NOTE];
