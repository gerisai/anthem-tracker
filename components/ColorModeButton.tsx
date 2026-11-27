'use client'

import { IconButton } from '@chakra-ui/react'
import { useTheme } from 'next-themes'
import { useSyncExternalStore } from 'react'
import { BiMoon, BiSun } from 'react-icons/bi'

const noop = () => () => {}

// The saved mode is only known in the browser, so the server and the first
// client render show a neutral button, then the real icon
function useMounted() {
  return useSyncExternalStore(noop, () => true, () => false)
}

// Floating light/dark toggle in the bottom-right corner of every page (rendered
// once in app/providers.tsx); next-themes saves the choice in localStorage
export function ColorModeButton() {
  const { resolvedTheme, setTheme } = useTheme()
  const mounted = useMounted()
  // Gated on `mounted` so the first client render matches the server's (React
  // keeps server-rendered attributes like aria-label on hydration)
  const dark = mounted && resolvedTheme === 'dark'
  const label = dark ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'

  return (
    <IconButton
      position='fixed'
      bottom='calc(1rem + env(safe-area-inset-bottom))'
      right='calc(1rem + env(safe-area-inset-right))'
      zIndex='sticky'
      size={{ base: 'lg', md: 'xl' }}
      rounded='full'
      shadow='lg'
      variant='solid'
      colorPalette={dark ? 'yellow' : 'gray'}
      disabled={!mounted}
      onClick={() => setTheme(dark ? 'light' : 'dark')}
      aria-label={label}
      title={label}
    >
      {mounted && (dark ? <BiSun/> : <BiMoon/>)}
    </IconButton>
  )
}
