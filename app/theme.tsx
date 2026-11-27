import { createSystem, defaultConfig } from '@chakra-ui/react'

// Light and dark mode: next-themes (app/providers.tsx) puts "light" or "dark"
// on <html>, which picks the _light or _dark value of each semantic token.
// Use these tokens instead of fixed gray.X / white so both modes work.
export const system = createSystem(defaultConfig, {
  theme: {
    semanticTokens: {
      colors: {
        // The dark page background is gray.800, which is v3's dark border color,
        // so separators and input underlines vanished. v2 used whiteAlpha.300.
        border: {
          DEFAULT: { value: { _light: '{colors.gray.300}', _dark: '{colors.whiteAlpha.300}' } },
        },
        // Page background (body)
        page: {
          value: { _light: '{colors.gray.100}', _dark: '{colors.gray.800}' },
        },
        // Raised boxes on the page: nav bar, program sections, menus, drawers
        surface: {
          DEFAULT: { value: { _light: '{colors.white}', _dark: '{colors.gray.700}' } },
          hover: { value: { _light: '{colors.gray.100}', _dark: '{colors.gray.600}' } },
          // Unchecked switch track; Chakra's default matches the dark page background
          track: { value: { _light: '{colors.gray.300}', _dark: '{colors.gray.600}' } },
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
      bg: 'page',
      color: 'fg',
    },
  },
})
