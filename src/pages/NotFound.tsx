
import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const NotFound = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background px-4">
      <div className="text-center max-w-md">
        <h1 className="text-6xl font-bold gradient-heading mb-6">404</h1>
        <p className="text-xl text-foreground mb-8">This page does not exist in the admin panel</p>
        <Button 
          onClick={() => navigate('/dashboard')}
          className="gradient-blue"
        >
          Return to Dashboard
        </Button>
      </div>
    </div>
  );
};

export default NotFound;
