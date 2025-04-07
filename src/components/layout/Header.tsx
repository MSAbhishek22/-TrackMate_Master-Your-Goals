
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/contexts/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import { BellIcon, LogOut, Settings, User } from "lucide-react";

export const Header: React.FC = () => {
  const { authState, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part.charAt(0))
      .join('')
      .toUpperCase();
  };

  return (
    <header className="border-b">
      <div className="container mx-auto flex justify-between items-center h-16 px-4">
        <div className="flex items-center">
          <Link to={authState.isAuthenticated ? "/dashboard" : "/"} className="flex items-center">
            <span className="sr-only">MasterPlan</span>
            <div className="h-8 w-8 rounded-md bg-gradient-to-br from-masterplan-purple to-masterplan-teal flex items-center justify-center text-white font-bold text-lg mr-3">
              M
            </div>
            <span className="text-xl font-bold gradient-text">MasterPlan</span>
          </Link>
        </div>

        <div className="flex items-center">
          {authState.isAuthenticated ? (
            <>
              <Button variant="ghost" size="icon" className="mr-2">
                <BellIcon className="h-5 w-5" />
              </Button>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={authState.user?.profilePicture} alt={authState.user?.name} />
                      <AvatarFallback className="bg-masterplan-purple text-white">
                        {authState.user?.name ? getInitials(authState.user.name) : "U"}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">{authState.user?.name}</p>
                      <p className="text-xs leading-none text-muted-foreground">
                        {authState.user?.email}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => navigate("/profile")}>
                    <User className="mr-2 h-4 w-4" />
                    <span>Profile</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate("/settings")}>
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Settings</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <Button onClick={() => navigate("/")} className="bg-gradient-to-r from-masterplan-purple to-masterplan-teal">
              Sign In
            </Button>
          )}
        </div>
      </div>
    </header>
  );
};
