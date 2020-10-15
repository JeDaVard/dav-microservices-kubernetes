import mongoose from 'mongoose'
import { app } from './app'
import { nats } from '@kuber-ticket/micro-events'
import { env } from './config'
import { TicketUpdatedListener, TicketCreatedListener } from './events'

const port = 3000

;(async function () {
    try {
        // NATS client initialisation
        await nats.connect(env.NATS_CLUSTER_ID!, env.NATS_CLIENT_ID!, env.NATS_URL!, () => {
            console.log('Order NATS is connected...')
        })
        nats.client.on('close', () => {
            console.log('Order NATS is disconnected')
            process.exit()
        })

        // Close NATS connection in case of server issues
        process.on('SIGINT', () => nats.client.close())
        process.on('SIGTERM', () => nats.client.close())

        // Run listener instances
        new TicketCreatedListener(nats.client).listen()
        new TicketUpdatedListener(nats.client).listen()

        // Connect to DB
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
