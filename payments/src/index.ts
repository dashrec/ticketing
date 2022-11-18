import mongoose from "mongoose";
import { app } from './app';
import { natsWrapper } from './nats-wrapper';
import { OrderCancelledListener } from './events/listeners/order-cancelled-listener';
import { OrderCreatedListener } from './events/listeners/order-created-listener';


const start= async () => {

  console.log("starting up...");

  if (!process.env.JWT_KEY){
    throw new Error('JWT_KEY must be defined');
  }
  if (!process.env.MONGO_URI){
    throw new Error('MONGO_URI must be defined');
  }
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
  new OrderCancelledListener(natsWrapper.client).listen();


  await mongoose.connect(process.env.MONGO_URI, {//auth-mongo-srv is a service name created in auth-mongo-depl.yaml. auth = give this db a name
  }); console.log('connected to mongo db');
}
catch (err){
 console.error(err);
}
app.listen(3000, () => {
  console.log('Listening on port 3000!!!');
});

};
start();