import { Listener, OrderCreatedEvent, Subjects, Message } from '@kuber-ticket/micro-events'
import { queueGroupName } from './queue-group-name'
import { Order } from '../../models/order'

export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
    subject: Subjects.OrderCreated = Subjects.OrderCreated
    queueGroupName = queueGroupName
    async onMessage(data: OrderCreatedEvent['data'], msg: Message) {
        const order = Order.build({
            id: data.id,
            userId: data.userId,
            version: data.version,
            status: data.status,
            price: data.ticket.price,
        })
        await order.save()

        msg.ack()
    }
}
