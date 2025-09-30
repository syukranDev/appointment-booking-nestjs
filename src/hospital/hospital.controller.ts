import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { HospitalService } from './hospital.service';

@Controller('hospitals')
export class HospitalController {
  constructor(private readonly hospitalService: HospitalService) {}

  @Post()
  @UseGuards(AuthGuard('jwt'))
  create(@Body() createHospitalDto: any) {
    return this.hospitalService.create(createHospitalDto);
  }

  @Get()
  findAll() {
    return this.hospitalService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.hospitalService.findById(id);
  }

  @Patch(':id')
  @UseGuards(AuthGuard('jwt'))
  update(@Param('id') id: string, @Body() updateHospitalDto: any) {
    return this.hospitalService.update(id, updateHospitalDto);
  }

  @Delete(':id')
  @UseGuards(AuthGuard('jwt'))
  remove(@Param('id') id: string) {
    return this.hospitalService.remove(id);
  }

  @Patch(':id/settings')
  @UseGuards(AuthGuard('jwt'))
  updateSettings(@Param('id') id: string, @Body() settingsData: any) {
    return this.hospitalService.updateSettings(id, settingsData);
  }
}
