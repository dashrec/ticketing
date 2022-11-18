import { natsWrapper } from './nats-wrapper';
import { OrderCreatedListener } from './events/listeners/order-created-listener';


const start= async () => {
  console.log("starting up....");


  if (!process.env.NATS_CLIENT_ID) {
    throw new Error('NATS_CLIENT_ID must be defined');
  }
  if (!process.env.NATS_URL) {
    throw new Error('NATS_URL must be defined');
  }
  if (!process.env.NATS_CLUSTER_ID) {
    throw new Error('NATS_CLUSTER_ID must be defined');
  }
try { //nats-depl file ticketing = value of  cid abbreviation of clusterId.  nats-srv =service that is governing access to our Nats deployment. in nats-depl  metadata: name: nats-srv and the port was 4222 

  //await natsWrapper.connect('ticketing', 'dasdass', 'http://nats-srv:4222');
  await natsWrapper.connect(
    process.env.NATS_CLUSTER_ID,
    process.env.NATS_CLIENT_ID,
    process.env.NATS_URL
  );
  natsWrapper.client.on('close', () => { //capture any close event and logout
    console.log('NATS connection closed!');
    process.exit();
  });
  process.on('SIGINT', () => natsWrapper.client.close()); //  control c or rs its going to reach out and tell nats streaming service do not send me event messages anymore and  close client down 
  process.on('SIGTERM', () => natsWrapper.client.close());
  new OrderCreatedListener(natsWrapper.client).listen();

}
catch (err){
 console.error(err);
}
};
start();