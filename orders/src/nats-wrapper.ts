import nats, { Stan } from 'node-nats-streaming';
//we do not want to assign client untill we call connect to mongo db from index file
class NatsWrapper {
  private _client?: Stan; //_client? <-- meaning telling typescript _client mit be undefined for some period of time and don't worry

  get client(){ //accessing nats client before connecting to throw error
        if(!this._client){
        throw new Error('Cannot access NATS client before connecting');
}//else
      return this._client; 
  }
  connect(clusterId: string, clientId: string, url: string) { //we are gonna receive all those arguments here
    this._client = nats.connect(clusterId, clientId, { url }); //create instance of nats client and assign to _client? variable  
    return new Promise<void>((resolve, reject) => { //because we try to access client in  callback function,  typescript thinks we might reassign client in between 
      this.client.on('connect', () => { 
        console.log('Connected to NATS');
        resolve();
      });
      this.client.on('error', (err) => {
        reject(err);
      });
    });
  }
}

export const natsWrapper = new NatsWrapper(); // exporting only one single instance and not whole class, that will be shared in all of our different files


