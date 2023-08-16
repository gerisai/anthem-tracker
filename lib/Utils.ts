export const repeatColors: any = {
    0: 'teal',
    1: 'yellow'
}

export const sortFns: any = {
    himno: (a: any, b: any) => Number(a.number) - Number(b.number), // numerical
    salmo: (a: any, b: any) => Number(a.name.match(/\d+/)[0]) - Number(b.name.match(/\d+/)[0]), // numerical from the name
    canto: (a: any, b: any) => a.name > b.name ? 1 : -1 // alphabetical
}

export const parseDate = (d: any) => {
    const D = d.toISOString().split('T')[0].split('-').reverse().join('-');
    return D
}
  
export const parseDateISO = (d: any) => {
    const D = d.toISOString().split('T')[0];
    return D
}

export const emoji: any = {
    0: '0️⃣',
    1: '1️⃣',
    2: '2️⃣',
    3: '3️⃣',
    4: '4️⃣',
    5: '5️⃣',
    6: '6️⃣',
    7: '7️⃣',
    8: '8️⃣',
    9: '9️⃣'
}

export function numberToEmoji(i: number) {
    return i.toString().split('').map((i) => emoji[i]).join('')
}