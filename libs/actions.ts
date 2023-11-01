"use server"

import { revalidatePath } from "next/cache"

import { connectToDB } from "./mongoose"
import { scrapeAmazonProduct } from "./scraper"

import Product from "./product.model"
import { getAveragePrice, getHighestPrice, getLowestPrice } from "./utils"
import { generateEmailBody, sendEmail } from "./nodemailer"

import { User } from "@/types"

//? SCRAPED AND STORE IT TO MONGODB
export async function scrapeAndStoreProduct(productUrl: string) {
   if (!productUrl) return

   try {
      connectToDB()
      const scrapedProduct = await scrapeAmazonProduct(productUrl)
      if (!scrapedProduct) return

      let product = scrapedProduct

      const existingProduct = await Product.findOne({ url: scrapedProduct.url })
      if (existingProduct) {
         const updatedPriceHistory: any = [...existingProduct.priceHistory, { price: scrapedProduct.currentPrice }]

         product = {
            ...scrapedProduct,
            priceHistory: updatedPriceHistory,
            lowestPrice: getLowestPrice(updatedPriceHistory),
            highestPrice: getHighestPrice(updatedPriceHistory),
            averagePrice: getAveragePrice(updatedPriceHistory),
         }
      }

      const newProduct = await Product.findOneAndUpdate({ url: scrapedProduct.url }, product, {
         upsert: true,
         new: true,
      })

      revalidatePath(`/products/${newProduct._id}`)
   } catch (error: any) {
      throw new Error(`Failed to create/update product: ${error.message}`)
   }
}

//? GET PRODUCT BY ID
export async function getProductById(productId: string) {
   try {
      connectToDB()
      const product = await Product.findOne({ _id: productId })
      if (!product) return null

      return product
   } catch (error: any) {
      console.error(error)
   }
}

//? GET ALL PRODUCTS
export async function getAllProducts() {
   try {
      connectToDB()
      const products = await Product.find()

      return products
   } catch (error) {
      console.error(error)
   }
}

//? GET SIMILAR PRODUCTS
export async function getSimilarProducts(productId: string) {
   try {
      connectToDB()
      const currentProduct = await Product.findById(productId)
      if (!currentProduct) return null

      const similarProducts = await Product.find({ _id: { $ne: productId } }).limit(3)

      return similarProducts
   } catch (error) {
      console.log(error)
   }
}

//? ADD USER EMAIL TO PRODUCTS
export async function addUserEmailToProduct(productId: string, userEmail: string) {
   try {
      connectToDB()
      const product = await Product.findById(productId)
      if (!product) return null

      const userExist = product.users.some((user: User) => user.email === userEmail)

      if (!userExist) {
         product.users.push({ email: userEmail })

         await product.save()

         const emailContent = generateEmailBody(product, "WELCOME")
         await sendEmail(emailContent, [userEmail])
      }
   } catch (error) {
      console.error(error)
   }
}
