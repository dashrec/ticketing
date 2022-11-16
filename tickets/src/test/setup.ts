import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import { app } from '../app';
import request from 'supertest';
import jwt from 'jsonwebtoken';

// running copy of mongo in memory so we can easily test multiple databases at the same time
// we ar not going to run test inside of our image at any point of time so we don't need to install any dependency as we re building the image. thats why we install as --save-dev
// MongoMemoryServer start up copy of mongodb in memory that allows us to make multiple test  at the same time across different projects without them to try reach out the copy of mongo  
//gives us direct memory excess to mongo db 
let mongo: any;

/* declare global { 
  var signin: () => Promise<string[]>;
} */
declare global {// tell typescript there is a global property called signin
  var signin: () => string[];
}

jest.mock('../nats-wrapper'); //it will redirect to __mocks__ folder

beforeAll(async () => { //hook function its going to run before all our test
  jest.clearAllMocks(); //between each our test we need to reset muck function. muck function internally is going to record how many times gets called. different arguments were provided and so on. so we do not want to pollute one test with data from another test
  process.env.JWT_KEY='test'; // <---defining a key!  in order to create json web token we need to use JWT_KEY. 

  const mongo = await MongoMemoryServer.create();
  const mongoUri = mongo.getUri();

  await mongoose.connect(mongoUri, {});
});

beforeEach(async () => {
  const collections = await mongoose.connection.db.collections();

  for (let collection of collections) {
    await collection.deleteMany({}); // delete or reset all the data in mongodb instance --->  mongo = new MongoMemoryServer();
  }
});

afterAll(async () => {
  if (mongo) {
    await mongo.stop();
  }
  await mongoose.connection.close();
});

/* 
global.signin = () => { // with global we can avoid importing file 

//build a jwt payload {id, email}

const payload = {
  id: '1lk24j124l',
  email: 'test@test.com',
}; */

global.signin = () => {
  // Build a JWT payload.  { id, email }
  const payload = {
    id: new mongoose.Types.ObjectId().toHexString(), // generate random id
    email: 'test@test.com',
  };

// Create the JWT!
const token = jwt.sign(payload, process.env.JWT_KEY!); // sign method comes from  import jwt from 'jsonwebtoken';

// Build session Object. { jwt: MY_JWT }
const session = { jwt: token };

// Turn that session into JSON
const sessionJSON = JSON.stringify(session);

// Take JSON and encode it as base64
const base64 = Buffer.from(sessionJSON).toString('base64');

// return a string thats the cookie with the encoded data
//return [`express:sess=${base64}`]; //express:sess is a key of cookie: express:sess = base64 in req headers when authenticating
return [`session=${base64}`];

};