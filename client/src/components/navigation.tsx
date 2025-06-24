import { Link, useLocation } from "wouter";
import { Leaf, Home, Camera, Users } from "lucide-react";

export default function Navigation() {
  const [location] = useLocation();

  return (
    <nav className="navbar-custom fixed top-0 left-0 right-0 z-50 border-b">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center space-x-2 text-xl font-bold text-[--primary-green] hover:no-underline">
            <Leaf className="h-6 w-6" />
            <span>AI 4 Green</span>
          </Link>
          
          <div className="hidden md:flex items-center space-x-8">
            <Link 
              href="/" 
              className={`nav-link-custom ${location === '/' ? 'text-[--secondary-green]' : ''}`}
            >
              <Home className="h-4 w-4 inline mr-2" />
              Home
            </Link>
            <Link 
              href="/scan" 
              className={`nav-link-custom ${location === '/scan' ? 'text-[--secondary-green]' : ''}`}
            >
              <Camera className="h-4 w-4 inline mr-2" />
              AI Scan
            </Link>
            <Link 
              href="/community" 
              className={`nav-link-custom ${location === '/community' ? 'text-[--secondary-green]' : ''}`}
            >
              <Users className="h-4 w-4 inline mr-2" />
              Community
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
