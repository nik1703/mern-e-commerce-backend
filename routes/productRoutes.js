import express from 'express'
import {
  createProduct,
  getProducts,
  deleteProduct,
  getProductById,
  updateProduct,
  softDeleteProduct,
} from '../controllers/productControllers.js'

const productRouter = express.Router()

productRouter.get('/', getProducts)
productRouter.get('/:id', getProductById)
productRouter.post('/', createProduct)
productRouter.patch('/:id', updateProduct)
productRouter.patch('/delete/:id', softDeleteProduct)
productRouter.delete('/:id', deleteProduct)

export default productRouter
