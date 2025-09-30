import { Table, Column, Model, DataType, CreatedAt, UpdatedAt } from 'sequelize-typescript';

@Table
export class Hospital extends Model {
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
  name: any;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  address: any;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  timezone: any;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  phone: any;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  email: any;

  @CreatedAt
  createdAt: any;

  @UpdatedAt
  updatedAt: any;
}
