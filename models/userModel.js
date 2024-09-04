import mongoose from 'mongoose'
const { Schema } = mongoose

const userSchema = new mongoose.Schema(
  {
    first_name: { type: String, default: null },
    last_name: { type: String, default: null },
    email: { type: String, unique: true },
    password: { type: String },
    token: { type: String },
    role: { type: String, default: 'user' },
    lastUpdatedBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    isDeleted: { type: Boolean, default: false },
    cart: [
      {
        productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
        quantity: { type: Number, default: 1 },
        color: { type: String },
        size: { type: String },
      },
    ],
  },
  {
    timestamps: true,
  }
)

const User = mongoose.model('User', userSchema)
export default User
