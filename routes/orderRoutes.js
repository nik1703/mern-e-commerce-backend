import express from 'express'
import {
  createOrder,
  getOrdersByUser,
  getOrders,
  UpdateOrderStatus,
  UpdateRefundStatus,
  getRequestedRefunds
} from '../controllers/orderControllers.js'


const orderRouter = express.Router()

orderRouter.post('/create-order', createOrder)
orderRouter.get('/myorders/:id', getOrdersByUser)
orderRouter.get('/admin', getOrders)
orderRouter.get('/requested-refunds', getRequestedRefunds)
orderRouter.patch('/update-status/:id', UpdateOrderStatus)
orderRouter.patch('/update-refund-status/:id', UpdateRefundStatus)



export default orderRouter
