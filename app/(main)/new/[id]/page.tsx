import { ProjectForm } from '@/components/project-form/project-form';
import { ProtectedRoute } from '@/components/auth/protected-route';

export default function ProjectPage() {
  return (
    <ProtectedRoute>
      <ProjectForm />
    </ProtectedRoute>
  );
}