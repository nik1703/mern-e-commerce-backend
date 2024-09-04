import User from '../models/userModel.js'
import Product from '../models/productModel.js'

const addToCart = async (req, res) => {
  const { userId, productId, quantity, color, size } = req.body

  try {
    const user = await User.findById(userId)

    if (!user) {
      return res.status(404).json({
        message: `User not found with this userId: ${userId}`,
      })
    }

    const product = await Product.findById(productId)
    if (!product) {
      return res.status(404).json({
        message: `Product not found with this productId: ${productId}`,
      })
    }

    const cartItemIndex = user.cart.findIndex(
      (item) =>
        item.productId.equals(productId) &&
        item.color === color &&
        item.size === size
    )
    if (cartItemIndex >= 0) {
      user.cart[cartItemIndex].quantity += quantity
    } else {
      user.cart.push({ productId, quantity, color, size })
    }

    await user.save()
    res.status(200).json({
      message: 'Product added to cart successfully',
      cartOfTheUser: user.cart,
    })
  } catch (error) {
    res.status(500).json({ message: 'Error adding product to cart' })
  }
}

const getCart = async (req, res) => {
  const { userId } = req.params
  try {
    const user = await User.findById(userId)
    if (!user) {
      return res.status(404).json({
        message: `User not found with this userId: ${userId}`,
      })
    }
    res.status(200).json({
      cartOfTheUser: user.cart,
    })
  } catch (error) {
    res.status(500).json({ message: 'Error getting cart' })
  }
}

export { addToCart, getCart }
