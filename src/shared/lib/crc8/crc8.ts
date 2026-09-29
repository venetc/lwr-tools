import { BYTE_MASK, CRC_POLYNOMIAL, HIGH_BIT_MASK } from './constants';

/**
 * CRC-8 checksum of the bytes.
 *
 * @description Bitwise CRC-8 without a lookup table, initial value 0. Each byte is XOR-ed into the running value,
 * then the value is shifted left 8 times; whenever the bit shifted out is 1, the value is XOR-ed with the polynomial.
 * Results are kept to 8 bits.
 *
 * @param bytes checked bytes.
 */
export const crc8 = (bytes: Uint8Array) => {
  return bytes.reduce((crc, byte) => {
    let value = crc ^ byte;

    for (let bit = 0; bit < 8; bit++) {
      value = value & HIGH_BIT_MASK ? ((value << 1) ^ CRC_POLYNOMIAL) & BYTE_MASK : (value << 1) & BYTE_MASK;
    }

    return value;
  }, 0);
};
