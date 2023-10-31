import axios from "axios"
import * as cheerio from "cheerio"

import { extractCurrency, extractPrice } from "../utils"

export async function scrapeAmazonProduct(url: string) {
   if (!url) return

   // curl --proxy brd.superproxy.io:22225 --proxy-user brd-customer-hL_5dd3b64f-zone-pricewise:9dj54pd60xkc -k https://lumtest.com/myip.json

   // BRIGHT DATA PROXY CONFIGURATION
   const username = String(process.env.BRIGHT_DATA_USERNAME)
   const password = String(process.env.BRIGHT_DATA_PASSWORD)
   const port = 22225
   const session_id = (1000000 * Math.random()) | 0

   const options = {
      auth: { username: `${username}-session-${session_id}`, password },
      host: "brd.superproxy.io",
      port,
      rejectUnauthorized: false,
   }

   try {
      // FETCH THE PRODUCT PAGE
      const response = await axios.get(url, options)
      const $ = cheerio.load(response.data)

      // EXTRACT THE PRODUCT TITLE
      //? MAIN CORE WHEN SCRAPING
      const title = $("#productTitle").text().trim()
      const currentPrice = extractPrice(
         $(".priceToPay span.a-price-whole"),
         $("a.size.base.a-color-price"),
         $(".a-button-selected .a-color-base"),
         $(".a-price.a-text-price")
      )

      const originalPrice = extractPrice(
         $("#priceblock_ourprice"),
         $(".a-price.a-text-price span.a-offscreen"),
         $("#listPrice"),
         $("#priceblock_dealprice"),
         $(".a-size-base.a.color-price")
      )

      const outOfStock = $("#availability span").text().trim() === "Currently unavailable."

      const image =
         $("#imgBlkFront").attr("data-a-dynamic-image") || $("#landingImage").attr("data-a-dynamic-image") || "{}"
      const imageUrls = Object.keys(JSON.parse(image))

      const currency = extractCurrency($(".a-price-symbol"))
      const discountRate = $(".savingsPercentage").text().replace(/[-%]/g, "")

      const data = {
         url,
         currency: currency || "$",
         image: imageUrls[0],
         title: title,
         currentPrice: Number(currentPrice),
         originalPrice: Number(originalPrice),
         priceHistory: [],
         discountRate: Number(discountRate),
         category: "category",
         reviewsCount: 100,
         stars: 4.5,
         isOutOfStock: outOfStock,
      }

      console.log(data)
   } catch (error: any) {
      throw new Error(`Failed to scrape product: ${error.message}`)
   }
}
