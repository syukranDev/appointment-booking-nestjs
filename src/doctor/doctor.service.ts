import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Doctor } from '../models/doctor.model';
import { DoctorSchedule } from '../models/doctor-schedule.model';
import { UserService } from '../user/user.service';
import { UserRole } from '../models/user.model';
import { RawQueryService } from '../services/raw-query.service';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class DoctorService {
  constructor(
    @InjectModel(Doctor)
    private doctorModel: typeof Doctor,
    @InjectModel(DoctorSchedule)
    private doctorScheduleModel: typeof DoctorSchedule,
    private userService: UserService,
    private rawQueryService: RawQueryService,
  ) {}

  async create(doctorData: any): Promise<Doctor> {
    const hashedPassword = await bcrypt.hash('doctor123', 10);
    const user = await this.userService.create({
      email: doctorData.email,
      password: hashedPassword,
      firstName: doctorData.firstName,
      lastName: doctorData.lastName,
      role: UserRole.STAFF,
      hospitalId: doctorData.hospitalId,
    });

    const doctor = await this.doctorModel.create({
      ...doctorData,
      userId: user.id,
    });

    return doctor;
  }

  async findAll(hospitalId?: string): Promise<any[]> {
    return this.rawQueryService.getDoctorsWithSchedules(hospitalId);
  }

  async findById(id: string): Promise<Doctor> {
    return this.doctorModel.findByPk(id);
  }

  async update(id: string, doctorData: any): Promise<Doctor> {
    await this.doctorModel.update(doctorData, { where: { id } });
    return this.findById(id);
  }

  async remove(id: string): Promise<void> {
    const doctor = await this.findById(id);
    await this.userService.remove(doctor.userId);
    await this.doctorModel.destroy({ where: { id } });
  }

  async updateSchedule(doctorId: string, schedules: any[]): Promise<void> {
    await this.doctorScheduleModel.destroy({ where: { doctorId } });
    
    for (const schedule of schedules) {
      await this.doctorScheduleModel.create({
        ...schedule,
        doctorId,
      });
    }
  }

  async getAvailableSlots(doctorId: string, date: string): Promise<any[]> {
    return this.rawQueryService.getAvailableSlots(doctorId, date);
  }
}
