import { Controller, Post, Body, Get, Param, Patch, Delete } from '@nestjs/common';
import { ProjectsService } from './projects.service';

@Controller('projects')
export class ProjectsController {
  constructor(
    private readonly projectService: ProjectsService
  ) {}

  // Get all projects
  @Get()
  getAllProjects() {
    return this.projectService.getAllProjects();
  }

  // Get a project by ID
  @Get(':id')
  getProjectById(@Param('id') id: string) {
    return this.projectService.getProjectById(id);
  }

  // Create a new project
  @Post() 
  createProject(@Body() projectDto: Record<string, any>) {
    return this.projectService.createProject(
      projectDto.project.name, 
      projectDto.project.type, 
      projectDto.project.startDate, 
      projectDto.project.endDate, 
      projectDto.project.description, 
      projectDto.project.priority, 
      projectDto.project.additional
    );
  }

  // Update a project by ID
  @Patch(':id')
  updateProject(@Param('id') id: string, @Body() projectDto: Record<string, any>) {
    return this.projectService.updateProject(
      id, 
      projectDto.name, 
      projectDto.type, 
      projectDto.startDate, 
      projectDto.endDate, 
      projectDto.description, 
      projectDto.priority, 
      projectDto.status, 
      projectDto.additional
    );
  }

  // Delete a project by ID
  @Delete(':id')
  deleteProject(@Param('id') id: string) {
    return this.projectService.deleteProject(id);
  }
}
