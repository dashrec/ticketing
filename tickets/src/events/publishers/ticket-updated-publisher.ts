import { Publisher, Subjects, TicketUpdatedEvent } from'@dash007tickets/common';

export class TicketUpdatedPublisher extends Publisher<TicketUpdatedEvent> {
  readonly subject = Subjects.TicketUpdated;
}
