import { ExpirationCompleteEvent, Publisher, Subjects } from '@kuber-ticket/micro-events'

export class OrderExpiredPublisher extends Publisher<ExpirationCompleteEvent> {
    subject: Subjects.ExpirationComplete = Subjects.ExpirationComplete
}
