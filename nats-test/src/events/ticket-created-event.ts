import { Subjects } from './subjects'; 

export interface TicketCreatedEvent { //this interfaces will make sure that we have a   matching subject and data in one of our listeners we put together
subject: Subjects.TicketCreated; //coupling with specific subject
      data: { //structure of data
        id: string ;
        title: string;
        price: number;
      }

}