
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
import { Config } from "@/types/types";
import { Edit, Download, MoreHorizontal, ThumbsDown, ThumbsUp, Trash2, Shield } from "lucide-react";
import { cn } from "@/lib/utils";

interface ConfigTableProps {
  configs: Config[];
  onEdit: (config: Config) => void;
  onDelete: (config: Config) => void;
}

export default function ConfigTable({ configs, onEdit, onDelete }: ConfigTableProps) {
  const [sortConfig, setSortConfig] = useState<{ key: keyof Config | null; direction: 'ascending' | 'descending' | null }>({
    key: null,
    direction: null
  });

  const requestSort = (key: keyof Config) => {
    let direction: 'ascending' | 'descending' = 'ascending';
    
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    
    setSortConfig({ key, direction });
  };

  const sortedConfigs = [...configs].sort((a, b) => {
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
            <TableHead>Name</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Host</TableHead>
            <TableHead 
              className="cursor-pointer hover:bg-muted/50"
              onClick={() => requestSort('downloaded')}
            >
              Downloads
              {sortConfig.key === 'downloaded' && (
                <span className="ml-1">{sortConfig.direction === 'ascending' ? '↑' : '↓'}</span>
              )}
            </TableHead>
            <TableHead 
              className="cursor-pointer hover:bg-muted/50"
              onClick={() => requestSort('onlines')}
            >
              Online
              {sortConfig.key === 'onlines' && (
                <span className="ml-1">{sortConfig.direction === 'ascending' ? '↑' : '↓'}</span>
              )}
            </TableHead>
            <TableHead>Rating</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedConfigs.map((config) => (
            <TableRow key={config._id}>
              <TableCell>
                <div className="font-medium">{config.name}</div>
                <div className="text-xs text-muted-foreground">{config.operator}</div>
              </TableCell>
              <TableCell>
                <Badge variant="outline" className="uppercase">{config.type}</Badge>
              </TableCell>
              <TableCell>{config.host}</TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <Download className="h-3.5 w-3.5 text-muted-foreground" />
                  {config.downloaded.toLocaleString()}
                </div>
              </TableCell>
              <TableCell>{config.onlines}</TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <div className="flex items-center text-green-500">
                    <ThumbsUp className="h-3.5 w-3.5 mr-1" />
                    {config.votesPositive}
                  </div>
                  <div className="flex items-center text-red-500">
                    <ThumbsDown className="h-3.5 w-3.5 mr-1" />
                    {config.votesNegative}
                  </div>
                </div>
              </TableCell>
              <TableCell>
                {config.forpremium ? (
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
                    <DropdownMenuItem onClick={() => onEdit(config)} className="cursor-pointer">
                      <Edit className="mr-2 h-4 w-4" />
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      onClick={() => onDelete(config)} 
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
