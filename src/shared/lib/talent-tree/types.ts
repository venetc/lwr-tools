export interface TalentIcon {
  /** Original icon, shown for a selected talent. */
  original: string
  /** Icon tinted for a talent available to select. */
  available: string
  /** Icon tinted for a talent that is locked or not selected. */
  disabled: string
}

export interface Talent {
  id: string
  name: string
  description: string
  icon: TalentIcon
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
