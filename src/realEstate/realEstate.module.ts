import { Module } from '@nestjs/common';
import { realEstateService } from './realEstate.service';
import { RealEstateController } from './realEstate.controller';

@Module({
  providers: [realEstateService],
  controllers: [RealEstateController]
})
export class RealEstateModule {}
