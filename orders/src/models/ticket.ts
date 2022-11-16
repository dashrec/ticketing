import mongoose from 'mongoose';
import { Order, OrderStatus } from './order';
import { updateIfCurrentPlugin } from 'mongoose-update-if-current';

interface TicketAttrs {
  id: string;
  title: string;
  price: number;
}
//export this to use in order model
export interface TicketDoc extends mongoose.Document {
  title: string;
  price: number;
  version: number;
  isReserved(): Promise<boolean>;
}

interface TicketModel extends mongoose.Model<TicketDoc> {
  build(attrs: TicketAttrs): TicketDoc;

  findByEvent(event: { // meaning findByEvent = find by id and previous version
    id: string;
    version: number;
  }): Promise<TicketDoc | null>; // return resolve or null. so either we will find doc or will be null

}

const ticketSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
  },
  {
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
      },
    },
  }
);

//the value of the document that we're trying to save is available inside this function as this. And if we used an arrow function here that would override the value of this inside the function,


ticketSchema.set('versionKey', 'version'); //tell mongo to track all fields using the field version instead of default version field __v
ticketSchema.plugin(updateIfCurrentPlugin);

/* ticketSchema.pre('save', function (done) { // it will run anytime we will try to save a record
this.$where = {
  version: this.get('version') - 1 // whatever the current version is - 1
}
done();
}); */

ticketSchema.statics.findByEvent = (event: { id: string; version: number }) => {
  
  return Ticket.findOne({
    _id: event.id,
    version: event.version - 1,
  });


};




ticketSchema.statics.build = (attrs: TicketAttrs) => {
  //return new Ticket(attrs);
  
  return new Ticket({
    _id: attrs.id,
    title: attrs.title,
    price: attrs.price,
  });
};


    // Make sure that this ticket is not already reserved
    // Run query to look at all orders.  Find an order where the ticket
    // is the ticket we just found *and* the orders status is *not* cancelled.
    // If we find an order from that means the ticket *is* reserved

ticketSchema.methods.isReserved = async function () {
  // this === the ticket document that we just called 'isReserved' on
  const existingOrder = await Order.findOne({ 
    ticket: this,
    status: {
      $in: [
        OrderStatus.Created,
        OrderStatus.AwaitingPayment,
        OrderStatus.Complete,
      ],
    },
  });
                            // That's essentially going to take existing order if that thing is equal to null.
  return !!existingOrder;  // It will be flipped to true by the first exclamation and then flip back to false with the second one.
};


const Ticket = mongoose.model<TicketDoc, TicketModel>('Ticket', ticketSchema);

export { Ticket };
