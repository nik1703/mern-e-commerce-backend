import mongoose from 'mongoose'

const ProductSchema = new mongoose.Schema(
  {
    productId: {
      type: Number,
    },

    title: {
      type: String,
      required: true,
    },

    mainImage: {
      type: String,
    },

    mainImgPub: {
      type: String,
    },

    images: {
      type: [String],
    },

    imgpub: {
      type: [String],
    },

    price: {
      type: Number,
      required: true,
    },

    isDiscounted: {
      type: Boolean,
      default: false,
    },

    discountedPrice: {
      type: Number,
    },

    discountPercentage: {
      type: Number,
    },

    type: {
      type: String,
      required: true,
    },

    style: {
      type: String,
      required: true,
    },

    description: {
      type: String,
      required: true,
    },

    descriptionDetails: {
      type: String,
    },

    details: {
      type: String,
    },

    stars: {
      type: Number,
      default: 0,
    },

    reviews: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: 'Review',
    },

    sizes: {
      type: [String],
    },

    colors: {
      type: [String],
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
)

// Middleware to calculate the discounted price before saving the product
ProductSchema.pre('save', function (next) {
  if (this.isDiscounted) {
    this.discountedPrice =
      this.price - (this.price * this.discountPercentage) / 100
  } else {
    this.discountedPrice = this.price
  }
  next()
})

/// Middleware to calculate the discounted price before updating the product by findOneAndUpdate or findByIdAndUpdate
ProductSchema.pre('findOneAndUpdate', async function (next) {
  const update = this.getUpdate()

  if (update.$set) {
    // Get the current product data to fetch existing price if not provided in the update
    const product = await this.model.findOne(this.getQuery())

    const price =
      update.$set.price !== undefined ? update.$set.price : product.price
    const isDiscounted =
      update.$set.isDiscounted !== undefined
        ? update.$set.isDiscounted
        : product.isDiscounted
    const discountPercentage =
      update.$set.discountPercentage !== undefined
        ? update.$set.discountPercentage
        : product.discountPercentage

    if (isDiscounted) {
      update.$set.discountedPrice = price - (price * discountPercentage) / 100
    } else {
      update.$set.discountedPrice = price
    }
  }
  next()
})

const Product = mongoose.model('Product', ProductSchema)

export default Product
