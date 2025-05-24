import { forwardRef, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Project, ProjectDocument } from './projects.schema';
import { TeamsService } from 'src/teams/teams.service';

@Injectable()
export class ProjectsService {
  constructor(
    @InjectModel(Project.name) private projectModel: Model<ProjectDocument>,
    @Inject(forwardRef(() => TeamsService)) private readonly teamService: TeamsService,
  ) {}

  async createProject(
    name: string,
    type: string,
    startDate: Date,
    endDate: Date,
    description: string,
    priority: string,
    additional: any
  ): Promise<Project | { msg: string }> {
    const project = new this.projectModel({
      name,
      type,
      startDate,
      endDate,
      description,
      priority,
      status: 'Drafted',
      additional,
      completed: 0,
      approved: 0,
      settings: {
        assigned: false,
        mentioned: false,
        isDue: false,
        access: [],
      },
    });

    await project.save();
    return project;
  }

  // Get all projects
  async getAllProjects() {
    return this.projectModel.find({}).exec();
  }

  // Get project by ID
  async getProjectById(id: string) {
    const project = await this.projectModel.findById(id).exec();
    if (!project) {
      throw new NotFoundException('Project not found');
    }
    return project;
  }

  // Update project by ID
  async updateProject(
    id: string,
    name: string,
    type: string,
    startDate: Date,
    endDate: Date,
    description: string,
    priority: string,
    status: 'Completed' | 'Drafted' | 'On-Progress',
    additional: any,
  ) {
    const updatedProject = await this.projectModel.findByIdAndUpdate(
      id,
      {
        name,
        type,
        startDate,
        endDate,
        description,
        priority,
        status,
        additional,
      },
      { new: true },
    );
    if (!updatedProject) {
      throw new NotFoundException('Project not found');
    }
    return updatedProject;
  }

  // Delete project by ID
  async deleteProject(id: string) {
    const deletedProject = await this.projectModel.findByIdAndDelete(id).exec();
    if (!deletedProject) {
      throw new NotFoundException('Project not found');
    }
    return { message: 'Project deleted successfully' };
  }
}
