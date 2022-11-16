import mongoose from 'mongoose';
import { updateIfCurrentPlugin } from 'mongoose-update-if-current';
import { OrderStatus } from '@dash007tickets/common';

interface OrderAttrs { //properties we must provide when building the order 
  id: string;
  version: number;
  userId: string;
  price: number;
  status: OrderStatus;
}

interface OrderDoc extends mongoose.Document { //list of properties that the order has. id is already listed in that doc
  version: number;
  userId: string;
  price: number;
  status: OrderStatus;
}

interface OrderModel extends mongoose.Model<OrderDoc> {  //list of properties model itself contains
  build(attrs: OrderAttrs): OrderDoc; //take object attrs with type OrderAttrs and return OrderDoc 
}

const orderSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      required: true,
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

orderSchema.set('versionKey', 'version');
orderSchema.plugin(updateIfCurrentPlugin);

orderSchema.statics.build = (attrs: OrderAttrs) => {
  return new Order({
    _id: attrs.id,
    version: attrs.version,
    price: attrs.price,
    userId: attrs.userId,
    status: attrs.status,
  });
};

const Order = mongoose.model<OrderDoc, OrderModel>('Order', orderSchema);

export { Order };
