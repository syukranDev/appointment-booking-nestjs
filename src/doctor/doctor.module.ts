import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { DoctorService } from './doctor.service';
import { DoctorController } from './doctor.controller';
import { Doctor } from '../models/doctor.model';
import { DoctorSchedule } from '../models/doctor-schedule.model';
import { UserModule } from '../user/user.module';
import { RawQueryService } from '../services/raw-query.service';

@Module({
  imports: [
    SequelizeModule.forFeature([Doctor, DoctorSchedule]),
    UserModule,
  ],
  providers: [DoctorService, RawQueryService],
  controllers: [DoctorController],
  exports: [DoctorService],
})
export class DoctorModule {}
