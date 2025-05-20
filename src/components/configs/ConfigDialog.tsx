
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
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Config } from "@/types/types";

interface ConfigDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  config?: Config;
  onSubmit: (data: ConfigFormValues) => void;
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
      message: "Priority must be a non-negative number",
    }),
  operator: z.string().min(1, "Operator is required"),
  multiproxy: z.boolean().default(false),
  forpremium: z.boolean().default(false),
});

export type ConfigFormValues = z.infer<typeof configFormSchema>;

export default function ConfigDialog({ open, onOpenChange, config, onSubmit }: ConfigDialogProps) {
  const form = useForm<ConfigFormValues>({
    resolver: zodResolver(configFormSchema),
    defaultValues: {
      name: "",
      host: "",
      dnsHost: "",
      sni: "same",
      payload: "",
      type: "tls",
      default: false,
      cdn: false,
      cdnName: "",
      notes: false,
      noteMsg: "",
      testPriority: "1",
      operator: "",
      multiproxy: false,
      forpremium: false,
    },
  });

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
        sni: "same",
        payload: "",
        type: "tls",
        default: false,
        cdn: false,
        cdnName: "",
        notes: false,
        noteMsg: "",
        testPriority: "1",
        operator: "",
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Configuration Name</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. INTERNET OPTIMIZER" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="operator"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Operator Name</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. UNIVERSAL BYPASS" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="host"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Host</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. 141.193.213.11" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="dnsHost"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>DNS Host (optional)</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. 8.8.8.8" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Connection Type</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select connection type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="tls">TLS</SelectItem>
                        <SelectItem value="http">HTTP</SelectItem>
                        <SelectItem value="ws">WebSocket</SelectItem>
                        <SelectItem value="grpc">gRPC</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="sni"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>SNI</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select SNI type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="same">Same as Host</SelectItem>
                        <SelectItem value="custom">Custom</SelectItem>
                        <SelectItem value="empty">Empty</SelectItem>
                      </SelectContent>
                    </Select>
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
                      placeholder="HTTP payload content..."
                      className="h-20" 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                    <FormLabel className="font-normal">Show Notes</FormLabel>
                  </FormItem>
                )}
              />
              
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
                    <FormLabel className="font-normal">Multi Proxy</FormLabel>
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
            
            {form.watch("notes") && (
              <FormField
                control={form.control}
                name="noteMsg"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Note Message</FormLabel>
                    <FormControl>
                      <Input placeholder="Note message to display" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                    <FormLabel className="font-normal">Default Config</FormLabel>
                  </FormItem>
                )}
              />
              
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
            
            {form.watch("cdn") && (
              <FormField
                control={form.control}
                name="cdnName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>CDN Provider</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select CDN provider" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="cloudflare">Cloudflare</SelectItem>
                        <SelectItem value="cloudfront">CloudFront</SelectItem>
                        <SelectItem value="googlecloud">Google Cloud</SelectItem>
                      </SelectContent>
                    </Select>
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
