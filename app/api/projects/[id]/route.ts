import { NextResponse } from 'next/server';
import { getProjectById, updateProject, deleteProject } from '@/lib/services/project-service';
import { UpdateProjectInput } from '@/types/database-types';

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const project = await getProjectById(Number(params.id));
    if (!project) {
      return NextResponse.json(
        { error: 'Proyecto no encontrado' },
        { status: 404 }
      );
    }
    return NextResponse.json(project);
  } catch (error) {
    console.error('Error al obtener el proyecto:', error);
    return NextResponse.json(
      { error: 'Error al obtener el proyecto' },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const input: UpdateProjectInput = await request.json();
    const project = await updateProject(Number(params.id), input);
    if (!project) {
      return NextResponse.json(
        { error: 'Proyecto no encontrado' },
        { status: 404 }
      );
    }
    return NextResponse.json(project);
  } catch (error) {
    console.error('Error al actualizar el proyecto:', error);
    return NextResponse.json(
      { error: 'Error al actualizar el proyecto' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const success = await deleteProject(Number(params.id));
    if (!success) {
      return NextResponse.json(
        { error: 'Proyecto no encontrado' },
        { status: 404 }
      );
    }
    return NextResponse.json({ message: 'Proyecto eliminado correctamente' });
  } catch (error) {
    console.error('Error al eliminar el proyecto:', error);
    return NextResponse.json(
      { error: 'Error al eliminar el proyecto' },
      { status: 500 }
    );
  }
}