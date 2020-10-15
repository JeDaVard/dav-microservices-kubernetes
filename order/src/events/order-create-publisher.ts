import { Publisher, OrderCreatedEvent, Subjects } from '@kuber-ticket/micro-events'

export class OrderCreatePublisher extends Publisher<OrderCreatedEvent> {
    subject: Subjects.OrderCreated = Subjects.OrderCreated
}
