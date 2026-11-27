'use client'

import createCache from '@emotion/cache'
import { CacheProvider } from '@emotion/react'
import { ChakraProvider } from '@chakra-ui/react'
import { SessionProvider } from 'next-auth/react';
import { ThemeProvider } from 'next-themes'
import { useServerInsertedHTML } from 'next/navigation'
import { useState } from 'react'
import { Toaster } from '@/components/ui/toaster'
import { ColorModeButton } from '@/components/ColorModeButton'
import { system } from './theme'

// Emotion cache for the App Router: styles rendered on the server are collected
// and flushed into the HTML stream instead of being inlined next to elements,
// which React 19 reports as a hydration mismatch
function EmotionCacheProvider({ children }: { children: React.ReactNode }) {
  const [cache] = useState(() => {
    const cache = createCache({ key: 'css', prepend: true });
    cache.compat = true;
    return cache;
  });

  useServerInsertedHTML(() => (
    <style
      data-emotion={`${cache.key} ${Object.keys(cache.inserted).join(' ')}`}
      dangerouslySetInnerHTML={{ __html: Object.values(cache.inserted).join(' ') }}
    />
  ));

  return <CacheProvider value={cache}>{children}</CacheProvider>;
}

export function Providers({
    children
  }: {
  children: React.ReactNode
  }) {
  return (
    <SessionProvider>
      <EmotionCacheProvider>
        <ChakraProvider value={system}>
          {/* Puts "light"/"dark" on <html> (Chakra's _light/_dark tokens) and sets
              color-scheme for native controls. Dark by default, as the app was
              dark-only; ColorModeButton saves the choice in localStorage. */}
          <ThemeProvider attribute='class' defaultTheme='dark' enableSystem={false} disableTransitionOnChange>
            {children}
            <Toaster/>
            <ColorModeButton/>
          </ThemeProvider>
        </ChakraProvider>
      </EmotionCacheProvider>
    </SessionProvider>
  )
}
