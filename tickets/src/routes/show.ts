import express, { Request, Response } from 'express';
import { NotFound } from '@vptickets/common'

import { Ticket } from '../models/tickets';

const router = express.Router();

router.get('/api/tickets/:id',
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const ticket = await Ticket.findById(id);

    if (!ticket) {
      throw new NotFound();
    }

    res.send(ticket);
  }
);

export { router as showTicketRouter };
