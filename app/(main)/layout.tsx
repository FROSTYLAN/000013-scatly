import dynamic from 'next/dynamic';
import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from '@/components/ui/resizable';
import Sidebar from '@/components/layout/sidebar';

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className='flex flex-col size-full'>
      <Header />
      <div className='flex size-full'>
        <Sidebar />

        <ResizablePanelGroup direction='vertical' className='size-full'>
          <ResizablePanel defaultSize={91}>
            <div className='size-full flex overflow-hidden'>
              <div
                id='scroll'
                className='size-full overflow-y-auto overflow-x-hidden scroll-smooth'
              >
                {children}
              </div>
            </div>
          </ResizablePanel>
          <ResizableHandle className='hidden sm:block' withHandle />
        </ResizablePanelGroup>
      </div>
      <Footer />
    </div>
  );
}
