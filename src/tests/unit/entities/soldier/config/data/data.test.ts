import { describe, expect, it } from 'vitest';

import { ABILITY_CONTENT } from '@entities/soldier/config/constants/ability-content';
import { BIOSOLDIER_CLASS_CONTENT } from '@entities/soldier/config/constants/biosoldier-class-content';
import { BODY_PART_CONTENT } from '@entities/soldier/config/constants/body-part-content';
import { MEC_CLASS_CONTENT } from '@entities/soldier/config/constants/mec-class-content';
import { OFFICER_RANK_CONTENT } from '@entities/soldier/config/constants/officer-rank-content';
import { PSI_LEVEL_CONTENT } from '@entities/soldier/config/constants/psi-level-content';
import { SOLDIER_RANK_CONTENT } from '@entities/soldier/config/constants/soldier-rank-content';

import { soldierContentSchema } from './data.schema';

/**
 * Perks offered on each rank of every class tree, in rank order. Share codes store a perk by its rank and its place on
 * the rank, so a mod update that changes these numbers breaks codes of earlier versions.
 */
const RANK_PERK_COUNTS = [
  ['specialist', 1],
  ['lance-corporal', 3],
  ['corporal', 3],
  ['sergeant', 3],
  ['tech-sergeant', 1],
  ['gunnery-sergeant', 3],
  ['master-sergeant', 2],
];

/** Gene mods offered on each body part, in body part order; share codes rely on these numbers like on rank perks. */
const BODY_PART_GENE_MOD_COUNTS = [
  ['brain', 2],
  ['eyes', 2],
  ['chest', 2],
  ['skin', 2],
  ['legs', 2],
];

/** Psionic abilities offered on each psi level, in psi level order; share codes rely on these numbers like on rank perks. */
const PSI_LEVEL_ABILITY_COUNTS = [
  ['awakened', 2],
  ['adept', 3],
  ['empath', 1],
  ['psion', 2],
  ['master', 1],
];

/** Officer perks offered on each officer rank, in officer training order; share codes rely on these numbers like on rank perks. */
const OFFICER_RANK_PERK_COUNTS = [
  ['lieutenant', 2],
  ['captain', 2],
  ['major', 2],
  ['colonel', 2],
  ['field-commander', 2],
];

describe('soldier content data', () => {
  it('matches the content schema', () => {
    const content = {
      abilities: ABILITY_CONTENT,
      biosoldierClasses: BIOSOLDIER_CLASS_CONTENT,
      mecClasses: MEC_CLASS_CONTENT,
      ranks: SOLDIER_RANK_CONTENT,
      bodyParts: BODY_PART_CONTENT,
      psiLevels: PSI_LEVEL_CONTENT,
      officerRanks: OFFICER_RANK_CONTENT,
    };

    const result = soldierContentSchema.safeParse(content);

    expect(result.error?.issues ?? []).toEqual([]);
  });

  it('keeps the ranks', () => {
    const rankIds = RANK_PERK_COUNTS.map(([rankId]) => rankId);

    const contentRankIds = Object.keys(SOLDIER_RANK_CONTENT);

    expect(contentRankIds).toEqual(rankIds);
  });

  it.each([
    ...Object.entries(BIOSOLDIER_CLASS_CONTENT),
    ...Object.entries(MEC_CLASS_CONTENT),
  ])('keeps the number of perks on each rank of %s', (_, soldierClass) => {
    const ranks = Object.entries(soldierClass.perks);

    const perkCounts = ranks.map(([rankId, perkIds]) => [rankId, perkIds.length]);

    expect(perkCounts).toEqual(RANK_PERK_COUNTS);
  });

  it('keeps the number of gene mods on each body part', () => {
    const bodyParts = Object.entries(BODY_PART_CONTENT);

    const geneModCounts = bodyParts.map(([bodyPartId, bodyPart]) => [bodyPartId, bodyPart.geneMods.length]);

    expect(geneModCounts).toEqual(BODY_PART_GENE_MOD_COUNTS);
  });

  it('keeps the number of psionic abilities on each psi level', () => {
    const psiLevels = Object.entries(PSI_LEVEL_CONTENT);

    const abilityCounts = psiLevels.map(([psiLevelId, psiLevel]) => [psiLevelId, psiLevel.abilities.length]);

    expect(abilityCounts).toEqual(PSI_LEVEL_ABILITY_COUNTS);
  });

  it('keeps the number of officer perks on each officer rank', () => {
    const officerRanks = Object.entries(OFFICER_RANK_CONTENT);

    const perkCounts = officerRanks.map(([officerRankId, officerRank]) => [officerRankId, officerRank.perks.length]);

    expect(perkCounts).toEqual(OFFICER_RANK_PERK_COUNTS);
  });
});
