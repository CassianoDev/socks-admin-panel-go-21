import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { UserDropdown } from "./UserDropdown";
import { ThemeToggle } from "./ThemeToggle";

interface HeaderProps {
  onMenuClick: () => void;
}

export function Header({ onMenuClick }: HeaderProps) {
  return (
    <header className="sticky top-0 z-40 border-b bg-background/80 backdrop-blur">
      <div className="flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-4">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={onMenuClick}
            className="lg:hidden"
          >
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle menu</span>
          </Button>
          <h1 className="text-xl font-semibold">VPN Admin Panel</h1>
        </div>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <UserDropdown />
        </div>
      </div>
    </header>
  );
}
