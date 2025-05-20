import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { appConfig } from "@/lib/mock";
import { toast } from "sonner";
import { AppSettingsFormValues } from "@/types/types";

const appSettingsSchema = z.object({
  versionNow: z.string().transform((val) => parseFloat(val)),
  buildNow: z.string().transform((val) => parseInt(val, 10)),
  adsMediation: z.boolean().default(false),
  maintenenceMode: z.boolean().default(false),
  deviceLocked: z.boolean().default(false),
  appBg: z.string().optional(),
  curveBg: z.string().optional(),
  timeMaxHour: z.string().transform((val) => parseInt(val, 10)),
  timeStepHour: z.string().transform((val) => parseInt(val, 10)),
  AgentInstructions: z.string().optional(),
  AgentApiKeyGemini: z.string().optional(),
  AgentModel: z.string().optional(),
});

export default function AppSettings() {
  const form = useForm<AppSettingsFormValues>({
    resolver: zodResolver(appSettingsSchema),
    defaultValues: {
      versionNow: "1.0",
      buildNow: "1",
      adsMediation: false,
      maintenenceMode: false,
      deviceLocked: false,
      appBg: "",
      curveBg: "",
      timeMaxHour: "24",
      timeStepHour: "1",
      AgentInstructions: "",
      AgentApiKeyGemini: "",
      AgentModel: "gemini-pro",
    },
  });

  useEffect(() => {
    // Load app config
    form.reset({
      versionNow: appConfig.versionNow.toString(),
      buildNow: appConfig.buildNow.toString(),
      adsMediation: appConfig.adsMediation,
      maintenenceMode: appConfig.maintenenceMode,
      deviceLocked: appConfig.deviceLocked,
      appBg: appConfig.appBg,
      curveBg: appConfig.curveBg,
      timeMaxHour: appConfig.timeMaxHour.toString(),
      timeStepHour: appConfig.timeStepHour.toString(),
      AgentInstructions: appConfig.AgentInstructions,
      AgentApiKeyGemini: appConfig.AgentApiKeyGemini,
      AgentModel: appConfig.AgentModel,
    });
  }, [form]);

  const onSubmit = (values: AppSettingsFormValues) => {
    console.log("App settings updated:", values);
    toast.success("App settings updated successfully");
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold mb-2">App Settings</h2>
        <p className="text-muted-foreground">
          Configure the app appearance, version, and behavior settings.
        </p>
      </div>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <Card className="glass-card">
            <CardHeader>
              <CardTitle>Version Settings</CardTitle>
              <CardDescription>Configure the app version and build number</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="versionNow"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>App Version</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormDescription>
                        Current app version (e.g. 4.2)
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="buildNow"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Build Number</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormDescription>
                        Current build number (e.g. 103)
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <FormField
                  control={form.control}
                  name="maintenenceMode"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center space-x-3 space-y-0">
                      <FormControl>
                        <Checkbox 
                          checked={field.value} 
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>Maintenance Mode</FormLabel>
                        <FormDescription>
                          Disable app usage during maintenance
                        </FormDescription>
                      </div>
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="deviceLocked"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center space-x-3 space-y-0">
                      <FormControl>
                        <Checkbox 
                          checked={field.value} 
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>Lock Devices</FormLabel>
                        <FormDescription>
                          Prevent new device registrations
                        </FormDescription>
                      </div>
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="adsMediation"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center space-x-3 space-y-0">
                      <FormControl>
                        <Checkbox 
                          checked={field.value} 
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>Enable Ads</FormLabel>
                        <FormDescription>
                          Show ads for free users
                        </FormDescription>
                      </div>
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>
          </Card>
          
          <Card className="glass-card">
            <CardHeader>
              <CardTitle>Appearance Settings</CardTitle>
              <CardDescription>Configure the app's visual appearance</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="appBg"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>App Background URL</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormDescription>
                        URL to the app background image
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="curveBg"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Curve Background URL</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormDescription>
                        URL to the curve background image
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="timeMaxHour"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Maximum Time (hours)</FormLabel>
                      <FormControl>
                        <Input type="number" min="1" {...field} />
                      </FormControl>
                      <FormDescription>
                        Maximum time in hours for connection
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="timeStepHour"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Time Step (hours)</FormLabel>
                      <FormControl>
                        <Input type="number" min="1" {...field} />
                      </FormControl>
                      <FormDescription>
                        Time step increment in hours
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>
          </Card>
          
          <Card className="glass-card">
            <CardHeader>
              <CardTitle>AI Agent Settings</CardTitle>
              <CardDescription>Configure the AI assistant for users</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <FormField
                control={form.control}
                name="AgentModel"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>AI Model</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormDescription>
                      AI model to use for the assistant (e.g. gemini-pro)
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="AgentApiKeyGemini"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>API Key</FormLabel>
                    <FormControl>
                      <Input type="password" {...field} />
                    </FormControl>
                    <FormDescription>
                      API key for the AI service
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="AgentInstructions"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Agent Instructions</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Instructions for the AI assistant..."
                        className="min-h-32" 
                        {...field} 
                      />
                    </FormControl>
                    <FormDescription>
                      Instructions for how the AI should respond to users
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>
          
          <div className="flex justify-end">
            <Button type="submit" className="gradient-blue">Save Settings</Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
