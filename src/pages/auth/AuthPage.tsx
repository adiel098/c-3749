import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LoginForm } from "@/components/auth/LoginForm";
import { SignUpForm } from "@/components/auth/SignUpForm";
import { LogIn, UserPlus } from "lucide-react";
import { useMediaQuery } from "@/hooks/useMediaQuery";

interface AuthPageProps {
  onAuthSuccess?: () => void;
}

const AuthPage = ({ onAuthSuccess }: AuthPageProps) => {
  const isMobile = useMediaQuery("(max-width: 768px)");

  return (
    <div className="min-h-[100dvh] max-h-[100dvh] flex items-start justify-center p-4 auth-page overflow-y-auto">
      <Card className="w-full max-w-md glass-effect my-4">
        <CardContent className="p-0">
          <Tabs defaultValue="login" className="w-full">
            <TabsContent value="login">
              <div className={`p-4 pb-2 ${isMobile ? "pt-6" : "pt-6"} text-center`}>
                <h1 className={`${isMobile ? 'text-6xl' : 'text-4xl md:text-5xl lg:text-6xl'} font-bold mb-4 relative`}>
                  <span className="bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent animate-gradient relative inline-block">
                    OrbiterEX
                  </span>
                  {isMobile && (
                    <span className="absolute -inset-1 bg-primary/10 blur-xl -z-10 animate-pulse-subtle rounded-full"></span>
                  )}
                </h1>
                <p className="text-muted-foreground mb-6 flex flex-col gap-1">
                  <span>The Leading Zero-Fee Professional</span>
                  <span>Trading Platform 🚀📈</span>
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
                <LoginForm onAuthSuccess={onAuthSuccess} />
              </div>
            </TabsContent>
            <TabsContent value="signup">
              <div className={`p-4 pb-2 ${isMobile ? "pt-6" : "pt-6"} text-center`}>
                <h1 className={`${isMobile ? 'text-6xl' : 'text-4xl md:text-5xl lg:text-6xl'} font-bold mb-4 relative`}>
                  <span className="bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent animate-gradient relative inline-block">
                    Join Us Now
                  </span>
                  {isMobile && (
                    <span className="absolute -inset-1 bg-primary/10 blur-xl -z-10 animate-pulse-subtle rounded-full"></span>
                  )}
                </h1>
                <p className="text-muted-foreground mb-6">
                  Join thousands of successful traders worldwide! 🌟
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
                <SignUpForm onAuthSuccess={onAuthSuccess} />
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default AuthPage;