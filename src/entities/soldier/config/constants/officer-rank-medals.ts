import type { DeepReadonly } from '@shared/lib/object';

import type { OfficerRankId } from '../../model/officer-ranks';
import captainMedal from '../icons/officer-ranks/captain.png';
import colonelMedal from '../icons/officer-ranks/colonel.png';
import fieldCommanderMedal from '../icons/officer-ranks/field-commander.png';
import lieutenantMedal from '../icons/officer-ranks/lieutenant.png';
import majorMedal from '../icons/officer-ranks/major.png';

/** Medal image by officer rank id. */
export const OFFICER_RANK_MEDAL: DeepReadonly<Record<OfficerRankId, string>> = {
  'lieutenant': lieutenantMedal,
  'captain': captainMedal,
  'major': majorMedal,
  'colonel': colonelMedal,
  'field-commander': fieldCommanderMedal,
};
