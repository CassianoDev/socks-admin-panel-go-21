
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Config, ConfigFormValues } from "@/types/types";

interface ConfigDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  config?: Config;
  onSubmit: (data: ConfigFormValues) => void;
  hostInputOverride?: (multiproxy: boolean, value: string, onChange: (value: string) => void) => React.ReactNode | null;
}

const configFormSchema = z.object({
  name: z.string().min(1, "Name is required"),
  host: z.string().min(1, "Host is required"),
  dnsHost: z.string().optional(),
  sni: z.string().optional(),
  payload: z.string().optional(),
  type: z.string().min(1, "Type is required"),
  default: z.boolean().default(false),
  cdn: z.boolean().default(false),
  cdnName: z.string().optional(),
  notes: z.boolean().default(false),
  noteMsg: z.string().optional(),
  testPriority: z.string()
    .transform((val) => parseInt(val, 10))
    .refine((val) => !isNaN(val) && val >= 0, {
      message: "Priority must be a positive number",
    }),
  operator: z.string().min(1, "Operator is required"),
  multiproxy: z.boolean().default(false),
  forpremium: z.boolean().default(false),
});

export default function ConfigDialog({ open, onOpenChange, config, onSubmit, hostInputOverride }: ConfigDialogProps) {
  const form = useForm<ConfigFormValues>({
    resolver: zodResolver(configFormSchema),
    defaultValues: {
      name: "",
      host: "",
      dnsHost: "",
      sni: "",
      payload: "",
      type: "ssh",
      default: false,
      cdn: false,
      cdnName: "",
      notes: false,
      noteMsg: "",
      testPriority: "0",
      operator: "vpnapp",
      multiproxy: false,
      forpremium: false,
    },
  });

  // Get the current multiproxy value from form
  const multiproxyEnabled = form.watch("multiproxy");

  useEffect(() => {
    if (config) {
      form.reset({
        name: config.name,
        host: config.host,
        dnsHost: config.dnsHost,
        sni: config.sni,
        payload: config.payload,
        type: config.type,
        default: config.default,
        cdn: config.cdn,
        cdnName: config.cdnName,
        notes: config.notes,
        noteMsg: config.noteMsg,
        testPriority: config.testPriority.toString(),
        operator: config.operator,
        multiproxy: config.multiproxy,
        forpremium: config.forpremium,
      });
    } else {
      form.reset({
        name: "",
        host: "",
        dnsHost: "",
        sni: "",
        payload: "",
        type: "ssh",
        default: false,
        cdn: false,
        cdnName: "",
        notes: false,
        noteMsg: "",
        testPriority: "0",
        operator: "vpnapp",
        multiproxy: false,
        forpremium: false,
      });
    }
  }, [config, form]);

  const handleSubmit = (values: ConfigFormValues) => {
    onSubmit(values);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{config ? "Edit Configuration" : "Add New Configuration"}</DialogTitle>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. SSH Direct" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Type</FormLabel>
                    <Select 
                      onValueChange={field.onChange} 
                      defaultValue={field.value}
                      value={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="ssh">SSH</SelectItem>
                        <SelectItem value="vmess">VMESS</SelectItem>
                        <SelectItem value="v2ray">V2RAY</SelectItem>
                        <SelectItem value="trojan">TROJAN</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="testPriority"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Test Priority</FormLabel>
                    <FormControl>
                      <Input type="number" min="0" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <FormField
              control={form.control}
              name="multiproxy"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center space-x-3 space-y-0">
                  <FormControl>
                    <Checkbox 
                      checked={field.value} 
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel className="font-normal">Multi-proxy Support</FormLabel>
                    <FormDescription>
                      Enable for multiple host addresses separated by semicolons
                    </FormDescription>
                  </div>
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="host"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Host{multiproxyEnabled ? 's' : ''}</FormLabel>
                  <FormControl>
                    {hostInputOverride && multiproxyEnabled 
                      ? hostInputOverride(multiproxyEnabled, field.value, field.onChange)
                      : <Input placeholder="e.g. 127.0.0.1:22" {...field} />
                    }
                  </FormControl>
                  {multiproxyEnabled && (
                    <FormDescription>
                      Multiple hosts can be added and managed with the editor
                    </FormDescription>
                  )}
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="dnsHost"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>DNS Host (optional)</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. dns.example.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="sni"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>SNI (optional)</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. example.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <FormField
              control={form.control}
              name="payload"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Payload (optional)</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Enter payload content here..." 
                      className="min-h-[100px]" 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="operator"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Operator</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. vpnapp" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="space-y-3">
                <FormField
                  control={form.control}
                  name="default"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center space-x-3 space-y-0">
                      <FormControl>
                        <Checkbox 
                          checked={field.value} 
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <FormLabel className="font-normal">Default Configuration</FormLabel>
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="forpremium"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center space-x-3 space-y-0">
                      <FormControl>
                        <Checkbox 
                          checked={field.value} 
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <FormLabel className="font-normal">Premium Users Only</FormLabel>
                    </FormItem>
                  )}
                />
              </div>
            </div>
            
            <hr className="border-border" />
            
            <FormField
              control={form.control}
              name="cdn"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center space-x-3 space-y-0">
                  <FormControl>
                    <Checkbox 
                      checked={field.value} 
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <FormLabel className="font-normal">CDN Enabled</FormLabel>
                </FormItem>
              )}
            />
            
            {form.watch("cdn") && (
              <FormField
                control={form.control}
                name="cdnName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>CDN Provider</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. cloudflare, cloudfront" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
            
            <hr className="border-border" />
            
            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center space-x-3 space-y-0">
                  <FormControl>
                    <Checkbox 
                      checked={field.value} 
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <FormLabel className="font-normal">Add Notes</FormLabel>
                </FormItem>
              )}
            />
            
            {form.watch("notes") && (
              <FormField
                control={form.control}
                name="noteMsg"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Note Message</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Note information for users..." 
                        className="min-h-[80px]" 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
            
            <DialogFooter>
              <Button type="submit" className="gradient-blue">
                {config ? "Update Configuration" : "Add Configuration"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
