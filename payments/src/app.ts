import  express from "express";
import 'express-async-errors';
import { json } from 'body-parser';
import { NotFoundError, errorHandler, currentUser } from "@dash007tickets/common";
import cookieSession from "cookie-session";
import { createChargeRouter } from './routes/new';

//split out index js file in to two different files app.js and index.js. app.js must not listening on any port
//then we will have app.js file that will be imported im test file and will be tested as well as index file will be executed only when we want to run app 
// to run supertest the app  must not listen to any port. therefore we move start function in to index.js file with listening  on port 3000
//its relevant because we might make test on several services at the same time and they ar listening on same port that creates an issue
//we cannot make tests on different services just because they are both listening on the same port
const app = express();
app.set('trust proxy', true); //make express aware that behind the proxy is a nginx. nad trust the traffic even though comming from proxy
app.use(json());

app.use(
 cookieSession({
    signed:false,
    secure: process.env.NODE_ENV !=='test', // secure true means cookies ar only gonna get shared  when someone makes request to our server  over https connection so supertest is not a https request  
})); // process.env.NODE_ENV !=='test' means if its test give false otherwise true


app.use(currentUser); // if user is authenticated its gonna set on currentUser property
app.use(createChargeRouter);

//when we have any request coming to our  app all = any to any route '*' means to any rout we do not recognize we throw NotFoundError 404 
app.all('*', async(req, res)=> { //any routs come that we don't recognize throw error
  throw new NotFoundError();
});


app.use(errorHandler);

export {app};