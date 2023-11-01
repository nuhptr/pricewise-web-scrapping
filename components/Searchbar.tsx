"use client"

import { FormEvent, useState } from "react"

import { scrapeAndStoreProduct } from "@/libs/actions"

const isValidAmazonProduct = (url: string) => {
   try {
      const parsedURL = new URL(url)
      const hostName = parsedURL.hostname

      // CHECK IF HOSTNAME CONTAINS AMAZON.COM OR AMAZON
      if (hostName.includes("amazon.com") || hostName.includes("amazon.") || hostName.endsWith("amazon")) {
         return true
      }
   } catch (error) {
      console.error(error)
   }
}

export default function Searchbar(): React.JSX.Element {
   const [searchPrompt, setSearchPrompt] = useState<string>("")
   const [isLoading, setIsLoading] = useState<boolean>(false)

   const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault()

      const isValidLink = isValidAmazonProduct(searchPrompt)
      if (!isValidLink) return alert("Please enter a valid Amazon product link")

      try {
         setIsLoading(true)

         // SCRAPE PRODUCT PAGE
         const product = await scrapeAndStoreProduct(searchPrompt)
         console.log(product)

         setIsLoading(false)
         // setSearchPrompt("")
      } catch (error) {
         setIsLoading(false)
      }
   }

   return (
      <form className="flex flex-wrap gap-4 mt-12" onSubmit={handleSubmit}>
         <input
            type="text"
            value={searchPrompt}
            onChange={(event) => setSearchPrompt(event.target.value)}
            placeholder="Enter product link"
            className="searchbar-input"
         />

         <button type="submit" disabled={searchPrompt === ""} className="searchbar-btn">
            {isLoading ? "Searching..." : "Search"}
         </button>
      </form>
   )
}
