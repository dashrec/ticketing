/* export const natsWrapper = { 
   //ticket created publisher in new.ts  will receive  fake client object for test environment and in base publisher file will show up it. base publisher will assign it 
   //to this.client property. and at some point of time route handler call publish function to try to publish some event and it will access a fake publish function 

  client: {
    publish:(subject: string, data: string, callback: () => void) => {
      callback();
    }
  }
} */




export const natsWrapper = {
  client: {
    publish: jest.fn().mockImplementation(
        (subject: string, data: string, callback: () => void) => {
          callback();
        }
      ),
  },
};
