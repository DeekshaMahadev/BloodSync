import { useState, useEffect } from 'react';
import { 
  Droplet, 
  ChevronDown, 
  Building2, 
  ShieldCheck, 
  LayoutDashboard, 
  Menu, 
  User, 
  LogOut, 
  Home, 
  Search, 
  ClipboardList, 
  UserPlus, 
  InfoIcon
} from 'lucide-react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { supabase } from '@/lib/supabase';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

interface HeaderProps {
  className?: string;
}

export function Header({ className }: HeaderProps) {
  const [user, setUser] = useState<any>(null);
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Check initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/');
  };

  const navLinks = [
    { name: 'Home', href: '/', icon: Home },
    { name: 'Find Donors', href: '/donors', icon: Search },
    { name: 'Requested Blood', href: '/requested', icon: ClipboardList },
    { name: 'Register as Donor', href: '/register', icon: UserPlus },
    { name: 'Help & Support', href: '/help', icon: User },
  ];

  return (
    <header className={cn("sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80", className)}>
      <div className="container flex h-16 items-center justify-between px-4">
        
        <div className="flex items-center gap-4">
          {/* Mobile Menu Trigger (Drawer) */}
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="icon" className="shrink-0">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[300px] sm:w-[350px]">
              <SheetHeader className="text-left">
                <SheetTitle className="flex items-center gap-2">
                  <Droplet className="h-5 w-5 text-primary" />
                  BloodSync 
                </SheetTitle>
              </SheetHeader>
              <nav className="flex flex-col gap-4 mt-8">
                {navLinks.map((link) => (
                  <Link
                    key={link.name}
                    to={link.href}
                    onClick={() => setIsOpen(false)}
                    className={cn(
                      "flex items-center gap-3 px-3 py-2 text-lg font-medium rounded-md transition-colors",
                      location.pathname === link.href 
                        ? "bg-primary/10 text-primary" 
                        : "text-muted-foreground hover:text-primary hover:bg-muted"
                    )}
                  >
                    <link.icon className="h-5 w-5" />
                    {link.name}
                  </Link>
                ))}
              </nav>
            </SheetContent>
          </Sheet>

          {/* Logo Section */}
          <Link to="/" className="flex items-center gap-2 transition-opacity hover:opacity-80">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary shadow-sm shadow-primary/20">
              <Droplet className="h-5 w-5 text-primary-foreground" />
            </div>
            <div className="flex flex-col hidden sm:flex">
              <span className="text-lg font-bold leading-tight tracking-tight text-foreground">BloodSync</span>
              <span className="text-[9px] font-semibold uppercase tracking-[0.1em] text-primary">Life Saver Network</span>
            </div>
          </Link>
        </div>

        {/* Desktop Navigation Links */}
        <nav className="hidden items-center gap-1 md:flex">
          {navLinks.map((link) => (
            <Button 
              key={link.name}
              variant="ghost" 
              className={cn(
                "text-sm font-medium",
                location.pathname === link.href && "bg-muted text-primary"
              )} 
              asChild
            >
              <Link to={link.href}>{link.name}</Link>
            </Button>
          ))}
        </nav>

       {/* Right Side Action Section */}
        <div className="flex items-center gap-3">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button className="gap-2 px-5 shadow-md shadow-primary/10">
                <LayoutDashboard className="h-4 w-4" />
                Login Portal
                <ChevronDown className="h-4 w-4 opacity-50" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 p-2">
              <DropdownMenuLabel className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-2 py-1.5">
                Access Type
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              
              {/* Hospital Login Option */}
              <DropdownMenuItem asChild className="cursor-pointer focus:bg-primary/5 focus:text-primary py-2.5">
                <Link to="/hospital-login" className="flex items-center w-full">
                  <Building2 className="mr-3 h-4 w-4 text-primary" />
                  <div className="flex flex-col">
                    <span className="font-medium">Hospital Login</span>
                    <span className="text-[10px] text-muted-foreground">Manage blood requests</span>
                  </div>
                </Link>
              </DropdownMenuItem>

              {/* Admin Login Option */}
              <DropdownMenuItem asChild className="cursor-pointer focus:bg-primary/5 focus:text-primary py-2.5">
                <Link to="/admin" className="flex items-center w-full">
                  <ShieldCheck className="mr-3 h-4 w-4 text-primary" />
                  <div className="flex flex-col">
                    <span className="font-medium">Admin Portal</span>
                    <span className="text-[10px] text-muted-foreground">System management</span>
                  </div>
                </Link>
              </DropdownMenuItem>

              {/* Donor Login Option */}
              <DropdownMenuItem asChild className="cursor-pointer focus:bg-primary/5 focus:text-primary py-2.5">
                <Link to="/donor-login" className="flex items-center w-full">
                  <Droplet className="mr-3 h-4 w-4 text-primary" />
                  <div className="flex flex-col">
                    <span className="font-medium">Donor Login</span>
                    <span className="text-[10px] text-muted-foreground">Manage donor profile</span>
                  </div>
                </Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
