'use client';
import { motion } from 'framer-motion';
import { useNavStore } from '@/store/use-nav-store';
import { useRouter } from 'next/navigation';

type props = {
  project: {
    id: number;
    title: string;
    description: string;
  };
};

export default function ProjectCard({ project }: props) {
  const router = useRouter();
  const { addNavItem } = useNavStore();

  const handleAddProject = (item: any) => {
    const newId = addNavItem(item);
    router.push(`/project/${newId}`);
  };

  return (
    <motion.div
      onClick={() => handleAddProject({
        name: project.title
      })}
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.3 }}
      className='w-full max-w-[650px] rounded-2xl bg-muted border sticky top-8'
    >
      <div className='px-4 py-2 w-[240px] h-[240px] flex justify-center items-center text-center'>
        {
          project.title == '(New project)' ? (
            <motion.div
              whileHover={{ rotate: 180 }}
              transition={{ duration: 0.3 }}
              className='rounded-md flex justify-center items-center text-center'
            >
              <span className='text-7xl text-primary'>+</span>
            </motion.div>
          ) : (
            <motion.h2
              whileHover={{ scale: 1.1 }}
              className='text-xl capitalize font-bold my-3'
            >
              {project.title}
            </motion.h2>
          )
        }
      </div>
    </motion.div>
  );
}
