
import { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AdCallback, LiveCallback, UserAdStatus } from "@/types/adLogs";
import { mockAdCallbacks, mockUserAdStatus } from "@/lib/mockAdLogs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Clock, TrendingUp } from "lucide-react";
import { toast } from "sonner";

export default function AdLogs() {
  const [adCallbacks, setAdCallbacks] = useState<AdCallback[]>(mockAdCallbacks);
  const [userAdStatus, setUserAdStatus] = useState<UserAdStatus[]>(mockUserAdStatus);
  const [liveCallbacks, setLiveCallbacks] = useState<LiveCallback[]>([]);
  const [stats, setStats] = useState({
    total: 0,
    completed: 0,
    started: 0,
    error: 0
  });

  // Calculate statistics from ad callbacks
  useEffect(() => {
    const total = adCallbacks.length;
    const completed = adCallbacks.filter(cb => cb.status === "completed").length;
    const started = adCallbacks.filter(cb => cb.status === "started").length;
    const error = adCallbacks.filter(cb => cb.status === "error").length;
    
    setStats({ total, completed, started, error });
  }, [adCallbacks]);

  // Simulate incoming live callbacks
  useEffect(() => {
    const interval = setInterval(() => {
      if (Math.random() > 0.6) { // 40% chance of new callback
        const newCallback: LiveCallback = {
          userId: Math.floor(Math.random() * 10000).toString().padStart(4, '0'),
          adType: ["premium", "standard", "featured", "video"][Math.floor(Math.random() * 4)],
          status: Math.random() > 0.1 ? "completed" : Math.random() > 0.5 ? "started" : "error",
          timestamp: Date.now()
        };
        
        // Add to live callbacks and limit to last 10
        setLiveCallbacks(prev => [newCallback, ...prev].slice(0, 15));
        
        // Also add to main callbacks list
        setAdCallbacks(prev => [newCallback, ...prev]);
        
        // If it's a completed ad and we have this user, update their validity
        if (newCallback.status === "completed") {
          setUserAdStatus(prev => {
            const userIndex = prev.findIndex(u => u.userId === newCallback.userId);
            if (userIndex >= 0) {
              // Extend validity by a random amount (1-4 hours)
              const extensionMs = Math.floor(Math.random() * 3 * 60 * 60 * 1000) + 60 * 60 * 1000;
              const updatedUsers = [...prev];
              updatedUsers[userIndex] = {
                ...updatedUsers[userIndex],
                validUntil: updatedUsers[userIndex].validUntil + extensionMs,
                adViews: updatedUsers[userIndex].adViews + 1,
                lastSeen: Date.now()
              };
              
              // Show a toast notification
              toast.success(`User ${newCallback.userId} watched an ad - validity extended`, {
                description: `+${Math.round(extensionMs / 1000 / 60 / 60)} hours`
              });
              
              return updatedUsers;
            }
            return prev;
          });
        }
      }
    }, 3000); // Check every 3 seconds
    
    return () => clearInterval(interval);
  }, []);

  // Calculate time remaining helper
  const getTimeRemaining = (validUntil: number) => {
    const now = Date.now();
    const diff = validUntil - now;
    
    if (diff <= 0) return "Expired";
    
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    
    if (days > 0) return `${days}d ${hours}h`;
    if (hours > 0) return `${hours}h ${minutes}m`;
    return `${minutes}m`;
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold">Ad Callbacks Monitor</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Total Callbacks</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.total}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Completed</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-500">{stats.completed}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Started</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-500">{stats.started}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Errors</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-red-500">{stats.error}</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center">
              <TrendingUp className="mr-2 h-5 w-5" />
              Ad Callback Logs
            </CardTitle>
            <CardDescription>
              Historical record of premium ad callbacks
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="all">
              <TabsList className="mb-4">
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="completed">Completed</TabsTrigger>
                <TabsTrigger value="started">Started</TabsTrigger>
                <TabsTrigger value="error">Errors</TabsTrigger>
              </TabsList>
              
              <TabsContent value="all" className="m-0">
                <div className="rounded-md border h-[400px] overflow-y-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>User ID</TableHead>
                        <TableHead>Ad Type</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Timestamp</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {adCallbacks.map((callback, i) => (
                        <TableRow key={`${callback.userId}-${callback.timestamp}-${i}`}>
                          <TableCell className="font-mono">{callback.userId}</TableCell>
                          <TableCell>{callback.adType}</TableCell>
                          <TableCell>
                            <StatusBadge status={callback.status} />
                          </TableCell>
                          <TableCell>{new Date(callback.timestamp).toLocaleString()}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </TabsContent>
              
              <TabsContent value="completed" className="m-0">
                <div className="rounded-md border h-[400px] overflow-y-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>User ID</TableHead>
                        <TableHead>Ad Type</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Timestamp</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {adCallbacks
                        .filter(cb => cb.status === "completed")
                        .map((callback, i) => (
                          <TableRow key={`${callback.userId}-${callback.timestamp}-${i}`}>
                            <TableCell className="font-mono">{callback.userId}</TableCell>
                            <TableCell>{callback.adType}</TableCell>
                            <TableCell>
                              <StatusBadge status={callback.status} />
                            </TableCell>
                            <TableCell>{new Date(callback.timestamp).toLocaleString()}</TableCell>
                          </TableRow>
                        ))}
                    </TableBody>
                  </Table>
                </div>
              </TabsContent>
              
              <TabsContent value="started" className="m-0">
                <div className="rounded-md border h-[400px] overflow-y-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>User ID</TableHead>
                        <TableHead>Ad Type</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Timestamp</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {adCallbacks
                        .filter(cb => cb.status === "started")
                        .map((callback, i) => (
                          <TableRow key={`${callback.userId}-${callback.timestamp}-${i}`}>
                            <TableCell className="font-mono">{callback.userId}</TableCell>
                            <TableCell>{callback.adType}</TableCell>
                            <TableCell>
                              <StatusBadge status={callback.status} />
                            </TableCell>
                            <TableCell>{new Date(callback.timestamp).toLocaleString()}</TableCell>
                          </TableRow>
                        ))}
                    </TableBody>
                  </Table>
                </div>
              </TabsContent>
              
              <TabsContent value="error" className="m-0">
                <div className="rounded-md border h-[400px] overflow-y-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>User ID</TableHead>
                        <TableHead>Ad Type</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Timestamp</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {adCallbacks
                        .filter(cb => cb.status === "error")
                        .map((callback, i) => (
                          <TableRow key={`${callback.userId}-${callback.timestamp}-${i}`}>
                            <TableCell className="font-mono">{callback.userId}</TableCell>
                            <TableCell>{callback.adType}</TableCell>
                            <TableCell>
                              <StatusBadge status={callback.status} />
                            </TableCell>
                            <TableCell>{new Date(callback.timestamp).toLocaleString()}</TableCell>
                          </TableRow>
                        ))}
                    </TableBody>
                  </Table>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>
              <div className="flex items-center">
                <span className="relative flex h-3 w-3 mr-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                </span>
                Live Callbacks
              </div>
            </CardTitle>
            <CardDescription>
              Real-time premium ad callbacks
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 h-[400px] overflow-y-auto pr-2">
              {liveCallbacks.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  Waiting for callbacks...
                </div>
              ) : (
                liveCallbacks.map((callback, i) => (
                  <div 
                    key={`${callback.userId}-${callback.timestamp}`} 
                    className={`p-3 rounded-lg border ${
                      i === 0 ? 'bg-muted/50 animate-fade-in' : ''
                    }`}
                  >
                    <div className="flex justify-between items-center">
                      <div className="font-mono text-sm">{callback.userId}</div>
                      <StatusBadge status={callback.status} />
                    </div>
                    <div className="mt-1 flex justify-between text-sm">
                      <span>{callback.adType}</span>
                      <span className="text-muted-foreground">
                        {new Date(callback.timestamp).toLocaleTimeString()}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Clock className="mr-2 h-5 w-5" />
            User Ad Validity
          </CardTitle>
          <CardDescription>
            Track premium users who have watched ads and their remaining validity time
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User ID</TableHead>
                  <TableHead>Ad Views</TableHead>
                  <TableHead>Last Seen</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Time Remaining</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {userAdStatus
                  .sort((a, b) => b.validUntil - a.validUntil) // Sort by validity time
                  .map((user) => {
                    const isExpired = user.validUntil < Date.now();
                    const timeRemaining = getTimeRemaining(user.validUntil);
                    
                    return (
                      <TableRow key={user.userId} className={isExpired ? 'opacity-60' : ''}>
                        <TableCell className="font-mono">{user.userId}</TableCell>
                        <TableCell>{user.adViews}</TableCell>
                        <TableCell>{new Date(user.lastSeen).toLocaleString()}</TableCell>
                        <TableCell>
                          {isExpired ? (
                            <Badge variant="destructive">Expired</Badge>
                          ) : (
                            <Badge variant="outline" className="bg-green-500/10 text-green-600 border-green-500/20">
                              Active
                            </Badge>
                          )}
                        </TableCell>
                        <TableCell>
                          <div className={`font-medium ${isExpired ? 'text-destructive' : ''}`}>
                            {timeRemaining}
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// Helper component for status badges
function StatusBadge({ status }: { status: AdCallback["status"] }) {
  switch (status) {
    case "completed":
      return <Badge className="bg-green-500">Completed</Badge>;
    case "started":
      return <Badge className="bg-blue-500">Started</Badge>;
    case "error":
      return <Badge variant="destructive">Error</Badge>;
    default:
      return <Badge variant="outline">{status}</Badge>;
  }
}
