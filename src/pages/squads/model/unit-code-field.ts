import { computed, ref } from 'vue';

import type { DecodedUnit } from '@features/share-build';
import { readShareCode } from '@features/share-build';

import { INVALID_SHARE_CODE_TEXT, SQUAD_CODE_IN_ADD_UNIT_TEXT } from '../config/constants';
import type { SquadBuildData } from './squad-build';
import { squadBuildCaption } from './squad-build';

/**
 * Unit of the entered Share code as the Share code tab previews it.
 */
export interface UnitCodePreview {
  /** Build of the code with its kind. */
  squadBuild: SquadBuildData
  /** Build name. */
  name: string
  /** Unit type and class of the build: `Biosoldier · Sniper`. */
  caption: string
}

/**
 * Share code field of the Add Unit dialog: the entered code, the preview of its Unit and the message of a code it does
 * not take. A Build code and a Unit code of any kind are accepted; a Squad code is sent to the Import of the toolbar.
 */
export const useUnitCodeField = () => {
  const code = ref('');

  const error = ref<string | null>(null);

  const preview = computed((): UnitCodePreview | null => {
    const result = readShareCode(code.value);

    if (result.status !== 'unit') return null;

    return { squadBuild: result.unit, name: result.unit.build.name, caption: squadBuildCaption(result.unit) };
  });

  /**
   * Unit of the entered code, read afresh so that its build can be handed over; a Squad code and any other invalid
   * code show their messages.
   *
   * @returns the Unit; null for a Squad code or an invalid code.
   */
  const readUnit = (): DecodedUnit | null => {
    const result = readShareCode(code.value);

    if (result.status === 'unit') return result.unit;

    error.value = result.status === 'squad' ? SQUAD_CODE_IN_ADD_UNIT_TEXT : INVALID_SHARE_CODE_TEXT;

    return null;
  };

  /**
   * Clears the code and the message.
   */
  const reset = () => {
    code.value = '';
    error.value = null;
  };

  return { code, error, preview, reset, readUnit };
};
