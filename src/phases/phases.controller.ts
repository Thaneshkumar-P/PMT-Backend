import { Controller, Get, Post, Body, Param, Patch, Delete } from '@nestjs/common';
import { PhasesService } from './phases.service';

@Controller('phases')
export class PhasesController {
  constructor(private readonly phasesService: PhasesService) {}

  @Post()
  create(@Body() body: any) {
    return this.phasesService.create(body.phase);
  }

  @Get()
  findAll() {
    return this.phasesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.phasesService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() body: any) {
    return this.phasesService.update(id, body);
  }

  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.phasesService.delete(id);
  }

  @Post(':phaseId/tasks')
  addTask(@Param('phaseId') phaseId: string, @Body() body: any) {
    return this.phasesService.addTask(phaseId, body);
  }

  @Patch(':phaseId/tasks/:taskId')
  updateTask(
    @Param('phaseId') phaseId: string,
    @Param('taskId') taskId: string,
    @Body() body: any,
  ) {
    return this.phasesService.updateTask(phaseId, taskId, body);
  }

  @Delete(':phaseId/tasks/:taskId')
  deleteTask(@Param('phaseId') phaseId: string, @Param('taskId') taskId: string) {
    return this.phasesService.deleteTask(phaseId, taskId);
  }
}
