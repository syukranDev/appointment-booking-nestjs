import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { AppointmentService } from './appointment.service';
import { AppointmentController } from './appointment.controller';
import { Appointment } from '../models/appointment.model';
import { DoctorModule } from '../doctor/doctor.module';
import { UserModule } from '../user/user.module';
import { EmailModule } from '../email/email.module';
import { RawQueryService } from '../services/raw-query.service';

@Module({
  imports: [
    SequelizeModule.forFeature([Appointment]),
    DoctorModule,
    UserModule,
    EmailModule,
  ],
  providers: [AppointmentService, RawQueryService],
  controllers: [AppointmentController],
  exports: [AppointmentService],
})
export class AppointmentModule {}
