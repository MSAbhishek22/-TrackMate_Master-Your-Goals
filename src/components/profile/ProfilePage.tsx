
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { LoaderCircle, ArrowLeft } from "lucide-react";
import { User } from "@/types";

const ProfilePage = () => {
  const { authState, updateProfile } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState<Partial<User>>({
    name: "",
    email: "",
    profilePicture: "",
    bio: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!authState.isAuthenticated && !authState.isLoading) {
      navigate("/");
    }
    
    if (authState.user) {
      setFormData({
        name: authState.user.name || "",
        email: authState.user.email || "",
        profilePicture: authState.user.profilePicture || "",
        bio: authState.user.bio || "",
      });
    }
  }, [authState, navigate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await updateProfile({
        name: formData.name,
        bio: formData.bio,
        profilePicture: formData.profilePicture,
      });
    } catch (error) {
      console.error("Failed to update profile:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part.charAt(0))
      .join('')
      .toUpperCase();
  };

  if (authState.isLoading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-gray-200 rounded w-48"></div>
          <div className="h-4 bg-gray-200 rounded w-64"></div>
        </div>
      </div>
    );
  }

  if (!authState.isAuthenticated) {
    return null; // Will redirect in useEffect
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      <Button variant="ghost" onClick={() => navigate("/dashboard")} className="mb-6">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Dashboard
      </Button>
      
      <Card className="shadow-md">
        <CardHeader>
          <CardTitle className="text-2xl">Your Profile</CardTitle>
          <CardDescription>Update your personal information</CardDescription>
        </CardHeader>
        
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-6">
            <div className="flex flex-col items-center sm:flex-row sm:gap-8">
              <div className="mb-4 sm:mb-0">
                <Avatar className="h-24 w-24">
                  <AvatarImage src={formData.profilePicture} />
                  <AvatarFallback className="text-2xl bg-masterplan-purple text-white">
                    {formData.name ? getInitials(formData.name) : "U"}
                  </AvatarFallback>
                </Avatar>
              </div>
              
              <div className="flex-1">
                <Label htmlFor="profilePicture">Profile Picture URL</Label>
                <Input
                  id="profilePicture"
                  name="profilePicture"
                  value={formData.profilePicture || ""}
                  onChange={handleChange}
                  placeholder="https://example.com/your-photo.jpg"
                  className="w-full"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Enter a URL for your profile picture
                </p>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                name="name"
                value={formData.name || ""}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email || ""}
                disabled
                className="bg-gray-50"
              />
              <p className="text-xs text-muted-foreground">
                Email cannot be changed
              </p>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="bio">Bio</Label>
              <Textarea
                id="bio"
                name="bio"
                value={formData.bio || ""}
                onChange={handleChange}
                placeholder="Tell us a bit about yourself"
                className="min-h-[100px]"
              />
            </div>
          </CardContent>
          
          <CardFooter className="flex justify-between">
            <Button type="button" variant="outline" onClick={() => navigate("/dashboard")}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting} className="bg-gradient-to-r from-masterplan-purple to-masterplan-teal">
              {isSubmitting ? (
                <>
                  <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                "Save Changes"
              )}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};

export default ProfilePage;
