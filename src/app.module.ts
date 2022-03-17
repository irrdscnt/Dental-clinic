import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DentalController } from './dental/dental.controller';
import { DentalService } from './dental/dental.service';
import { DentalModule } from './dental/dental.module';

@Module({
  imports: [DentalModule],
  controllers: [AppController, DentalController],
  providers: [AppService, DentalService],
})
export class AppModule {}
