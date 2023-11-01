import React from "react"
import Image from "next/image"
import Link from "next/link"
import { redirect } from "next/navigation"

import { Product } from "@/types"
import { getProductById, getSimilarProducts } from "@/libs/actions"
import { formatNumber } from "@/libs/utils"

import PriceInfoCard from "@/components/PriceInfoCard"
import ProductCard from "@/components/ProductCard"
import Modal from "@/components/Modal"

type Props = {
   params: { id: string }
}

const ProductsDetails = async ({ params: { id } }: Props) => {
   const product: Product = await getProductById(id)
   if (!product) redirect("/")

   const similarProduct = await getSimilarProducts(id)

   return (
      <div className="product-container">
         <div className="flex flex-col gap-28 xl:flex-row">
            {/* LEFT SIDE */}
            <div className="product-image">
               <Image src={product.image} alt={product.title} width={580} height={400} className="mx-auto" />
            </div>

            {/* RIGHT SIDE */}
            <div className="flex flex-col flex-1">
               <div className="flex flex-wrap items-start justify-between gap-5 pb-6">
                  <div className="flex flex-col gap-3">
                     <p className="text-[28px] text-secondary font-semibold leading-relaxed">{product.title}</p>

                     <Link href={product.url} target="_parent" className="text-base text-black opacity-50">
                        Visit link -&gt;
                     </Link>
                  </div>

                  <div className="flex items-center gap-3">
                     <div className="product-hearts">
                        <Image src="/icons/red-heart.svg" alt="Icon Hearth" width={20} height={20} />
                        <p className="text-base font-semibold text-[#D46F77]">{product.reviewsCount}</p>
                     </div>

                     <div className="p-2 bg-white-200 rounded-10">
                        <Image src="/icons/bookmark.svg" alt="Icon Bookmark" width={20} height={20} />
                     </div>

                     <div className="p-2 bg-white-200 rounded-10">
                        <Image src="/icons/share.svg" alt="Icon Share" width={20} height={20} />
                     </div>
                  </div>
               </div>

               <div className="product-info">
                  <div className="flex flex-col gap-2">
                     <p className="text-[34px] text-secondary font-bold">
                        {product.currency} {formatNumber(product.currentPrice)}
                     </p>

                     <p className="text-[21px] text-black opacity-50 line-through">
                        {product.currency} {formatNumber(product.originalPrice)}
                     </p>
                  </div>

                  <div className="flex flex-col gap-4">
                     <div className="flex gap-3">
                        <div className="product-stars">
                           <Image src="/icons/star.svg" alt="Icon Star" width={16} height={16} />
                           <p className="text-sm font-semibold text-primary-orange">{product.stars || "25"}</p>
                        </div>

                        <div className="product-reviews">
                           <Image src="/icons/comment.svg" alt="Icon Comment" width={16} height={16} />
                           <p className="text-sm font-semibold text-secondary">{product.reviewsCount} Reviews</p>
                        </div>
                     </div>

                     <p className="text-sm text-black opacity-50">
                        <span className="font-semibold text-primary-green">93% </span> of buyers have recommended this.
                     </p>
                  </div>
               </div>

               <div className="flex flex-col gap-5 my-7">
                  <div className="flex flex-wrap gap-5">
                     <PriceInfoCard
                        title="Current Price"
                        iconSrc="/icons/price-tag.svg"
                        value={`${product.currency} ${formatNumber(product.currentPrice)}`}
                     />
                     <PriceInfoCard
                        title="Average Price"
                        iconSrc="/icons/chart.svg"
                        value={`${product.currency} ${formatNumber(product.averagePrice)}`}
                     />
                     <PriceInfoCard
                        title="Highest Price"
                        iconSrc="/icons/arrow-up.svg"
                        value={`${product.currency} ${formatNumber(product.highestPrice)}`}
                     />
                     <PriceInfoCard
                        title="Lowest Price"
                        iconSrc="/icons/arrow-down.svg"
                        value={`${product.currency} ${formatNumber(product.lowestPrice)}`}
                     />
                  </div>
               </div>

               {/* MODAL FOR OPENING SENDING EMAIL SUBSCRIBE */}
               <Modal productId={id} />
            </div>
         </div>

         <div className="flex flex-col gap-16">
            <div className="flex flex-col gap-5">
               <h1 className="text-2xl font-semibold text-secondary">Product Description</h1>
               <div className="flex flex-col gap-4 leading-relaxed">{product?.description?.split("\n")}</div>
            </div>

            <button className="btn w-fit mx-auto flex items-center justify-center gap-3 min-w-[200px]">
               <Image src="/icons/bag.svg" alt="Icon Bag" width={22} height={22} />
               <Link href="/" className="text-base text-white">
                  Buy Now
               </Link>
            </button>
         </div>

         {similarProduct && similarProduct?.length > 0 && (
            <div className="flex flex-col w-full gap-2 py-14">
               <p className="section-text">Similar Product</p>

               <div className="flex flex-wrap w-full gap-10 mt-7">
                  {similarProduct.map((product) => (
                     <ProductCard key={product._id} product={product} />
                  ))}
               </div>
            </div>
         )}
      </div>
   )
}

export default ProductsDetails
