import { NextResponse } from "next/server"

import Product from "@/libs/product.model"
import { connectToDB } from "@/libs/mongoose"
import { scrapeAmazonProduct } from "@/libs/scraper"
import { getAveragePrice, getEmailNotifType, getHighestPrice, getLowestPrice } from "@/libs/utils"
import { generateEmailBody, sendEmail } from "@/libs/nodemailer"

export const maxDuration = 300 // This function can run for a maximum of 300 seconds
export const dynamic = "force-dynamic"
export const revalidate = 0

export async function GET() {
   try {
      connectToDB()

      const products = await Product.find({})
      if (!products) throw new Error("No products found.")

      //? 1. SCRAPE LATEST PRODUCT DETAILS & PRODUCT DB
      const updatedProducts = await Promise.all(
         products.map(async (currentProduct) => {
            const scrapedProduct = await scrapeAmazonProduct(currentProduct.url)
            if (!scrapedProduct) throw new Error("No Product found")

            const updatedPriceHistory = [...currentProduct.priceHistory, { price: scrapedProduct.currentPrice }]

            const product = {
               ...scrapedProduct,
               priceHistory: updatedPriceHistory,
               lowestPrice: getLowestPrice(updatedPriceHistory),
               highestPrice: getHighestPrice(updatedPriceHistory),
               averagePrice: getAveragePrice(updatedPriceHistory),
            }

            //? UPDATED PRODUCT IN DB
            const updatedProduct = await Product.findOneAndUpdate({ url: product.url }, product)

            //? 2 CHECK EACH PRODUCT'S STATUS & SEND EMAIL ACCORDINGLY
            const emailNotifType = getEmailNotifType(scrapedProduct, currentProduct)

            if (emailNotifType && updatedProduct.users.length > 0) {
               const productInfo = { title: updatedProduct.title, url: updatedProduct.url }
               // Construct emailContent
               const emailContent = await generateEmailBody(productInfo, emailNotifType)
               // Get array of user emails
               const userEmails = updatedProduct.users.map((user: any) => user.email)
               // Send email notification
               await sendEmail(emailContent, userEmails)
            }

            return updatedProduct
         })
      )

      return NextResponse.json({ message: "Ok", data: updatedProducts, maxDuration: 10 })
   } catch (error: any) {
      throw new Error(`Failed to get all products: ${error.message}`)
   }
}
