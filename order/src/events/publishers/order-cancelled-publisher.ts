import { Publisher, OrderCancelledEvent, Subjects } from '@kuber-ticket/micro-events'

export class OrderCancelledPublisher extends Publisher<OrderCancelledEvent> {
    subject: Subjects.OrderCancelled = Subjects.OrderCancelled
}
