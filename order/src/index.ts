import mongoose from 'mongoose'
import { app } from './app'
import { nats } from '@kuber-ticket/micro-events'
import { env } from './config'

const port = 3000

;(async function () {
    try {
        await nats.connect(env.NATS_CLUSTER_ID!, env.NATS_CLIENT_ID!, env.NATS_URL!, () => {
            console.log('Order NATS is connected...')
        })
        nats.client.on('close', () => {
            console.log('Order NATS is disconnected')
            process.exit()
        })

        process.on('SIGINT', () => nats.client.close())
        process.on('SIGTERM', () => nats.client.close())

        await mongoose.connect(env.MONGO_URI!, {
            useNewUrlParser: true,
            useCreateIndex: true,
            useUnifiedTopology: true,
        })
        console.log('Order mongodb is connected...')
    } catch (e) {
        console.error(e)
    }

    app.listen(port, () => {
        console.log('Order service is up on ' + port)
    })
})()
