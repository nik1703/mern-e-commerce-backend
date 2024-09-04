import express from 'express'
import auth from '../middleware/auth.js'
import {
  userLogin,
  userRegister,
  userLogout,
  userDelete,
  userUpdate,
  getAllUsers,
  userLoginWithToken,
  getUserById,
} from '../controllers/userController.js'

const userRouter = express.Router()

userRouter.get('/', getAllUsers)
userRouter.get('/:id', getUserById)
userRouter.post('/register', userRegister)
userRouter.post('/login', userLogin)
userRouter.post('/tokenLogin', auth, userLoginWithToken)
userRouter.post('/logout', auth, userLogout)
userRouter.patch('/:id', userUpdate)
userRouter.delete('/:id', userDelete)

export default userRouter
