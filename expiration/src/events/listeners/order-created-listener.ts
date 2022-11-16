import { Listener, OrderCreatedEvent, Subjects } from '@dash007tickets/common';
import { Message } from 'node-nats-streaming';
import { queueGroupName } from './queue-group-name';
import { expirationQueue } from '../../queues/expiration-queue';

export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
  subject: Subjects.OrderCreated = Subjects.OrderCreated;
  queueGroupName = queueGroupName;

    async onMessage(data: OrderCreatedEvent['data'], msg: Message) {  //whenever we receive an event enqueue a job for expiration service
      const delay = new Date(data.expiresAt).getTime() - new Date().getTime();  // gives time between the future time and time right now 
                                  console.log("waiting this many milliseconds to process the job: ", delay)                                              //  new Date(data.expiresAt).getTime()  gives time in mil seconds
      await expirationQueue.add(
      {
        orderId: data.id,
      },
     {
        delay,
      }    
      );
  
      msg.ack();   
  }
}
