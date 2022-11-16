import request from 'supertest';
import { app } from '../../app';
import { Ticket } from '../../models/ticket';
import { natsWrapper } from '../../nats-wrapper';
//import '@types/jest';
//new ts 



it('has a route handler listening to /api/tickets for post requests', async () => {

  //make request ro an app and send empty object. 
  const response = await request(app).post('/api/tickets').send({});

  expect(response.status).not.toEqual(404); //404 means  route not found new.ts is route if its comment out u get 404

});

it('can only be accessed if the user is signed in', async () => { 

   await request(app).post('/api/tickets').send({}).expect(401);//401 means unauthorized error defined in common errors. auth is not tight to this route at this time so we do not get what we expect 401 meaning test works

});

it('returns a status other than 401 if the user is signed in', async () => {
  const response = await request(app).post('/api/tickets')
  .set('Cookie', global.signin())
  .send({});
  //console.log(response.status);
  expect(response.status).not.toEqual(401);
});




it('returns an error if an invalid title is provided', async () => {

  await request(app).post('/api/tickets') // expected 400 "Bad Request", got 200 "OK"  because route handler responses with  res.sendStatus(200);  at that time 
  .set('Cookie', global.signin())
  .send({title: '', price:23}).expect(400);

  await request(app).post('/api/tickets')
  .set('Cookie', global.signin())
  .send({price:23}).expect(400);
});



it('returns an error if an invalid price is provided', async () => {

  await request(app).post('/api/tickets')
  .set('Cookie', global.signin())
  .send({title: 'adasdasd', price: -10 }).expect(400);

  await request(app).post('/api/tickets')
  .set('Cookie', global.signin())
  .send({title: 'adasdasd'}).expect(400);
});



it('creates a ticket with valid inputs', async () => {

  let tickets = await Ticket.find({}); //get all tickets that exist

  expect(tickets.length).toEqual(0); // because in test setup.ts file we delete all collection.deleteMany({});  

  const title = 'asldkfj';


  await request(app).post('/api/tickets')
    .send({ title, price: 20})
    .set('Cookie', global.signin())
    .expect(201); // 201 record wa created


    tickets = await Ticket.find({}); //get all tickets

    expect(tickets.length).toEqual(1); //after we create we expect 1
    expect(tickets[0].price).toEqual(20);
    expect(tickets[0].title).toEqual(title);

}); //at this point test is gonna fail because actual implementation is not done jet in route handler new.ts file



it('publishes an event', async () => {
  const title = 'asldkfj';

  await request(app).post('/api/tickets').set('Cookie', global.signin())
    .send({
      title,
      price: 20,
    })
    .expect(201);
//console.log(natsWrapper);
  expect(natsWrapper.client.publish).toHaveBeenCalled(); //make sure publish function was called after creating the ticket
});
