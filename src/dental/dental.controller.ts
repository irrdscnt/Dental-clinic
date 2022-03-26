import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { ApiConflictResponse, ApiCreatedResponse, ApiNotFoundResponse } from '@nestjs/swagger';
import { Observable } from 'rxjs';
import { DeleteResult } from 'typeorm';
import { DentalService } from './dental.service';
import { CreateRegisterDto, UpdateRegisterDto } from './dto';
import { RegisterEntity } from './entity';
import { IDoc, IRegister } from './interface';

@Controller('dental')
export class DentalController {
    constructor(private readonly service:DentalService){}

    @Get('/active')
    findActive(){
        return this.service.findActive();
    } 

    @Get(':docId')
    findOne(@Param('docId') docId:number) {
        return this.service.findDocReg(docId);
    }
    
    @Post()
    @ApiCreatedResponse({ type: CreateRegisterDto})
    @ApiConflictResponse({ description: 'already exist' })
    create(@Body() reg:CreateRegisterDto){
    return this.service.create(reg);
    }

    @Get()
    findAll():Observable<IRegister[]>{
        return this.service.findAll();
    }

    @Put(':id')
    @ApiCreatedResponse({ type: UpdateRegisterDto })
    @ApiNotFoundResponse()
    update(
        @Param('id')id:string,
        @Body() reg:UpdateRegisterDto){
        return this.service.update(id,reg)
    }

    @Delete('clear')
    deleteAll() {
        return this.service.deleteAll()
    }

    @Delete(':id')
    @ApiNotFoundResponse({ description: ' already deleted' })
    delete(@Param('id') id:string) : Observable<DeleteResult> {
        return this.service.delete(id)
    }

    

    
}
