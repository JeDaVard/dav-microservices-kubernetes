import { Listener, OrderCreatedEvent, Subjects, Message } from '@kuber-ticket/micro-events'
import { queueGroupName } from './queue-group-names'
import Ticket from '../../models/ticket'
import { TicketCreatedPublisher } from '../publishers/ticket-created-publisher'

export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
    subject: Subjects.OrderCreated = Subjects.OrderCreated
    queueGroupName = queueGroupName
    async onMessage(data: OrderCreatedEvent['data'], msg: Message) {
        const { id, ticket: orderTicket } = data

        // Find the ticket that can be reserved
        const ticket = await Ticket.findById(orderTicket.id)
        if (!ticket) throw new Error('The ticket does not exist')

        // Mark the ticket as reserved by updating its orderId
        ticket.set('orderId', id)
        await ticket.save()

        msg.ack()
    }
}
