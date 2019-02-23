/**
 * check wether an address is 0x000...
 * @param address {string} public address '0x' + 40 bytes
 */
export const addressIsZero = (address: string): boolean => {
  return /0x([0]{40})/.test(address);
};
