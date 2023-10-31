import Image from "next/image"
import Link from "next/link"
import React from "react"

const navIcons = [
   { src: "/icons/search.svg", alt: "search" },
   { src: "/icons/black-heart.svg", alt: "black-heart" },
   { src: "/icons/user.svg", alt: "user" },
]

export default function Navbar(): React.JSX.Element {
   return (
      <header className="w-full">
         <nav className="nav">
            <Link href="/" className="flex items-center gap-1">
               <Image src="/icons/logo.svg" alt="Pricewise Logo" width={27} height={27} />

               <p className="nav-logo">
                  Price<span className="text-primary">wise</span>
               </p>
            </Link>

            <div className="flex items-center gap-6">
               {navIcons.map((icon) => (
                  <Image
                     key={icon.alt}
                     src={icon.src}
                     alt={icon.alt}
                     width={28}
                     height={28}
                     className="object-contain"
                  />
               ))}
            </div>
         </nav>
      </header>
   )
}
