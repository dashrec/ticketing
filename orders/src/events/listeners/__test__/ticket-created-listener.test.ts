import { Message } from 'node-nats-streaming';
import mongoose from 'mongoose';
import { TicketCreatedEvent } from '@dash007tickets/common';
import { TicketCreatedListener } from '../ticket-created-listener';
import { natsWrapper } from '../../../nats-wrapper';
import { Ticket } from '../../../models/ticket';

const setup = async () => {
  // create an instance of the listener
  const listener = new TicketCreatedListener(natsWrapper.client); //whenever creating listener we are required to pass nats client

  // create a fake data event
  const data: TicketCreatedEvent['data'] = { // valid data object that requires a type definition of event create
    version: 0,
    id: new mongoose.Types.ObjectId().toHexString(), //generate id
    title: 'concert',
    price: 10,
    userId: new mongoose.Types.ObjectId().toHexString(),
  };

  // @ts-ignore
  const msg: Message = {       // create a fake message object 
    ack: jest.fn(),  // fake ack 
  };

  return { listener, data, msg };
};





it('creates and saves a ticket', async () => {
  const { listener, data, msg } = await setup();

  // call the onMessage function with the data object + message object
  await listener.onMessage(data, msg);

  // write assertions to make sure a ticket was created!
  const ticket = await Ticket.findById(data.id);

  expect(ticket).toBeDefined();
  expect(ticket!.title).toEqual(data.title);
  expect(ticket!.price).toEqual(data.price);
});




it('acks the message', async () => {

  const { listener, data, msg } = await setup();
  // call the onMessage function with the data object + message object
  await listener.onMessage(data, msg);

  // write assertions to make sure ack function is called
 // expect(msg.ack).not.toHaveBeenCalled();
 expect(msg.ack).toHaveBeenCalled();
});
