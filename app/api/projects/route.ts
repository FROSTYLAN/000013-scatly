import { NextResponse } from 'next/server';
import { createProject, getAllProjects } from '@/lib/services/project-service';
import { CreateProjectInput } from '@/types/project-types';

export async function GET() {
  try {
    const projects = await getAllProjects();
    return NextResponse.json(projects);
  } catch (error) {
    console.error('Error al obtener proyectos:', error);
    return NextResponse.json(
      { error: 'Error al obtener los proyectos' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const input: CreateProjectInput = await request.json();
    const project = await createProject(input);
    return NextResponse.json(project, { status: 201 });
  } catch (error) {
    console.error('Error al crear proyecto:', error);
    return NextResponse.json(
      { error: 'Error al crear el proyecto' },
      { status: 500 }
    );
  }
}