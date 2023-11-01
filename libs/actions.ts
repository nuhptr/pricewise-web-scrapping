"use server"

import { revalidatePath } from "next/cache"

import { connectToDB } from "./mongoose"
import { scrapeAmazonProduct } from "./scraper"

import { getAveragePrice, getHighestPrice, getLowestPrice } from "./utils"
import Product from "./product.model"

//? SCRAPED AND STORE IT TO MONGODB
export async function scrapeAndStoreProduct(productUrl: string) {
   if (!productUrl) return

   try {
      connectToDB()

      const scrapeProduct = await scrapeAmazonProduct(productUrl)
      if (!scrapeProduct) return

      let product = scrapeProduct

      const existingProduct = await Product.findOne({ url: scrapeProduct.url })
      if (existingProduct) {
         const updatePriceHistory: any = [...existingProduct.priceHistory, { price: scrapeProduct.currentPrice }]

         product = {
            ...scrapeProduct,
            priceHistory: updatePriceHistory,
            lowestPrice: getLowestPrice(updatePriceHistory),
            highestPrice: getHighestPrice(updatePriceHistory),
            averagePrice: getAveragePrice(updatePriceHistory),
         }
      }

      const newProduct = await Product.findOneAndUpdate({ url: scrapeProduct.url }, product, {
         upsert: true,
         new: true,
      })

      revalidatePath(`/products/${newProduct._id}`)
   } catch (error: any) {
      throw new Error(`Failed to create/update product: ${error}`)
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
