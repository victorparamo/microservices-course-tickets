import request from 'supertest';
import { app } from '../../app';
import mongoose from 'mongoose';

const createTicket = (cookie?: string[]) => {
  const title = 'test';
  const price = 20;

  return request(app)
    .post('/api/tickets')
    .set('Cookie', cookie || global.signin())
    .send({
      title,
      price,
    })
    .expect(201);
}

it('returns a 404 if the provided id does not exist', async () => {
  const id = mongoose.Types.ObjectId().toHexString();

  await request(app)
    .put(`/api/tickets/${id}`)
    .set('Cookie', global.signin())
    .send({
      title: 'ccsd',
      price: 20,
    })
    .expect(404);
});

it('returns a 401 if the user is not authenticated', async () => {
  const id = mongoose.Types.ObjectId().toHexString();

  await request(app)
    .put(`/api/tickets/${id}`)
    .send({
      title: 'ccsd',
      price: 20,
    })
    .expect(401);
});

it('returns a 401 if the user does not own the ticket', async () => {
  const response = await createTicket();

  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set('Cookie', global.signin())
    .send({
      title: 'ccsd',
      price: 20,
    })
    .expect(401);
});

it('returns a 400 if the user provides an invalid title or price', async () => {
  const cookie = global.signin();
  const response = await createTicket(cookie);

  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set('Cookie', cookie)
    .send({
      title: '',
      price: 20,
    })
    .expect(400);
  
  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set('Cookie', cookie)
    .send({
      title: '',
      price: -10,
    })
    .expect(400);
  
  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set('Cookie', cookie)
    .send({
      title: 'ccdcd',
      price: -10,
    })
    .expect(400);
});

it('can fetch the list of tickets', async () => {
  const cookie = global.signin();
  const responseCreate = await createTicket(cookie);

  const newTitle = 'testUpdated';
  const response = await request(app)
    .put(`/api/tickets/${responseCreate.body.id}`)
    .set('Cookie', cookie)
    .send({
      title: newTitle,
      price: 1000,
    })
    .expect(200);

  expect(response.body.title).toEqual(newTitle);
})
