import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import {  InjectRepository } from '@nestjs/typeorm';
import { from, Observable } from 'rxjs';
import { DeleteResult, MoreThan, Repository } from 'typeorm';

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
        const today=new Date()
        return this.regRep.find({
            where:{
                startDate:MoreThan(today)
            }
        })
    }
    isAvailable(docId:number,startDate:Date){
        const neww=new Date(startDate)
        const a=this.regRep.find({startDate})
        console.log(neww,a)


        const exist=this.regRep.find({startDate})
        if(exist){
            const datee=new Date(startDate)
            if (datee){
                throw new BadRequestException(400,'this termin is already taken')

            }
        }
        //const exist=this.regRep.find({startDate})
        // if(docId){
        //     const newd=new Date(startDate)
        //     const exist=this.regRep.find({startDate}) 
        //     if(!exist){
        //         return newd
        //     }
        // }
        
        
        //
        // const newd=new Date(date)
        // const exist=this.regRep.find({startDate})
        // if(exist){
        //     const datee=new Date(startDate)
        //     if (datee){
        //         throw new BadRequestException(400,'this termin is already taken')

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
    isSame=(a,b)=>{
        return a.getFullYear()===b.getFullYear() && 
        a.getMonth()===b.getMonth() &&
        a.getDay()===b.getDay() &&
        a.getUTCHours()===b.getUTCHours()        
    }
    
    create(reg:RegisterEntity): Observable<RegisterEntity>{
        let {docId,docName,price,startDate,endDate}=reg;
        
        startDate=new Date(startDate)
        const end=new Date(startDate).setMilliseconds(1*60*60*1000)
        reg.endDate=new Date(end)

        const b=this.regRep.find({where:{startDate:startDate}})
        //console.log(b)

        const neww=new Date(startDate)
        const a=this.regRep.find({startDate})
        //console.log(neww,a)
        //console.log(`${startDate}`)

        // const isSame=(a,b)=>{
        //     return a.getFullYear()===b.getFullYear() && 
        //     a.getMonth()===b.getMonth() ||
        //     a.getDate()===b.getDate() ||
        //     a.getUTCHours()===b.getUTCHours()        
        // }
        // //const start=new Date(startDate.getFullYear(),startDate.getMonth(),startDate.getDate(),startDate.getUTCHours())
        // const newdate=new Date(startDate)
        // if (newdate){
        //     const newd=new Date(newdate.getFullYear(),newdate.getMonth(),newdate.getDate(),newdate.getUTCHours())
        //     //const id = this.regRep.find({docId})
        //     // if(docId){
        //     reg.startDate=new Date(startDate)
        //     console.log(newdate,reg.startDate)
        //     // }
        //     const start=new Date(reg.startDate.getFullYear(),reg.startDate.getMonth(),reg.startDate.getDate(),reg.startDate.getUTCHours())
        //     // const exist=this.regRep.find({startDate})
        //     // reg.startDate=new Date(startDate.getFullYear(),startDate.getMonth(),startDate.getDate(),startDate.getUTCHours())
        //     const issSame=isSame(newd,start)
        //     if(issSame){
        //         throw new BadRequestException(400,'this termin is already taken')
        //     }
            
        // }
        

        // if(startDate){
        //     const exist=this.regRep.find({docId})
        //     if(+startDate==+reg.startDate){
        //         throw new BadRequestException(400,'this termin is already taken')

        //         //return docId
        //         // throw new BadRequestException(400,'this termin is already taken')
                
        //     }
            
        // }

        const exist = this.DB.find((doc) => doc.docId == docId);
        if (!exist) {
        throw new ConflictException();
        }
        
        
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

    update(id:number,reg:RegisterEntity){
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
