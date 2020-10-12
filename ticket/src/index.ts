import mongoose from 'mongoose'

import { app } from './app'

const port = 3000

;(async function () {
    if (!process.env.JWT_SECRET) {
        throw new Error('JWT_SECRET env variable is missing!')
    }
    if (!process.env.MONGO_URI) {
        throw new Error('MONGO_URI must be defined!')
    }
    try {
        await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useCreateIndex: true,
            useUnifiedTopology: true,
        })
        console.log('Ticket mongodb is connected...')
    } catch (e) {
        console.error(e)
    }

    app.listen(port, () => {
        console.log('Ticket service is up on ' + port)
    })
})()