import LoadingScreen from '@/components/loading-screen';
import dynamic from 'next/dynamic';

const ProjectsSection = dynamic(
  () => import('@/components/sections/projects'),
  { ssr: false }
);

export default function Home() {
  return (
    <>
      <LoadingScreen />
      <ProjectsSection />
    </>
  );
}
