import Image from "next/image"
import Link from "next/link"

import { Product } from "@/types"

interface Props {
   product: Product
}

export default function ProductCard({ product }: Props): React.JSX.Element {
   return (
      <Link href={`/products/${product._id}`} className="product-card">
         <div className="product-card_img-container">
            <Image src={product.image} alt={product.title} width={200} height={200} className="product-card_img" />
         </div>

         <div className="flex flex-col gap-3">
            <h3 className="product-title">{product.title}</h3>

            <div className="flex justify-between">
               <p className="text-lg text-black capitalize opacity-50">{product.category}</p>
               <p className="text-lg font-semibold text-black">
                  <span>{product?.currency}</span>
                  <span>{product?.currentPrice}</span>
               </p>
            </div>
         </div>
      </Link>
   )
}
