const mongoose = require('mongoose')
const colors = require('colors')
const connectDB =async () => {
            try {
                const conn = await mongoose.connect(process.env.MONGO_URL)
                console.log(`connected to mongodb`.bgMagenta.white);
            } catch (error) {
                console.log(`Error: ${error}`.bgRed.white);
            }
}

module.exports = connectDB