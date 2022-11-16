import request from 'supertest';
import { app } from '../../app';
import mongoose from 'mongoose';

it('returns a 404 if the ticket is not found', async () => { // err 400 means not catched  error like 'smt went wrong'
 const id = new mongoose.Types.ObjectId().toHexString(); //generate id with mongoose built in Function
 const response =  await request(app).get(`/api/tickets/${id}`).send().expect(404);  //this id will be passed in router handler and from there to app index mongodb
 //console.log(response.body);

}); // in show.ts Route Handler returns 400 if Ticket is Found but not with right id -- > laskdjfalksfdlkakj

it('returns the ticket if the ticket is found', async () => {
  const title = 'concert';
  const price = 20;

  const response = await request(app).post('/api/tickets').set('Cookie', global.signin())
    .send({
      title,
      price,
    })
    .expect(201);

  const ticketResponse = await request(app).get(`/api/tickets/${response.body.id}`).send().expect(200);

  expect(ticketResponse.body.title).toEqual(title); 
  expect(ticketResponse.body.price).toEqual(price);
});
