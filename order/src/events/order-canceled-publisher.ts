import { Publisher, OrderCanceledEvent, Subjects } from '@kuber-ticket/micro-events'

export class OrderCanceledPublisher extends Publisher<OrderCanceledEvent> {
    subject: Subjects.OrderCanceled = Subjects.OrderCanceled
}
