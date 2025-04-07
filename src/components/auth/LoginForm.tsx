
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import { LoaderCircle } from "lucide-react";

interface LoginFormProps {
  onToggleForm: () => void;
}

export const LoginForm: React.FC<LoginFormProps> = ({ onToggleForm }) => {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      await login(email, password);
    } catch (err) {
      setError("Invalid email or password. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto shadow-lg animate-fade-in">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold text-center gradient-text">Log in to MasterPlan</CardTitle>
        <CardDescription className="text-center">
          Enter your email and password to access your goals
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="your.email@example.com"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full"
              disabled={isSubmitting}
            />
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="password">Password</Label>
              <a href="#" className="text-sm text-masterplan-purple hover:underline">
                Forgot password?
              </a>
            </div>
            <Input
              id="password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full"
              disabled={isSubmitting}
            />
          </div>
          {error && <p className="text-sm font-medium text-red-500">{error}</p>}
          <Button type="submit" className="w-full bg-gradient-to-r from-masterplan-purple to-masterplan-teal" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
                Logging in...
              </>
            ) : (
              "Log in"
            )}
          </Button>
        </form>
      </CardContent>
      <CardFooter>
        <p className="text-sm text-center w-full text-muted-foreground">
          Don't have an account?{" "}
          <button 
            onClick={onToggleForm} 
            className="text-masterplan-purple hover:underline font-medium"
            type="button"
          >
            Sign up
          </button>
        </p>
      </CardFooter>
    </Card>
  );
};
