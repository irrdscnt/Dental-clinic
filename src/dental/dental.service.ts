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

    getHours(date:Date){
        const getTime=new Date(`${date}`);
        let hours=getTime.getUTCHours()
        return hours
    }

    findActive(reg:RegisterEntity){
        const today=new Date()
        return this.regRep.find({
            where:{
                startDate:MoreThan(today)
            }
        })
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

        const exist = this.DB.find((doc) => doc.docId == docId);
        if (!exist) {
        throw new ConflictException();
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
