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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import { Server } from "@/types/types";
import { Edit, MoreHorizontal, Shield, Trash2, ChevronDown } from "lucide-react";
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

  // Helper function to count total CDNs
  const countCDNs = (server: Server) => {
    // Count all CDN entries across all providers
    return Object.values(server.cdns || {}).reduce((total, domains) => {
      return total + (domains?.length || 0);
    }, 0);
  };

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
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="secondary" size="sm" className="h-8 bg-blue-500/10 text-blue-400 border-blue-500/20">
                        <span className="mr-1">{server.cdnName || "CDNs"}</span>
                        <Badge variant="outline" className="ml-1 px-1.5 py-0 h-5">
                          {countCDNs(server)}
                        </Badge>
                        <ChevronDown className="ml-1 h-3 w-3" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-60 p-2" align="start">
                      <div className="space-y-2">
                        <h4 className="font-medium text-sm">CDN Providers</h4>
                        
                        {Object.entries(server.cdns || {}).map(([provider, domains]) => (
                          domains && domains.length > 0 && (
                            <div key={provider} className="space-y-1">
                              <h5 className="text-xs font-medium text-muted-foreground capitalize">
                                {provider === 'cloudflare' 
                                  ? 'Cloudflare' 
                                  : provider === 'googlecloud' 
                                    ? 'Google Cloud' 
                                    : provider === 'cloudfront' 
                                      ? 'CloudFront' 
                                      : provider}
                              </h5>
                              <div className="space-y-1">
                                {domains.map((cdn, i) => (
                                  <div key={i} className="text-xs px-2 py-1 bg-muted/30 rounded">{cdn}</div>
                                ))}
                              </div>
                            </div>
                          )
                        ))}
                        
                        {countCDNs(server) === 0 && (
                          <div className="text-xs text-muted-foreground p-2">No CDN entries found</div>
                        )}
                      </div>
                    </PopoverContent>
                  </Popover>
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
