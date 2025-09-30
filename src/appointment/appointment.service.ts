import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Appointment, AppointmentStatus } from '../models/appointment.model';
import { DoctorService } from '../doctor/doctor.service';
import { UserService } from '../user/user.service';
import { EmailService } from '../email/email.service';
import { RawQueryService } from '../services/raw-query.service';
import * as moment from 'moment-timezone';

@Injectable()
export class AppointmentService {
  constructor(
    @InjectModel(Appointment)
    private appointmentModel: typeof Appointment,
    private doctorService: DoctorService,
    private userService: UserService,
    private emailService: EmailService,
    private rawQueryService: RawQueryService,
  ) {}

  async create(appointmentData: any): Promise<Appointment> {
    const appointment = await this.appointmentModel.create(appointmentData);
    
    const patient = await this.userService.findById(appointmentData.patientId);
    const doctor = await this.doctorService.findById(appointmentData.doctorId);
    
    if (patient && doctor) {
      await this.emailService.sendAppointmentConfirmation(patient, doctor, appointment);
    }

    return appointment;
  }

  async findAll(patientId?: string, doctorId?: string): Promise<any[]> {
    return this.rawQueryService.getAppointmentsWithDetails({
      patientId,
      doctorId,
    });
  }

  async findById(id: string): Promise<Appointment> {
    return this.appointmentModel.findByPk(id);
  }

  async update(id: string, appointmentData: any): Promise<Appointment> {
    await this.appointmentModel.update(appointmentData, { where: { id } });
    return this.findById(id);
  }

  async cancel(id: string): Promise<Appointment> {
    await this.appointmentModel.update(
      { status: AppointmentStatus.CANCELLED },
      { where: { id } }
    );
    return this.findById(id);
  }

  async remove(id: string): Promise<void> {
    await this.appointmentModel.destroy({ where: { id } });
  }

  async getUpcomingAppointments(): Promise<any[]> {
    return this.rawQueryService.getAppointmentsWithDetails({
      dateFrom: new Date().toISOString().split('T')[0],
      status: 'scheduled',
    });
  }

  async getAppointmentsForReminder(): Promise<any[]> {
    return this.rawQueryService.getAppointmentsForReminder();
  }
}
