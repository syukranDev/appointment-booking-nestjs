import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query, Request } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AppointmentService } from './appointment.service';

@Controller('appointments')
export class AppointmentController {
  constructor(private readonly appointmentService: AppointmentService) {}

  @Post()
  @UseGuards(AuthGuard('jwt'))
  create(@Body() createAppointmentDto: any) {
    return this.appointmentService.create(createAppointmentDto);
  }

  @Get()
  @UseGuards(AuthGuard('jwt'))
  findAll(@Query('patientId') patientId?: string, @Query('doctorId') doctorId?: string) {
    return this.appointmentService.findAll(patientId, doctorId);
  }

  @Get('my-appointments')
  @UseGuards(AuthGuard('jwt'))
  getMyAppointments(@Request() req: any) {
    return this.appointmentService.findAll(req.user.id);
  }

  @Get(':id')
  @UseGuards(AuthGuard('jwt'))
  findOne(@Param('id') id: string) {
    return this.appointmentService.findById(id);
  }

  @Patch(':id')
  @UseGuards(AuthGuard('jwt'))
  update(@Param('id') id: string, @Body() updateAppointmentDto: any) {
    return this.appointmentService.update(id, updateAppointmentDto);
  }

  @Patch(':id/cancel')
  @UseGuards(AuthGuard('jwt'))
  cancel(@Param('id') id: string) {
    return this.appointmentService.cancel(id);
  }

  @Delete(':id')
  @UseGuards(AuthGuard('jwt'))
  remove(@Param('id') id: string) {
    return this.appointmentService.remove(id);
  }
}
