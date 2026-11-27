// The app's mark ("Programa"): three bars for the three services of a program
// (Recibimiento, Matutino, Vespertino) and a note, white on teal. No hooks or
// Chakra, so server code can render it too (app/apple-icon.tsx).
//
// Two drawings: `full` (three thin bars) for 48px and up, `small` (two thick
// bars, heavier note) below that, where thin bars blur together. app/icon.svg
// (the favicon) is the `small` drawing, kept in sync by hand.

export const LOGO_TEAL = '#0d9488'; // Chakra teal.600

const FULL = (
    <>
        <rect x="11" y="17" width="25" height="5" rx="2.5" fill="#fff"/>
        <rect x="11" y="29" width="25" height="5" rx="2.5" fill="#fff"/>
        <rect x="11" y="41" width="16" height="5" rx="2.5" fill="#fff"/>
        <ellipse cx="42.5" cy="45" rx="6.5" ry="5" transform="rotate(-20 42.5 45)" fill="#fff"/>
        <rect x="46.5" y="15" width="3.5" height="30" rx="1.5" fill="#fff"/>
        <path d="M50 15c0 6 8 8 8 15 0 2-.6 4-1.6 5.5.4-6-6.4-8-6.4-11z" fill="#fff"/>
    </>
);

const SMALL = (
    <>
        <rect x="10" y="17" width="26" height="8" rx="4" fill="#fff"/>
        <rect x="10" y="33" width="18" height="8" rx="4" fill="#fff"/>
        <ellipse cx="42" cy="46" rx="8" ry="6.5" transform="rotate(-20 42 46)" fill="#fff"/>
        <rect x="45.5" y="12" width="5" height="34" rx="2" fill="#fff"/>
        <path d="M50 12c0 7 9 9 9 17-1-6-9-8-9-11z" fill="#fff"/>
    </>
);

// `square` drops the rounded corners (iOS rounds the home-screen icon itself).
// Decorative by default; pass `title` when the mark stands alone.
export function LogoMark({ size = 32, square = false, title }: { size?: number, square?: boolean, title?: string }) {
    return (
        <svg width={size} height={size} viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg"
        role={title ? 'img' : undefined} aria-hidden={title ? undefined : true} style={{ flexShrink: 0, display: 'block' }}>
            {title && <title>{title}</title>}
            <rect width="64" height="64" rx={square ? 0 : 14} fill={LOGO_TEAL}/>
            {size >= 48 ? FULL : SMALL}
        </svg>
    );
}
