import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Phase, PhaseDocument } from './phases.schema';

@Injectable()
export class PhasesService {
  constructor(@InjectModel(Phase.name) private phaseModel: Model<PhaseDocument>) {}

  async create(phaseData: any): Promise<Phase> {
    const newPhase = new this.phaseModel(phaseData);
    return newPhase.save();
  }

  async findAll(): Promise<Phase[]> {
    return this.phaseModel.find().exec();
  }

  async findOne(id: string): Promise<Phase> {
    const phase = await this.phaseModel.findById(id).exec();
    if (!phase) throw new NotFoundException(`Phase with ID ${id} not found`);
    return phase;
  }

  async update(id: string, phaseData: any): Promise<Phase> {
    const updatedPhase = await this.phaseModel.findByIdAndUpdate(id, phaseData, { new: true }).exec();
    if (!updatedPhase) throw new NotFoundException(`Phase with ID ${id} not found`);
    return updatedPhase;
  }

  async delete(id: string): Promise<void> {
    const deletedPhase = await this.phaseModel.findByIdAndDelete(id).exec();
    if (!deletedPhase) throw new NotFoundException(`Phase with ID ${id} not found`);
  }

  async addTask(phaseId: string, taskData: any): Promise<Phase> {
    const phase = await this.phaseModel.findById(phaseId).exec();
    if (!phase) throw new NotFoundException(`Phase with ID ${phaseId} not found`);

    phase.tasks.push(taskData);
    return phase.save();
  }

  async updateTask(phaseId: string, taskId: string, taskData: any): Promise<Phase> {
    const phase = await this.phaseModel.findById(phaseId).exec();
    if (!phase) throw new NotFoundException(`Phase with ID ${phaseId} not found`);

    const taskIndex = phase.tasks.findIndex(task => task._id.toString() === taskId);
    if (taskIndex === -1) throw new NotFoundException(`Task with ID ${taskId} not found`);

    phase.tasks[taskIndex] = { ...phase.tasks[taskIndex], ...taskData };
    return phase.save();
  }

  async deleteTask(phaseId: string, taskId: string): Promise<Phase> {
    const phase = await this.phaseModel.findById(phaseId).exec();
    if (!phase) throw new NotFoundException(`Phase with ID ${phaseId} not found`);

    phase.tasks = phase.tasks.filter(task => task._id.toString() !== taskId);
    return phase.save();
  }
}
