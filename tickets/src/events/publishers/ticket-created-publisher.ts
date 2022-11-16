import { Publisher, Subjects, TicketCreatedEvent } from '@dash007tickets/common';

export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent> {
  readonly subject = Subjects.TicketCreated;
}
