import express from 'express'
import {
  deleteReview,
  getReviewByUserId,
  getReviews,
  updateReviewById,
  writeReview,
} from '../controllers/reviewControllers.js'

const reviewRouter = express.Router()

reviewRouter.get('/', getReviews)
reviewRouter.get('/:id', getReviewByUserId)
reviewRouter.post('/', writeReview)
reviewRouter.patch('/:id', updateReviewById)
reviewRouter.delete('/:id', deleteReview)


export default reviewRouter
