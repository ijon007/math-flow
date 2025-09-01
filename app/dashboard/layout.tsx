import { AppSidebar } from '@/components/sidebar/app-sidebar';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Dashboard - Math Flow",
  description: "Dashboard - Math Flow",
};

function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) { 
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        {children}
      </SidebarInset>
    </SidebarProvider>
  )
}

export default DashboardLayout