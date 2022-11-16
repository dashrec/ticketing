import express, { Request, Response } from 'express';
import { requireAuth, validateRequest, NotFoundError, OrderStatus, BadRequestError } from '@dash007tickets/common';
import { body } from 'express-validator';
import mongoose from 'mongoose';
import { Ticket } from '../models/ticket';
import { Order } from '../models/order';
import { OrderCreatedPublisher } from '../events/publishers/order-created-publisher';
import { natsWrapper } from '../nats-wrapper';

const router = express.Router();
const EXPIRATION_WINDOW_SECONDS = 1 * 60; //expiration window of time

router.post('/api/orders', requireAuth,
[
  body('ticketId') //this ticket id is ref to some id in mongo db. so should have the structure of mongo id. so string of characters  
    .not()
    .isEmpty()
    .custom((input: string) => mongoose.Types.ObjectId.isValid(input)) //makes sure that id what the user provided has the structure of a real mongo ID and tickets service has mongoDB as a service db
    .withMessage('TicketId must be provided'),
],validateRequest,

async (req: Request, res: Response) => {
  const { ticketId } = req.body;
  const ticket = await Ticket.findById(ticketId);

  if (!ticket) {  
    throw new NotFoundError();
  }

  // Make sure that this ticket is not already reserved
  const isReserved = await ticket.isReserved();
  if (isReserved) {
    
    throw new BadRequestError('Ticket is already reserved');
  }


    // Calculate an expiration date for this order
    const expiration = new Date(); //gets actual time during creating an order
    expiration.setSeconds(expiration.getSeconds() + EXPIRATION_WINDOW_SECONDS); //sets the expiration time

    // Build the order and save it to the database
    const order = Order.build({
      userId: req.currentUser!.id,
      status: OrderStatus.Created,
      expiresAt: expiration,
      ticket,  // we found above
    });
    await order.save();

    // Publish an event saying that an order was created
    new OrderCreatedPublisher(natsWrapper.client).publish({
      id: order.id,
      version: order.version,
      status: order.status,
      userId: order.userId,
      expiresAt: order.expiresAt.toISOString(), //UTC timestamp  is going to work regardless of what the time zone of the service that is receiving this event is in. so get utc timestamp!

   
      ticket: {
        id: ticket.id,
        price: ticket.price,
      },
    });




    res.status(201).send(order);
});

export { router as newOrderRouter };




