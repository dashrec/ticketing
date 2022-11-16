import useRequest from '../../hooks/use-request';
import Router from 'next/router';
const TicketShow = ({ ticket }) => {
  const { doRequest, errors } = useRequest({url: '/api/orders', method: 'post',
    body: {
      ticketId: ticket.id,
    },
   // onSuccess: (order) => console.log(order),
   onSuccess: (order) =>
   Router.push('/orders/[orderId]', `/orders/${order.id}`), // 1.arg = path to the file.  2.arg = actual order 
  });
//So we do not want to have any parentheses on {doRequest()}. If you put parentheses on this, then do request will be called the instant this component is first rendered.
  return (
    <div>
      <h1>{ticket.title}</h1>
      <h4>Price: {ticket.price}</h4>
      {errors}
      <button onClick={() => doRequest()} className="btn btn-primary">
        Purchase
      </button>
    </div>
  );
};
//<button onClick={() => doRequest()} <-- ref Finally on click and we're going to wrap that with an arrow function. So now even though this does get called with an event object, we're not going to receive it. We're not going to pass it through to do requests or anything like that.

TicketShow.getInitialProps = async (context, client) => {
  // So whatever you name the file inside those square brackets, that is the query or part of the query that is going to be extracted.

  const { ticketId } = context.query; //extract id from context. 
  const { data } = await client.get(`/api/tickets/${ticketId}`);

  return { ticket: data }; // This object right here is now going to be merged into all the different props that are provided to ticket show.


};



export default TicketShow;


//Whatever word we put inside of those square brackets that will be provided to us as a parameter inside of that context, our object that gets passed to our get initial function.

