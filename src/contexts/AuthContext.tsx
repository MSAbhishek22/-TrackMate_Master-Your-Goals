
import React, { createContext, useContext, useState, useEffect } from "react";
import { User, AuthState } from "@/types";
import { toast } from "sonner";

interface AuthContextProps {
  authState: AuthState;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  updateProfile: (userData: Partial<User>) => Promise<void>;
}

// Mock user data for demo
const MOCK_USER: User = {
  id: "user-1",
  name: "Alex Johnson",
  email: "alex@student.edu",
  profilePicture: "https://i.pravatar.cc/150?img=33",
  bio: "Computer Science student trying to stay productive!",
  theme: "light",
};

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: true,
  });

  useEffect(() => {
    // Check if user is logged in from localStorage
    const storedUser = localStorage.getItem("masterplan_user");
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setAuthState({
          user: parsedUser,
          isAuthenticated: true,
          isLoading: false,
        });
      } catch (error) {
        console.error("Failed to parse stored user data:", error);
        localStorage.removeItem("masterplan_user");
        setAuthState({
          user: null,
          isAuthenticated: false,
          isLoading: false,
        });
      }
    } else {
      setAuthState({
        user: null,
        isAuthenticated: false,
        isLoading: false,
      });
    }
  }, []);

  const login = async (email: string, password: string) => {
    // Simulate API call
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      // For demo purposes, we'll allow any login with email format and password length > 5
      if (email.includes("@") && password.length > 5) {
        const user = { ...MOCK_USER, email };
        localStorage.setItem("masterplan_user", JSON.stringify(user));
        
        setAuthState({
          user,
          isAuthenticated: true,
          isLoading: false,
        });
        
        toast.success("Logged in successfully!");
      } else {
        throw new Error("Invalid credentials");
      }
    } catch (error) {
      toast.error("Login failed. Please check your credentials.");
      throw error;
    }
  };

  const register = async (name: string, email: string, password: string) => {
    // Simulate API call
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      // For demo purposes, we'll allow any registration with valid format
      if (name && email.includes("@") && password.length > 5) {
        const user = { ...MOCK_USER, name, email };
        localStorage.setItem("masterplan_user", JSON.stringify(user));
        
        setAuthState({
          user,
          isAuthenticated: true,
          isLoading: false,
        });
        
        toast.success("Registered successfully!");
      } else {
        throw new Error("Invalid registration data");
      }
    } catch (error) {
      toast.error("Registration failed. Please check your information.");
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem("masterplan_user");
    setAuthState({
      user: null,
      isAuthenticated: false,
      isLoading: false,
    });
    toast.success("Logged out successfully!");
  };

  const updateProfile = async (userData: Partial<User>) => {
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      const updatedUser = { ...authState.user, ...userData } as User;
      localStorage.setItem("masterplan_user", JSON.stringify(updatedUser));
      
      setAuthState({
        ...authState,
        user: updatedUser,
      });
      
      toast.success("Profile updated successfully!");
    } catch (error) {
      toast.error("Failed to update profile.");
      throw error;
    }
  };

  return (
    <AuthContext.Provider value={{ authState, login, register, logout, updateProfile }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
