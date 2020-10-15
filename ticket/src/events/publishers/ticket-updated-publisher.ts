import { Publisher, Subjects, OrderCreatedEvent } from '@kuber-ticket/micro-events/build'

export class TicketUpdatedPublisher extends Publisher<OrderCreatedEvent> {
    subject: Subjects.OrderCreated = Subjects.OrderCreated
}
