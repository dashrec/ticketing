import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import { app } from '../app';
import request from 'supertest';
// running copy of mongo in memory so we can easily test multiple databases at the same time
// we ar not going to run test inside of our image at any point of time so we don't need to install any dependency as we re building the image. thats why we install as --save-dev
// MongoMemoryServer start up copy of mongodb in memory that allows us to make multiple test  at the same time across different projects without them to try reach out the copy of mongo  
//gives us direct memory excess to mongo db 
let mongo: any;

declare global { // tell typescript there is a global property called signin
  var signin: () => Promise<string[]>;
}


beforeAll(async () => { //hook function its going to run before all our test
  process.env.JWT_KEY='test';

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


global.signin=async () => { // with global we can avoid importing file 
  const email = 'test@test.com';
  const password = 'password'
  const response = await request(app).post('/api/users/signup').send({
    email, 
    password
  }).expect(201);

const cookie = response.get('Set-Cookie');
return cookie; // save cookie on signin function
};