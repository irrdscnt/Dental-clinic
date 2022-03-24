export class UpdateRegisterDto {
    regId:number;

    active:boolean;
    
    name: string;

    phone: string;
  
    startDate?: Date;

    endDate?:Date;

    docId: number;

    price:number;

    docName: string;
}