import { createSystem, defaultConfig } from '@chakra-ui/react'

// The app is dark-only: app/layout.tsx puts className="dark" on <html>, which
// turns on Chakra's dark semantic tokens without next-themes or a toggle
export const system = createSystem(defaultConfig, {
  theme: {
    semanticTokens: {
      colors: {
        // The page background is gray.800, which is v3's dark border color, so
        // separators and input underlines vanished. v2 used whiteAlpha.300.
        border: {
          DEFAULT: { value: { _light: '{colors.gray.200}', _dark: '{colors.whiteAlpha.300}' } },
        },
      },
    },
    recipes: {
      // v2's default heading size; v3's default (xl) is much smaller
      heading: { defaultVariants: { size: '3xl' } },
    },
  },
  globalCss: {
    body: {
      bg: 'gray.800',
    },
  },
})
