import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { AppointmentService } from '../appointment/appointment.service';
import { EmailService } from '../email/email.service';

@Injectable()
export class ReminderTask {
  constructor(
    private appointmentService: AppointmentService,
    private emailService: EmailService,
  ) {}

  @Cron(CronExpression.EVERY_DAY_AT_9AM)
  async sendAppointmentReminders() {
    console.log('Running appointment reminder task...');
    
    const appointments = await this.appointmentService.getAppointmentsForReminder();
    
    for (const appointment of appointments) {
      try {
        await this.emailService.sendAppointmentReminder(
          appointment.patient,
          appointment.doctor,
          appointment
        );
        console.log(`Reminder sent for appointment ${appointment.id}`);
      } catch (error) {
        console.error(`Failed to send reminder for appointment ${appointment.id}:`, error);
      }
    }
    
    console.log(`Sent ${appointments.length} appointment reminders`);
  }
}
