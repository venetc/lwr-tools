import {
  RFC_4122_VARIANT,
  VARIANT_BYTE_INDEX,
  VARIANT_CLEAR_MASK,
  VERSION_4,
  VERSION_BYTE_INDEX,
  VERSION_CLEAR_MASK,
} from './constants';

/**
 * Random UUID v4 built on `crypto.getRandomValues`, which, unlike `crypto.randomUUID`,
 * works in insecure contexts and older browsers.
 */
export const createId = () => {
  const bytes = crypto.getRandomValues(new Uint8Array(16));

  bytes[VERSION_BYTE_INDEX] = (bytes[VERSION_BYTE_INDEX] & VERSION_CLEAR_MASK) | VERSION_4;
  bytes[VARIANT_BYTE_INDEX] = (bytes[VARIANT_BYTE_INDEX] & VARIANT_CLEAR_MASK) | RFC_4122_VARIANT;

  const hex = Array.from(bytes, byte => byte.toString(16).padStart(2, '0')).join('');

  return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`;
};
