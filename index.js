
const express = require('express')
const dotenv = require('dotenv')
const colors = require('colors')
const morgan = require('morgan')
const authRoutes = require('./routes/authRoute')
const connectDB = require('./config/db')
const cors = require('cors')
const categoryRoutes = require('./routes/categoryRoutes')
const productRoutes = require('./routes/productRoutes')
dotenv.config()

connectDB()

const app = express()

app.use(cors())
app.use(express.json())
app.use(morgan('dev'))

app.use('/api/v1/auth', authRoutes)
app.use('/api/v1/category', categoryRoutes)
app.use('/api/v1/product',productRoutes)



app.get('/',(req,res) =>{
    res.send('<h1>Welcome to E commerce app</h1>')
})

const PORT = 8080 || process.env.PORT

app.listen(PORT, ()=>{
    console.log(`E commerce server started at port ${PORT} and waiting for client requests`.bgCyan.white);
})
