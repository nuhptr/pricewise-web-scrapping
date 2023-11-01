import mongoose from "mongoose"

let isConnected = false // Variable to track connection status

//? CONNECT TO MONGODB
export const connectToDB = async () => {
   mongoose.set("strictQuery", true)

   if (!process.env.MONGODB_URI) return console.log("No MongoDB URI provided")
   if (isConnected) return console.log("=> Using existing database connection")

   try {
      await mongoose.connect(process.env.MONGODB_URI)
      isConnected = true
      console.log("=> MongoDB connection established")
   } catch (error: any) {
      console.log("=> MongoDB connection error:", error.message)
   }
}
