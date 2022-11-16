import nats from 'node-nats-streaming';
import {randomBytes} from 'crypto';
import { TicketCreatedListener } from './events/ticket-created-listener';
console.clear();


//ticketing = cluster id 
const stan = nats.connect('ticketing', randomBytes(4).toString('hex'), { //creating client  
  url: 'http://localhost:4222',
});

stan.on('connect', () => { //watch connect event meaning after we are successfully connected  say connected
  console.log('Listener connected to NATS');

  stan.on('close', () => { //anytime we ar gonna try to close  this client or disconnect from running server, we ar going to do a console log
    console.log('NATS connection closed!');
    process.exit();
  });
  new TicketCreatedListener(stan).listen(); //listen method 

});


// those event listener will watch if someone is going to close the service
process.on('SIGINT', () => stan.close()); //  control c or rs its going to reach out and tell nats streaming service do not send me event messages anymore and  close client down 
process.on('SIGTERM', () => stan.close());






 //abbreviation of acknowledge. every time service gets events it will be considered as delivered by default. 
 //so if the data will be lost from service, the client has no info about it. setDurableName makes sure if listener goes down still getting missed events and not process the same event two times
  //const options = stan.subscriptionOptions().setManualAckMode(true).setDeliverAllAvailable().setDurableName('accounting-service'); //by setting true nat streaming library is no longer going to acknowledged it as delivered automatically. setDeliverAllAvailable saves all delivered events in nats streaming server 
//nats will wipe out setDurableName history if listener goes down. if a listener goes down for a small period of time 'queue-group-name' will not dump the entire durable subscription  

//queue groupe is created to make sure that multiple instances of the same service do not  get the same events
  //const subscription = stan.subscribe('ticket:created', 'order-service-queue-group', options); //1. name of chanel 2. it shares events on two service 50% - 50%
  //const subscription = stan.subscribe('ticket:created',  'queue-group-name', options); //1. name of chanel 2. if a listener goes down for a small period of time 'queue-group-name' will not dump the entire durable subscription 
/*   subscription.on('message', (msg: Message) => { //message mens event that we have to receive. msg is an actual message.   msg: Message describes the type of msg

    const data = msg.getData(); //actual data included in event

    if (typeof data === 'string') {
      console.log(`Received event #${msg.getSequence()}, with data: ${data}`); //getSequence method returns number of the events

  }
  msg.ack(); // it acknowledges that the event from nats streaming chanel has received
  }); */
