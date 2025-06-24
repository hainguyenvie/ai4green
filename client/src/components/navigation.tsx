import { Link, useLocation } from "wouter";
import { Leaf, Home, Scan, Users, Menu, X } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";

export default function Navigation() {
  const [location] = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <nav className="nav-modern fixed top-0 left-0 right-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center space-x-3 text-xl font-bold text-emerald-600 hover:no-underline group">
            <div className="w-8 h-8 bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
              <Leaf className="h-5 w-5 text-white" />
            </div>
            <span className="bg-gradient-to-r from-emerald-600 to-emerald-700 bg-clip-text text-transparent">
              AI 4 Green
            </span>
          </Link>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link 
              href="/" 
              className={`flex items-center space-x-2 px-3 py-2 rounded-lg font-medium transition-all duration-200 ${
                location === '/' 
                  ? 'text-emerald-600 bg-emerald-50' 
                  : 'text-slate-600 hover:text-emerald-600 hover:bg-emerald-50'
              }`}
            >
              <Home className="h-4 w-4" />
              <span>Trang Chủ</span>
            </Link>
            <Link 
              href="/scan" 
              className={`flex items-center space-x-2 px-3 py-2 rounded-lg font-medium transition-all duration-200 ${
                location === '/scan' 
                  ? 'text-emerald-600 bg-emerald-50' 
                  : 'text-slate-600 hover:text-emerald-600 hover:bg-emerald-50'
              }`}
            >
              <Scan className="h-4 w-4" />
              <span>Quét AI</span>
            </Link>
            <Link 
              href="/community" 
              className={`flex items-center space-x-2 px-3 py-2 rounded-lg font-medium transition-all duration-200 ${
                location === '/community' 
                  ? 'text-emerald-600 bg-emerald-50' 
                  : 'text-slate-600 hover:text-emerald-600 hover:bg-emerald-50'
              }`}
            >
              <Users className="h-4 w-4" />
              <span>Cộng Đồng</span>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-slate-200 py-4">
            <div className="space-y-2">
              <Link 
                href="/" 
                className={`flex items-center space-x-3 px-3 py-3 rounded-lg font-medium transition-all duration-200 ${
                  location === '/' 
                    ? 'text-emerald-600 bg-emerald-50' 
                    : 'text-slate-600 hover:text-emerald-600 hover:bg-emerald-50'
                }`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <Home className="h-5 w-5" />
                <span>Trang Chủ</span>
              </Link>
              <Link 
                href="/scan" 
                className={`flex items-center space-x-3 px-3 py-3 rounded-lg font-medium transition-all duration-200 ${
                  location === '/scan' 
                    ? 'text-emerald-600 bg-emerald-50' 
                    : 'text-slate-600 hover:text-emerald-600 hover:bg-emerald-50'
                }`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <Scan className="h-5 w-5" />
                <span>Quét AI</span>
              </Link>
              <Link 
                href="/community" 
                className={`flex items-center space-x-3 px-3 py-3 rounded-lg font-medium transition-all duration-200 ${
                  location === '/community' 
                    ? 'text-emerald-600 bg-emerald-50' 
                    : 'text-slate-600 hover:text-emerald-600 hover:bg-emerald-50'
                }`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <Users className="h-5 w-5" />
                <span>Cộng Đồng</span>
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
