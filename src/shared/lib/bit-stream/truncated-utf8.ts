/**
 * UTF-8 bytes of the text that fit the limit without cutting a character.
 *
 * @param text source text.
 * @param maxLength maximum byte count.
 */
export const truncatedUtf8 = (text: string, maxLength: number) => {
  const encoder = new TextEncoder();
  const bytes: number[] = [];

  for (const char of text) {
    const charBytes = encoder.encode(char);

    if (bytes.length + charBytes.length > maxLength) break;

    bytes.push(...charBytes);
  }

  return bytes;
};
