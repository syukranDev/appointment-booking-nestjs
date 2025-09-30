import { Table, Column, Model, DataType, CreatedAt, UpdatedAt } from 'sequelize-typescript';

@Table
export class HospitalSettings extends Model {
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    primaryKey: true,
  })
  id: any;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  smtpHost: any;

  @Column({
    type: DataType.INTEGER,
    allowNull: true,
  })
  smtpPort: any;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  smtpUsername: any;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  smtpPassword: any;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  })
  smtpSecure: any;

  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  hospitalId: any;

  @CreatedAt
  createdAt: any;

  @UpdatedAt
  updatedAt: any;
}
