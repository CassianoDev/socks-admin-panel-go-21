import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import ServerTable from "@/components/servers/ServerTable";
import ServerDialog from "@/components/servers/ServerDialog";
import { Server } from "@/types/types";
import { servers as mockServers } from "@/lib/mock";
import { PlusCircle, Search } from "lucide-react";
import { toast } from "sonner";

// Define ServerFormValues here to avoid import issues
interface ServerFormValues {
  cloudFlareDomain: string;
  dnsttDomain?: string;
  country: string;
  city: string;
  state: string;
  ipv4: string;
  ipv6?: string;
  portHTTP?: string;
  portTLS?: string;
  portUDP?: string;
  portDNSTT?: string;
  premium: boolean;
  invisible: boolean;
  tls: boolean;
  quic: boolean;
  http: boolean;
  dnstt: boolean;
  cdn: boolean;
  cdnName?: string;
  capacity: string | number;
}

export default function Servers() {
  const [servers, setServers] = useState<Server[]>(mockServers);
  const [searchTerm, setSearchTerm] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedServer, setSelectedServer] = useState<Server | undefined>(undefined);

  const filteredServers = servers.filter(server => 
    server.country.toLowerCase().includes(searchTerm.toLowerCase()) ||
    server.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
    server.ipv4.includes(searchTerm) ||
    server.cloudFlareDomain.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleEdit = (server: Server) => {
    setSelectedServer(server);
    setDialogOpen(true);
  };

  const handleDelete = (server: Server) => {
    setSelectedServer(server);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (selectedServer) {
      setServers(servers.filter(s => s._id !== selectedServer._id));
      toast.success(`Server ${selectedServer.cloudFlareDomain} deleted successfully`);
      setDeleteDialogOpen(false);
    }
  };

  const handleFormSubmit = (data: ServerFormValues) => {
    if (selectedServer) {
      // Update existing server
      setServers(servers.map(s => 
        s._id === selectedServer._id ? { 
          ...s, 
          ...data,
          capacity: typeof data.capacity === 'string' ? parseInt(data.capacity, 10) : data.capacity 
        } : s
      ));
      toast.success(`Server ${data.cloudFlareDomain} updated successfully`);
    } else {
      // Add new server
      const newServer: Server = {
        _id: `new-${Date.now()}`,
        cloudFlareDomain: data.cloudFlareDomain,
        dnsttDomain: data.dnsttDomain || "",
        country: data.country,
        city: data.city,
        state: data.state,
        ipv4: data.ipv4,
        ipv6: data.ipv6 || "",
        portHTTP: data.portHTTP || "80",
        portTLS: data.portTLS || "443",
        portUDP: data.portUDP || "0",
        portDNSTT: data.portDNSTT || "53",
        flag: `${data.country.toLowerCase()}flag.png`,
        premium: data.premium,
        invisible: data.invisible,
        usersAdsed: 0,
        tls: data.tls,
        quic: data.quic,
        http: data.http,
        dnstt: data.dnstt,
        lastPing: Math.floor(Date.now() / 1000),
        UniSkip: false,
        usage: 0,
        onlineUsers: 0,
        capacity: typeof data.capacity === 'string' ? parseInt(data.capacity, 10) : data.capacity,
        cdnNumber: 0,
        cdnName: data.cdnName || "",
        cdn: data.cdn,
        cdns: {
          cloudflare: [],
          googlecloud: [],
          cloudfront: []
        }
      };
      setServers([...servers, newServer]);
      toast.success(`Server ${data.cloudFlareDomain} added successfully`);
    }
    setSelectedServer(undefined);
    setDialogOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold">Servers</h2>
        <Button className="gradient-blue" onClick={() => {
          setSelectedServer(undefined);
          setDialogOpen(true);
        }}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Add Server
        </Button>
      </div>
      
      <div className="flex items-center border rounded-md pl-3 max-w-md bg-muted/30">
        <Search className="h-4 w-4 text-muted-foreground" />
        <Input 
          placeholder="Search by country, city or IP..." 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="border-0 focus-visible:ring-0 focus-visible:ring-offset-0"
        />
      </div>
      
      <ServerTable 
        servers={filteredServers} 
        onEdit={handleEdit} 
        onDelete={handleDelete} 
      />
      
      <ServerDialog 
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        server={selectedServer}
        onSubmit={handleFormSubmit}
      />
      
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the server{" "}
              <span className="font-semibold">
                {selectedServer?.cloudFlareDomain}
              </span>. 
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={confirmDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      
      <div className="text-sm text-muted-foreground">
        {filteredServers.length} server{filteredServers.length !== 1 ? 's' : ''} found
      </div>
    </div>
  );
}
