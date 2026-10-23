import { computed, ref } from 'vue';

import type { DecodedUnit } from '@features/share-build';
import { decodeUnit } from '@features/share-build';
import { createId } from '@shared/lib/id';

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
 * Share code field of the Add Unit dialog: the entered code, the preview of its Unit and the error of an invalid code,
 * linked to the field while shown. A Build code and a Unit code of any kind are accepted.
 */
export const useUnitCodeField = () => {
  const code = ref('');

  const isInvalid = ref(false);

  const errorId = createId();

  const errorDescribedBy = computed(() => (isInvalid.value ? errorId : null));

  const preview = computed((): UnitCodePreview | null => {
    const result = decodeUnit(code.value);

    if (result.status !== 'decoded') return null;

    return { squadBuild: result.unit, name: result.unit.build.name, caption: squadBuildCaption(result.unit) };
  });

  /**
   * Hides the error once the code is edited.
   */
  const clearError = () => {
    isInvalid.value = false;
  };

  /**
   * Clears the code and the error.
   */
  const reset = () => {
    code.value = '';
    clearError();
  };

  /**
   * Unit of the entered code, decoded afresh so that its build can be handed over; an invalid code shows the error.
   *
   * @returns the Unit; null for an invalid code.
   */
  const readUnit = (): DecodedUnit | null => {
    const result = decodeUnit(code.value);

    if (result.status === 'decoded') return result.unit;

    isInvalid.value = true;

    return null;
  };

  return { code, isInvalid, errorId, errorDescribedBy, preview, clearError, reset, readUnit };
};
