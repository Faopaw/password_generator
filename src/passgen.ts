export default function csprngp(length: number): string[] {
  const randomValues = new Uint8Array(length);
  crypto.getRandomValues(randomValues);
  const stringArray = uint8ArrayToStringArray(randomValues)
  return stringArray;
}

function uint8ArrayToStringArray(uint8Array: Uint8Array): string[] {
    return Array.from(uint8Array, byte => String.fromCharCode(byte));
}