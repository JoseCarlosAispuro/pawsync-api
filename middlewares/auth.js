import {timingSafeEqual} from 'node:crypto'

const token = process.env.API_TOKEN

const safeEqual = (a, b) => {
    const bufferA = Buffer.from(a)
    const bufferB = Buffer.from(b)

    if (bufferA.length !== bufferB.length) {
        return false
    }

    return timingSafeEqual(bufferA, bufferB)
}

const auth = () => {
    return ((req, res, next) => {
        if(!req.headers.authorization) {
            return res.status(401).json({"error": "Authorization header missing"})
        }

        const authParts = req.headers.authorization.split(" ")

        if(authParts[0] !== 'Bearer' || !authParts[1]){
            return res.status(401).json({"error": "Authorization header bad formatted"})
        }

        if(!safeEqual(token, authParts[1])) {
            return res.status(401).json({"error": "Incorrect Authorization Token"})
        }

        next();
    })
}

export default auth