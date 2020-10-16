import { Publisher, Subjects, TicketUpdatedEvent } from '@kuber-ticket/micro-events/build'

export class TicketUpdatedPublisher extends Publisher<TicketUpdatedEvent> {
    subject: Subjects.TicketUpdated = Subjects.TicketUpdated
}
