export interface IRegister {
    regId:number;
    active:boolean;
    name: string;
    phone: string;
    startDate: Date;
    endDate?:Date;
    docId: number;
    docName:string;
    price: number;

  }
  