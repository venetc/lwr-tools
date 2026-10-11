import type { ShivBuildData } from '@entities/shiv/model/build';
import type { ShivPerkContent } from '@entities/shiv/model/perks';
import type { TechnologyLevelContent } from '@entities/shiv/model/technology-levels';
import type { BinaryCodeSection } from '@shared/lib/binary-code';

export const SHIV_PERK_CONTENT_MOCK: Record<string, ShivPerkContent> = {
  left: { code: 1, name: 'Left', description: 'Left description' },
  right: { code: 2, name: 'Right', description: 'Right description' },
  up: { code: 3, name: 'Up', description: 'Up description' },
  down: { code: 4, name: 'Down', description: 'Down description' },
  top: { code: 5, name: 'Top', description: 'Top description' },
};

export const TECHNOLOGY_LEVEL_CONTENT_MOCK: Record<string, TechnologyLevelContent> = {
  first: { name: 'First', perks: ['left', 'right'] },
  second: { name: 'Second', perks: ['up', 'down'] },
  third: { name: 'Third', perks: ['top'] },
};

export const DEFAULT_NAME_BUILD: ShivBuildData = { perks: ['right', null, 'top'], name: 'SHIV' };

export const NAMED_BUILD: ShivBuildData = { perks: ['left', 'down', null], name: 'Tank' };

export const UNKNOWN_PERK_BUILD: ShivBuildData = { perks: ['missing', null, null], name: 'SHIV' };

export const SHIV_FORMAT = 2;

export const BIOSOLDIER_FORMAT = 1;

export const PERKS_SECTION_ID = 1;

export const NAME_SECTION_ID = 2;

export const INVALID_RESULT = { status: 'invalid' };

export const BIOSOLDIER_CODE_RESULT = { status: 'other-unit', unit: 'Biosoldier' };

export const GARBAGE_CODE = 'not a code';

export const REVERSED_PERKS_BUILD: ShivBuildData = { perks: ['left', 'up', 'top'], name: 'SHIV' };

/**
 * SHIV `PERKS` section with raw numbers: perk count 3 bits, perk numbers 6 bits each.
 *
 * @param perkCodes selected perk numbers, in any order.
 * @param extraBits zero bits written after the fields.
 */
export const perksSection = (perkCodes: number[], extraBits = 0): BinaryCodeSection => ({
  id: PERKS_SECTION_ID,
  write: (writer) => {
    writer.writeUint(perkCodes.length, 3);
    perkCodes.forEach(perkCode => writer.writeUint(perkCode, 6));
    if (extraBits > 0) writer.writeUint(0, extraBits);
  },
});
