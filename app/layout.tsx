import type { Metadata } from 'next'
import './globals.css'
import { Toaster } from 'sonner'

export const metadata: Metadata = {
  title: 'Emma Frey — Digital Products & Resources',
  description:
    'Helping women build income online — one digital product at a time. Browse courses, guides, and resources.',
  openGraph: {
    title: 'Emma Frey — Digital Products & Resources',
    description: 'Helping women build income online — one digital product at a time.',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;1,9..40,400&family=DM+Mono:wght@400;500&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="antialiased">
        {children}
        <Toaster
          position="bottom-center"
          toastOptions={{
            style: {
              background: '#FDF7F2',
              border: '1px solid #EDD9CB',
              color: '#3A2A30',
              borderRadius: '12px',
            },
          }}
        />
      </body>
    </html>
  )
}
