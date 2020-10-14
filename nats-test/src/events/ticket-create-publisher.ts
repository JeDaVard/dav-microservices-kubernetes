import { Publisher, Subjects, TicketCreatedEvent } from '@kuber-ticket/micro-events'

export class TicketCreatePublisher extends Publisher<TicketCreatedEvent> {
    readonly subject: Subjects.TicketCreated = Subjects.TicketCreated
}
