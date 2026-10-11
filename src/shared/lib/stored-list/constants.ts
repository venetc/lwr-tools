import { z } from 'zod';

/** Delay after the last change before items are saved, in milliseconds. */
export const SAVE_DELAY = 300;

/** Longest time changes wait to be saved during continuous editing, in milliseconds. */
export const SAVE_MAX_WAIT = 2000;

/** Stored order: item ids from first to last. */
export const ORDER_SCHEMA = z.array(z.string());
