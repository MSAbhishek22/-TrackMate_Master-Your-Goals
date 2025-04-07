
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import { LoaderCircle } from "lucide-react";

interface RegisterFormProps {
  onToggleForm: () => void;
}

export const RegisterForm: React.FC<RegisterFormProps> = ({ onToggleForm }) => {
  const { register } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setIsSubmitting(true);

    try {
      await register(name, email, password);
    } catch (err) {
      setError("Failed to register. Please try again later.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto shadow-lg animate-fade-in">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold text-center gradient-text">Create an Account</CardTitle>
        <CardDescription className="text-center">
          Sign up to start tracking your goals
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Full Name</Label>
            <Input
              id="name"
              type="text"
              placeholder="John Doe"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full"
              disabled={isSubmitting}
            />
          </div>
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
            <Label htmlFor="password">Password</Label>
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
          <div className="space-y-2">
            <Label htmlFor="confirm-password">Confirm Password</Label>
            <Input
              id="confirm-password"
              type="password"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full"
              disabled={isSubmitting}
            />
          </div>
          {error && <p className="text-sm font-medium text-red-500">{error}</p>}
          <Button type="submit" className="w-full bg-gradient-to-r from-masterplan-purple to-masterplan-teal" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
                Signing up...
              </>
            ) : (
              "Sign up"
            )}
          </Button>
        </form>
      </CardContent>
      <CardFooter>
        <p className="text-sm text-center w-full text-muted-foreground">
          Already have an account?{" "}
          <button 
            onClick={onToggleForm} 
            className="text-masterplan-purple hover:underline font-medium"
            type="button"
          >
            Log in
          </button>
        </p>
      </CardFooter>
    </Card>
  );
};
