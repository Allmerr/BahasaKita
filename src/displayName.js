export function displayName(name) {
 return String(name || '').replace(/(^|[\s'-])(\p{L})/gu, (_, separator, letter) => separator + letter.toLocaleUpperCase('id-ID'))
}
