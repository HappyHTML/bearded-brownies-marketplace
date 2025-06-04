import { Button } from "@/components/ui/button";
import { ShoppingBag, Menu } from "lucide-react";

interface NavigationProps {
  onHostGiveaway: () => void;
}

export default function Navigation({ onHostGiveaway }: NavigationProps) {
  return (
    <nav className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-14 sm:h-16">
          {/* Logo */}
          <div className="flex items-center">
            <ShoppingBag className="text-lg sm:text-2xl brand-brown mr-2 sm:mr-3" size={20} />
            <span className="text-base sm:text-xl font-bold brand-charcoal hidden sm:block">Bearded Brownies Marketplace</span>
            <span className="text-base font-bold brand-charcoal sm:hidden">BB Marketplace</span>
          </div>
          
          {/* Navigation Items */}
          <div className="hidden md:flex items-center space-x-6 lg:space-x-8">
            <a href="#" className="text-gray-600 dark:text-gray-300 hover:text-primary transition-colors text-sm lg:text-base">
              Browse Items
            </a>
            <a href="#" className="text-gray-600 dark:text-gray-300 hover:text-primary transition-colors text-sm lg:text-base">
              How It Works
            </a>
            <a href="#" className="text-gray-600 dark:text-gray-300 hover:text-primary transition-colors text-sm lg:text-base">
              About
            </a>
          </div>
          
          {/* CTA Button */}
          <Button 
            onClick={onHostGiveaway}
            className="bg-primary text-primary-foreground hover:bg-primary/90 shadow-md hover:shadow-lg text-xs sm:text-sm px-3 sm:px-4 py-2"
          >
            <ShoppingBag className="mr-1 sm:mr-2" size={14} />
            <span className="hidden sm:inline">List Item</span>
            <span className="sm:hidden">List</span>
          </Button>
          
          {/* Mobile menu button */}
          <Button variant="ghost" className="md:hidden p-2">
            <Menu size={18} />
          </Button>
        </div>
      </div>
    </nav>
  );
}
