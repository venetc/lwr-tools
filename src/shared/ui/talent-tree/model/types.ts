export interface Talent {
  id: string
  name: string
  description: string
  icon: string
  grants: Talent[]
}

export interface TalentRank {
  id: string
  name: string
  icon: string
  talents: Talent[]
}

export interface TalentTreeData {
  name: string
  icon: string
  ranks: TalentRank[]
}

export type TalentBuild = Talent['id'][];
export type TalentRankState = 'completed' | 'available' | 'locked';
