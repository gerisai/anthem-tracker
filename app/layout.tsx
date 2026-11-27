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
    // Dark-only app: "dark" turns on Chakra's dark tokens, colorScheme makes
    // native controls (date picker, scrollbars) dark too
    <html lang="en" className="dark" style={{ colorScheme: 'dark' }}>
      <body>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  )
}
