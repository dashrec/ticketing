import request from 'supertest';
import { app } from '../../app';
import { signupRouter } from '../signup';

it('responds with details about the current user', async () => {
/*  const authResponse = await request(app).post('/api/users/signup') //after signup cookie must be included
    .send({
      email: 'test@test.com',
      password: 'password'
    })
    .expect(201);
 */
/*   const cookie = authResponse.get('Set-Cookie'); //extract cookie */


const cookie = await global.signin();

  const response = await request(app).get('/api/users/currentuser')
    .set('Cookie', cookie) // set Cookie header and then actual cookie 
    .send()
    .expect(400);

    expect(response.body.currentUser.email).toEqual('test@test.com');
   // console.log(response.body); //cookie is not included in request because supertest does not have it by default
});


it('responds with null if not authenticated', async () => {
  const response = await request(app)
    .get('/api/users/currentuser')
    .send()
    .expect(200);

  expect(response.body.currentUser).toEqual(null);

});
