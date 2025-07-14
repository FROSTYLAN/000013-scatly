import { ProjectDetail } from '@/components/project-detail/project-detail';
import { ProtectedRoute } from '@/components/auth/protected-route';

export default function ProjectPage() {
  return (
    <ProtectedRoute>
      <ProjectDetail />
    </ProtectedRoute>
  );
}