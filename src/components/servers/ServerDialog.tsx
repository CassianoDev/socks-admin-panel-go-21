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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Server, ServerFormValues } from "@/types/types";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { X, Plus } from "lucide-react";

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
  cdns: z.record(z.array(z.string()).default([])).optional().default({
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
      cdns: {
        cloudflare: [],
        googlecloud: [],
        cloudfront: []
      }
    },
  });

  const [activeTab, setActiveTab] = useState("cloudflare");
  const [customProviders, setCustomProviders] = useState<string[]>([]);
  const [customProviderInput, setCustomProviderInput] = useState("");
  const [cdnDomains, setCdnDomains] = useState<Record<string, string[]>>({
    cloudflare: [""],
    googlecloud: [""],
    cloudfront: [""]
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
          cdns: server.cdns || {
            cloudflare: [],
            googlecloud: [],
            cloudfront: []
          }
        });
        
        // Initialize custom providers from server data
        const defaultProviders = ["cloudflare", "googlecloud", "cloudfront"];
        const serverCdnKeys = server.cdns ? Object.keys(server.cdns) : [];
        const customCdnKeys = serverCdnKeys.filter(key => !defaultProviders.includes(key));
        
        setCustomProviders(customCdnKeys);
        
        // Update local state for CDN domains including custom providers
        const domainsState: Record<string, string[]> = {
          cloudflare: server.cdns?.cloudflare?.length ? server.cdns.cloudflare : [""],
          googlecloud: server.cdns?.googlecloud?.length ? server.cdns.googlecloud : [""],
          cloudfront: server.cdns?.cloudfront?.length ? server.cdns.cloudfront : [""],
        };
        
        // Add custom CDN providers domains
        customCdnKeys.forEach(key => {
          domainsState[key] = server.cdns?.[key]?.length ? server.cdns[key] : [""];
        });
        
        setCdnDomains(domainsState);
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
          cdns: {
            cloudflare: [],
            googlecloud: [],
            cloudfront: []
          }
        });
        
        // Reset custom providers
        setCustomProviders([]);
        setCustomProviderInput("");
        
        // Reset local state for CDN domains
        setCdnDomains({
          cloudflare: [""],
          googlecloud: [""],
          cloudfront: [""]
        });
      }
    }
  }, [form, server, open]);

  // Add a domain input to the specified CDN provider
  const addDomainField = (cdnType: string) => {
    setCdnDomains(prev => ({
      ...prev,
      [cdnType]: [...(prev[cdnType] || []), ""]
    }));
  };

  // Remove a domain input from the specified CDN provider
  const removeDomainField = (cdnType: string, index: number) => {
    if (cdnDomains[cdnType] && cdnDomains[cdnType].length > 1) {
      setCdnDomains(prev => ({
        ...prev,
        [cdnType]: prev[cdnType].filter((_, i) => i !== index)
      }));
    }
  };

  // Update domain value in the local state and form
  const updateDomain = (cdnType: string, index: number, value: string) => {
    // Update local state
    setCdnDomains(prev => {
      const newDomains = [...(prev[cdnType] || [])];
      newDomains[index] = value;
      return { ...prev, [cdnType]: newDomains };
    });
    
    // Update form state with filtered domains (remove empty ones)
    setTimeout(() => {
      const updatedDomains = { ...cdnDomains };
      if (!updatedDomains[cdnType]) {
        updatedDomains[cdnType] = [];
      }
      
      updatedDomains[cdnType] = [
        ...(updatedDomains[cdnType].slice(0, index) || []),
        value,
        ...(updatedDomains[cdnType].slice(index + 1) || [])
      ];
      
      // Filter out empty domains for each provider
      const filteredDomains: Record<string, string[]> = {};
      Object.keys(updatedDomains).forEach(key => {
        filteredDomains[key] = updatedDomains[key].filter(d => d.trim() !== "");
      });
      
      form.setValue('cdns', filteredDomains);
    }, 0);
  };

  // Handle adding a new custom CDN provider
  const handleAddCustomProvider = () => {
    if (customProviderInput.trim() && !customProviders.includes(customProviderInput.trim().toLowerCase())) {
      const newProvider = customProviderInput.trim().toLowerCase();
      setCustomProviders([...customProviders, newProvider]);
      setCdnDomains(prev => ({
        ...prev,
        [newProvider]: [""]
      }));
      setCustomProviderInput("");
      setActiveTab(newProvider);
    }
  };

  // Handle removing a custom CDN provider
  const handleRemoveCustomProvider = (provider: string) => {
    setCustomProviders(customProviders.filter(p => p !== provider));
    setCdnDomains(prev => {
      const newDomains = { ...prev };
      delete newDomains[provider];
      return newDomains;
    });
    
    // Update form state to remove the custom provider
    const updatedCdns = { ...form.getValues('cdns') };
    delete updatedCdns[provider];
    form.setValue('cdns', updatedCdns);
    
    // Set active tab to a default one if the removed provider was active
    if (activeTab === provider) {
      setActiveTab('cloudflare');
    }
  };

  const handleSubmit = (data: ServerFormValues) => {
    // Filter out empty domains before submitting
    const filteredCdns: Record<string, string[]> = {};
    
    // Filter default providers
    ['cloudflare', 'googlecloud', 'cloudfront'].forEach(provider => {
      filteredCdns[provider] = cdnDomains[provider]?.filter(d => d.trim() !== "") || [];
    });
    
    // Filter custom providers
    customProviders.forEach(provider => {
      filteredCdns[provider] = cdnDomains[provider]?.filter(d => d.trim() !== "") || [];
    });
    
    const finalData = {
      ...data,
      cdns: filteredCdns
    };
    
    onSubmit(finalData);
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
              <div className="space-y-4">
                {/* Add custom CDN provider input */}
                <div className="flex items-center space-x-2 mb-4">
                  <Input
                    value={customProviderInput}
                    onChange={(e) => setCustomProviderInput(e.target.value)}
                    placeholder="Add custom CDN provider"
                    className="flex-1"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleAddCustomProvider}
                    disabled={!customProviderInput.trim()}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                
                <FormField
                  control={form.control}
                  name="cdnName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>CDN Provider</FormLabel>
                      <Select 
                        onValueChange={field.onChange} 
                        defaultValue={field.value}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select CDN provider" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="cloudflare">Cloudflare</SelectItem>
                          <SelectItem value="googlecloud">Google Cloud</SelectItem>
                          <SelectItem value="cloudfront">CloudFront (AWS)</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormDescription>
                        Select a CDN provider to configure domains
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div className="border rounded-md p-4">
                  <h3 className="text-sm font-medium mb-3">CDN Domains</h3>
                  
                  <Tabs 
                    defaultValue="cloudflare" 
                    value={activeTab} 
                    onValueChange={setActiveTab}
                    className="w-full"
                  >
                    <TabsList className="grid grid-cols-3 mb-4">
                      <TabsTrigger value="cloudflare">Cloudflare</TabsTrigger>
                      <TabsTrigger value="googlecloud">Google Cloud</TabsTrigger>
                      <TabsTrigger value="cloudfront">CloudFront</TabsTrigger>
                      
                      {/* Custom CDN provider tabs */}
                      {customProviders.map(provider => (
                        <div key={provider} className="flex items-center">
                          <TabsTrigger value={provider} className="capitalize">
                            {provider}
                          </TabsTrigger>
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6"
                            onClick={() => handleRemoveCustomProvider(provider)}
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </div>
                      ))}
                    </TabsList>
                    
                    {/* Default CDN provider content */}
                    <TabsContent value="cloudflare" className="space-y-3">
                      {cdnDomains.cloudflare.map((domain, index) => (
                        <div key={`cloudflare-${index}`} className="flex items-center space-x-2">
                          <Input
                            value={domain}
                            onChange={(e) => updateDomain('cloudflare', index, e.target.value)}
                            placeholder="cdn.example.com"
                            className="flex-1"
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={() => removeDomainField('cloudflare', index)}
                            disabled={cdnDomains.cloudflare.length === 1}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => addDomainField('cloudflare')}
                        className="mt-2"
                      >
                        <Plus className="mr-2 h-4 w-4" />
                        Add Cloudflare Domain
                      </Button>
                    </TabsContent>
                    
                    <TabsContent value="googlecloud" className="space-y-3">
                      {cdnDomains.googlecloud.map((domain, index) => (
                        <div key={`googlecloud-${index}`} className="flex items-center space-x-2">
                          <Input
                            value={domain}
                            onChange={(e) => updateDomain('googlecloud', index, e.target.value)}
                            placeholder="cdn.example.com"
                            className="flex-1"
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={() => removeDomainField('googlecloud', index)}
                            disabled={cdnDomains.googlecloud.length === 1}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => addDomainField('googlecloud')}
                        className="mt-2"
                      >
                        <Plus className="mr-2 h-4 w-4" />
                        Add Google Cloud Domain
                      </Button>
                    </TabsContent>
                    
                    <TabsContent value="cloudfront" className="space-y-3">
                      {cdnDomains.cloudfront.map((domain, index) => (
                        <div key={`cloudfront-${index}`} className="flex items-center space-x-2">
                          <Input
                            value={domain}
                            onChange={(e) => updateDomain('cloudfront', index, e.target.value)}
                            placeholder="cdn.example.com"
                            className="flex-1"
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={() => removeDomainField('cloudfront', index)}
                            disabled={cdnDomains.cloudfront.length === 1}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => addDomainField('cloudfront')}
                        className="mt-2"
                      >
                        <Plus className="mr-2 h-4 w-4" />
                        Add CloudFront Domain
                      </Button>
                    </TabsContent>
                    
                    {/* Custom CDN provider content */}
                    {customProviders.map(provider => (
                      <TabsContent key={provider} value={provider} className="space-y-3">
                        {cdnDomains[provider]?.map((domain, index) => (
                          <div key={`${provider}-${index}`} className="flex items-center space-x-2">
                            <Input
                              value={domain}
                              onChange={(e) => updateDomain(provider, index, e.target.value)}
                              placeholder="cdn.example.com"
                              className="flex-1"
                            />
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              onClick={() => removeDomainField(provider, index)}
                              disabled={(cdnDomains[provider]?.length || 0) <= 1}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        ))}
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => addDomainField(provider)}
                          className="mt-2"
                        >
                          <Plus className="mr-2 h-4 w-4" />
                          Add {provider.charAt(0).toUpperCase() + provider.slice(1)} Domain
                        </Button>
                      </TabsContent>
                    ))}
                  </Tabs>
                </div>
              </div>
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
