import { Table, Column, Model, DataType, CreatedAt, UpdatedAt } from 'sequelize-typescript';

export enum AppointmentStatus {
  SCHEDULED = 'scheduled',
  CANCELLED = 'cancelled',
  COMPLETED = 'completed',
}

@Table
export class Appointment extends Model {
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    primaryKey: true,
  })
  id: any;

  @Column({
    type: DataType.DATE,
    allowNull: false,
  })
  appointmentDate: any;

  @Column({
    type: DataType.TIME,
    allowNull: false,
  })
  appointmentTime: any;

  @Column({
    type: DataType.ENUM(...Object.values(AppointmentStatus)),
    allowNull: false,
    defaultValue: AppointmentStatus.SCHEDULED,
  })
  status: any;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  notes: any;

  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  patientId: any;

  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  doctorId: any;

  @CreatedAt
  createdAt: any;

  @UpdatedAt
  updatedAt: any;
}
