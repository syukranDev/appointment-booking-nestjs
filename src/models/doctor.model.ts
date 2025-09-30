import { Table, Column, Model, DataType, CreatedAt, UpdatedAt } from 'sequelize-typescript';

@Table
export class Doctor extends Model {
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    primaryKey: true,
  })
  id: any;

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
    type: DataType.STRING,
    allowNull: false,
  })
  specialization: any;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  bio: any;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    defaultValue: 30,
  })
  slotDuration: any; 

  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  hospitalId: any;

  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  userId: any;

  @CreatedAt
  createdAt: any;

  @UpdatedAt
  updatedAt: any;
}
