import { PriceHistoryItem, Product } from "@/types"

const Notification = {
   WELCOME: "WELCOME",
   CHANGE_OF_STOCK: "CHANGE_OF_STOCK",
   LOWEST_PRICE: "LOWEST_PRICE",
   THRESHOLD_MET: "THRESHOLD_MET",
}

const THRESHOLD_PERCENTAGE = 40

//? EXTRACT AND RETURN PRICE FROM AMAZON
export function extractPrice(...elements: any) {
   for (const element of elements) {
      const priceText = element.text().trim()

      if (priceText) {
         const cleanPrice = priceText.replace(/[^\d.]/g, "")

         let firstPrice
         if (cleanPrice) firstPrice = cleanPrice.match(/\d+\.\d{2}/)?.[0]

         return firstPrice || cleanPrice
      }
   }

   return ""
}

//? EXTRACT CURRENCY FROM AMAZON
export function extractCurrency(element: any) {
   const currencyText = element.text().trim().slice(0, 1)
   return currencyText || ""
}

//? EXTRACTS DESCRIPTION FROM TWO POSSIBLE ELEMENTS FROM AMAZON
export function extractDescription($: any) {
   // these are possible elements holding description of the product
   const selectors = [
      ".a-unordered-list .a-list-item",
      ".a-expander-content p",
      // Add more selectors here if needed
   ]

   for (const selector of selectors) {
      const elements = $(selector)
      if (elements.length > 0) {
         const textContent = elements
            .map((_: any, element: any) => $(element).text().trim())
            .get()
            .join("\n")
         return textContent
      }
   }

   // If no matching elements were found, return an empty string
   return ""
}

//? RETURN HIGHEST PRICE OF A PRODUCT
export function getHighestPrice(priceList: PriceHistoryItem[]) {
   let highestPrice = priceList[0]

   for (const element of priceList) {
      if (element.price > highestPrice.price) highestPrice = element
   }

   return highestPrice.price
}

//? RETURN LOWEST PRICE OF A PRODUCT
export function getLowestPrice(priceList: PriceHistoryItem[]) {
   let lowestPrice = priceList[0]

   for (const element of priceList) {
      if (element.price < lowestPrice.price) lowestPrice = element
   }

   return lowestPrice.price
}

//? RETURN AVERAGE PRICE OF A PRODUCT
export function getAveragePrice(priceList: PriceHistoryItem[]) {
   const sumOfPrices = priceList.reduce((acc, curr) => acc + curr.price, 0)
   const averagePrice = sumOfPrices / priceList.length || 0

   return averagePrice
}

//? GET EMAIL NOTIFICATION TYPE
export const getEmailNotifType = (scrapedProduct: Product, currentProduct: Product) => {
   const lowestPrice = getLowestPrice(currentProduct.priceHistory)

   if (scrapedProduct.currentPrice < lowestPrice) {
      return Notification.LOWEST_PRICE as keyof typeof Notification
   }
   if (!scrapedProduct.isOutOfStock && currentProduct.isOutOfStock) {
      return Notification.CHANGE_OF_STOCK as keyof typeof Notification
   }
   if (scrapedProduct.discountRate >= THRESHOLD_PERCENTAGE) {
      return Notification.THRESHOLD_MET as keyof typeof Notification
   }

   return null
}

//? FORMAT NUMBER
export const formatNumber = (num: number = 0) => {
   return num.toLocaleString(undefined, {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
   })
}
