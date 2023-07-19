import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { Providers } from "./providers"

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Anthem Tracker',
  description: 'Track usage for anthems',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
      <Providers>
          {children}
        </Providers>
      </body>
    </html>
  )
}
