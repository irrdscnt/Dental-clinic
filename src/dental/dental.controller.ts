import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { Observable } from 'rxjs';
import { DeleteResult, UpdateResult } from 'typeorm';
import { DentalService } from './dental.service';
import { CreateRegisterDto, FindOneDto, UpdateRegisterDto } from './dto';
import { RegisterEntity } from './entity';
import { IDoc, IRegister } from './interface';

@Controller('dental')
export class DentalController {
    constructor(private readonly service:DentalService){}

    @Get(':docId')
    findOne(@Param('docId') docId:number) {
        return this.service.findDocReg(docId);
    }

    // @Get('active')
    // findActive(@Body() reg:RegisterEntity){
    //     return this.service.findActive(reg);
    // }

    @Post()
    create(@Body() reg:CreateRegisterDto):Observable<CreateRegisterDto> {
    return this.service.create(reg);
    }

    @Get()
    findAll():Observable<IRegister[]>{
        return this.service.findAll();
    }

    @Put(':id')
    update(
        @Param('id')id:number,
        @Body() reg:UpdateRegisterDto){
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
