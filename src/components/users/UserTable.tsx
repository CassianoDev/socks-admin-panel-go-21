
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
import { PremiumUser } from "@/types/types";
import { Edit, MoreHorizontal, Trash2, Clock, AlertTriangle } from "lucide-react";
import { format } from "date-fns";

interface UserTableProps {
  users: PremiumUser[];
  onEdit: (user: PremiumUser) => void;
  onDelete: (user: PremiumUser) => void;
}

export default function UserTable({ users, onEdit, onDelete }: UserTableProps) {
  const [sortConfig, setSortConfig] = useState<{ key: keyof PremiumUser | null; direction: 'ascending' | 'descending' | null }>({
    key: null,
    direction: null
  });

  const requestSort = (key: keyof PremiumUser) => {
    let direction: 'ascending' | 'descending' = 'ascending';
    
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    
    setSortConfig({ key, direction });
  };

  const sortedUsers = [...users].sort((a, b) => {
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
              onClick={() => requestSort('emaiL')}
            >
              Email
              {sortConfig.key === 'emaiL' && (
                <span className="ml-1">{sortConfig.direction === 'ascending' ? '↑' : '↓'}</span>
              )}
            </TableHead>
            <TableHead>Purchase ID</TableHead>
            <TableHead 
              className="cursor-pointer hover:bg-muted/50"
              onClick={() => requestSort('date')}
            >
              Purchase Date
              {sortConfig.key === 'date' && (
                <span className="ml-1">{sortConfig.direction === 'ascending' ? '↑' : '↓'}</span>
              )}
            </TableHead>
            <TableHead 
              className="cursor-pointer hover:bg-muted/50"
              onClick={() => requestSort('months')}
            >
              Duration
              {sortConfig.key === 'months' && (
                <span className="ml-1">{sortConfig.direction === 'ascending' ? '↑' : '↓'}</span>
              )}
            </TableHead>
            <TableHead 
              className="cursor-pointer hover:bg-muted/50"
              onClick={() => requestSort('dateEnd')}
            >
              Expires
              {sortConfig.key === 'dateEnd' && (
                <span className="ml-1">{sortConfig.direction === 'ascending' ? '↑' : '↓'}</span>
              )}
            </TableHead>
            <TableHead 
              className="cursor-pointer hover:bg-muted/50"
              onClick={() => requestSort('pricePayed')}
            >
              Price
              {sortConfig.key === 'pricePayed' && (
                <span className="ml-1">{sortConfig.direction === 'ascending' ? '↑' : '↓'}</span>
              )}
            </TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedUsers.map((user) => (
            <TableRow key={user._id} className={user.suspicious ? "bg-red-950/20" : ""}>
              <TableCell>{user.emaiL}</TableCell>
              <TableCell>
                <div className="font-mono text-xs overflow-hidden text-ellipsis">{user.txid}</div>
              </TableCell>
              <TableCell>{format(new Date(user.date), 'MMM dd, yyyy')}</TableCell>
              <TableCell>{user.months} months</TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <Clock className="h-3.5 w-3.5 text-muted-foreground" />
                  {format(new Date(user.dateEnd * 1000), 'MMM dd, yyyy')}
                </div>
              </TableCell>
              <TableCell>${user.pricePayed}</TableCell>
              <TableCell>
                {user.expired ? (
                  <Badge variant="destructive">Expired</Badge>
                ) : user.suspicious ? (
                  <Badge variant="outline" className="bg-red-600/20 text-red-400 border-red-700">
                    <AlertTriangle className="h-3 w-3 mr-1" />
                    Suspicious
                  </Badge>
                ) : (
                  <Badge variant="secondary" className="bg-green-600/20 text-green-400 border-green-700">
                    Active
                  </Badge>
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
                    <DropdownMenuItem onClick={() => onEdit(user)} className="cursor-pointer">
                      <Edit className="mr-2 h-4 w-4" />
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      onClick={() => onDelete(user)} 
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
