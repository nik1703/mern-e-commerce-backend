import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import connectDB from './database/connectDB.js'
import productRouter from './routes/productRoutes.js'
import userRouter from './routes/userRoutes.js'
import errorHandlerMiddleware from './middleware/errorHandlerMiddleware.js'
// import notFoundMiddleware from './middleware/notFoundMiddleware.js'
import 'dotenv/config'
import reviewRouter from './routes/reviewRoutes.js'
import cartRouter from './routes/cartRoutes.js'
import orderRouter from './routes/orderRoutes.js'

const app = express()
const PORT = process.env.PORT || 5050
app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    optionsSuccessStatus: 200,
    credentials: true,
  })
)
app.use(cookieParser())
app.use(express.json({ limit: '30mb' }))
app.use(express.urlencoded({ limit: '30mb', extended: true }))
app.use('/products', productRouter)
app.use('/user', userRouter)
app.use('/reviews', reviewRouter)
app.use('/cart', cartRouter)
app.use('/orders', orderRouter)
app.use(errorHandlerMiddleware)
// app.use(notFoundMiddleware)

app.get('/', (req, res) => {
  res.send('API is running...')
})

// if route not found
app.use('*', (req, res) => {
  res.status(404).json({
    success: 'false',
    message: 'Page not found',
    error: {
      statusCode: 404,
      message: 'You reached a route that is not defined on this server',
    },
  })
})

const startServer = async () => {
  try {
    await connectDB(process.env.MONGO_URL)
    console.log('verbindung mit MONGODB hat geklappt!')
    //
    app.listen(PORT, () => {
      console.log(`Port läuft auf Port: ${PORT}`)
    })
  } catch (error) {
    console.log(error)
  }
}

startServer()
