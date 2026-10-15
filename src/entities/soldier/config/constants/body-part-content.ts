import type { DeepReadonly } from '@shared/lib/object';

import type { BodyPartContent } from '../../model/body-parts';
import bodyPartsJson from '../data/body-parts.json';

/** Body part records by body part id, in Genetics Lab order. */
export const BODY_PART_CONTENT: DeepReadonly<typeof bodyPartsJson> = bodyPartsJson satisfies Record<string, BodyPartContent>;
