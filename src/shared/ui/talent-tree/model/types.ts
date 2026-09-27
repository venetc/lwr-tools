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
  /** Tree name. */
  name: string
  /** Tree ranks from lowest to highest. */
  ranks: Rank[]
  /** Talents granted without selection: their ranks are always completed and cannot change. */
  baseBuild: TalentBuild
}

export type TalentBuild = Talent['id'][];
export type TalentRankState = 'completed' | 'available' | 'locked';
