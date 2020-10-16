import { Listener, OrderCreatedEvent, Subjects, Message } from '@kuber-ticket/micro-events'
import { orderQueueGroupName } from './order-queue-group-name'
import { expirationQueue } from '../../queues/expiration-queues'

export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
    subject: Subjects.OrderCreated = Subjects.OrderCreated
    queueGroupName = orderQueueGroupName
    async onMessage(data: OrderCreatedEvent['data'], msg: Message) {
        const delay = new Date(data.expiresAt).getTime() - new Date().getTime()

        await expirationQueue.add({ orderId: data.id }, { delay })
        msg.ack()
    }
}
