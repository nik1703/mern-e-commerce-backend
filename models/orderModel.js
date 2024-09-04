import mongoose from 'mongoose'

const { Schema, model } = mongoose

const orderSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },

    products: [
      {
        productId: {
          type: Schema.Types.ObjectId,
          ref: 'Product',
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
        },
        color: {
          type: String,
          required: true,
        },
        size: {
          type: String,
          required: true,
        },
        price: {
          type: Number,
          required: true,
        },
        discountedPrice: {
          type: Number,
        },
      },
    ],

    totalAmount: {
      type: Number,
      required: true,
    },

    status: {
      type: String,
      enum: ['Pending', 'Confirmed', 'Shipped', 'Delivered', 'Refunded'],
      default: 'Pending',
    },

    paymentMethod: {
      type: String,
      required: true,
    },
    deliveryFee: {
      type: Number,
      required: true,
    },
    discount: {
      type: Number,
      default: 0,
    },
    totalDiscount: {
      type: Number,
      default: 0,
    },
    isRefunded: {
      type: Boolean,
      default: false,
    },
    refundStatus: {
      type: String,
      enum: ['Requested', 'Confirmed', 'Denied'],
    },
  },
  { timestamps: true }
)

// Middleware to calculate the total amount before saving the order
orderSchema.pre('validate', async function (next) {
  try {
    let totalAmount = 0
    for (let product of this.products) {
      if (
        product.productId &&
        product.quantity &&
        product.color &&
        product.size
      ) {
        const productDoc = await mongoose
          .model('Product')
          .findById(product.productId)
        if (productDoc) {
          product.isDiscounted = productDoc.isDiscounted
          product.price = productDoc.price
          product.discountedPrice = productDoc.discountedPrice
          totalAmount += productDoc.isDiscounted
            ? productDoc.discountedPrice * product.quantity
            : productDoc.price * product.quantity
        } else {
          return next(new Error('Product not found'))
        }
      } else {
        return next(new Error('Invalid product details'))
      }
    }

    this.totalDiscount = this.discount > 0 ? totalAmount * this.discount : 0
    this.totalAmount =
      this.discount > 0
        ? totalAmount - totalAmount * this.discount + this.deliveryFee
        : totalAmount + this.deliveryFee
    next()
  } catch (error) {
    next(error)
  }
})

const Order = model('Order', orderSchema)

export default Order
