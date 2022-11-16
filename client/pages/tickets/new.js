import { useState } from 'react';
import useRequest from '../../hooks/use-request';
import Router from 'next/router';

const NewTicket = () => {
  const [title, setTitle] = useState('');
  const [price, setPrice] = useState('');

  const { doRequest, errors } = useRequest({ url: '/api/tickets', method: 'post',
    body: {
      title,
      price,
    },
    onSuccess: () => Router.push('/'),
   // onSuccess: (ticket) => console.log(ticket),  //callback gets the recorded ticket back
  });

  const onSubmit = (event) => {
    event.preventDefault();

    doRequest();
  };


  const onBlur = () => {
    const value = parseFloat(price);

    if (isNaN(value)) {  //parseFloat("test")  on character gives nun so if value is character do nothing.  otherwise format it like 12 - 12.00 or 12.000001 - 12.00  or 12.007 - 12.01
      return;
    }

    setPrice(value.toFixed(2));
  };



  return (
    <div>
      <h1>Create a Ticket</h1>
      <form onSubmit={onSubmit}>
        <div className="form-group">
          <label>Title</label>
          <input value={title} onChange={(e) => setTitle(e.target.value)} className="form-control"/>
        </div>
        <div className="form-group">
          <label>Price</label>
          <input value={price} onBlur={onBlur} onChange={(e) => setPrice(e.target.value)} className="form-control"/>
        </div>
        {errors}
        <button className="btn btn-primary">Submit</button>
      </form>
    </div>
  );
};

export default NewTicket;
