import Queue from 'bull';
import { ExpirationCompletePublisher } from '../events/publishers/expiration-complete-publisher';
import { natsWrapper } from '../nats-wrapper';

interface Payload {
  orderId: string;
}
// 1 argument -> order:expiration is going to be essentially the bucket over inside of redis server that we want to store this job in temporarily. it has order id prop

const expirationQueue = new Queue<Payload>('order:expiration', {  //create new instance of queue
  redis: {
    host: process.env.REDIS_HOST,//tell this queue that we want it to connect to the instance of the Redis server that we are running over inside that pod that we had just created through that deployment
  },
});

expirationQueue.process(async (job) => {  // publish an event 
  new ExpirationCompletePublisher(natsWrapper.client).publish({
    orderId: job.data.orderId,
  });
});

export { expirationQueue };
