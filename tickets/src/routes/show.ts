import express, { Request, Response } from 'express';
import { NotFoundError } from '@dash007tickets/common';
import { Ticket } from '../models/ticket';

const router = express.Router();

router.get('/api/tickets/:id', async (req: Request, res: Response) => { // this id =show.test.ts file laskdjfalksfdlkakj
  const ticket = await Ticket.findById(req.params.id);

  if (!ticket) {
    throw new NotFoundError(); //Throws in common Directory Custom made --> not-found-error.ts that is on npm server uploaded
  }

  res.send(ticket);
});

export { router as showTicketRouter };
