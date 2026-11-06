import express from 'express'
import { getUsers, getUserById, createUser, updateUser, deleteUser } from '../controllers/users.controller.js'
import { validate } from '../middlewares/validate.js'
import auth from '../middlewares/auth.js'
import { userBodySchema, idParamsSchema, userQuerySchema } from '../schemas/users.schemas.js'

const usersRouter = express.Router()

usersRouter.get('/', validate(userQuerySchema, 'query') , getUsers)
usersRouter.get('/:id', validate(idParamsSchema, 'params'), getUserById)
usersRouter.post('/', auth(), validate(userBodySchema, 'body'), createUser)
usersRouter.put('/:id', auth(), validate(idParamsSchema, 'params'), validate(userBodySchema, 'body'),  updateUser)
usersRouter.delete('/:id', auth(), validate(idParamsSchema, 'params'), deleteUser)

export {usersRouter}