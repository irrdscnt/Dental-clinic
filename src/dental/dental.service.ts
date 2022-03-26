import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import {  InjectRepository } from '@nestjs/typeorm';
import { from, Observable } from 'rxjs';
import { DeleteResult, LessThan, LessThanOrEqual, MoreThan, MoreThanOrEqual, Repository } from 'typeorm';
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

    getHours(date:Date){
        const getTime=new Date(`${date}`);
        let hours=getTime.getUTCHours()
        return hours
    }

    findActive(){
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
    
    async create(reg:CreateRegisterDto){
        let {docId,startDate}=reg;
        
        startDate=new Date(startDate)
        const end=new Date(startDate).setMilliseconds(1*60*60*1000)
        reg.endDate=new Date(end)

        const enddate=new Date(reg.endDate)
        const startdate=new Date(reg.startDate)
        const isAvailable= await this.regRep.find({
            where:{
                docId:reg.docId,
                startDate:LessThanOrEqual(enddate),
                endDate:MoreThanOrEqual(startdate)
            }
        })
        if (isAvailable.length>0){
            throw new BadRequestException(400,'this termin is already taken!')
        }


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

    async update(id:string,reg:UpdateRegisterDto){
        let {startDate,docId}=reg;

        if (docId){
            const doc = this.DB.find(doc => doc.docId === docId);
            if(!doc){
                throw new BadRequestException(400,'This docId does not exist!')
            }
            reg.docId=doc.docId
            reg.price=doc.price
            reg.docName=doc.docName
            
        }

        
        if (reg.startDate){
            if (docId){
                reg.startDate=new Date(startDate)
                const end=new Date(startDate).setMilliseconds(1*60*60*1000)
                reg.endDate=new Date(end)
                const enddate=new Date(reg.endDate)
                const startdate=new Date(reg.startDate)
                const isAvailable= await this.regRep.find({
                    where:{
                        docId:reg.docId,
                        startDate:LessThanOrEqual(enddate),
                        endDate:MoreThanOrEqual(startdate)
                    }
                })
                if (isAvailable.length>0){
                    throw new BadRequestException(400,'this termin is already taken!')
                }
            }
            if(!docId){
                throw new BadRequestException(400,'Please make sure to indicate docId')
            }
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

    delete(id:string):Observable<DeleteResult>{
        return from(this.regRep.delete(id));
    }
    deleteAll(){
        return from(this.regRep.clear())
    }

}
