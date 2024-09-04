import mongoose from 'mongoose'

const connectDB = async (URL) => {
  return mongoose.connect(URL)
}

export default connectDB
