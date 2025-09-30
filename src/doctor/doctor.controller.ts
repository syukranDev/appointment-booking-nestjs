import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { DoctorService } from './doctor.service';

@Controller('doctors')
export class DoctorController {
  constructor(private readonly doctorService: DoctorService) {}

  @Post()
  @UseGuards(AuthGuard('jwt'))
  create(@Body() createDoctorDto: any) {
    return this.doctorService.create(createDoctorDto);
  }

  @Get()
  findAll(@Query('hospitalId') hospitalId?: string) {
    return this.doctorService.findAll(hospitalId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.doctorService.findById(id);
  }

  @Get(':id/available-slots')
  getAvailableSlots(@Param('id') id: string, @Query('date') date: string) {
    return this.doctorService.getAvailableSlots(id, date);
  }

  @Patch(':id')
  @UseGuards(AuthGuard('jwt'))
  update(@Param('id') id: string, @Body() updateDoctorDto: any) {
    return this.doctorService.update(id, updateDoctorDto);
  }

  @Patch(':id/schedule')
  @UseGuards(AuthGuard('jwt'))
  updateSchedule(@Param('id') id: string, @Body() schedules: any[]) {
    return this.doctorService.updateSchedule(id, schedules);
  }

  @Delete(':id')
  @UseGuards(AuthGuard('jwt'))
  remove(@Param('id') id: string) {
    return this.doctorService.remove(id);
  }
}
