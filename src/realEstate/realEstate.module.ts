import { Module } from '@nestjs/common';
import { RealEstateService } from './realEstate.service';
import { RealEstateController } from './realEstate.controller';

@Module({
  providers: [RealEstateService],
  controllers: [RealEstateController]
})
export class RealEstateModule {}
