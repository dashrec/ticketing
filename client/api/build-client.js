import axios from 'axios';


//So remember, depending upon whether we are running our application or really rendering our app on the
// Kubernetes cluster, so during the server side rendering phase or whether we are running our app inside
// the browser, we are creating a slightly different copy of Axios.
//So every single time we fetch data, we need to first run this build client function.
//In other words, for every get initial props, we need to somehow get the current client.
//Directly connected either to Ingress and Gen X or to well, just use the base URL.
//In other words, just use the current domain, make a request back off to our endpoint, our back end servers.

export default ({ req }) => {
  if (typeof window === 'undefined') {
    // We are on the server
    //inside headers there are, cookie object and domain name as well ticketing.dev 
    return axios.create({ baseURL: 'http://ingress-nginx-controller.ingress-nginx.svc.cluster.local', headers: req.headers }); //create preconfigured version of axios

  } ////baseURL = service name, namespace, ... 
  
  else {
    // We must be on the browser
    return axios.create({ baseUrl: '/' });
  }


};
