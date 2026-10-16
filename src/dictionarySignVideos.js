// Exact word matches in https://isyaratku.com/app/data.json, checked 2026-10-16.
// The dictionary credits Balai Bahasa Jawa Timur for these public video files.
const base = 'https://balaibahasajatim.kemendikdasmen.go.id/storage/videos/'
const ids = {
 Sekolah: '01K9MDBW7GCVZ4QZRF5861R8YS',
 Pasar: '01K9MD7SPPG88Q3B3G7JC05N1K',
 Taman: '01K9MD76G5GM0E6ADXKGAQ0ET6',
 Pagi: '01K8MH5JTEVHVPMEPH7SFTVYKT',
 Siang: '01K8MH4YJW6XCMSHRPRCPG1N2H',
 Sore: '01K8MGZ98VWNAYHFSCG28SW7W6',
 Malam: '01K8MGYM9GSK4QF0Q4R55HS3KN',
 Panjang: '01K9ME671GSDMWDP2K2P0AKP9W',
 Pendek: '01K9ME5C29MNH9BRMV47258QGT',
}
export function dictionarySignVideo(grade, word) {
 if (grade !== 'SD' || !Object.hasOwn(ids, word)) return null
 return {kind:'hosted', title:'Kamus BISINDO · Balai Bahasa Jawa Timur', url:`${base}${ids[word]}.mp4`, sourceUrl:'https://isyaratku.com/app/'}
}
