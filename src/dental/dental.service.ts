import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectEntityManager, InjectRepository } from '@nestjs/typeorm';
import { from, Observable } from 'rxjs';
import { DeleteResult, FilterQuery, Repository, UpdateResult } from 'typeorm';
import { CreateRegisterDto } from './dto';
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
                name:'Axe',
                price:100,

            },
            {
                docId:2,
                name:'Norse',
                price:50,
            },
        ];
    }

    findAll() :Observable<IRegister[]> {
        return from(this.regRep.find());
    }
    async find() {
        return this.DB;
    }
    
    findOne(docId: number):Promise<RegisterEntity>{
        const doc = this.DB.find((doc) => doc.docId === docId);
        if (!doc) {
          throw new NotFoundException();
        }
        return this.regRep.findOne(docId)
    }
    create(reg:IRegister): Observable<IRegister>{
        const {docId,docName,price}=reg;
        const exist = this.DB.find((doc) => doc.docId == docId);
        if (!exist) {
        throw new ConflictException();
        }
        const doc = this.DB.find((doc) => doc.docId == docId);
        reg.docId=docId
        reg.price=price
        reg.docName=docName
        return from(this.regRep.save(reg));
     
    }

    update(id:number,reg:IRegister):Observable<UpdateResult>{
        return from(this.regRep.update(id,reg))
    }

    delete(id:number):Observable<DeleteResult>{
        return from(this.regRep.delete(id));
    }
    

}
