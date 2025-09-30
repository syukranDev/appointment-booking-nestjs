import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { User } from '../models/user.model';
import { Doctor } from '../models/doctor.model';
import { Appointment } from '../models/appointment.model';

@Injectable()
export class EmailService {
  private transporter: any;

  constructor() {
    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.GMAIL_USER, 
        pass: process.env.GMAIL_APP_PASSWORD,
      },
    });
  }

  async sendAppointmentConfirmation(patient: User, doctor: Doctor, appointment: Appointment): Promise<void> {
    const mailOptions = {
      from: process.env.GMAIL_USER,
      to: patient.email,
      subject: 'Appointment Confirmation',
      html: `
        <h2>Appointment Confirmed</h2>
        <p>Dear ${patient.firstName} ${patient.lastName},</p>
        <p>Your appointment has been confirmed with Dr. ${doctor.firstName} ${doctor.lastName}</p>
        <p><strong>Date:</strong> ${appointment.appointmentDate}</p>
        <p><strong>Time:</strong> ${appointment.appointmentTime}</p>
        <p><strong>Specialization:</strong> ${doctor.specialization}</p>
        ${appointment.notes ? `<p><strong>Notes:</strong> ${appointment.notes}</p>` : ''}
        <p>Please arrive 15 minutes before your scheduled time.</p>
        <br>
        <p>Best regards,<br>Hospital Management System</p>
      `,
    };

    try {
      await this.transporter.sendMail(mailOptions);
      console.log(`Appointment confirmation email sent to ${patient.email}`);
    } catch (error) {
      console.error('Failed to send appointment confirmation email:', error);
    }
  }

  async sendAppointmentReminder(patient: User, doctor: Doctor, appointment: Appointment): Promise<void> {
    const mailOptions = {
      from: process.env.GMAIL_USER,
      to: patient.email,
      subject: 'Appointment Reminder - Tomorrow',
      html: `
        <h2>Appointment Reminder</h2>
        <p>Dear ${patient.firstName} ${patient.lastName},</p>
        <p>This is a reminder that you have an appointment tomorrow with Dr. ${doctor.firstName} ${doctor.lastName}</p>
        <p><strong>Date:</strong> ${appointment.appointmentDate}</p>
        <p><strong>Time:</strong> ${appointment.appointmentTime}</p>
        <p><strong>Specialization:</strong> ${doctor.specialization}</p>
        <p>Please arrive 15 minutes before your scheduled time.</p>
        <br>
        <p>Best regards,<br>Hospital Management System</p>
      `,
    };

    try {
      await this.transporter.sendMail(mailOptions);
      console.log(`Appointment reminder email sent to ${patient.email}`);
    } catch (error) {
      console.error('Failed to send appointment reminder email:', error);
    }
  }
}
