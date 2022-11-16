import { OrderCancelledEvent, Subjects, Listener, OrderStatus } from '@dash007tickets/common';
import { Message } from 'node-nats-streaming';
import { queueGroupName } from './queue-group-name';
import { Order } from '../../models/order';

export class OrderCancelledListener extends Listener<OrderCancelledEvent> {
  subject: Subjects.OrderCancelled = Subjects.OrderCancelled;
  queueGroupName = queueGroupName;

  async onMessage(data: OrderCancelledEvent['data'], msg: Message) {

    const order = await Order.findOne({
      _id: data.id,
      version: data.version - 1,//not strictly needed at that time but for the future if it will be needed we just add it anyways. it starts get important if we update an order
    });

    if (!order) {
      throw new Error('Order not found');
    }

    order.set({ status: OrderStatus.Cancelled });
    await order.save();

    msg.ack();
  }
}
