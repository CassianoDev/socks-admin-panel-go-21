
import { NavLink } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ChevronLeft, ChevronRight, LayoutDashboard, Server, Settings, Shield, Users, Activity } from "lucide-react";
import { cn } from "@/lib/utils";

interface SidebarProps {
  open: boolean;
}

export default function Sidebar({ open }: SidebarProps) {
  const collapsed = !open;
  
  return (
    <div 
      className={cn(
        "bg-card border-r border-border h-screen transition-all duration-300 ease-in-out flex flex-col",
        collapsed ? "w-16" : "w-64"
      )}
    >
      <div className="h-16 flex items-center justify-between px-4 border-b border-border">
        {!collapsed && (
          <span className="text-lg font-bold gradient-heading">DockSocks VPN</span>
        )}
      </div>
      
      <ScrollArea className="flex-1">
        <nav className="px-2 py-4">
          <ul className="space-y-1">
            <MenuItem 
              to="/dashboard" 
              icon={<LayoutDashboard className="h-5 w-5" />} 
              title="Dashboard" 
              collapsed={collapsed}
            />
            <MenuItem 
              to="/servers" 
              icon={<Server className="h-5 w-5" />} 
              title="Servers" 
              collapsed={collapsed}
            />
            <MenuItem 
              to="/configs" 
              icon={<Shield className="h-5 w-5" />} 
              title="Configurations" 
              collapsed={collapsed}
            />
            <MenuItem 
              to="/users" 
              icon={<Users className="h-5 w-5" />} 
              title="Premium Users" 
              collapsed={collapsed}
            />
            <MenuItem 
              to="/ad-logs" 
              icon={<Activity className="h-5 w-5" />} 
              title="Ad Logs" 
              collapsed={collapsed}
            />
            <MenuItem 
              to="/app-settings" 
              icon={<Settings className="h-5 w-5" />} 
              title="App Settings" 
              collapsed={collapsed}
            />
          </ul>
        </nav>
      </ScrollArea>
      
      <div className="p-4 border-t border-border">
        <div className={cn(
          "text-xs text-center text-muted-foreground",
          collapsed ? "hidden" : "block"
        )}>
          <p>DockSocks Admin v1.0</p>
          <p>© 2025 DockSocks VPN</p>
        </div>
      </div>
    </div>
  );
}

interface MenuItemProps {
  to: string;
  icon: React.ReactNode;
  title: string;
  collapsed: boolean;
}

function MenuItem({ to, icon, title, collapsed }: MenuItemProps) {
  return (
    <li>
      <NavLink 
        to={to} 
        className={({ isActive }) => cn(
          "sidebar-item",
          isActive ? "active" : "",
          collapsed && "justify-center"
        )}
      >
        {icon}
        {!collapsed && <span>{title}</span>}
      </NavLink>
    </li>
  );
}
