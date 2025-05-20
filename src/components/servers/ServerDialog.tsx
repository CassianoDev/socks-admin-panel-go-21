
import { useState, useEffect } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
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
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Server, ServerFormValues } from "@/types/types";

// Form schema
const serverFormSchema = z.object({
  cloudFlareDomain: z.string().min(1, "Domain is required"),
  dnsttDomain: z.string().optional(),
  country: z.string().min(1, "Country is required"),
  city: z.string().min(1, "City is required"),
  state: z.string().optional(),
  ipv4: z.string().min(1, "IPv4 is required"),
  ipv6: z.string().optional(),
  portHTTP: z.string().optional(),
  portTLS: z.string().optional(),
  portUDP: z.string().optional(),
  portDNSTT: z.string().optional(),
  premium: z.boolean().default(false),
  invisible: z.boolean().default(false),
  tls: z.boolean().default(true),
  quic: z.boolean().default(false),
  http: z.boolean().default(true),
  dnstt: z.boolean().default(false),
  cdn: z.boolean().default(false),
  cdnName: z.string().optional(),
  capacity: z.union([z.string(), z.number()]).transform(val => 
    typeof val === 'string' ? parseInt(val, 10) : val
  ),
  cdns: z.object({
    cloudflare: z.array(z.string()).optional().default([]),
    googlecloud: z.array(z.string()).optional().default([]),
    cloudfront: z.array(z.string()).optional().default([])
  }).optional().default({
    cloudflare: [],
    googlecloud: [],
    cloudfront: []
  }),
});

interface ServerDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  server?: Server;
  onSubmit: (data: ServerFormValues) => void;
}

export default function ServerDialog({ 
  open, 
  onOpenChange, 
  server, 
  onSubmit 
}: ServerDialogProps) {
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
      tls: true,
      quic: false,
      http: true,
      dnstt: false,
      cdn: false,
      cdnName: "",
      capacity: 100,
    },
  });

  // Reset form when server changes
  useEffect(() => {
    if (open) {
      if (server) {
        form.reset({
          cloudFlareDomain: server.cloudFlareDomain,
          dnsttDomain: server.dnsttDomain,
          country: server.country,
          city: server.city,
          state: server.state,
          ipv4: server.ipv4,
          ipv6: server.ipv6,
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
          cdnName: server.cdnName,
          capacity: server.capacity,
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
          tls: true,
          quic: false,
          http: true,
          dnstt: false,
          cdn: false,
          cdnName: "",
          capacity: 100,
        });
      }
    }
  }, [form, server, open]);

  const handleSubmit = (data: ServerFormValues) => {
    onSubmit(data);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {server ? "Edit Server" : "Add New Server"}
          </DialogTitle>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="cloudFlareDomain"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>CloudFlare Domain</FormLabel>
                    <FormControl>
                      <Input placeholder="example.com" {...field} />
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
                    <FormLabel>DNSTT Domain (Optional)</FormLabel>
                    <FormControl>
                      <Input placeholder="dnstt.example.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="country"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Country</FormLabel>
                    <FormControl>
                      <Input placeholder="United States" {...field} />
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
                      <Input placeholder="New York" {...field} />
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
                      <Input placeholder="NY" {...field} />
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
                      <Input placeholder="192.168.1.1" {...field} />
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
                    <FormLabel>IPv6 Address (Optional)</FormLabel>
                    <FormControl>
                      <Input placeholder="2001:db8::1" {...field} />
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
                    <FormLabel>Capacity</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        placeholder="100" 
                        {...field}
                        onChange={(e) => field.onChange(e.target.value)}
                      />
                    </FormControl>
                    <FormDescription>
                      Maximum number of concurrent users
                    </FormDescription>
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
                      <Input placeholder="80" {...field} />
                    </FormControl>
                    <FormMessage />
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
                      <Input placeholder="443" {...field} />
                    </FormControl>
                    <FormMessage />
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
                      <Input placeholder="0" {...field} />
                    </FormControl>
                    <FormMessage />
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
                      <Input placeholder="53" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <FormField
                control={form.control}
                name="http"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>HTTP</FormLabel>
                      <FormDescription>
                        Enable HTTP protocol
                      </FormDescription>
                    </div>
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="tls"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>TLS</FormLabel>
                      <FormDescription>
                        Enable TLS protocol
                      </FormDescription>
                    </div>
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="quic"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>QUIC</FormLabel>
                      <FormDescription>
                        Enable QUIC protocol
                      </FormDescription>
                    </div>
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="dnstt"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>DNSTT</FormLabel>
                      <FormDescription>
                        Enable DNSTT protocol
                      </FormDescription>
                    </div>
                  </FormItem>
                )}
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <FormField
                control={form.control}
                name="premium"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>Premium</FormLabel>
                      <FormDescription>
                        Server for premium users only
                      </FormDescription>
                    </div>
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="invisible"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>Invisible</FormLabel>
                      <FormDescription>
                        Hide server from server list
                      </FormDescription>
                    </div>
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="cdn"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>CDN</FormLabel>
                      <FormDescription>
                        Server uses CDN
                      </FormDescription>
                    </div>
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
                      <Input placeholder="Cloudflare" {...field} />
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
