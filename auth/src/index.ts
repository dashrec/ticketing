import mongoose from "mongoose";
import { app } from './app';

const start= async () => {
  console.log("starting up..");

  if (!process.env.JWT_KEY){
    throw new Error('JWT_KEY must be defined');
  }

  
  if (!process.env.MONGO_URI){
    throw new Error('MONGO_URI must be defined');
  }

try {
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