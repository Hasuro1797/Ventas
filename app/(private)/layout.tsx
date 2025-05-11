import AppSideBar from "@/components/AppSideBar";
import HeaderComponent from "@/components/headerComponent/HeaderComponent";
import { SidebarProvider } from "@/components/ui/sidebar";

export default function PrivateLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider className="font-sans">
      <AppSideBar />
      <main className="w-full font-sans">
        <HeaderComponent />
        {children}
      </main>
    </SidebarProvider>
  );
}
