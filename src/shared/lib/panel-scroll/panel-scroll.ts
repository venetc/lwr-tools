import { unrefElement, usePreferredReducedMotion } from '@vueuse/core';
import type { ComponentPublicInstance } from 'vue';

/**
 * Scrolling the page to panels of items, instant when the user prefers reduced motion.
 * Panels are collected through template refs, not looked up in the document.
 */
export const usePanelScroll = () => {
  const reducedMotion = usePreferredReducedMotion();

  const panels = new Map<string, Element>();

  /**
   * Function template ref of the item panel: remembers the rendered panel and forgets an unmounted one.
   *
   * @param id item id.
   */
  const panelRef = (id: string) => (panel: Element | ComponentPublicInstance | null) => {
    const element = unrefElement(panel as HTMLElement | ComponentPublicInstance | null) ?? null;

    if (!element) {
      panels.delete(id);
      return;
    }

    panels.set(id, element);
  };

  /**
   * Scrolls the page to the item panel; does nothing if the panel is not rendered.
   *
   * @param id item id.
   */
  const scrollToPanel = (id: string) => {
    const panel = panels.get(id) ?? null;

    if (!panel) return;

    panel.scrollIntoView({ behavior: reducedMotion.value === 'reduce' ? 'auto' : 'smooth', block: 'start' });
  };

  return { panelRef, scrollToPanel };
};
