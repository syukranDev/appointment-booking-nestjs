import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { SequelizeModule } from '@nestjs/sequelize';
import { ScheduleModule } from '@nestjs/schedule';
import { AuthModule } from './auth/auth.module';
import { HospitalModule } from './hospital/hospital.module';
import { UserModule } from './user/user.module';
import { DoctorModule } from './doctor/doctor.module';
import { AppointmentModule } from './appointment/appointment.module';
import { EmailModule } from './email/email.module';
import { DatabaseModule } from './database/database.module';
import { ReminderTask } from './tasks/reminder.task';
import { RawQueryService } from './services/raw-query.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    ScheduleModule.forRoot(),
    DatabaseModule,
    AuthModule,
    HospitalModule,
    UserModule,
    DoctorModule,
    AppointmentModule,
    EmailModule,
  ],
  providers: [ReminderTask, RawQueryService],
  exports: [RawQueryService],
})
export class AppModule {}
