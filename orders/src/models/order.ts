import mongoose from 'mongoose';
import { OrderStatus } from '@dash007tickets/common';
import { TicketDoc } from './ticket';
import { updateIfCurrentPlugin } from 'mongoose-update-if-current';

export { OrderStatus };


interface OrderAttrs {  //describes properties that are used to create order
  userId: string;
  status: OrderStatus; //status must be one of the statuses listed in OrderStatus
  expiresAt: Date;
  ticket: TicketDoc;
}
// the reason of creating two interfaces is because the properties that are required to create order might be different than properties that actually end up on an order
interface OrderDoc extends mongoose.Document {  //describes properties that saved doc has
  userId: string;
  status: OrderStatus;
  expiresAt: Date;
  ticket: TicketDoc;
  version: number; //mongoose.Document doc has __v property which is usually used for tracking version but we are recording the versions on a version property. to excess it we need to add this
}

interface OrderModel extends mongoose.Model<OrderDoc> { //describes properties that order model has
  build(attrs: OrderAttrs): OrderDoc; //allow typescript type checking on properties to create new doc.  out of (attrs: OrderAttrs), we will get an order document. 
}



const orderSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      required: true,
//But we can also add in some validation on mongoose side to make sure that anytime someone tries to change or set the status property right here, Mongoose will make
// sure that it gets set to one of several possible values.
      enum: Object.values(OrderStatus),
      default: OrderStatus.Created,
    },
    expiresAt: {
      type: mongoose.Schema.Types.Date,
    },
    ticket: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Ticket',
    },
  },
  {
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id; //get id out of _id and then delete  _id
        delete ret._id;
      },
    },
  }
);

orderSchema.set('versionKey', 'version'); //tell mongo to track all fields using the field version instead of default version field __v
orderSchema.plugin(updateIfCurrentPlugin);


orderSchema.statics.build = (attrs: OrderAttrs) => { //this is going to give us build method on actual order model
  return new Order(attrs);
};

const Order = mongoose.model<OrderDoc, OrderModel>('Order', orderSchema);

export { Order };
