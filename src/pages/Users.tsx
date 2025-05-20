
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
import UserTable from "@/components/users/UserTable";
import UserDialog, { UserFormValues } from "@/components/users/UserDialog";
import { PremiumUser } from "@/types/types";
import { premiumUsers as mockUsers } from "@/lib/mock";
import { PlusCircle, Search } from "lucide-react";
import { toast } from "sonner";

export default function Users() {
  const [users, setUsers] = useState<PremiumUser[]>(mockUsers);
  const [searchTerm, setSearchTerm] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<PremiumUser | undefined>(undefined);

  const filteredUsers = users.filter(user => 
    user.emaiL.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.txid.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleEdit = (user: PremiumUser) => {
    setSelectedUser(user);
    setDialogOpen(true);
  };

  const handleDelete = (user: PremiumUser) => {
    setSelectedUser(user);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (selectedUser) {
      setUsers(users.filter(u => u._id !== selectedUser._id));
      toast.success(`User ${selectedUser.emaiL} deleted successfully`);
      setDeleteDialogOpen(false);
    }
  };

  const handleFormSubmit = (data: UserFormValues) => {
    if (selectedUser) {
      // Update existing user
      setUsers(users.map(u => 
        u._id === selectedUser._id ? { 
          ...u, 
          emaiL: data.emaiL,
          e2id: data.e2id,
          txid: data.txid,
          date: data.date.toISOString(),
          dateStart: Math.floor(data.date.getTime() / 1000),
          dateEnd: Math.floor(data.dateEnd.getTime() / 1000),
          pricePayed: data.pricePayed,
          months: typeof data.months === 'string' ? parseInt(data.months, 10) : data.months,
          suspicious: data.suspicious,
          used: data.used,
          expired: data.expired
        } : u
      ));
      toast.success(`User ${data.emaiL} updated successfully`);
    } else {
      // Add new user
      const newUser: PremiumUser = {
        _id: `new-${Date.now()}`,
        emaiL: data.emaiL,
        e2id: data.e2id,
        txid: data.txid,
        date: data.date.toISOString(),
        dateStart: Math.floor(data.date.getTime() / 1000),
        dateEnd: Math.floor(data.dateEnd.getTime() / 1000),
        pricePayed: data.pricePayed,
        months: typeof data.months === 'string' ? parseInt(data.months, 10) : data.months,
        suspicious: data.suspicious,
        used: data.used,
        expired: data.expired
      };
      setUsers([...users, newUser]);
      toast.success(`User ${data.emaiL} added successfully`);
    }
    setSelectedUser(undefined);
    setDialogOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold">Premium Users</h2>
        <Button className="gradient-blue" onClick={() => {
          setSelectedUser(undefined);
          setDialogOpen(true);
        }}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Add User
        </Button>
      </div>
      
      <div className="flex items-center border rounded-md pl-3 max-w-md bg-muted/30">
        <Search className="h-4 w-4 text-muted-foreground" />
        <Input 
          placeholder="Search by email or transaction ID..." 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="border-0 focus-visible:ring-0 focus-visible:ring-offset-0"
        />
      </div>
      
      <UserTable 
        users={filteredUsers} 
        onEdit={handleEdit} 
        onDelete={handleDelete} 
      />
      
      <UserDialog 
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        user={selectedUser}
        onSubmit={handleFormSubmit}
      />
      
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the premium user{" "}
              <span className="font-semibold">
                {selectedUser?.emaiL}
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
        {filteredUsers.length} user{filteredUsers.length !== 1 ? 's' : ''} found
      </div>
    </div>
  );
}
