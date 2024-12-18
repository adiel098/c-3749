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
            <div className="p-6 pb-2">
              <h1 className="text-4xl font-bold gradient-text mb-4">Welcome Back</h1>
              <p className="text-xl text-foreground/90 mb-6">
                Great to see you again! Log in to continue your trading journey
              </p>
            </div>
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
            <TabsContent value="login" className="p-6 pt-2">
              <LoginForm />
            </TabsContent>
            <TabsContent value="signup" className="p-6 pt-2">
              <SignUpForm />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default AuthPage;