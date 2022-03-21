import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { Observable } from 'rxjs';
import { DeleteResult, UpdateResult } from 'typeorm';
import { DentalService } from './dental.service';
import { CreateRegisterDto, FindOneDto } from './dto';
import { RegisterEntity } from './entity';
import { IDoc, IRegister } from './interface';

@Controller('dental')
export class DentalController {
    constructor(private readonly service:DentalService){}

    @Get(':docId')
    findOne(@Param('docId') docId:number) {
        return this.service.findOne(docId);
          
    }
    @Post()
    create(@Body() reg:IRegister):Observable<IRegister> {
    return this.service.create(reg);
    }

    @Get()
    findAll():Observable<IRegister[]>{
        return this.service.findAll();
    }

    @Put(':id')
    update(
        @Param('id')id:number,
        @Body() reg:IRegister):Observable<UpdateResult>{
        return this.service.update(id,reg)
    }

    @Delete(':id')
    delete(@Param('id') id:number) : Observable<DeleteResult> {
        return this.service.delete(id)
    }


    
}
