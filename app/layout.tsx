import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'FlexLiving Reviews Dashboard',
  description: 'Manage and display property reviews',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}