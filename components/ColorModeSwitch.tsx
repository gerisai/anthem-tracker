'use client'

import { Switch } from '@chakra-ui/react'
import { useTheme } from 'next-themes'
import { useSyncExternalStore } from 'react'
import { BiMoon, BiSun } from 'react-icons/bi'

const noop = () => () => {}

// The saved mode is only known in the browser, so render the switch unchecked
// on the server and the first client render, then show the real state
function useMounted() {
  return useSyncExternalStore(noop, () => true, () => false)
}

// Light/dark toggle; next-themes saves the choice in localStorage
export function ColorModeSwitch() {
  const { resolvedTheme, setTheme } = useTheme()
  const mounted = useMounted()
  const dark = mounted && resolvedTheme === 'dark'

  return (
    <Switch.Root
      size='lg'
      colorPalette='teal'
      checked={dark}
      disabled={!mounted}
      onCheckedChange={({ checked }) => setTheme(checked ? 'dark' : 'light')}
      aria-label='Modo oscuro'
      title={dark ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
    >
      <Switch.HiddenInput/>
      <Switch.Control bg='surface.track' _checked={{ bg: 'colorPalette.solid' }}>
        <Switch.Thumb>
          <Switch.ThumbIndicator fallback={<BiSun color='orange'/>}>
            <BiMoon color='black'/>
          </Switch.ThumbIndicator>
        </Switch.Thumb>
      </Switch.Control>
    </Switch.Root>
  )
}
