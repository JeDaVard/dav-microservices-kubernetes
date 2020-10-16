import { Listener, OrderCreatedEvent, Subjects, Message } from '@kuber-ticket/micro-events'
import { queueGroupName } from './queue-group-names'
import Ticket from '../../models/ticket'
import { TicketUpdatedPublisher } from '../publishers/ticket-updated-publisher'

export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
    subject: Subjects.OrderCreated = Subjects.OrderCreated
    queueGroupName = queueGroupName
    async onMessage(data: OrderCreatedEvent['data'], msg: Message) {
        // Find the ticket that can be reserved
        const ticket = await Ticket.findById(data.ticket.id)
        if (!ticket) throw new Error('The ticket does not exist')

        // Mark the ticket as reserved by updating its orderId
        ticket.set({ orderId: data.id })
        await ticket.save()
        // console.log(ticket.orderId, data.id)
        await new TicketUpdatedPublisher(this.stan).publish({
            id: ticket.id,
            price: ticket.price,
            title: ticket.title,
            userId: ticket.userId,
            orderId: ticket.orderId,
            version: ticket.version,
        })

        msg.ack()
    }
}
