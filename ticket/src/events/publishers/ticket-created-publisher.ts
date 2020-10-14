import { Publisher, Subjects, TicketCreatedEvent } from '@kuber-ticket/micro-events/build'

export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent> {
    subject: Subjects.TicketCreated = Subjects.TicketCreated
}
