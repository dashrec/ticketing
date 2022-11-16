
import { Message, Stan } from 'node-nats-streaming';
import { Subjects } from './subjects';

interface Event { 
  subject: Subjects; // if there an event its gonna have a subject and a subject is going to be a one of the possible values listed inside of subjects enum
  data: any;
}


//with T we say that subject must be exactly equal to whatever subject was provided on T[''] argument and data must be whatever data we providedon T['data']
//base class Listener.  Generic type 
export abstract class Listener <T extends Event>{  // this listener is going to make it a lot easier to create listeners for all the different kinds of events
  abstract subject: T['subject']; //must be defined by a sub class
  abstract queueGroupName: string;
  abstract onMessage(data: T['data'], msg: Message): void;// first argument of onMessage  T['data'] so in our case in ticket-created-event defined type of data
  private client: Stan; //actual client we are listen defined on live 4 
  protected ackWait = 5 * 1000; //meaning sub class can define it if it want to. 5  * 1000 (millisecond) = 5 sec. normally its 30 sec so we shorten on 5 sec

  constructor(client: Stan) { //constructor require us to  provide pre initialized client, meaning already connected to nats server. thats done on top of page
    this.client = client;//assign client to this client
  }

  subscriptionOptions() {
    return this.client //nats instance
      .subscriptionOptions()
      .setDeliverAllAvailable()
      .setManualAckMode(true)
      .setAckWait(this.ackWait)
      .setDurableName(this.queueGroupName);
  }

  listen() {
    const subscription = this.client.subscribe(
      this.subject,
      this.queueGroupName,
      this.subscriptionOptions()
    );

    subscription.on('message', (msg: Message) => { //get on msg var with type message 
      console.log(`Message received: ${this.subject} / ${this.queueGroupName}`); // / = + so print out queueGroupName as well

      const parsedData = this.parseMessage(msg);
      this.onMessage(parsedData, msg); //function to run when a message is received, msg ? in case we want to access some other properties inside msg 
    });
  }

  parseMessage(msg: Message) {
    const data = msg.getData(); //it gives either buffer or string
    return typeof data === 'string'
      ? JSON.parse(data)
      : JSON.parse(data.toString('utf8')); //if buffer parse buffer and get some json out of it
  }
}