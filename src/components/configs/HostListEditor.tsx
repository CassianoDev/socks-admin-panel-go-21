
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Plus, X, Edit3, Save } from "lucide-react";

interface HostListEditorProps {
  value: string;
  onChange: (value: string) => void;
}

export default function HostListEditor({ value, onChange }: HostListEditorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [hosts, setHosts] = useState<string[]>(
    value ? value.split(";").filter(Boolean) : []
  );
  const [newHost, setNewHost] = useState("");
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editValue, setEditValue] = useState("");

  // Generate a display string for the hosts
  const getDisplayValue = (hostList: string[]) => {
    if (hostList.length === 0) return "No hosts configured";
    if (hostList.length === 1) return hostList[0];
    return `${hostList[0]} +${hostList.length - 1} more`;
  };

  const handleAddHost = () => {
    if (newHost.trim()) {
      const updatedHosts = [...hosts, newHost.trim()];
      setHosts(updatedHosts);
      setNewHost("");
    }
  };

  const handleRemoveHost = (index: number) => {
    const updatedHosts = hosts.filter((_, i) => i !== index);
    setHosts(updatedHosts);
  };

  const handleStartEdit = (index: number) => {
    setEditingIndex(index);
    setEditValue(hosts[index]);
  };

  const handleSaveEdit = () => {
    if (editingIndex !== null) {
      const updatedHosts = [...hosts];
      if (editValue.trim()) {
        updatedHosts[editingIndex] = editValue.trim();
      }
      setHosts(updatedHosts);
      setEditingIndex(null);
    }
  };

  const handleSave = () => {
    onChange(hosts.join(";"));
    setIsOpen(false);
  };

  return (
    <>
      <div className="flex gap-2">
        <Button
          type="button"
          variant="outline"
          onClick={() => setIsOpen(true)}
          className="w-full justify-between text-left font-normal"
        >
          <span className="truncate">{getDisplayValue(hosts)}</span>
          <Edit3 className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </div>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-[550px]">
          <DialogHeader>
            <DialogTitle>Manage Host List</DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="flex gap-2">
              <Input 
                placeholder="Enter host (e.g. 127.0.0.1:80)"
                value={newHost}
                onChange={(e) => setNewHost(e.target.value)}
              />
              <Button type="button" onClick={handleAddHost} size="icon">
                <Plus className="h-4 w-4" />
              </Button>
            </div>

            {hosts.length > 0 ? (
              <ScrollArea className="h-[250px] rounded-md border p-2">
                <div className="space-y-2">
                  {hosts.map((host, index) => (
                    <div 
                      key={index} 
                      className="flex items-center justify-between p-2 rounded-md bg-muted/30"
                    >
                      {editingIndex === index ? (
                        <div className="flex-1 flex gap-2">
                          <Input 
                            value={editValue}
                            onChange={(e) => setEditValue(e.target.value)}
                            autoFocus
                          />
                          <Button 
                            size="icon" 
                            variant="ghost" 
                            onClick={handleSaveEdit}
                          >
                            <Save className="h-4 w-4" />
                          </Button>
                        </div>
                      ) : (
                        <>
                          <span className="flex-1 font-mono text-sm">{host}</span>
                          <div className="flex gap-1">
                            <Button 
                              size="icon"
                              variant="ghost"
                              onClick={() => handleStartEdit(index)}
                            >
                              <Edit3 className="h-3.5 w-3.5" />
                            </Button>
                            <Button 
                              size="icon"
                              variant="ghost"
                              onClick={() => handleRemoveHost(index)}
                              className="text-destructive hover:text-destructive"
                            >
                              <X className="h-3.5 w-3.5" />
                            </Button>
                          </div>
                        </>
                      )}
                    </div>
                  ))}
                </div>
              </ScrollArea>
            ) : (
              <div className="h-[100px] flex items-center justify-center text-muted-foreground">
                No hosts added. Add a host to get started.
              </div>
            )}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSave}>
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
