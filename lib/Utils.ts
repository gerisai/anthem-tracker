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