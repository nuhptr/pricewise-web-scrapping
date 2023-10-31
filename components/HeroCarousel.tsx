"use client"

import Image from "next/image"
import { Carousel } from "react-responsive-carousel"
import "react-responsive-carousel/lib/styles/carousel.min.css"

const heroImage = [
   { imgURL: "/images/hero-1.svg", alt: "Smartwatch" },
   { imgURL: "/images/hero-2.svg", alt: "Bag" },
   { imgURL: "/images/hero-3.svg", alt: "Lamp" },
   { imgURL: "/images/hero-4.svg", alt: "Air Fryer" },
   { imgURL: "/images/hero-5.svg", alt: "Chair" },
]

export default function HeroCarousel(): React.JSX.Element {
   return (
      <div className="hero-carousel">
         <Carousel
            showIndicators={false}
            showThumbs={false}
            autoPlay
            infiniteLoop
            // interval={2000}
            showArrows={false}
            showStatus={false}>
            {heroImage.map((image) => (
               <Image
                  key={image.alt}
                  src={image.imgURL}
                  alt={image.alt}
                  priority
                  width={484}
                  height={484}
                  className="object-contain"
               />
            ))}
         </Carousel>

         <Image
            src="/icons/hand-drawn-arrow.svg"
            alt="Hand Drawn Arrow"
            width={175}
            height={175}
            className="absolute bottom-0 z-0 max-xl:hidden -left-[15%]"
         />
      </div>
   )
}
