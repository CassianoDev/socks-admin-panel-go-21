
import { useState } from "react";
import { 
  Table, 
  TableHeader, 
  TableRow, 
  TableHead, 
  TableBody, 
  TableCell 
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Server } from "@/types/types";
import { Edit, MoreHorizontal, Shield, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface ServerTableProps {
  servers: Server[];
  onEdit: (server: Server) => void;
  onDelete: (server: Server) => void;
}

export default function ServerTable({ servers, onEdit, onDelete }: ServerTableProps) {
  const [sortConfig, setSortConfig] = useState<{ key: keyof Server | null; direction: 'ascending' | 'descending' | null }>({
    key: null,
    direction: null
  });

  const requestSort = (key: keyof Server) => {
    let direction: 'ascending' | 'descending' = 'ascending';
    
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    
    setSortConfig({ key, direction });
  };

  const sortedServers = [...servers].sort((a, b) => {
    if (!sortConfig.key) return 0;
    
    const aValue = a[sortConfig.key];
    const bValue = b[sortConfig.key];
    
    if (aValue < bValue) {
      return sortConfig.direction === 'ascending' ? -1 : 1;
    }
    if (aValue > bValue) {
      return sortConfig.direction === 'ascending' ? 1 : -1;
    }
    return 0;
  });

  return (
    <div className="rounded-md border border-border overflow-hidden">
      <Table>
        <TableHeader className="bg-muted/30">
          <TableRow>
            <TableHead 
              className="cursor-pointer hover:bg-muted/50"
              onClick={() => requestSort('country')}
            >
              Country
              {sortConfig.key === 'country' && (
                <span className="ml-1">{sortConfig.direction === 'ascending' ? '↑' : '↓'}</span>
              )}
            </TableHead>
            <TableHead 
              className="cursor-pointer hover:bg-muted/50"
              onClick={() => requestSort('ipv4')}
            >
              IP Address
              {sortConfig.key === 'ipv4' && (
                <span className="ml-1">{sortConfig.direction === 'ascending' ? '↑' : '↓'}</span>
              )}
            </TableHead>
            <TableHead>Protocols</TableHead>
            <TableHead 
              className="cursor-pointer hover:bg-muted/50"
              onClick={() => requestSort('onlineUsers')}
            >
              Users
              {sortConfig.key === 'onlineUsers' && (
                <span className="ml-1">{sortConfig.direction === 'ascending' ? '↑' : '↓'}</span>
              )}
            </TableHead>
            <TableHead>CDN</TableHead>
            <TableHead 
              className="cursor-pointer hover:bg-muted/50"
              onClick={() => requestSort('premium')}
            >
              Status
              {sortConfig.key === 'premium' && (
                <span className="ml-1">{sortConfig.direction === 'ascending' ? '↑' : '↓'}</span>
              )}
            </TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedServers.map((server) => (
            <TableRow key={server._id}>
              <TableCell>
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 rounded-full bg-gray-700 flex items-center justify-center overflow-hidden">
                    <span className="text-xs">{server.country}</span>
                  </div>
                  <span>{server.country} - {server.city}</span>
                </div>
              </TableCell>
              <TableCell>{server.ipv4}</TableCell>
              <TableCell>
                <div className="flex gap-1">
                  {server.http && <Badge variant="outline">HTTP</Badge>}
                  {server.tls && <Badge variant="outline">TLS</Badge>}
                  {server.quic && <Badge variant="outline">QUIC</Badge>}
                  {server.dnstt && <Badge variant="outline">DNSTT</Badge>}
                </div>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <span>{server.onlineUsers}</span>
                  <div className="w-full max-w-24 bg-gray-700 h-2 rounded-full overflow-hidden">
                    <div 
                      className={cn(
                        "h-full",
                        server.onlineUsers / server.capacity > 0.8 
                          ? "bg-red-500" 
                          : server.onlineUsers / server.capacity > 0.5 
                            ? "bg-yellow-500" 
                            : "bg-green-500"
                      )}
                      style={{ width: `${(server.onlineUsers / server.capacity) * 100}%` }}
                    />
                  </div>
                </div>
              </TableCell>
              <TableCell>
                {server.cdn ? (
                  <Badge variant="secondary" className="bg-blue-500/10 text-blue-400 border-blue-500/20">
                    {server.cdnName || "Enabled"}
                  </Badge>
                ) : (
                  <Badge variant="outline" className="text-muted-foreground">None</Badge>
                )}
              </TableCell>
              <TableCell>
                {server.premium ? (
                  <Badge className="bg-gradient-to-r from-amber-500 to-amber-300 text-black">
                    <Shield className="h-3 w-3 mr-1" /> Premium
                  </Badge>
                ) : (
                  <Badge variant="secondary">Free</Badge>
                )}
              </TableCell>
              <TableCell className="text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <MoreHorizontal className="h-4 w-4" />
                      <span className="sr-only">Actions</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                    <DropdownMenuItem onClick={() => onEdit(server)} className="cursor-pointer">
                      <Edit className="mr-2 h-4 w-4" />
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      onClick={() => onDelete(server)} 
                      className="text-destructive focus:text-destructive cursor-pointer"
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
