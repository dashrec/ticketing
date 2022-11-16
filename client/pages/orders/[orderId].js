import { useEffect, useState } from 'react';
import StripeCheckout from 'react-stripe-checkout';
import useRequest from '../../hooks/use-request';
import Router from 'next/router';

const OrderShow = ({ order, currentUser }) => {

  const [timeLeft, setTimeLeft] = useState(0);

  const { doRequest, errors } = useRequest({url: '/api/payments', method: 'post',
    body: {
      orderId: order.id,
    },
    onSuccess: () => Router.push('/orders'),
  });


  useEffect(() => {
    const findTimeLeft = () => {
      const msLeft = new Date(order.expiresAt) - new Date();
      setTimeLeft(Math.round(msLeft / 1000));
    };

    findTimeLeft(); // it calls this function immediately
    // call that function again and again
    const timerId = setInterval(findTimeLeft, 1000); // So when you call set interval, it's going to wait that amount of time before calling that function for the very first time.

    return () => {
      clearInterval(timerId);
    };
  }, [order]);

  if(timeLeft<0) { 
    return <div>Order Expired</div>;
  }


  return (
    <div>
      Time left to pay: {timeLeft} seconds
      <StripeCheckout
    //    token={(token) => console.log(token)}
        token={({ id }) => doRequest({ token: id })}// send token with orderId: order.id, in body above. it merges token with order id 
        stripeKey="pk_test_51M4U6iDq5KTwCKpva6m7ESAyjIfppMKbAsLKA9eUwYygCx7eWvawfR5f1NFCsDAfgc0CQlPR8vnrwZsNEFhunxKd00UKwapDcz"
        amount={order.ticket.price * 100} // it treats  as a cents
        email={currentUser.email}
      />
      {errors}
    </div>
  );
};


OrderShow.getInitialProps = async (context, client) => {
  const { orderId } = context.query;


    const { data } = await client.get(`/api/orders/${orderId}`);
    return { order: data };
 

};

export default OrderShow;
