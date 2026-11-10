import express from 'express'
import { usersRouter } from './routes/users.routes.js'
import { authRouter } from './routes/auth.routes.js'

const app = express()

app.use(express.json())

app.use((req, res, next) => {
    const reqTime = Date.now()

    res.on('finish', () => {
        const duration = Date.now() - reqTime
        console.log(`${req.method} ${req.originalUrl} ${res.statusCode} ${duration}ms`);
    })

    next();
})

app.use('/auth', authRouter)
app.use('/users', usersRouter)

app.use((req, res) => {
    res.status(404).json({"error": "Not found"})
})

app.use((err, req, res, next) => {
    if(err.status < 500) {
        res.status(err.status).json({"error": err.message})
        return
    }

    console.error(err)

    res.status(500).json({"error": "Internal server error"})
})

export {app}