import type { BitReader } from '@shared/lib/bit-stream';

import { END_SECTION_ID, SECTION_ID_BITS, SECTION_LENGTH_BITS } from './constants';

/**
 * Section readers by id, or null if ids are not ascending, a section or the end id runs past the data,
 * or whole bytes follow the end id.
 *
 * @description Reads `id · length · fields` until the end id. Ids must strictly ascend, which also rules out
 * duplicates. A reader past the end returns 0, the end id, so a cut code leaves the loop and is caught by `isOverrun`.
 * After the end id only the zero padding of the last byte may remain.
 *
 * @param reader reader positioned at the first section.
 */
export const readSections = (reader: BitReader) => {
  const sections = new Map<number, BitReader>();
  let previousId = END_SECTION_ID;
  let id = reader.readUint(SECTION_ID_BITS);

  while (id !== END_SECTION_ID) {
    if (id <= previousId) return null;

    sections.set(id, reader.readSection(reader.readUint(SECTION_LENGTH_BITS)));
    previousId = id;
    id = reader.readUint(SECTION_ID_BITS);
  }

  if (reader.isOverrun || reader.remainingBits >= 8) return null;

  return sections;
};
