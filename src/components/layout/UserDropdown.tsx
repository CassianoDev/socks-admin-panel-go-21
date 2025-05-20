
import { useState } from "react";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { LogOut, Settings, User } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useNavigate } from "react-router-dom";

export function UserDropdown() {
  const navigate = useNavigate();
  const [user] = useState({
    name: "Admin User",
    email: "admin@docksocks.com",
    initials: "AU"
  });

  const handleLogout = () => {
    // Simple logout function
    localStorage.removeItem('isLoggedIn');
    navigate('/login');
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-8 w-8 rounded-full">
          <Avatar className="h-8 w-8">
            <AvatarFallback>{user.initials}</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{user.name}</p>
            <p className="text-xs leading-none text-muted-foreground">
              {user.email}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <User className="mr-2 h-4 w-4" />
          <span>Profile</span>
        </DropdownMenuItem>
        <DropdownMenuItem>
          <Settings className="mr-2 h-4 w-4" />
          <span>Settings</span>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleLogout}>
          <LogOut className="mr-2 h-4 w-4" />
          <span>Log out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

// To fix the type error with ServerFormValues, export a shared interface
export interface ServerFormValues {
  _id?: string;
  country: string;
  city: string;
  ipv4: string;
  ipv6?: string;
  portHTTP?: string;
  portTLS?: string;
  portUDP?: string;
  portDNSTT?: string;
  cdn?: boolean;
  cdnName?: string;
  cdns: {
    cloudflare?: string[];
    googlecloud?: string[];
    cloudfront?: string[];
  };
  dnsttDomain?: string;
  http?: boolean;
  tls?: boolean;
  quic?: boolean;
  dnstt?: boolean;
  premium?: boolean;
  onlineUsers: number;
  capacity: number;
  state?: string;
  cloudFlareDomain?: string;
}

export interface UserFormValues {
  _id?: string;
  name: string;
  email: string;
  premium: boolean;
  transactionId?: string;
  e2Id?: string;
  expiryDate?: string;
}
