import Order from '../models/orderModel.js'
import User from '../models/userModel.js'

const createOrder = async (req, res) => {
  const { userId, paymentMethod, orderData, discount } = req.body

  const user = await User.findById(userId)
  if (!user) {
    return res.status(404).json({ message: 'User not found' })
  }

  const order = {
    user: userId,
    products: orderData.map((item) => {
      return {
        productId: item.productId,
        quantity: item.quantity,
        color: item.color,
        size: item.size,
      }
    }),
    status: 'Pending',
    paymentMethod,
    deliveryFee: 15,
    discount,
  }

  try {
    const newOrder = new Order(order)
    const savedOrder = await newOrder.save()
    res
      .status(201)
      .json({ message: 'Order created successfully', order: savedOrder })

    // Clear the cart after creating the order successfully
    if (savedOrder) {
      user.cart = []
      await user.save()
    }
  } catch (error) {
    res.status(500).json({ message: 'Failed to create order', error: error })
  }
}

const getOrdersByUser = async (req, res) => {
  try {
    const userOrders = await Order.find({ user: req.params.id }).populate(
      'products.productId'
    )

    res.status(200).json({ message: 'Orders fetched successfully', userOrders })
  } catch (error) {
    console.error('Error getting orders by user')
    res.status(500).json({ Error: error.message })
  }
}

const getOrders = async (req, res) => {
  try {
    const orders = await Order.find({}).sort({ createdAt: -1 })
    res.status(200).json(orders)
  } catch (error) {
    res.status(500).json({ message: 'Failed to get orders', error: error })
  }
}

const getRequestedRefunds = async (req, res) => {
	  try {
	 const orders = await Order.find({ refundStatus: 'Requested' }).sort({
		createdAt: -1,
	 })
	 res.status(200).json(orders)
  } catch (error) {
	 res.status(500).json({ message: 'Failed to get requested refunds', error })
  }
}

const UpdateOrderStatus = async (req, res) => {
  try {
    const orderId = req.params.id
    const updatedOrder = await Order.findByIdAndUpdate(orderId, req.body, {
      new: true,
    })
    res.status(200).json(updatedOrder)
  } catch (error) {
    res.status(500).json({ message: 'Failed to update order status', error })
  }
}

const UpdateRefundStatus = async (req, res) => {
  try {
    const orderId = req.params.id
    const updatedOrder = await Order.findByIdAndUpdate(orderId, req.body, {
      new: true,
    })
    res.status(200).json(updatedOrder)
  } catch (error) {
    res.status(500).json({ message: 'Failed to update refund status', error })
  }
}

export {
  createOrder,
  getOrders,
  getOrdersByUser,
  UpdateOrderStatus,
  UpdateRefundStatus,
  getRequestedRefunds,
}
