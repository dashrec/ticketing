import { Subjects, Publisher, OrderCancelledEvent } from '@dash007tickets/common';

export class OrderCancelledPublisher extends Publisher<OrderCancelledEvent> {
  subject: Subjects.OrderCancelled = Subjects.OrderCancelled;
}
