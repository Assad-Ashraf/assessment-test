import './globals.css'
import { Toaster } from "@/components/ui/toaster"  // Changed

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        {children}
        <Toaster />  {/* Much cleaner! */}
      </body>
    </html>
  )
}