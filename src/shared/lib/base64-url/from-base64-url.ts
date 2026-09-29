import { BASE64URL_PATTERN } from './constants';

/**
 * Bytes of a base64url string without padding, or null if it is not valid base64url.
 *
 * @param text decoded string.
 */
export const fromBase64Url = (text: string) => {
  if (!BASE64URL_PATTERN.test(text)) return null;

  try {
    const binary = atob(text.replaceAll('-', '+').replaceAll('_', '/'));

    return Uint8Array.from(binary, char => char.charCodeAt(0));
  } catch {
    return null;
  }
};
