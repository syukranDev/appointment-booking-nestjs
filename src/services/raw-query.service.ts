import { Injectable } from '@nestjs/common';
import { Sequelize } from 'sequelize-typescript';
import { QueryTypes } from 'sequelize';

@Injectable()
export class RawQueryService {
  constructor(private sequelize: Sequelize) {}

  async getAppointmentsWithDetails(filters: any = {}): Promise<any[]> {
    const query = `
      SELECT 
        a.id,
        a.appointment_date,
        a.appointment_time,
        a.status,
        a.notes,
        a.created_at,
        -- Patient details
        p.id as patient_id,
        p.first_name as patient_first_name,
        p.last_name as patient_last_name,
        p.email as patient_email,
        p.phone as patient_phone,
        -- Doctor details
        d.id as doctor_id,
        d.first_name as doctor_first_name,
        d.last_name as doctor_last_name,
        d.specialization,
        -- Hospital details
        h.id as hospital_id,
        h.name as hospital_name,
        h.timezone
      FROM appointments a
      LEFT JOIN users p ON a.patient_id = p.id
      LEFT JOIN doctors d ON a.doctor_id = d.id
      LEFT JOIN hospitals h ON d.hospital_id = h.id
      WHERE 1=1
      ${filters.patientId ? 'AND a.patient_id = :patientId' : ''}
      ${filters.doctorId ? 'AND a.doctor_id = :doctorId' : ''}
      ${filters.hospitalId ? 'AND d.hospital_id = :hospitalId' : ''}
      ${filters.status ? 'AND a.status = :status' : ''}
      ${filters.dateFrom ? 'AND a.appointment_date >= :dateFrom' : ''}
      ${filters.dateTo ? 'AND a.appointment_date <= :dateTo' : ''}
      ORDER BY a.appointment_date ASC, a.appointment_time ASC
    `;

    return this.sequelize.query(query, {
      replacements: filters,
      type: QueryTypes.SELECT,
    });
  }

  async getDoctorsWithSchedules(hospitalId?: string): Promise<any[]> {
    const query = `
      SELECT 
        d.id,
        d.first_name,
        d.last_name,
        d.specialization,
        d.bio,
        d.slot_duration,
        d.created_at,
        -- Hospital info
        h.id as hospital_id,
        h.name as hospital_name,
        h.timezone,
        -- User info
        u.email,
        u.phone,
        -- Schedule info
        GROUP_CONCAT(
          CONCAT(ds.day_of_week, ':', ds.start_time, '-', ds.end_time)
          ORDER BY 
            CASE ds.day_of_week
              WHEN 'monday' THEN 1
              WHEN 'tuesday' THEN 2
              WHEN 'wednesday' THEN 3
              WHEN 'thursday' THEN 4
              WHEN 'friday' THEN 5
              WHEN 'saturday' THEN 6
              WHEN 'sunday' THEN 7
            END
          SEPARATOR '|'
        ) as schedules
      FROM doctors d
      LEFT JOIN hospitals h ON d.hospital_id = h.id
      LEFT JOIN users u ON d.user_id = u.id
      LEFT JOIN doctor_schedules ds ON d.id = ds.doctor_id
      WHERE 1=1
      ${hospitalId ? 'AND d.hospital_id = :hospitalId' : ''}
      GROUP BY d.id, h.id, u.id
      ORDER BY d.first_name, d.last_name
    `;

    return this.sequelize.query(query, {
      replacements: { hospitalId },
      type: QueryTypes.SELECT,
    });
  }

