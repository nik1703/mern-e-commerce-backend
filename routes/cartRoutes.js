import express from 'express'
import { addToCart, getCart } from '../controllers/cartControllers.js'

const cartRouter = express.Router()

cartRouter.post('/add-to-cart', addToCart)
cartRouter.get('/:userId', getCart)

export default cartRouter