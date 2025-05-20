import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { format } from "date-fns";
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
import { PremiumUser, UserFormValues } from "@/types/types";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { CalendarIcon } from "lucide-react";

interface UserDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user?: PremiumUser;
  onSubmit: (data: UserFormValues) => void;
}

const userFormSchema = z.object({
  emaiL: z.string().email("Please enter a valid email"),
  txid: z.string().min(1, "Transaction ID is required"),
  e2id: z.string().min(1, "E2 ID is required"),
  date: z.date({ required_error: "Please select a date" }),
  dateEnd: z.date({ required_error: "Please select an end date" }),
  pricePayed: z.string()
    .refine(
      (val) => !isNaN(parseFloat(val)) && parseFloat(val) >= 0, 
      { message: "Price must be a positive number" }
    ),
  months: z.string()
    .transform((val) => parseInt(val, 10))
    .refine((val) => !isNaN(val) && val > 0, {
      message: "Months must be a positive number",
    }),
  suspicious: z.boolean().default(false),
  used: z.boolean().default(true),
  expired: z.boolean().default(false),
});

export default function UserDialog({ open, onOpenChange, user, onSubmit }: UserDialogProps) {
  const form = useForm<UserFormValues>({
    resolver: zodResolver(userFormSchema),
    defaultValues: {
      emaiL: "",
      txid: "",
      e2id: "",
      date: new Date(),
      dateEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
      pricePayed: "0.00",
      months: "1",
      suspicious: false,
      used: true,
      expired: false,
    },
  });

  useEffect(() => {
    if (user) {
      form.reset({
        emaiL: user.emaiL,
        txid: user.txid,
        e2id: user.e2id,
        date: new Date(user.date),
        dateEnd: new Date(user.dateEnd * 1000),
        pricePayed: user.pricePayed,
        months: user.months.toString(),
        suspicious: user.suspicious,
        used: user.used,
        expired: user.expired,
      });
    } else {
      form.reset({
        emaiL: "",
        txid: "",
        e2id: "",
        date: new Date(),
        dateEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
        pricePayed: "0.00",
        months: "1",
        suspicious: false,
        used: true,
        expired: false,
      });
    }
  }, [user, form]);

  const handleSubmit = (values: UserFormValues) => {
    onSubmit(values);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>{user ? "Edit Premium User" : "Add New Premium User"}</DialogTitle>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="emaiL"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="user@example.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="txid"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Transaction ID</FormLabel>
                    <FormControl>
                      <Input placeholder="Transaction ID" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="e2id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>E2 ID</FormLabel>
                    <FormControl>
                      <Input placeholder="E2 ID" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="date"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Purchase Date</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "w-full pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? (
                              format(field.value, "PPP")
                            ) : (
                              <span>Pick a date</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          initialFocus
                          className={cn("p-3 pointer-events-auto")}
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="dateEnd"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Expiration Date</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "w-full pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? (
                              format(field.value, "PPP")
                            ) : (
                              <span>Pick a date</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          initialFocus
                          className={cn("p-3 pointer-events-auto")}
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="pricePayed"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Price Paid</FormLabel>
                    <FormControl>
                      <Input type="number" step="0.01" min="0" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="months"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Subscription Months</FormLabel>
                    <FormControl>
                      <Input type="number" min="1" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <FormField
                control={form.control}
                name="suspicious"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center space-x-3 space-y-0">
                    <FormControl>
                      <Checkbox 
                        checked={field.value} 
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <FormLabel className="font-normal">Mark as Suspicious</FormLabel>
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="used"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center space-x-3 space-y-0">
                    <FormControl>
                      <Checkbox 
                        checked={field.value} 
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <FormLabel className="font-normal">Used</FormLabel>
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="expired"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center space-x-3 space-y-0">
                    <FormControl>
                      <Checkbox 
                        checked={field.value} 
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <FormLabel className="font-normal">Expired</FormLabel>
                  </FormItem>
                )}
              />
            </div>
            
            <DialogFooter>
              <Button type="submit" className="gradient-blue">
                {user ? "Update User" : "Add User"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
