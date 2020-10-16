import Queue from 'bull'
import { nats } from '@kuber-ticket/micro-events'

import { OrderExpiredPublisher } from '../events/publishers/order-expired-publisher'

interface Payload {
    orderId: string
}

const expirationQueue = new Queue<Payload>('order:expiration', {
    redis: {
        host: process.env.REDIS_HOST,
    },
})

expirationQueue.process(async (job) => {
    new OrderExpiredPublisher(nats.client).publish({
        orderId: job.data.orderId,
    })
})

export { expirationQueue }
