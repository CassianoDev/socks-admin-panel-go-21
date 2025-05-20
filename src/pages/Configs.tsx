
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
import ConfigTable from "@/components/configs/ConfigTable";
import ConfigDialog, { ConfigFormValues } from "@/components/configs/ConfigDialog";
import { Config } from "@/types/types";
import { configs as mockConfigs } from "@/lib/mock";
import { PlusCircle, Search } from "lucide-react";
import { toast } from "sonner";

export default function Configs() {
  const [configs, setConfigs] = useState<Config[]>(mockConfigs);
  const [searchTerm, setSearchTerm] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedConfig, setSelectedConfig] = useState<Config | undefined>(undefined);

  const filteredConfigs = configs.filter(config => 
    config.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    config.operator.toLowerCase().includes(searchTerm.toLowerCase()) ||
    config.host.includes(searchTerm)
  );

  const handleEdit = (config: Config) => {
    setSelectedConfig(config);
    setDialogOpen(true);
  };

  const handleDelete = (config: Config) => {
    setSelectedConfig(config);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (selectedConfig) {
      setConfigs(configs.filter(c => c._id !== selectedConfig._id));
      toast.success(`Configuration ${selectedConfig.name} deleted successfully`);
      setDeleteDialogOpen(false);
    }
  };

  const handleFormSubmit = (data: ConfigFormValues) => {
    if (selectedConfig) {
      // Update existing config
      setConfigs(configs.map(c => 
        c._id === selectedConfig._id ? { 
          ...c, 
          ...data,
          testPriority: typeof data.testPriority === 'string' ? parseInt(data.testPriority, 10) : data.testPriority 
        } : c
      ));
      toast.success(`Configuration ${data.name} updated successfully`);
    } else {
      // Add new config
      const newConfig: Config = {
        _id: `new-${Date.now()}`,
        name: data.name,
        host: data.host,
        dnsHost: data.dnsHost || "",
        sni: data.sni || "same",
        payload: data.payload || "",
        type: data.type,
        default: data.default,
        downloaded: 0,
        cdn: data.cdn,
        cdnName: data.cdnName || "",
        cdnNumber: data.cdn ? 1 : 0,
        notes: data.notes,
        noteMsg: data.noteMsg || "",
        testPriority: typeof data.testPriority === 'string' ? parseInt(data.testPriority, 10) : data.testPriority,
        operator: data.operator,
        onlines: 0,
        votesPositive: 0,
        votesNegative: 0,
        multiproxy: data.multiproxy,
        forpremium: data.forpremium
      };
      setConfigs([...configs, newConfig]);
      toast.success(`Configuration ${data.name} added successfully`);
    }
    setSelectedConfig(undefined);
    setDialogOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold">Configurations</h2>
        <Button className="gradient-blue" onClick={() => {
          setSelectedConfig(undefined);
          setDialogOpen(true);
        }}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Add Config
        </Button>
      </div>
      
      <div className="flex items-center border rounded-md pl-3 max-w-md bg-muted/30">
        <Search className="h-4 w-4 text-muted-foreground" />
        <Input 
          placeholder="Search by name, operator or host..." 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="border-0 focus-visible:ring-0 focus-visible:ring-offset-0"
        />
      </div>
      
      <ConfigTable 
        configs={filteredConfigs} 
        onEdit={handleEdit} 
        onDelete={handleDelete} 
      />
      
      <ConfigDialog 
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        config={selectedConfig}
        onSubmit={handleFormSubmit}
      />
      
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the configuration{" "}
              <span className="font-semibold">
                {selectedConfig?.name}
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
        {filteredConfigs.length} configuration{filteredConfigs.length !== 1 ? 's' : ''} found
      </div>
    </div>
  );
}
