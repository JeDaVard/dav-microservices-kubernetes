import { env } from './config'
import { nats } from '@kuber-ticket/micro-events'
import mongoose from 'mongoose'

import { app } from './app'

const port = 3000

;(async function () {
    try {
        // Connect to NATS
        await nats.connect(env.NATS_CLUSTER_ID!, env.NATS_CLIENT_ID!, env.NATS_URL!, () => {
            console.log('Ticket NATS is connected...')
        })
        // Take care of .. if connection closes close the process too, or if the process closes close the connection too
        nats.client.on('close', () => {
            console.log('Ticket NATS is disconnected')
            process.exit()
        })

        process.on('SIGINT', () => nats.client.close())
        process.on('SIGTERM', () => nats.client.close())

        // Listen for events

        // Connect to DB
        await mongoose.connect(env.MONGO_URI!, {
            useNewUrlParser: true,
            useCreateIndex: true,
            useUnifiedTopology: true,
        })
        console.log('Ticket mongodb is connected...')
    } catch (e) {
        console.error(e)
    }
    // Run the server
    app.listen(port, () => {
        console.log('Ticket service is up on ' + port)
    })
})()
