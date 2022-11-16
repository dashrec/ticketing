import { Listener } from './base-listener';
import { Message } from 'node-nats-streaming';
import { TicketCreatedEvent } from './ticket-created-event';
import { Subjects } from './subjects';

//custom newTicket listener .  Generic type -->  <>
export class TicketCreatedListener extends Listener <TicketCreatedEvent>{ //extending listener abstract class. TicketCreatedEvent type to listener that describes the event that we expect to receive inside of this listener so interface!
  //subject = 'ticket:created'; //inside our publisher subject name 
  readonly subject: Subjects.TicketCreated = Subjects.TicketCreated; //by providing  Subjects.TicketCreated = we say we never change value of subject like Subjects.OrderUpdate.  so subject not to be a type of other Subject type listed inside subjects
  queueGroupName = 'payments-service'; //whenever events come the message will be distributed to one of the listeners inside que
  onMessage(data: TicketCreatedEvent['data'], msg: Message) { //data = in publisher defined data. data must be equal to type of TicketCreatedEvents data property
    console.log('Event data!', data);  


/*     console.log(data.id);
    console.log(data.title);
    console.log(data.price); */
    msg.ack();  // if everything goes well, we acknowledge. if fails nats going to deliver it at sometimes in the future
  }
}

//readonly prevents a property of a class from being changed. 