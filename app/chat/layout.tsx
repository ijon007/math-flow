import type { Metadata } from 'next';
import { AppSidebar } from '@/components/sidebar/app-sidebar';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';

export const metadata: Metadata = {
  title: 'Dashboard - Math Flow',
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
      <SidebarInset className="rounded-xl border border-neutral-200">
        {children}
      </SidebarInset>
    </SidebarProvider>
  );
}

export default DashboardLayout;
