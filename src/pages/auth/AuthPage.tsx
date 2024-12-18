import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LoginForm } from "@/components/auth/LoginForm";
import { SignUpForm } from "@/components/auth/SignUpForm";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { ScrollArea } from "@/components/ui/scroll-area";

const AuthPage = () => {
  const [activeTab, setActiveTab] = useState("login");
  const { session } = useAuth();
  const location = useLocation();
  const isMobile = useMediaQuery("(max-width: 768px)");

  if (session) {
    const from = location.state?.from?.pathname || "/";
    return <Navigate to={from} replace />;
  }

  return (
    <div className={`min-h-[100dvh] flex items-start justify-center bg-gradient-to-b from-background via-background/95 to-background/90 ${isMobile ? 'p-0' : 'p-4'}`}>
      <div className={`w-full ${isMobile ? 'h-[100dvh]' : 'max-w-md'}`}>
        <Card className={`glass-effect relative overflow-hidden ${isMobile ? 'h-full rounded-none' : ''}`}>
          <div className={`${isMobile ? 'h-full flex flex-col' : ''}`}>
            <CardHeader className="space-y-4 relative">
              <CardTitle className="text-3xl font-bold gradient-text">
                {activeTab === "login" ? "Welcome Back" : "Join Us Today"}
              </CardTitle>
              <CardDescription className="space-y-3">
                <p className="text-lg text-foreground/90 font-medium">
                  {activeTab === "login" 
                    ? "Great to see you again! Log in to continue your trading journey" 
                    : "Join hundreds of traders and start your crypto trading adventure"}
                </p>
                <p className="text-foreground/80">
                  {activeTab === "login" 
                    ? "Great to see you again! Log in to continue your trading journey" 
                    : "Unlock powerful trading tools and opportunities"}
                </p>
              </CardDescription>
            </CardHeader>
            <CardContent className={`relative ${isMobile ? 'flex-1 overflow-hidden flex flex-col' : ''}`}>
              <Tabs value={activeTab} onValueChange={setActiveTab} className={`${isMobile ? 'h-full flex flex-col' : 'space-y-6'}`}>
                <TabsList className="grid w-full grid-cols-2 h-14 rounded-lg p-1 bg-muted/30">
                  <TabsTrigger 
                    value="login"
                    className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-md transition-all duration-300"
                  >
                    Login
                  </TabsTrigger>
                  <TabsTrigger 
                    value="signup"
                    className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-md transition-all duration-300"
                  >
                    Sign Up
                  </TabsTrigger>
                </TabsList>
                <div className={`${isMobile ? 'flex-1 overflow-hidden' : ''}`}>
                  <ScrollArea className={`${isMobile ? 'h-[calc(100dvh-13rem)] pr-4' : ''}`}>
                    <TabsContent 
                      value="login" 
                      className={`space-y-4 [&>*]:relative ${isMobile ? 'pb-8' : ''}`}
                    >
                      <LoginForm />
                    </TabsContent>
                    <TabsContent 
                      value="signup" 
                      className={`space-y-4 [&>*]:relative ${isMobile ? 'pb-16' : ''}`}
                    >
                      <SignUpForm />
                    </TabsContent>
                  </ScrollArea>
                </div>
              </Tabs>
            </CardContent>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default AuthPage;