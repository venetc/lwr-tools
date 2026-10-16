import type { AbilityContent } from '@entities/soldier/model/abilities';
import type { BodyPartContent } from '@entities/soldier/model/body-parts';
import type { GeneModTreeBuild } from '@entities/soldier/model/gene-mod-tiers';

export const ABILITY_CONTENT_MOCK: Record<string, AbilityContent> = {
  'neural-damping': { code: 20, name: 'Neural Damping', description: 'Damps the brain.' },
  'head-second': { code: 21, name: 'Head Second', description: 'Second head option.' },
  'chest-first': { code: 22, name: 'Chest First', description: 'First chest option.' },
  'chest-second': { code: 23, name: 'Chest Second', description: 'Second chest option.' },
  'feet-first': { code: 24, name: 'Feet First', description: 'First feet option.' },
  'feet-second': { code: 25, name: 'Feet Second', description: 'Second feet option.' },
};

export const BODY_PART_CONTENT_MOCK: Record<string, BodyPartContent> = {
  head: { name: 'Head', geneMods: ['neural-damping', 'head-second'] },
  chest: { name: 'Chest', geneMods: ['chest-first', 'chest-second'] },
  feet: { name: 'Feet', geneMods: ['feet-first', 'feet-second'] },
};

/**
 * Build with the gene mods and psionic abilities.
 *
 * @param geneMods gene mods by body part.
 * @param readonly whether the build is readonly.
 * @param psionicAbilities psionic abilities by psi level.
 */
export const createBuildMock = (geneMods: (string | null)[], readonly = false, psionicAbilities: string[] = []): GeneModTreeBuild => ({
  geneMods: geneMods as GeneModTreeBuild['geneMods'],
  psionicAbilities: psionicAbilities as GeneModTreeBuild['psionicAbilities'],
  readonly,
});

export const NO_GENE_MODS = [null, null, null];

export const HEAD_AND_CHEST_GENE_MODS = ['head-second', 'chest-first', null];

export const PSIONICS = ['psionic'];

export const UNAVAILABLE_NOTE = 'Unavailable with Psionic abilities';
