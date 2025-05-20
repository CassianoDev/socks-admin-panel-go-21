
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { X, Plus, Clipboard } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

interface HostListEditorProps {
  value: string;
  onChange: (value: string) => void;
}

export default function HostListEditor({ value, onChange }: HostListEditorProps) {
  const [hosts, setHosts] = useState<string[]>(value ? value.split(";") : [""]);
  const [bulkPasteDialogOpen, setBulkPasteDialogOpen] = useState(false);
  const [bulkPasteContent, setBulkPasteContent] = useState("");
  
  // Update the parent component's value whenever hosts change
  const updateParentValue = (newHosts: string[]) => {
    const filteredHosts = newHosts.filter(host => host.trim() !== "");
    onChange(filteredHosts.join(";"));
    setHosts(filteredHosts.length > 0 ? filteredHosts : [""]);
  };

  const handleHostChange = (index: number, newValue: string) => {
    const newHosts = [...hosts];
    newHosts[index] = newValue;
    setHosts(newHosts);
    updateParentValue(newHosts);
  };

  const handleAddHost = () => {
    setHosts([...hosts, ""]);
  };

  const handleRemoveHost = (index: number) => {
    const newHosts = hosts.filter((_, i) => i !== index);
    updateParentValue(newHosts);
  };

  const handleBulkPaste = () => {
    setBulkPasteDialogOpen(true);
  };

  const processBulkPaste = () => {
    if (!bulkPasteContent.trim()) {
      setBulkPasteDialogOpen(false);
      return;
    }

    // Split by common delimiters (newline, comma, semicolon)
    const pastedHosts = bulkPasteContent
      .split(/[\n,;]+/)
      .map(host => host.trim())
      .filter(host => host !== "");

    if (pastedHosts.length > 0) {
      updateParentValue(pastedHosts);
      setBulkPasteContent("");
      setBulkPasteDialogOpen(false);
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm text-muted-foreground">
          {hosts.filter(h => h.trim() !== "").length} host(s) configured
        </span>
        <div className="flex space-x-2">
          <Button 
            type="button" 
            variant="outline" 
            size="sm"
            onClick={handleBulkPaste}
          >
            <Clipboard className="mr-1 h-4 w-4" />
            Bulk Paste
          </Button>
          <Button 
            type="button" 
            variant="outline" 
            size="sm"
            onClick={handleAddHost}
          >
            <Plus className="mr-1 h-4 w-4" />
            Add Host
          </Button>
        </div>
      </div>

      {hosts.map((host, index) => (
        <div key={index} className="flex items-center space-x-2">
          <Input
            value={host}
            onChange={(e) => handleHostChange(index, e.target.value)}
            placeholder="hostname:port"
            className="flex-1"
          />
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={() => handleRemoveHost(index)}
            disabled={hosts.length === 1 && host === ""}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      ))}

      <Dialog open={bulkPasteDialogOpen} onOpenChange={setBulkPasteDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Paste Multiple Hosts</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Paste a list of hosts (one per line, or separated by commas/semicolons)
            </p>
            <Textarea
              value={bulkPasteContent}
              onChange={(e) => setBulkPasteContent(e.target.value)}
              placeholder="host1:port1&#10;host2:port2&#10;host3:port3"
              className="min-h-[150px]"
              autoFocus
            />
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setBulkPasteDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={processBulkPaste}>
              Add Hosts
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
