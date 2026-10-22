import { useEventListener } from '@vueuse/core';
import type { Ref } from 'vue';
import { onScopeDispose } from 'vue';

import { useToastQueue } from '@shared/ui/toast';

import { CLOSE_NOTE_TOAST_TITLE } from '../config/constants';
import { useOpenSquadCheck } from './open-squad-check';
import type { UnitCard } from './unit-cards';

/**
 * Unit check of the open Squad after Build edits: in the Build dialog of a Unit card and in another tab. While edits in
 * the dialog would take something off, one notification tells what closing the dialog takes off and the Squad waits:
 * closing the dialog checks it once, so an edit undone before closing takes nothing off. Edits in another tab are
 * checked when the tab is shown again, unless the dialog holds such edits. The notification closes with the page.
 *
 * @param unitCards cards of the Units of the open Squad.
 */
export const useBuildEditCheck = (unitCards: Readonly<Ref<readonly UnitCard[]>>) => {
  const { showPersistentToast, updateToast, closeToast } = useToastQueue();

  const { checkOpenSquad } = useOpenSquadCheck();

  let closeNoteToastId: string | null = null;

  let closeNoteCardId: string | null = null;

  /**
   * Closes the notification of what closing the Build dialog takes off.
   */
  const hideCloseNote = () => {
    closeNoteCardId = null;

    if (!closeNoteToastId) return;

    closeToast(closeNoteToastId);
    closeNoteToastId = null;
  };

  /**
   * Tells what closing the Build dialog takes off the Units of the card's Build after an edit in the dialog: updates
   * the shown notification or shows a new one, and closes it once closing would take nothing off.
   *
   * @param cardId id of the card whose Build dialog the edit was made in.
   */
  const showCloseNote = (cardId: string) => {
    const closeNote = unitCards.value.find(card => card.id === cardId)?.closeNote;

    if (!closeNote) {
      hideCloseNote();
      return;
    }

    closeNoteCardId = cardId;

    const content = { title: CLOSE_NOTE_TOAST_TITLE, description: closeNote };

    if (closeNoteToastId && updateToast(closeNoteToastId, content)) return;

    closeNoteToastId = showPersistentToast(content);
  };

  /**
   * Closes the notification and checks the Units of the open Squad against their Builds once the Build dialog closes.
   */
  const checkClosedBuild = () => {
    hideCloseNote();
    checkOpenSquad();
  };

  /**
   * Applies edits made in another tab once the tab is shown again: checks the open Squad, or, while the Build dialog
   * holds edits that would take something off, only brings the notification up to date.
   */
  const checkOnShow = () => {
    if (document.visibilityState !== 'visible') return;

    if (closeNoteCardId) {
      showCloseNote(closeNoteCardId);
      return;
    }

    checkOpenSquad();
  };

  useEventListener(document, 'visibilitychange', checkOnShow);

  onScopeDispose(hideCloseNote);

  return { showCloseNote, checkClosedBuild };
};
