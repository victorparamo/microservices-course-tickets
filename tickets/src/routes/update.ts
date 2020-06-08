import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import {
  RequireAuth,
  ValidateRequest,
  NotAuthorizedError,
  NotFound,
} from '@vptickets/common'

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

    res.status(200).send(ticket);
  }
);

export { router as updateTicketRouter };
