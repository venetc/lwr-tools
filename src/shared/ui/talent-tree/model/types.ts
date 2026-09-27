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
  talents: Talent[]
}

export interface TalentTreeData<Rank extends TalentRank = TalentRank> {
  name: string
  ranks: Rank[]
}

export type TalentBuild = Talent['id'][];
export type TalentRankState = 'completed' | 'available' | 'locked';
