import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LoginForm } from "@/components/auth/LoginForm";
import { SignUpForm } from "@/components/auth/SignUpForm";

const AuthPage = () => {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 auth-page">
      <Card className="w-full max-w-md glass-effect">
        <CardContent className="p-0">
          <Tabs defaultValue="login" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="login">Login</TabsTrigger>
              <TabsTrigger value="signup">Sign Up</TabsTrigger>
            </TabsList>
            <TabsContent value="login" className="p-6">
              <div className="mb-6 text-center">
                <h1 className="text-2xl font-bold gradient-text mb-2">Welcome Back!</h1>
                <p className="text-muted-foreground">Enter your credentials to access your account</p>
              </div>
              <LoginForm />
            </TabsContent>
            <TabsContent value="signup" className="p-6">
              <div className="mb-6 text-center">
                <h1 className="text-2xl font-bold gradient-text mb-2">Create Account</h1>
                <p className="text-muted-foreground">Join us and start trading today</p>
              </div>
              <SignUpForm />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default AuthPage;