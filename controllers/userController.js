import User from '../models/userModel.js'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

const getAllUsers = async (req, res) => {
  try {
    const users = await User.find()
    res.status(200).json(users)
  } catch (err) {
    console.log(err)
  }
}

const getUserById = async (req, res) => {
  const userId = req.params.id
  try {
    const user = await User.findById(userId)
    res.status(200).json({ message: 'User found', user })
  } catch (error) {
    res.status(404).json({ message: 'User not found' })
  }
}

const userLogin = async (req, res) => {
  try {
    // Get user input
    const { email, password } = req.body

    // Validate user input
    if (!(email && password)) {
      res.status(400).send('All input is required')
    }
    // Validate if user exist in our database
    const user = await User.findOne({ email })

    // Check if user exists
    if (!user) {
      return res.status(400).send('Invalid Credentials')
    }

    const matchedPassword = await bcrypt.compare(password, user.password)
    if (user && matchedPassword) {
      // Create token
      const token = jwt.sign(
        { user_id: user._id, email },
        process.env.TOKEN_KEY,
        {
          expiresIn: '2h',
        }
      )

      // save user token
      user.token = token
      await user.save()

      // user
      return res.status(200).json(user)
    } else {
      return res.status(400).send('Invalid Credentials')
    }
  } catch (err) {
    console.log(err)
  }
}

const userRegister = async (req, res) => {
  try {
    // Get user input
    const { first_name, last_name, email, password } = req.body

    // Validate user input
    if (!(email && password && first_name && last_name)) {
      res.status(400).send(req.body)
    }

    // check if user already exist
    // Validate if user exist in our database
    const oldUser = await User.findOne({ email })

    if (oldUser) {
      return res.status(409).send('User Already Exist. Please Login ')
    }

    //Encrypt user password
    const encryptedPassword = await bcrypt.hash(password, 10)

    // Create user in our database
    const user = await User.create({
      first_name,
      last_name,
      email: email.toLowerCase(), // sanitize: convert email to lowercase
      password: encryptedPassword,
    })

    // Create token
    const token = jwt.sign(
      { user_id: user._id, email },
      process.env.TOKEN_KEY,
      {
        expiresIn: '2h',
      }
    )
    // save user token
    user.token = token
    await user.save()

    // return new user
    res.status(201).json(user)
  } catch (err) {
    console.log(err)
  }
}

const userLogout = async (req, res) => {
  try {
    // Get the user from the request object
    const user = req.user
    // Clear the user's token (logout)

    const findUser = await User.findOne({ email: user.email })
    findUser.token = null

    await findUser.save()
    res.status(200).json(findUser)
  } catch (err) {
    console.error(err)
    res.status(500).send(err.message)
  }
}

const userLoginWithToken = async (req, res) => {
  try {
    const user = req.user
    const userData = user.email

    const findUser = await User.findOne({ email: userData })

    res.status(200).json(findUser)
  } catch (err) {
    console.error(err)
    res.status(500).send(err.message)
  }
}

const userDelete = async (req, res) => {
  try {
    const userId = req.params.id
    const deletedUser = await User.findByIdAndDelete(userId)
    res.status(200).json(deletedUser)
  } catch (err) {
    console.error(err)
    res.status(500).send(err.message)
  }
}

const userUpdate = async (req, res) => {
  try {
    const userID = req.params.id
    const updateUser = await User.findByIdAndUpdate(userID, req.body, {
      new: true,
    })
    res.status(200).json(updateUser)
  } catch (error) {
    console.error(error)
    res.status(500).send(error.message)
  }
}

export {
  userLogin,
  userRegister,
  userLogout,
  userDelete,
  userUpdate,
  getAllUsers,
  userLoginWithToken,
  getUserById
}
