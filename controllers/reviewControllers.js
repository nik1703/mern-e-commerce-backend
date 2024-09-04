import Review from '../models/reviewModel.js'

const getReviews = async (req, res) => {
  try {
    const reviews = await Review.find({})
      .populate('productId')
      .populate('createdBy')
    res.status(200).json(reviews)
  } catch (error) {
    res.status(500).json({ message: 'Fehler beim Abrufen der Reviews' })
  }
}

const getReviewByUserId = async (req, res) => {
  try {
    const review = await Review.find({ createdBy: req.params.id })
      .populate('productId')
      .populate('createdBy')

    res.status(200).json(review)
  } catch (error) {
    res.status(500).json({
      message: 'Fehler beim Abrufen der Reviews',
      error: error.message,
    })
  }
}

const updateReviewById = async (req, res) => {
  try {
    const reviewID = req.params.id
    const updateReview = await Review.findByIdAndUpdate(reviewID, req.body, {
      new: true,
    })
    res.status(200).json(updateReview)
  } catch (error) {
    console.error(error)
    res.status(500).send(error.message)
  }
}

const writeReview = async (req, res) => {
  try {
    const review = await Review.create(req.body)
    res.status(201).json(review)
  } catch (error) {
    res.status(500).json({ message: 'Fehler beim Abrufen der Reviews' })
  }
}

const deleteReview = async (req, res) => {
  try {
    const review = await Review.findByIdAndDelete(req.params.id)
    res.status(200).json(review)
  } catch (error) {
    res.status(500).json({ message: 'Fehler beim Löschen des Reviews' })
  }
}

export { getReviews, getReviewByUserId, writeReview, deleteReview, updateReviewById }