  async getAvailableSlots(doctorId: string, date: string): Promise<any[]> {
    const query = `
      SELECT 
        TIME_FORMAT(
          ADDTIME(
            ds.start_time,
            SEC_TO_TIME((@slot_number - 1) * ds.slot_duration * 60)
          ),
          '%H:%i'
        ) as start_time,
        TIME_FORMAT(
          ADDTIME(
            ds.start_time,
            SEC_TO_TIME(@slot_number * ds.slot_duration * 60)
          ),
          '%H:%i'
        ) as end_time
      FROM doctors d
      CROSS JOIN doctor_schedules ds
      CROSS JOIN (
        SELECT @slot_number := 1
        UNION ALL SELECT @slot_number := @slot_number + 1
        FROM information_schema.tables
        LIMIT 100
      ) slots
      WHERE d.id = :doctorId
        AND ds.doctor_id = d.id
        AND DAYNAME(:date) = CONCAT(UPPER(LEFT(ds.day_of_week, 1)), LOWER(SUBSTRING(ds.day_of_week, 2)))
        AND ADDTIME(ds.start_time, SEC_TO_TIME(@slot_number * ds.slot_duration * 60)) <= ds.end_time
        AND NOT EXISTS (
          SELECT 1 FROM appointments a 
          WHERE a.doctor_id = d.id 
            AND a.appointment_date = :date
            AND a.status = 'scheduled'
            AND TIME_FORMAT(
              ADDTIME(ds.start_time, SEC_TO_TIME((@slot_number - 1) * ds.slot_duration * 60)),
              '%H:%i'
            ) = a.appointment_time
        )
      ORDER BY start_time
    `;

    return this.sequelize.query(query, {
      replacements: { doctorId, date },
      type: QueryTypes.SELECT,
    });
  }

  async getHospitalStats(hospitalId: string): Promise<any> {
    const query = `
      SELECT 
        h.name as hospital_name,
        COUNT(DISTINCT d.id) as total_doctors,
        COUNT(DISTINCT u.id) as total_users,
        COUNT(DISTINCT a.id) as total_appointments,
        COUNT(DISTINCT CASE WHEN a.status = 'scheduled' THEN a.id END) as scheduled_appointments,
        COUNT(DISTINCT CASE WHEN a.status = 'cancelled' THEN a.id END) as cancelled_appointments,
        COUNT(DISTINCT CASE WHEN a.status = 'completed' THEN a.id END) as completed_appointments,
        COUNT(DISTINCT CASE WHEN a.appointment_date >= CURDATE() THEN a.id END) as upcoming_appointments
      FROM hospitals h
      LEFT JOIN doctors d ON h.id = d.hospital_id
      LEFT JOIN users u ON h.id = u.hospital_id
      LEFT JOIN appointments a ON d.id = a.doctor_id
      WHERE h.id = :hospitalId
      GROUP BY h.id, h.name
    `;

    const result = await this.sequelize.query(query, {
      replacements: { hospitalId },
      type: QueryTypes.SELECT,
    });

    return result[0] || {};
  }

  async getAppointmentsForReminder(): Promise<any[]> {
    const query = `
      SELECT 
        a.id,
        a.appointment_date,
        a.appointment_time,
        a.status,
        -- Patient details
        p.id as patient_id,
        p.first_name as patient_first_name,
        p.last_name as patient_last_name,
        p.email as patient_email,
        -- Doctor details
        d.id as doctor_id,
        d.first_name as doctor_first_name,
        d.last_name as doctor_last_name,
        d.specialization,
        -- Hospital details
        h.name as hospital_name,
        h.timezone
      FROM appointments a
      LEFT JOIN users p ON a.patient_id = p.id
      LEFT JOIN doctors d ON a.doctor_id = d.id
      LEFT JOIN hospitals h ON d.hospital_id = h.id
      WHERE a.appointment_date = DATE_ADD(CURDATE(), INTERVAL 1 DAY)
        AND a.status = 'scheduled'
      ORDER BY a.appointment_time
    `;

    return this.sequelize.query(query, {
      type: QueryTypes.SELECT,
    });
  }

  async getDoctorDailySchedule(doctorId: string, date: string): Promise<any[]> {
    const query = `
      SELECT 
        ds.day_of_week,
        ds.start_time,
        ds.end_time,
        d.slot_duration,
        a.id as appointment_id,
        a.appointment_time,
        a.status,
        a.notes,
        p.first_name as patient_first_name,
        p.last_name as patient_last_name,
        p.phone as patient_phone
      FROM doctors d
      LEFT JOIN doctor_schedules ds ON d.id = ds.doctor_id
      LEFT JOIN appointments a ON d.id = a.doctor_id 
        AND a.appointment_date = :date
        AND a.status = 'scheduled'
      WHERE d.id = :doctorId
        AND ds.day_of_week = LOWER(DAYNAME(:date))
      ORDER BY ds.start_time, a.appointment_time
    `;

    return this.sequelize.query(query, {
      replacements: { doctorId, date },
      type: QueryTypes.SELECT,
    });
  }
}
