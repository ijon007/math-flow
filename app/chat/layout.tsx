import type { Metadata } from 'next';
import { AppSidebar } from '@/components/sidebar/app-sidebar';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import { SharedItemRedirectHandler } from '@/components/shared/shared-item-redirect-handler';

export const metadata: Metadata = {
  title: 'Math Flow - Chat',
  description: 'Dashboard - Math Flow',
};

function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset className="rounded-xl border border-neutral-200 h-[calc(100vh-1rem)] overflow-hidden">
        <SharedItemRedirectHandler />
        {children}
      </SidebarInset>
    </SidebarProvider>
  );
}

export default DashboardLayout;
