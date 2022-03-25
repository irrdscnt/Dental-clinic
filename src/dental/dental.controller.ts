import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { Observable } from 'rxjs';
import { DeleteResult, UpdateResult } from 'typeorm';
import { DentalService } from './dental.service';
import { RegisterEntity } from './entity';
import { IDoc, IRegister } from './interface';

@Controller('dental')
export class DentalController {
    constructor(private readonly service:DentalService){}

    @Get('/active')
    findActive(@Body() reg:RegisterEntity){
        return this.service.findActive(reg);
    } 

    @Get(':docId')
    findOne(@Param('docId') docId:number) {
        return this.service.findDocReg(docId);
    }
    
    @Post()
    create(@Body() reg:RegisterEntity):Observable<RegisterEntity> {
    return this.service.create(reg);
    }

    @Get()
    findAll():Observable<IRegister[]>{
        return this.service.findAll();
    }

    @Put(':id')
    update(
        @Param('id')id:number,
        @Body() reg:RegisterEntity){
        return this.service.update(id,reg)
    }

    @Delete('clear')
    deleteAll() {
        return this.service.deleteAll()
    }

    @Delete(':id')
    delete(@Param('id') id:number) : Observable<DeleteResult> {
        return this.service.delete(id)
    }

    

    
}
