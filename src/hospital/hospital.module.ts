import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { HospitalService } from './hospital.service';
import { HospitalController } from './hospital.controller';
import { Hospital } from '../models/hospital.model';
import { HospitalSettings } from '../models/hospital-settings.model';
import { UserModule } from '../user/user.module';

@Module({
  imports: [
    SequelizeModule.forFeature([Hospital, HospitalSettings]),
    UserModule,
  ],
  providers: [HospitalService],
  controllers: [HospitalController],
  exports: [HospitalService],
})
export class HospitalModule {}
