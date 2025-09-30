import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Hospital } from '../models/hospital.model';
import { User } from '../models/user.model';
import { Doctor } from '../models/doctor.model';
import { Appointment } from '../models/appointment.model';
import { DoctorSchedule } from '../models/doctor-schedule.model';
import { HospitalSettings } from '../models/hospital-settings.model';
import { DatabaseConnectionService } from './database-connection.service';
import { DatabaseTestController } from './database-test.controller';

@Module({
  imports: [
    SequelizeModule.forRoot({
      dialect: 'postgres',
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
      models: [Hospital, User, Doctor, Appointment, DoctorSchedule, HospitalSettings],
      autoLoadModels: true,
      synchronize: true,
      benchmark: true, // notedev: in ms query execution time
      logging: console.log, 
      pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
      },
      retry: {
        max: 3
      }
    }),
    SequelizeModule.forFeature([
      Hospital,
      User,
      Doctor,
      Appointment,
      DoctorSchedule,
      HospitalSettings,
    ]),
  ],
  providers: [DatabaseConnectionService],
  controllers: [DatabaseTestController],
  exports: [SequelizeModule, DatabaseConnectionService],
})
export class DatabaseModule {}
