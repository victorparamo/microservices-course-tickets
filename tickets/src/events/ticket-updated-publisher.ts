import { Publisher, Subjects, TicketUpdatedEvent } from '@vptickets/common';

export class TicketUpdatedPublisher extends Publisher<TicketUpdatedEvent> {
  readonly subject = Subjects.TicketUpdated;
}