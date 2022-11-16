import express, { Request, Response } from 'express';
import { requireAuth, validateRequest } from '@dash007tickets/common';
import {body} from 'express-validator';
import { Ticket } from '../models/ticket';
import { TicketCreatedPublisher } from '../events/publishers/ticket-created-publisher';
import { natsWrapper } from '../nats-wrapper';

// this is a route handler
const router = express.Router();

router.post('/api/tickets', requireAuth, 
[
  body('title').not().isEmpty().withMessage('Title is required'), //make sure its not empty. its gonna handle on both case. 1 = title is not provided 2=is but empty
  body('price').isFloat({ gt: 0 }).withMessage('Price must be greater than 0'),
],
validateRequest,
async (req: Request, res: Response) => {
  const { title, price } = req.body; //destruct
    const ticket = Ticket.build({
      title,
      price,
      userId: req.currentUser!.id, //1. we can excess to currentUser because we set app.use(currentUser); in app.ts file  2.typescript tells u have to check first if currentUser is defined, but we dont need to do that. remember, requireAuth is already checks it and if its not defined it would throw an error so that it would never reach to this  route handler
    });  // typescript does not look in requireAuth function and understanding about currentUser check if function
    await ticket.save();
//wait untill ticket is  saved in database.  publishing event to nats 
    await new TicketCreatedPublisher(natsWrapper.client).publish({ //if we try to access this client it throws an error client = geter defined in nats-wraper
      id: ticket.id,
      title: ticket.title,
      price: ticket.price,
      userId: ticket.userId,
      version: ticket.version,
    });
    res.status(201).send(ticket); //send res to user with updated ticket


//  res.sendStatus(200); 
});

export { router as createTicketRouter };

//createTicketRouter must be imported in app.ts and wired up like this app.use(createTicketRouter);
// requireAuth is middleware thats able to find out if the user is authenticated or not