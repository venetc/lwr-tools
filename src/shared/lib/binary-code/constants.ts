/** Width of the format number in the code header. */
export const FORMAT_BITS = 8;

/** Width of a section id; part of the section layout, a change means new format numbers. */
export const SECTION_ID_BITS = 5;

/** Width of a section length in bits; part of the section layout, a change means new format numbers. */
export const SECTION_LENGTH_BITS = 9;

/** Longest section in bits that its length field can hold: 2⁹ − 1 = 511. */
export const MAX_SECTION_BITS = 2 ** SECTION_LENGTH_BITS - 1;

/** Section id that ends the section list; real sections start from 1. */
export const END_SECTION_ID = 0;
