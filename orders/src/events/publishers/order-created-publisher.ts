import { Publisher, OrderCreatedEvent, Subjects } from '@dash007tickets/common';

export class OrderCreatedPublisher extends Publisher<OrderCreatedEvent> {
  subject: Subjects.OrderCreated = Subjects.OrderCreated;
}
