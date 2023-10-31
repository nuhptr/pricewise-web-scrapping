import type { Metadata } from "next"
import { Inter, Space_Grotesk } from "next/font/google"

import "./globals.css"

import Navbar from "@/components/Navbar"

const inter = Inter({ subsets: ["latin"] })
const spaceGrotesk = Space_Grotesk({
   subsets: ["latin"],
   weight: ["300", "400", "500", "600", "700"],
})

export const metadata: Metadata = {
   title: "Pricewise | Track prices of your favorite products",
   description: "Track prices of your favorite products",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
   return (
      <html lang="en">
         <body className={inter.className} suppressHydrationWarning>
            <main className="mx-auto max-w-10xl">
               <Navbar />
               {children}
            </main>
         </body>
      </html>
   )
}
