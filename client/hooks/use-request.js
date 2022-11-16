import axios from 'axios';
import { useState } from 'react';

//this is hook and hooks ar used inside of component
export default ({ url, method, body, onSuccess }) => {

  const [errors, setErrors] = useState(null);

//props = {} <--- So now whenever we make use of our use request hook, when we call due request, we can pass in some additional properties to include with the request body.
  const doRequest = async (props = {}) => { //await requires async func.. empty {} by default

    try {
      setErrors(null);
      const response = await axios[method](url, { ...body, ...props }); //at that time we don't know what method are we gonna pass get post or whatever as well as url and a body
          if(onSuccess){  
              onSuccess(response.data); // onSuccess will be called with response.data
          }

      return response.data; //this goes to doRequest function
    } catch (err) { //jsx block
      setErrors(
        <div className="alert alert-danger">   
          <h4>Ooops....</h4>
          <ul className="my-0">
            {err.response.data.errors.map((err) => (
              <li key={err.message}>{err.message}</li>
            ))}
          </ul>
        </div>
      );
    }
  };

  return { doRequest, errors }; //errors capchers errors might come from api
};
