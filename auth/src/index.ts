import mongoose from 'mongoose'

import app from './app'

const port = 3000

;(async function () {
    if (!process.env.JWT_SECRET) {
        throw new Error('JWT_SECRET env variable is missing!')
    }
    try {
        await mongoose.connect('mongodb://auth-mongo-srv/auth', {
            useNewUrlParser: true,
            useCreateIndex: true,
            useUnifiedTopology: true,
        })
        console.log('Auth mongodb is connected...')
    } catch (e) {
        console.error(e)
    }

    app.listen(port, () => {
        console.log('Auth service is up on ' + port)
    })
})()
