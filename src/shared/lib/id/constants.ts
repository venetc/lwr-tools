/** Index of the UUID byte that holds the version in its high 4 bits. */
export const VERSION_BYTE_INDEX = 6;

/** Mask that keeps the low 4 bits of the version byte: 0x0F = 15. */
export const VERSION_CLEAR_MASK = 0x0F;

/** UUID version 4 in the high 4 bits of the version byte: 0x40 = 64. */
export const VERSION_4 = 0x40;

/** Index of the UUID byte that holds the variant in its high 2 bits. */
export const VARIANT_BYTE_INDEX = 8;

/** Mask that keeps the low 6 bits of the variant byte: 0x3F = 63. */
export const VARIANT_CLEAR_MASK = 0x3F;

/** RFC 4122 variant in the high 2 bits of the variant byte: 0x80 = 128. */
export const RFC_4122_VARIANT = 0x80;
