import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectEntityManager, InjectRepository } from '@nestjs/typeorm';
import { timingSafeEqual } from 'crypto';
import { doc } from 'prettier';
import { from, Observable } from 'rxjs';
import { DeleteDateColumn, DeleteResult, FilterQuery, MoreThan, Repository, UpdateResult } from 'typeorm';
import { CreateRegisterDto, UpdateRegisterDto } from './dto';
import { RegisterEntity } from './entity';
import { IDoc, IRegister } from './interface';

@Injectable()
export class DentalService {
    private DB:IDoc[];
    constructor(
        @InjectRepository(RegisterEntity)
        private readonly regRep:Repository<RegisterEntity>){
        this.DB=[
            {
                docId:1,
                docName:'Axe',
                price:100,

            },
            {
                docId:2,
                docName:'Norse',
                price:50,
            },
        ];
    }

    findAll() :Observable<IRegister[]> {
        this.regRep.find()
        return from(this.regRep.find());
    }
    // async find() {
    //     return this.DB;
    // }

    getHours(date:Date){
        const getTime=new Date(`${date}`);
        let hours=getTime.getUTCHours()
        return hours
    }

    // async checkDate(date:any) {
    //     // date = new Date(date);
    //     const weekDay = new Date(date).getDay();
    //     if (weekDay == 0 || weekDay == 6) {
    //         throw new BadRequestException(400, 'You cant register on weekends!')
    //     }
    //     
        
    // }
    findActive(reg:RegisterEntity){
        const today=new Date().getMonth()
        const datee=new Date(reg.startDate).getMonth()
        console.log(today)

        if(datee<today){
            return this.findAll()
        }

    }
    isAvailable(docId:number,startDate:Date){
        const newd=new Date(startDate)
        if(docId){
            const exist=this.regRep.find({startDate}) 
            if(!exist){
                return exist
            }
        }
        
        
        // //
        // // const newd=new Date(date)
        // if(exist){
        //     const datee=new Date(date)
        //     if (!datee){
        //         return datee
        //     }
        //     // const exist=this.getHours(date)
        //     // console.log(exist)
        //     // if(exist){
        //     //     return date
        //     // }
            
        // }
        
    }
    
    

    findDocReg(docId: number){
        
        const id = this.regRep.find({docId})
        if (!id) {
           throw new BadRequestException(400,'This doctor ID does not exist! Try 1 or 2');
        }else{
            return id
        }
        
    }
    
    create(reg:CreateRegisterDto): Observable<CreateRegisterDto>{
        let {docId,docName,price,startDate,endDate}=reg;
        startDate=new Date(startDate)
        const end=new Date(startDate).setMilliseconds(1*60*60*1000)
        reg.endDate=new Date(end)

        const exist = this.DB.find((doc) => doc.docId == docId);
        if (!exist) {
        throw new ConflictException();
        }
        
        // if(startDate){
        //     const exist=this.regRep.find({docId})
            
        // }
        // const checkAvail=this.isAvailable(docId,date)
        // if(!checkAvail){
        //     throw new BadRequestException(400,'This termin is already taken!')
        // }
        
        const weekday=new Date(startDate).getDay();
        if (weekday==0||weekday==6){
            throw new BadRequestException(400, 'You cant register on weekends!');
        }
        const getTime=new Date(`${startDate}`);
        let hours=getTime.getUTCHours()
       
        if(hours>16 || hours<9){
            throw new BadRequestException(400, 'workhours are from 9-17!');
        } else if(hours==12){
            throw new BadRequestException(400,'lunch break')
        }
        
        const doc = this.DB.find((doc) => doc.docId == docId);
        reg.docId=doc.docId
        reg.price=doc.price
        reg.docName=doc.docName
        return from(this.regRep.save(reg));
     
    }

    update(id:number,reg:UpdateRegisterDto){
        const {startDate,docId}=reg;
        if (docId){
            const doc = this.DB.find(doc => doc.docId === docId);
            if(!doc){
                throw new BadRequestException(400,'This docId does not exist!')
            }
            reg.docId=doc.docId
            reg.price=doc.price
            reg.docName=doc.docName
            
        }
        // const doc = this.DB.find((doc) => doc.docId == docId);
        // reg.docId=doc.docId
        // reg.price=doc.price
        // reg.docName=doc.docName
        // const exist = this.DB.find((doc) => doc.docId == docId);
        // if (!exist) {
        // throw new ConflictException();
        // }
        // if(startDate){
        //     const exist=this.regRep.find({docId})
            
        // }
        //const start=new Date(startDate)
        if (startDate){
            reg.endDate=new Date(new Date(startDate).setMilliseconds(1*60*60*1000))
        }
        
        
        const weekday=new Date(startDate).getDay();
        if (weekday==0||weekday==6){
            throw new BadRequestException(400, 'You cant register on weekends!');
        }
        const getTime=new Date(`${startDate}`);
        let hours=getTime.getUTCHours()
        if(hours>16 || hours<9){
            throw new BadRequestException(400, 'workhours are from 9-17!');
        } else if(hours==12){
            throw new BadRequestException(400,'lunch break')
        }
        
        return from(this.regRep.update(id,reg))
    } 

    delete(id:number):Observable<DeleteResult>{
        return from(this.regRep.delete(id));
    }
    deleteAll(){
        return from(this.regRep.clear())
    }

}
