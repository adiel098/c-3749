import { Card, CardContent, CardHeader, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LoginForm } from "@/components/auth/LoginForm";
import { SignUpForm } from "@/components/auth/SignUpForm";

const AuthPage = () => {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 auth-page">
      <Card className="w-full max-w-md glass-effect">
        <CardContent className="p-0">
          <Tabs defaultValue="login" className="w-full">
            <TabsContent value="login">
              <div className="p-6 pb-2">
                <h1 className="text-4xl font-bold gradient-text mb-4">Welcome Back</h1>
                <p className="text-xl text-foreground/90 mb-6">
                  Great to see you again! Log in to continue your trading journey
                </p>
              </div>
              <LoginForm />
            </TabsContent>
            <TabsContent value="signup">
              <div className="p-6 pb-2">
                <h1 className="text-4xl font-bold gradient-text mb-4">Join Us Now</h1>
                <p className="text-xl text-foreground/90 mb-6">
                  Join hundreds of traders and start your crypto trading adventure
                </p>
              </div>
              <SignUpForm />
            </TabsContent>
            <TabsList className="grid w-full grid-cols-2 p-6">
              <TabsTrigger 
                value="login" 
                className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
              >
                Login
              </TabsTrigger>
              <TabsTrigger 
                value="signup"
                className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
              >
                Sign Up
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default AuthPage;