const express = require('express')
const cookieParser = require('cookie-parser')
const cors = require('cors')

/*Routes */
const chatRoutes = require('./routes/chat.routes')
const authRoutes = require('./routes/auth.routes')

const app = express()

/* Middlewares */
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}))
app.use(express.json())
app.use(cookieParser())


/*Using Routes*/
app.use('/api/auth', authRoutes)
app.use('/api/chat', chatRoutes)

module.exports = app
