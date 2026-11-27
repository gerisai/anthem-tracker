import { ImageResponse } from 'next/og';
import { LogoMark } from '@/components/Logo';

// iOS home-screen icon (Next's apple-icon file convention), rendered to PNG at
// build time. Square corners: iOS applies its own mask.
export const size = { width: 180, height: 180 };
export const contentType = 'image/png';

export default function AppleIcon() {
    return new ImageResponse(<LogoMark size={180} square/>, size);
}
