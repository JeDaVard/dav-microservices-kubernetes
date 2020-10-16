import { env } from './config'
import { nats } from '@kuber-ticket/micro-events'
import { OrderCreatedListener } from './events/listeners/order-created-listener'
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

        // Listeners
        new OrderCreatedListener(nats.client).listen()
    } catch (e) {
        console.error(e)
    }
})()
