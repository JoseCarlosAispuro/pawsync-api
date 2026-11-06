import {getAll, getUserByName, getById, create, update, remove} from '../src/data/users.repository.js'

const getUsers = async (req, res) => {
    if(req.validated.query.name) {
        const user = await getUserByName(req.validated.query.name)
        res.status(200).json(user)
        return
    }

    const users = await getAll()
    res.status(200).json(users)
}

const getUserById = async (req, res) => {
    const user = await getById(req.validated.params.id)

    if(!user) {
        res.status(404).json({"error": "User not found"})
        return
    }

    res.status(200).json(user)
}

const createUser = async (req, res) => {
    const newUser = await create(req.validated.body.name)
    res.location(`${req.baseUrl}/${newUser.id}`)
    res.status(201).json(newUser)
}

const updateUser = async (req, res) => {
    const user = await update(req.validated.params.id, req.validated.body.name)

    if(!user) {
        res.status(404).json({"error": "User not found"})
        return
    }

    res.status(200).json(user)
}

const deleteUser = async (req, res) => {
    const user = await remove(req.validated.params.id)

    if(!user) {
        res.status(404).json({"error": "User not found"})
        return
    }

    res.status(204).end()
}

export {getUsers, getUserById, createUser, updateUser, deleteUser}
