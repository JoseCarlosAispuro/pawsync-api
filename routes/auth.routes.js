import express from 'express'
import { validate } from '../middlewares/validate.js'
import { registerUser, loginUser } from '../controllers/auth.controller.js'
import { authSchema } from '../schemas/users.schemas.js'

const authRouter = express.Router()

authRouter.post('/register', validate(authSchema, 'body'),registerUser)
authRouter.post('/login', validate(authSchema, 'body'),loginUser)

export { authRouter }