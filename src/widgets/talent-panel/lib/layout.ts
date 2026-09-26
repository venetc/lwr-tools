const COLUMNS: Record<number, number[]> = { 1: [2], 2: [1, 3], 3: [1, 2, 3] };

export function talentColumn(talentsInRank: number, talentIndex: number): number {
  return COLUMNS[talentsInRank]?.[talentIndex] ?? talentIndex + 1;
}
