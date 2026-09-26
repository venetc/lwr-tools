import type { Talent, TalentBuild, TalentRankState, TalentTreeData } from './types';

import { findRankTalent } from './tree';

export function rankState(build: TalentBuild, rankIndex: number): TalentRankState {
  if (rankIndex < build.length) return 'completed';
  if (rankIndex === build.length) return 'available';
  return 'locked';
}

export function selectedTalentId(build: TalentBuild, rankIndex: number): string | null {
  return build[rankIndex] ?? null;
}

export function lastSelectedTalent(tree: TalentTreeData, build: TalentBuild): Talent | null {
  const lastRankIndex = build.length - 1;
  return findRankTalent(tree, lastRankIndex, selectedTalentId(build, lastRankIndex));
}

export function selectTalent(build: TalentBuild, rankIndex: number, talentId: string | null): void {
  if (rankIndex > build.length) return;
  build.length = rankIndex;
  if (talentId !== null) build.push(talentId);
}
