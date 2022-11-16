import Link from 'next/link';

//index wil be used as a root route. we can not load data from server inside of component
/* const LandingPage = ({ currentUser }) => {
return currentUser ? ( <h1>You are signed in</h1> ) : ( <h1>You are not signed in</h1> )
}; */

// href="/tickets/[ticketId]"  = describes generic route without customized id 

const LandingPage = ({ currentUser, tickets }) => {
const ticketList = tickets.map((ticket) => {
  return (
    <tr key={ticket.id}>
      <td>{ticket.title}</td>
      <td>{ticket.price}</td>
      <td>
          <Link legacyBehavior  href="/tickets/[ticketId]" as={`/tickets/${ticket.id}`}>
            <a  className="nav-link">View</a>
          </Link>
      </td>
    </tr>
  );
});


return (
  <div>
    <h1>Tickets</h1>
    <table className="table">
      <thead>
        <tr>
          <th>Title</th>
          <th>Price</th>
          <th>Link</th>
        </tr>
      </thead>
      <tbody>{ticketList}</tbody>
    </table>
  </div>
);
};


//If we need to get access to our client, we can receive it as the second argument.
//And if we need to get access to the current user just so we can use their ID to fetch some data or something
LandingPage.getInitialProps = async (context, client, currentUser )=> { // context is an entire object. 

  const { data } = await client.get('/api/tickets'); // destruct data from res
  return { tickets: data }; // Now, this object right here, everything inside of here is going to be merged into the props that are being passed to the landing page. meaning currentUser
// pass this key tickets to LandingPage above
  

};
//this function  has access to the client, which we are using to make requests during the initial rendering process.




export default LandingPage;

