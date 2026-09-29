/**
 * Bytes as base64url without padding.
 *
 * @param bytes encoded bytes.
 */
export const toBase64Url = (bytes: Uint8Array) => {
  return btoa(String.fromCharCode(...bytes))
    .replaceAll('+', '-')
    .replaceAll('/', '_')
    .replace(/=+$/, '');
};
