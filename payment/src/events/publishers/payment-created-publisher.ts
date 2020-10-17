import { Subjects, Publisher, PaymentCreatedEvent } from '@kuber-ticket/micro-events'

export class PaymentCreatedPublisher extends Publisher<PaymentCreatedEvent> {
    subject: Subjects.PaymentCreated = Subjects.PaymentCreated
}
