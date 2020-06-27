import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import {
  RequireAuth,
  ValidateRequest,
  NotAuthorizedError,
  NotFound,
} from '@vptickets/common';

import { TicketUpdatedPublisher } from '../events/ticket-updated-publisher';
import { natsWrapper } from '../nats-wrapper';

import { Ticket } from '../models/tickets';

const router = express.Router();

router.put('/api/tickets/:id',
  RequireAuth,
  [
    body('title')
      .not()
      .isEmpty()
      .withMessage('Title is required'),
    body('price')
      .isFloat({ gt: 0 })
      .withMessage('Price must be greater than 0')
  ],
  ValidateRequest,
  async (req: Request, res: Response) => {
    const { title, price } = req.body;

    const ticket = await Ticket.findById(req.params.id);

    if (!ticket) {
      throw new NotFound();
    }

    if (ticket.userId !== req.currentUser!.id) {
      throw new NotAuthorizedError();
    }

    ticket.set({
      title,
      price,
    });

    await ticket.save();
    new TicketUpdatedPublisher(natsWrapper.client).publish({
      id: ticket.id,
      title: ticket.title,
      price: ticket.price,
      userId: ticket.userId,
    });

    res.status(200).send(ticket);
  }
);

export { router as updateTicketRouter };
