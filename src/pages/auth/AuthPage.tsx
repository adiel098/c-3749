import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LoginForm } from "@/components/auth/LoginForm";
import { SignUpForm } from "@/components/auth/SignUpForm";
import { LogIn, UserPlus } from "lucide-react";
import { useMediaQuery } from "@/hooks/useMediaQuery";

const AuthPage = () => {
  const isMobile = useMediaQuery("(max-width: 768px)");

  return (
    <div className="min-h-[100dvh] max-h-[100dvh] flex items-start justify-center p-4 auth-page overflow-y-auto">
      <Card className="w-full max-w-md glass-effect my-4">
        <CardContent className="p-0">
          <Tabs defaultValue="login" className="w-full">
            <TabsContent value="login">
              <div className={`p-4 pb-2 ${isMobile ? "pt-6" : "pt-6"}`}>
                <h1 className="text-4xl font-bold gradient-text mb-4">Welcome Back</h1>
                <p className="text-xl text-foreground/90 mb-6">
                  Great to see you again! Log in to continue your trading journey
                </p>
              </div>
              <div className="px-6">
                <TabsList className="grid w-full grid-cols-2 mb-6 h-14 bg-card/40 p-1">
                  <TabsTrigger 
                    value="login"
                    className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary data-[state=active]:to-accent data-[state=active]:text-primary-foreground data-[state=active]:shadow-lg transition-all duration-300 h-12"
                  >
                    <div className="flex items-center gap-2">
                      <LogIn className="w-5 h-5" />
                      <span className="font-medium">Login</span>
                    </div>
                  </TabsTrigger>
                  <TabsTrigger 
                    value="signup"
                    className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary data-[state=active]:to-accent data-[state=active]:text-primary-foreground data-[state=active]:shadow-lg transition-all duration-300 h-12"
                  >
                    <div className="flex items-center gap-2">
                      <UserPlus className="w-5 h-5" />
                      <span className="font-medium">Sign Up</span>
                    </div>
                  </TabsTrigger>
                </TabsList>
              </div>
              <div className="px-6 pb-6">
                <LoginForm />
              </div>
            </TabsContent>
            <TabsContent value="signup">
              <div className={`p-4 pb-2 ${isMobile ? "pt-6" : "pt-6"}`}>
                <h1 className="text-4xl font-bold gradient-text mb-4">Join Us Now</h1>
                <p className="text-xl text-foreground/90 mb-6">
                  Join hundreds of traders and start your crypto trading adventure
                </p>
              </div>
              <div className="px-6">
                <TabsList className="grid w-full grid-cols-2 mb-6 h-14 bg-card/40 p-1">
                  <TabsTrigger 
                    value="login"
                    className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary data-[state=active]:to-accent data-[state=active]:text-primary-foreground data-[state=active]:shadow-lg transition-all duration-300 h-12"
                  >
                    <div className="flex items-center gap-2">
                      <LogIn className="w-5 h-5" />
                      <span className="font-medium">Login</span>
                    </div>
                  </TabsTrigger>
                  <TabsTrigger 
                    value="signup"
                    className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary data-[state=active]:to-accent data-[state=active]:text-primary-foreground data-[state=active]:shadow-lg transition-all duration-300 h-12"
                  >
                    <div className="flex items-center gap-2">
                      <UserPlus className="w-5 h-5" />
                      <span className="font-medium">Sign Up</span>
                    </div>
                  </TabsTrigger>
                </TabsList>
              </div>
              <div className="px-6 pb-6">
                <SignUpForm />
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default AuthPage;