import nats from 'node-nats-streaming';
import { TicketCreatedPublisher } from './events/ticket-created-publisher';

console.clear();

const stan = nats.connect('ticketing', 'abc', { //client id 
  url: 'http://localhost:4222',
});

stan.on('connect', async () => {
  console.log('Publisher connected to NATS');
  const publisher = new TicketCreatedPublisher(stan);

  try { // catch if any problem with connection to server
    await publisher.publish({
      id: '123',
      title: 'concert',
      price: 20,
    });
  } catch (err) {
    console.error(err);
  }

/* 
  const data = JSON.stringify({ // cannot chare javascript object so convert in to json
    id: '123',
    title: 'concert',
    price: 20,
  });

  stan.publish('ticket:created', data, () => { //first argument = subject name second the data we want to share
    console.log('Event published');
  }); */
});
