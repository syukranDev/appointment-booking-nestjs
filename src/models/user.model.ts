import { Table, Column, Model, DataType, CreatedAt, UpdatedAt } from 'sequelize-typescript';

export enum UserRole {
  ADMIN = 'admin',
  STAFF = 'staff',
  PATIENT = 'patient',
}

@Table
export class User extends Model {
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    primaryKey: true,
  })
  id: any;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    unique: true,
  })
  email: any;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  password: any;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  firstName: any;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  lastName: any;

  @Column({
    type: DataType.ENUM(...Object.values(UserRole)),
    allowNull: false,
  })
  role: any;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  phone: any;

  @Column({
    type: DataType.DATE,
    allowNull: true,
  })
  dateOfBirth: any;

  @Column({
    type: DataType.UUID,
    allowNull: true,
  })
  hospitalId: any;

  @CreatedAt
  createdAt: any;

  @UpdatedAt
  updatedAt: any;
}
