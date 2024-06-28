import express from 'express'
import cookieParser from 'cookie-parser'
import cors from 'cors'
const app = express()
app.use(cors({
    origin: process.env.ORIGIN,
    credentials:true
}))
app.use(express.json({limit:"14kb"}))
app.use(express.urlencoded)
app.use(express.static("public"))
app.use(cookieParser())

// import routes
import router from './routes/user.routes.js'
app.use("/api/v1/users", router)

// how does the standard url look like : https://localhost/8000/api/v1/users/    now the control moves to user.routers file

export {app}