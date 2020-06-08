import request from 'supertest';
import { app } from '../../app';
import mongoose from 'mongoose';

const createTicket = () => {
  const title = 'test';
  const price = 20;

  return request(app)
  .post('/api/tickets')
  .set('Cookie', global.signin())
  .send({
    title,
    price,
  })
  .expect(201);
}

it('can fetch the list of tickets', async () => {
  await createTicket();
  await createTicket();
  await createTicket();

  const response = await request(app)
    .get(`/api/tickets`)
    .send()
    .expect(200);

  expect(response.body.length).toEqual(3);
})
