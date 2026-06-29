import './globals.css'

export const metadata = {
  title: 'Gadditrust - Seller Portal',
  description: 'Second-hand vehicle marketplace seller platform',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  )
}
