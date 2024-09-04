import mongoose from 'mongoose'

const { Schema, model } = mongoose

const reviewSchema = new Schema(
  {
    productId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'Product',
    },

    stars: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },

    review: {
      type: String,
      required: true,
    },

    verified: {
      type: Boolean,
      default: false,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
    createdBy: {
      required: true,
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    lastUpdatedBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  {
    timestamps: true,
  }
)

const Review = model('Review', reviewSchema)

export default Review
