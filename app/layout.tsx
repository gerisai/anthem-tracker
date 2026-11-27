import type { Metadata } from 'next'
import { Providers } from './providers'

export const metadata: Metadata = {
  title: 'Programación de Cantos',
  description: 'Registro de cantos',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    // next-themes sets the "light"/"dark" class and color-scheme on <html>
    // before hydration, so React must not warn about them
    <html lang="en" suppressHydrationWarning>
      <body>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  )
}
