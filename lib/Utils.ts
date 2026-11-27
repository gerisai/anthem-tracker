export const repeatColors: any = {
    0: 'teal',
    1: 'yellow'
}

export const sortFns: any = {
    himno: (a: any, b: any) => Number(a.number) - Number(b.number), // numerical
    salmo: (a: any, b: any) => Number(a.name.match(/\d+/)[0]) - Number(b.name.match(/\d+/)[0]), // numerical from the name
    canto: (a: any, b: any) => a.name > b.name ? 1 : -1 // alphabetical
}

export const monthsToNames: any = {
    0: 'Enero',
    1: 'Febrero',
    2: 'Marzo',
    3: 'Abril',
    4: 'Mayo',
    5: 'Junio',
    6: 'Julio',
    7: 'Agosto',
    8: 'Septiembre',
    9: 'Octubre',
    10: 'Noviembre',
    11: 'Diciembre'
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

// Builds the /api/fullprogram payload for each program: song ids and their order by name
export function toProgramInputs(programs: any) {
    return Object.values(programs).map((p: any) => ({
        type: p.type,
        songs: p.songs.map((s: any) => ({ id: s.id })),
        order: p.songs.reduce((a: any, s: any, i: number) => ({ ...a, [s.name]: i + 1 }), {})
    }));
}

// Dates within the last 30 days of `now`; drives the usage colors in SongList
export const RECENT_WINDOW_MS = 30 * 24 * 60 * 60 * 1000;

export function recentDates(dates: Date[], now: number) {
    return dates.filter((d) => d.getTime() > now - RECENT_WINDOW_MS);
}

// Groups services by month, oldest first. Uses UTC, like the stored dates
// (UTC midnight) and parseDate, so the month never shifts with the time zone.
export function groupByMonth<T extends { date: Date | string }>(programs: T[]) {
    const sorted = [...programs].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    const groups: { key: string, label: string, year: number, month: string, programs: T[] }[] = [];

    for (const program of sorted) {
        const d = new Date(program.date);
        const key = `${d.getUTCFullYear()}-${d.getUTCMonth()}`;
        const last = groups[groups.length - 1];

        if (last && last.key === key) {
            last.programs.push(program);
        } else {
            const month = monthsToNames[d.getUTCMonth()];
            groups.push({ key, label: `${month} ${d.getUTCFullYear()}`, year: d.getUTCFullYear(), month, programs: [program] });
        }
    }

    return groups;
}

// Groups services by year, then month (groupByMonth), for the history page:
// newest year first; months inside a year and services inside a month go in
// calendar order (January first, oldest first).
export function groupByYear<T extends { date: Date | string }>(programs: T[]) {
    const years: { year: number, count: number, months: ReturnType<typeof groupByMonth<T>> }[] = [];

    for (const month of groupByMonth(programs)) {
        const last = years[years.length - 1];

        if (last && last.year === month.year) {
            last.months.push(month);
            last.count += month.programs.length;
        } else {
            years.push({ year: month.year, count: month.programs.length, months: [month] });
        }
    }

    return years.reverse();
}
