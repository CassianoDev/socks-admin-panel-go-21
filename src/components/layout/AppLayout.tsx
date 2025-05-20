
import { ReactNode, useState } from "react";
import { Header } from "./Header";
import Sidebar from "./Sidebar";

export default function AppLayout({ children }: { children: ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="min-h-screen w-full flex">
      <Sidebar open={sidebarOpen} />
      
      <div className="flex flex-col flex-grow">
        <Header onMenuClick={toggleSidebar} />
        <main className="flex-grow p-6">{children}</main>
      </div>
    </div>
  );
}
