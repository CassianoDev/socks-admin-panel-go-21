
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Database, Lock, Server, Shield, Users } from "lucide-react";

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background px-4 py-12">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -inset-[100%] opacity-50 bg-[radial-gradient(circle_at_50%_50%,rgba(59,130,246,0.08),rgba(59,130,246,0)_80%)]"></div>
        <div className="absolute -inset-[100%] opacity-50 bg-[radial-gradient(circle_at_80%_20%,rgba(155,135,245,0.12),rgba(155,135,245,0)_60%)]"></div>
      </div>
      
      <div className="text-center max-w-3xl mb-12 z-10">
        <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-500 to-accent mx-auto flex items-center justify-center mb-8">
          <Shield className="h-10 w-10 text-white" />
        </div>
        <h1 className="text-5xl font-bold gradient-heading mb-6">DockSocks VPN Admin</h1>
        <p className="text-xl text-muted-foreground mb-8">
          Comprehensive management system for your VPN infrastructure.
          Control servers, configurations, and premium users all in one place.
        </p>
        <Button 
          onClick={() => navigate('/login')}
          className="gradient-blue px-8 py-6 text-lg"
        >
          <Lock className="mr-2 h-5 w-5" />
          Login to Admin Panel
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl z-10">
        <FeatureCard 
          icon={<Server className="h-8 w-8" />}
          title="Server Management"
          description="Add, edit, and remove VPN servers with detailed configuration options for protocols and networking."
        />
        <FeatureCard 
          icon={<Shield className="h-8 w-8" />}
          title="Configuration Control"
          description="Manage connection configurations with support for various protocols, proxies, and payload customization."
        />
        <FeatureCard 
          icon={<Users className="h-8 w-8" />}
          title="User Administration"
          description="Track premium users, monitor subscriptions, and manage user access permissions."
        />
        <FeatureCard 
          icon={<Database className="h-8 w-8" />}
          title="MongoDB Integration"
          description="Native support for MongoDB with collections for servers, configurations, and premium users."
        />
        <FeatureCard 
          icon={<Lock className="h-8 w-8" />}
          title="Secure Admin Access"
          description="Role-based authentication system to protect sensitive VPN infrastructure controls."
        />
      </div>
    </div>
  );
};

const FeatureCard = ({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) => {
  return (
    <div className="glass-card p-6 rounded-xl">
      <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
        {icon}
      </div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-muted-foreground">{description}</p>
    </div>
  );
};

export default Index;
