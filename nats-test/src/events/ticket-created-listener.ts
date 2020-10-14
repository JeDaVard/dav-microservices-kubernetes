import { Message } from 'node-nats-streaming'
import { TicketCreatedEvent, Subjects, Listener } from '@kuber-ticket/micro-events'

export class TicketCreatedListener extends Listener<TicketCreatedEvent> {
    readonly subject: Subjects.TicketCreated = Subjects.TicketCreated
    queueGroupName = 'payments-service'
    onMessage(data: TicketCreatedEvent['data'], msg: Message) {
        console.log('Event data', data)
        msg.ack()
    }
}
