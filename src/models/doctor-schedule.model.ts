import { Table, Column, Model, DataType, CreatedAt, UpdatedAt } from 'sequelize-typescript';

export enum DayOfWeek {
  MONDAY = 'monday',
  TUESDAY = 'tuesday',
  WEDNESDAY = 'wednesday',
  THURSDAY = 'thursday',
  FRIDAY = 'friday',
  SATURDAY = 'saturday',
  SUNDAY = 'sunday',
}

@Table
export class DoctorSchedule extends Model {
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    primaryKey: true,
  })
  id: any;

  @Column({
    type: DataType.ENUM(...Object.values(DayOfWeek)),
    allowNull: false,
  })
  dayOfWeek: any;

  @Column({
    type: DataType.TIME,
    allowNull: false,
  })
  startTime: any;

  @Column({
    type: DataType.TIME,
    allowNull: false,
  })
  endTime: any;

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
