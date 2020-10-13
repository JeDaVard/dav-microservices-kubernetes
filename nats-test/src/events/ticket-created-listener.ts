import { BaseListener } from './base-listener'
import { Message } from 'node-nats-streaming'
import { Subjects } from './subjects'
import { TicketCreatedEvent } from './ticket-created-event'

export class TicketCreatedListener extends BaseListener<TicketCreatedEvent> {
    readonly subject: Subjects.TicketCreated = Subjects.TicketCreated
    queueGroupName = 'payments-service'
    onMessage(data: TicketCreatedEvent['data'], msg: Message) {
        console.log('Event data', data)
        msg.ack()
    }
}
