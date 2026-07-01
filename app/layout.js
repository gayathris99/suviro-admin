import './globals.css'

export const metadata = {
  title: 'Suviro Admin',
  description: 'Suviro Pharmalife admin portal',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}