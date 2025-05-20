
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
import { Checkbox } from "@/components/ui/checkbox";
import { Server } from "@/types/types";

interface ServerDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  server?: Server;
  onSubmit: (data: ServerFormValues) => void;
}

const serverFormSchema = z.object({
  cloudFlareDomain: z.string().min(1, "Domain is required"),
  dnsttDomain: z.string().optional(),
  country: z.string().min(1, "Country is required"),
  city: z.string().min(1, "City is required"),
  state: z.string().min(1, "State is required"),
  ipv4: z.string().min(1, "IPv4 is required"),
  ipv6: z.string().optional(),
  portHTTP: z.string().optional(),
  portTLS: z.string().optional(),
  portUDP: z.string().optional(),
  portDNSTT: z.string().optional(),
  premium: z.boolean().default(false),
  invisible: z.boolean().default(false),
  tls: z.boolean().default(false),
  quic: z.boolean().default(false),
  http: z.boolean().default(false),
  dnstt: z.boolean().default(false),
  cdn: z.boolean().default(false),
  cdnName: z.string().optional(),
  capacity: z.string()
    .transform((val) => parseInt(val, 10))
    .refine((val) => !isNaN(val) && val > 0, {
      message: "Capacity must be a positive number",
    }),
});

export type ServerFormValues = z.infer<typeof serverFormSchema>;

export default function ServerDialog({ open, onOpenChange, server, onSubmit }: ServerDialogProps) {
  const form = useForm<ServerFormValues>({
    resolver: zodResolver(serverFormSchema),
    defaultValues: {
      cloudFlareDomain: "",
      dnsttDomain: "",
      country: "",
      city: "",
      state: "",
      ipv4: "",
      ipv6: "",
      portHTTP: "80",
      portTLS: "443",
      portUDP: "0",
      portDNSTT: "53",
      premium: false,
      invisible: false,
      tls: false,
      quic: false,
      http: false,
      dnstt: false,
      cdn: false,
      cdnName: "",
      capacity: "100",
    },
  });

  useEffect(() => {
    if (server) {
      form.reset({
        cloudFlareDomain: server.cloudFlareDomain,
        dnsttDomain: server.dnsttDomain,
        country: server.country,
        city: server.city,
        state: server.state,
        ipv4: server.ipv4,
        ipv6: server.ipv6 || "",
        portHTTP: server.portHTTP,
        portTLS: server.portTLS,
        portUDP: server.portUDP,
        portDNSTT: server.portDNSTT,
        premium: server.premium,
        invisible: server.invisible,
        tls: server.tls,
        quic: server.quic,
        http: server.http,
        dnstt: server.dnstt,
        cdn: server.cdn,
        cdnName: server.cdnName || "",
        capacity: server.capacity.toString(),
      });
    } else {
      form.reset({
        cloudFlareDomain: "",
        dnsttDomain: "",
        country: "",
        city: "",
        state: "",
        ipv4: "",
        ipv6: "",
        portHTTP: "80",
        portTLS: "443",
        portUDP: "0",
        portDNSTT: "53",
        premium: false,
        invisible: false,
        tls: false,
        quic: false,
        http: false,
        dnstt: false,
        cdn: false,
        cdnName: "",
        capacity: "100",
      });
    }
  }, [server, form]);

  const handleSubmit = (values: ServerFormValues) => {
    onSubmit(values);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{server ? "Edit Server" : "Add New Server"}</DialogTitle>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="country"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Country</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. US, BR, JP" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="city"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>City</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. New York, São Paulo" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="state"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>State</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. NY, SP" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="ipv4"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>IPv4 Address</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. 123.45.67.89" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="ipv6"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>IPv6 Address (optional)</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. 2001:db8::1" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="capacity"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Capacity (max users)</FormLabel>
                    <FormControl>
                      <Input type="number" min="1" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="cloudFlareDomain"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>CloudFlare Domain</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. server.domain.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="dnsttDomain"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>DNSTT Domain (optional)</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. dns.domain.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <FormField
                control={form.control}
                name="portHTTP"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>HTTP Port</FormLabel>
                    <FormControl>
                      <Input type="text" {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="portTLS"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>TLS Port</FormLabel>
                    <FormControl>
                      <Input type="text" {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="portUDP"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>UDP Port</FormLabel>
                    <FormControl>
                      <Input type="text" {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="portDNSTT"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>DNSTT Port</FormLabel>
                    <FormControl>
                      <Input type="text" {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <FormField
                control={form.control}
                name="http"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center space-x-3 space-y-0">
                    <FormControl>
                      <Checkbox 
                        checked={field.value} 
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <FormLabel className="font-normal">HTTP</FormLabel>
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="tls"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center space-x-3 space-y-0">
                    <FormControl>
                      <Checkbox 
                        checked={field.value} 
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <FormLabel className="font-normal">TLS</FormLabel>
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="quic"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center space-x-3 space-y-0">
                    <FormControl>
                      <Checkbox 
                        checked={field.value} 
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <FormLabel className="font-normal">QUIC</FormLabel>
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="dnstt"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center space-x-3 space-y-0">
                    <FormControl>
                      <Checkbox 
                        checked={field.value} 
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <FormLabel className="font-normal">DNSTT</FormLabel>
                  </FormItem>
                )}
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <FormField
                control={form.control}
                name="premium"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center space-x-3 space-y-0">
                    <FormControl>
                      <Checkbox 
                        checked={field.value} 
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <FormLabel className="font-normal">Premium Server</FormLabel>
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="invisible"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center space-x-3 space-y-0">
                    <FormControl>
                      <Checkbox 
                        checked={field.value} 
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <FormLabel className="font-normal">Hidden Server</FormLabel>
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
            </div>
            
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
            
            <DialogFooter>
              <Button type="submit" className="gradient-blue">
                {server ? "Update Server" : "Add Server"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
