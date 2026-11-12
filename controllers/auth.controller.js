import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken"
import { getAccountByUsername, register } from "../src/data/auth.repository.js"

const dummyHash = await bcrypt.hash('dummyHash', 10)

const registerUser = async (req, res) => {
    const hashedPassword =  await bcrypt.hash(req.validated.body.password, 10)

    try {
        await register(req.validated.body.username, hashedPassword)
    } catch(err) {
        if(err.code === 'SQLITE_CONSTRAINT_UNIQUE') {
            res.status(409).json({"error": "Account already exist"})
            return
        }
        throw err
    }

    res.status(201).end()
}

const loginUser = async (req, res) => {
    const existingUser = getAccountByUsername(req.validated.body.username)
    const dummyPassword = 'testing'

    if(!existingUser) {
        await bcrypt.compare(dummyPassword, dummyHash)
        res.status(401).json({"error": "Account credentials are incorrect"})
        return
    }

    if(!await bcrypt.compare(req.validated.body.password, existingUser.password_hash)) {
        res.status(401).json({"error": "Account credentials are incorrect"})
        return
    }

    const token = jwt.sign({id: existingUser.id}, process.env.JWT_SECRET, {expiresIn: '2min'})

    res.status(200).json({"token": token})

}

export { registerUser, loginUser }