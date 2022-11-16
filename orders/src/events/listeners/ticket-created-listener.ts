import { Message } from 'node-nats-streaming';
import { Subjects, Listener, TicketCreatedEvent } from '@dash007tickets/common';
import { Ticket } from '../../models/ticket';
import { queueGroupName } from './queue-group-name';

export class TicketCreatedListener extends Listener<TicketCreatedEvent> {
  subject: Subjects.TicketCreated = Subjects.TicketCreated; //typescript enforces that never ll be able to changed it
  queueGroupName = queueGroupName; //By being a member of this group, that ensures that any time any event comes into this channel, this  event is only going to be sent to one of the members inside this group.

  //take a look at ['data'] property that flow onMessage func. thats gonna be the type of data: argument. message has methods and one of them is ack();
  async onMessage(data: TicketCreatedEvent['data'], msg: Message) {

    const { id, title, price } = data;  //save every newTicket in orders local Ticket db 
    const ticket = Ticket.build({
      id,
      title,
      price,
    });
    await ticket.save();

    msg.ack(); //tell nats streaming server, we processed the msg and are good to go

  } 
}
