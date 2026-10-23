import { computed } from 'vue';

import type { DecodedUnit } from '@features/share-build';
import { decodeSquad, decodeUnit } from '@features/share-build';

import { INVALID_SHARE_CODE_TEXT, SQUAD_CODE_IN_ADD_UNIT_TEXT } from '../config/constants';
import { useShareCodeField } from './share-code-field';
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
 * not take, linked to the field while shown. A Build code and a Unit code of any kind are accepted; a Squad code is sent
 * to the Import of the toolbar.
 */
export const useUnitCodeField = () => {
  const { code, error, isInvalid, errorId, errorDescribedBy, showError, clearError, reset } = useShareCodeField();

  const preview = computed((): UnitCodePreview | null => {
    const result = decodeUnit(code.value);

    if (result.status !== 'decoded') return null;

    return { squadBuild: result.unit, name: result.unit.build.name, caption: squadBuildCaption(result.unit) };
  });

  /**
   * Unit of the entered code, decoded afresh so that its build can be handed over; a Squad code and any other invalid
   * code show their messages.
   *
   * @returns the Unit; null for a Squad code or an invalid code.
   */
  const readUnit = (): DecodedUnit | null => {
    const result = decodeUnit(code.value);

    if (result.status === 'decoded') return result.unit;

    showError(decodeSquad(code.value).status === 'decoded' ? SQUAD_CODE_IN_ADD_UNIT_TEXT : INVALID_SHARE_CODE_TEXT);

    return null;
  };

  return { code, error, isInvalid, errorId, errorDescribedBy, preview, clearError, reset, readUnit };
};
