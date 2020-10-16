import { Listener, OrderCancelledEvent, Subjects, Message } from '@kuber-ticket/micro-events'
import { queueGroupName } from './queue-group-names'
import Ticket from '../../models/ticket'
import { TicketUpdatedPublisher } from '../publishers/ticket-updated-publisher'

export class OrderCancelledListener extends Listener<OrderCancelledEvent> {
    subject: Subjects.OrderCancelled = Subjects.OrderCancelled
    queueGroupName = queueGroupName

    async onMessage(data: OrderCancelledEvent['data'], msg: Message) {
        const ticket = await Ticket.findById(data.ticket.id)

        if (!ticket) {
            throw new Error('Ticket not found')
        }

        ticket.set({ orderId: undefined })
        await ticket.save()
        await new TicketUpdatedPublisher(this.stan).publish({
            id: ticket.id,
            orderId: ticket.orderId,
            userId: ticket.userId,
            price: ticket.price,
            title: ticket.title,
            version: ticket.version,
        })

        msg.ack()
    }
}
