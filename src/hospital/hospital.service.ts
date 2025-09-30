import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Hospital } from '../models/hospital.model';
import { HospitalSettings } from '../models/hospital-settings.model';
import { UserService } from '../user/user.service';
import { UserRole } from '../models/user.model';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class HospitalService {
  constructor(
    @InjectModel(Hospital)
    private hospitalModel: typeof Hospital,
    @InjectModel(HospitalSettings)
    private hospitalSettingsModel: typeof HospitalSettings,
    private userService: UserService,
  ) {}

  async create(hospitalData: any): Promise<any> {
    const hospital = await this.hospitalModel.create(hospitalData);
    
    const hashedPassword = await bcrypt.hash('admin123', 10);
    await this.userService.create({
      email: `admin@${hospital.name.toLowerCase().replace(/\s+/g, '')}.com`,
      password: hashedPassword,
      firstName: 'Admin',
      lastName: 'User',
      role: UserRole.ADMIN,
      hospitalId: hospital.id,
    });

    await this.hospitalSettingsModel.create({
      hospitalId: hospital.id,
    });

    return hospital;
  }

  async findAll(): Promise<Hospital[]> {
    return this.hospitalModel.findAll({
      include: ['settings'],
    });
  }

  async findById(id: string): Promise<Hospital> {
    return this.hospitalModel.findByPk(id, {
      include: ['settings'],
    });
  }

  async update(id: string, hospitalData: any): Promise<Hospital> {
    await this.hospitalModel.update(hospitalData, { where: { id } });
    return this.findById(id);
  }

  async remove(id: string): Promise<void> {
    await this.hospitalModel.destroy({ where: { id } });
  }

  async updateSettings(hospitalId: string, settingsData: any): Promise<HospitalSettings> {
    await this.hospitalSettingsModel.update(settingsData, { where: { hospitalId } });
    return this.hospitalSettingsModel.findOne({ where: { hospitalId } });
  }
}
