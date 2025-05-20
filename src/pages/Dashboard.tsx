
import { Activity, Server, Shield, Users } from "lucide-react";
import StatCard from "@/components/dashboard/StatCard";
import { UserActivityChart, PremiumSalesChart, ServerUsageChart } from "@/components/dashboard/DashboardCharts";
import { serverStats, configStats, userStats } from "@/lib/mock";

export default function Dashboard() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold mb-6">Dashboard Overview</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard 
            title="Total Servers" 
            value={serverStats.totalServers} 
            icon={<Server className="h-4 w-4" />} 
            description={`${serverStats.activeServers} active servers`}
            trend={{ value: 12, positive: true }}
          />
          <StatCard 
            title="Online Users" 
            value={serverStats.totalOnlineUsers} 
            icon={<Activity className="h-4 w-4" />} 
            description={`${(serverStats.totalOnlineUsers / serverStats.totalCapacity * 100).toFixed(1)}% of capacity`}
            trend={{ value: 8, positive: true }}
          />
          <StatCard 
            title="Configuration Downloads" 
            value={configStats.downloadedTotal} 
            icon={<Shield className="h-4 w-4" />} 
            description={`${configStats.totalConfigs} active configurations`}
            trend={{ value: 23, positive: true }}
          />
          <StatCard 
            title="Premium Users" 
            value={userStats.totalPremiumUsers} 
            icon={<Users className="h-4 w-4" />} 
            description={`$${userStats.revenueTotal.toFixed(2)} total revenue`}
            trend={{ value: 5, positive: false }}
          />
        </div>
      </div>
      
      <div>
        <h2 className="text-2xl font-bold mb-4">Analytics</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <UserActivityChart />
          <PremiumSalesChart />
        </div>
      </div>
      
      <div className="grid grid-cols-1 gap-6">
        <ServerUsageChart />
      </div>
    </div>
  );
}
