import jwt from "jsonwebtoken"

const secret = process.env.JWT_SECRET

const isUser = (token) => {
    try {
        const authUser = jwt.verify(token, secret, {algorithms: ['HS256']})
        return {
            error: false,
            errorMessage: '',
            value: authUser
        }
    } catch (error) {
        return {
            error: true,
            errorMessage: error.name === 'TokenExpiredError' ? 'Token Expired' : 'Incorrect Token',
            value: {}}
    }
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

        const userValidated = isUser(authParts[1])

        if(userValidated.error) {
            return res.status(401).json({"error": userValidated.errorMessage})
        }

        req.user = {id: userValidated.value.id}

        next();
    })
}

export default auth