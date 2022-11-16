import 'bootstrap/dist/css/bootstrap.css';
import buildClient from '../api/build-client';
import Header from '../components/header';
//if we ever want to include global css we can only import global css in this app file



//Component = one of the components from pages.  pageProps are going to be set of components from where it takes only one component to pass
//export default ({Component, pageProps}) => {
 const AppComponent = ({Component, pageProps, currentUser}) => {  //take user and provide it to header
  return (<div> 
                      <Header currentUser = {currentUser} />       
              <div className="container">
                    <Component currentUser={currentUser} {...pageProps} />  {/* actual pages that sees the user + pass currentUser to child components meaning every comp inside pages dir */}
             </div>
         </div>  //whenever navigate to different pages next is gonna import one of the components from pages directory. and pass as Component. it wraps up with own default component
); };


//next js does not handle  getInitialProps on multiple location
AppComponent.getInitialProps = async (appContext) => {

const client = buildClient(appContext.ctx);
const { data } = await client.get('/api/users/currentuser');   // fetch current User

let pageProps = {};  //check to make sure that the child component has the initial props
if(appContext.Component.getInitialProps){ // we have signin and signup pages that do not have  getInitialProps Function therefore we must check
   pageProps = await appContext.Component.getInitialProps(appContext.ctx, client, data.currentUser); //data.currentUser =  fetch some data tied to a user, what the user's ID is or something like that.


}
return { 
   pageProps, //it will be returned above  const AppComponent = ({Component,  ---> pageProps, currentUser}) 
   ...data  
  };

}

export default AppComponent;


//next js is going to call this function while rendering our app on the server. so we fetch data which this component needs during the rendering process
//so anytime we want to fetch data from server we need to define getInitialProps function here and this function will be executed on server