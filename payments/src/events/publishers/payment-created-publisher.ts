import { Subjects, Publisher, PaymentCreatedEvent } from '@dash007tickets/common';

export class PaymentCreatedPublisher extends Publisher<PaymentCreatedEvent> {
  subject: Subjects.PaymentCreated = Subjects.PaymentCreated;
}
