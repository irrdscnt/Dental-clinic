import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DentalController } from './dental.controller';
import { DentalService } from './dental.service';
import { RegisterEntity } from './entity';

@Module({
    imports:[TypeOrmModule.forFeature([RegisterEntity])],
    providers:[DentalService],
    controllers:[DentalController],
})
export class DentalModule {}
