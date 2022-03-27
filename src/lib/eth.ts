export function isAddress(address: string) {
  return address.startsWith("0x") && address.length === 42;
}
