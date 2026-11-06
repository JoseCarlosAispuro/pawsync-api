import { app } from "./app.js"

const port = process.env.PORT ? Number(process.env.PORT) : 3000
const token = process.env.API_TOKEN

if(!token){
    console.error('Missing token env variable')
} else {
    app.listen(port, () => {
        console.log(`Server is running on port ${port} with express...`)
    })
}