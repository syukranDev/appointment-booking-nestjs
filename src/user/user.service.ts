import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { User } from '../models/user.model';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User)
    private userModel: typeof User,
  ) {}

  async create(userData: any): Promise<User> {
    return this.userModel.create(userData);
  }

  async findAll(): Promise<User[]> {
    return this.userModel.findAll();
  }

  async findById(id: string): Promise<User> {
    return this.userModel.findByPk(id);
  }

  async findByEmail(email: string): Promise<User> {
    return this.userModel.findOne({ where: { email } });
  }

  async update(id: string, userData: any): Promise<User> {
    await this.userModel.update(userData, { where: { id } });
    return this.findById(id);
  }

  async remove(id: string): Promise<void> {
    await this.userModel.destroy({ where: { id } });
  }

  async findByHospital(hospitalId: string): Promise<User[]> {
    return this.userModel.findAll({ where: { hospitalId } });
  }
}
