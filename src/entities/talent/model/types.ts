export interface Talent {
  id: string
  name: string
  description: string
  icon: string
}

export interface TalentRank {
  title: string
  icon: string
  talents: Talent[]
}

export interface TalentTree {
  title: string
  icon: string
  ranks: TalentRank[]
}

export type TalentBuild = Talent['id'][];
export type TalentRankState = 'completed' | 'available' | 'locked';
