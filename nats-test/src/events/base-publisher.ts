import { Stan } from 'node-nats-streaming';
import { Subjects } from './subjects';

interface Event { //must have subject and it must be on of the subjects listed in enum subjects
  subject: Subjects;
  data: any;
}

export abstract class Publisher<T extends Event> { //Event = interface name
  abstract subject: T['subject'];
  private client: Stan; //make sure class has a property of client

  constructor(client: Stan) {
    this.client = client;
  }


  //data we want to publish and type T data 
  publish(data: T['data']): Promise<void> {  //custom annotation meaning resolve with nothing at all
    return new Promise((resolve, reject) => { //resolve = success. reject = error
      this.client.publish(this.subject, JSON.stringify(data), (err) => {

        if (err) {
          return reject(err);
        }

        console.log('Event published to subject', this.subject);
        resolve();
      });
    });
  }
}
