import Product from '../models/productModel.js'
import { cloudinary } from '../cloudinary/cloudinaryConfig.js'

const getProducts = async (req, res) => {
  try {
    const products = await Product.find({}).populate('reviews')
    res.status(200).json(products)
  } catch (error) {
    res.status(500).json({ message: 'Fehler beim Abrufen der Produkte' })
  }
}

const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
    if (product) {
      res.status(200).json(product)
    } else {
      res.status(404).json({ message: 'Produkt nicht gefunden' })
    }
  } catch (error) {
    res.status(500).json({ message: 'Fehler beim Abrufen des Produkts' })
  }
}

const createProduct = async (req, res) => {
  const {
    title,
    mainImage,
    img1,
    img2,
    img3,
    price,
    isDiscounted,
    discountPercentage,
    type,
    style,
    description,
    descriptionDetails,
    details,
    sizes,
    colors,
  } = req.body

  const uploadImgFunction = async (image) => {
    const timestamp = Date.now()
    return cloudinary.uploader.upload(image, {
      upload_preset: 'ecommerce_product_images_preset',
      public_id: `${title}_${timestamp}`,
      allowed_formats: ['jpg', 'png', 'jpeg', 'svg'],
    })
  }

  const uploadedMainImage = await uploadImgFunction(mainImage)
  const uploadedImg1 = await uploadImgFunction(img1)
  const uploadedImg2 = await uploadImgFunction(img2)
  const uploadedImg3 = await uploadImgFunction(img3)

  try {
    const mainImageUrl = uploadedMainImage.secure_url
    const mainImagePublicId = uploadedMainImage.public_id
    const imageUrls = [
      uploadedImg1.secure_url,
      uploadedImg2.secure_url,
      uploadedImg3.secure_url,
    ]
    const imagePublicIds = [
      uploadedImg1.public_id,
      uploadedImg2.public_id,
      uploadedImg3.public_id,
    ]

    const product = new Product({
      title,
      mainImage: mainImageUrl,
      mainImgPub: mainImagePublicId,
      images: imageUrls,
      imgpub: imagePublicIds,
      price,
      isDiscounted,
      discountPercentage,
      type,
      style,
      description,
      descriptionDetails,
      details,
      sizes,
      colors,
    })

    await product.save()
    res.status(201).json({ message: 'Product added successfully', product })
  } catch (error) {
    res
      .status(500)
      .json({ message: 'Fehler bei der Speicherung', error: error.message })
  }
}

// Alkan wird hier aktualisieren
const updateProduct = async (req, res) => {
  const updateId = req.params.id
  const {
    title,
    price,
    isDiscounted,
    discountPercentage,
    type,
    style,
    description,
    descriptionDetails,
    details,
    sizes,
    colors,
    isDeleted,
  } = req.body

  let { mainImage, mainImgPub, images, imgpub } = req.body

  const uploadImgFunction = async (image) => {
    const timestamp = Date.now()
    return cloudinary.uploader.upload(image, {
      upload_preset: 'ecommerce_product_images_preset',
      public_id: `${title}_${timestamp}`,
      allowed_formats: ['jpg', 'png', 'jpeg', 'svg'],
    })
  }

  try {
    const product = await Product.findById(updateId)

    if (!product) {
      res.status(404)
      throw new Error('Produkt nicht gefunden!')
    }

    if (mainImage !== product.mainImage) {
      await cloudinary.uploader.destroy(product.mainImgPub)
      const uploadedMainImage = await uploadImgFunction(mainImage)
      mainImage = uploadedMainImage.secure_url
      mainImgPub = uploadedMainImage.public_id
    }

    for (let index = 0; index < images.length; index++) {
      const image = images[index]
      if (image !== product.images[index]) {
        await cloudinary.uploader.destroy(product.imgpub[index])
        const uploadedImage = await uploadImgFunction(image)
        images[index] = uploadedImage.secure_url
        imgpub[index] = uploadedImage.public_id
      }
    }

    const updatedData = {
      title,
      mainImage,
      mainImgPub,
      images,
      imgpub,
      price,
      isDiscounted,
      discountPercentage,
      type,
      style,
      description,
      descriptionDetails,
      details,
      sizes,
      colors,
      isDeleted,
    }

    const updatedProduct = await Product.findByIdAndUpdate(
      updateId,
      { $set: updatedData },
      { new: true, runValidators: true }
    )
    res
      .status(200)
      .json({ message: 'Product updated successfully', updatedProduct })
  } catch (error) {
    res.status(500).json({
      message: 'Fehler beim Aktualisieren des Produkts',
      error: error.message,
    })
  }
}

const softDeleteProduct = async (req, res) => {
  const product = await Product.findById(req.params.id)
  if (product) {
    product.isDeleted = true
    await product.save()
    res.status(200).json({ message: 'Produkt gelöscht!' })
  } else {
    res.status(404)
    throw new Error('Produkt nicht gefunden!')
  }
}

const deleteProduct = async (req, res) => {
  // const product = await Product.findById(req.params.id)
  // if (product) {
  //   await cloudinary.uploader.destroy(product.imgpub)
  //   await Product.deleteOne({ _id: req.params.id })
  //   res.status(200).json({ message: 'Produkt gelöscht!' })
  // } else {
  //   res.status(404)
  //   throw new Error('Produkt nicht gefunden!')
  // }
}

export {
  createProduct,
  getProductById,
  getProducts,
  updateProduct,
  deleteProduct,
  softDeleteProduct,
}
