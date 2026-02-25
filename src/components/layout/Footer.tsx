import { Droplet, Heart, Mail, Phone, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';
export function Footer() {
  return (
    <footer className="border-t bg-card">
      <div className="container py-12">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div className="space-y-4">
            <Link to="/" className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
                <Droplet className="h-5 w-5 text-primary-foreground" />
              </div>
              <div className="flex flex-col">
                <span className="text-lg font-bold leading-tight">BloodSync</span>
                <span className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">Save Lives</span>
              </div>
            </Link>
            <p className="text-sm text-muted-foreground">
              Connecting blood donors with those in need. Every drop counts, every donor is a hero.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="font-semibold">Quick Links</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link to="/donors" className="hover:text-primary transition-colors">Find Donors</Link></li>
              <li><Link to="/requested" className="hover:text-primary transition-colors">Requested Blood</Link></li>
              <li><Link to="/register" className="hover:text-primary transition-colors">Register as Donor</Link></li>
              <li><Link to="/Organisations" className="hover:text-primary transition-colors">Organization Portal</Link></li>
              <li><Link to="/help" className="hover:text-primary transition-colors">Help & Support</Link></li>
              <li><Link to="/Info" className="hover:text-primary transition-colors">Blood Info</Link></li>
            </ul>
          </div>

          {/* Dashboard Links */}
          <div className="space-y-4">
            <h4 className="font-semibold">Login Links</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link to="/admin" className="hover:text-primary transition-colors">Admin Login</Link></li>
              <li><Link to="/hospital-login" className="hover:text-primary transition-colors">Hospital Login</Link></li>
              <li><Link to="/hospital-login" className="hover:text-primary transition-colors">Donor Login</Link></li>
            </ul>
          </div> 

      
          {/* Contact */}
          <div className="space-y-4">
            <h4 className="font-semibold">Contact Us</h4>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-primary" />
                <span>+91 9000000000</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-primary" />
                <span>bloodsync123@gmail.com</span>
              </li>
              <li className="flex items-start gap-2">
                <MapPin className="h-4 w-4 text-primary mt-0.5" />
                <span>Bhadravathi, Shivamogga, Karnataka, India</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-8 flex flex-col items-center justify-between gap-4 border-t pt-8 text-sm text-muted-foreground sm:flex-row">
          <p>© 2026 BloodSync. All rights reserved.</p>
          <p className="flex items-center gap-1">
            Made with <Heart className="h-4 w-4 text-primary fill-primary" /> for humanity
          </p>
        </div>
      </div>
    </footer>
  );
}
