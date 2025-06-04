import { Button } from "@/components/ui/button";
import { ShoppingBag } from "lucide-react";

interface CTASectionProps {
  onHostGiveaway: () => void;
}

export default function CTASection({ onHostGiveaway }: CTASectionProps) {
  return (
    <section className="bg-primary py-12 sm:py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-2xl sm:text-3xl font-bold text-primary-foreground mb-3 sm:mb-4">
          Ready to Sell Your Items?
        </h2>
        <p className="text-primary-foreground/80 text-sm sm:text-lg mb-6 sm:mb-8">
          Join your friends in our trusted marketplace. List your items and connect with people you know!
        </p>
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
          <Button 
            onClick={onHostGiveaway}
            variant="secondary"
            className="bg-white text-primary hover:bg-gray-100 px-6 sm:px-8 py-2 sm:py-3 shadow-lg w-full sm:w-auto"
          >
            <ShoppingBag className="mr-2" size={16} />
            List Your Item
          </Button>
          <Button 
            variant="outline" 
            className="border-white text-white hover:bg-white hover:text-primary px-6 sm:px-8 py-2 sm:py-3 w-full sm:w-auto"
          >
            Learn How It Works
          </Button>
        </div>
      </div>
    </section>
  );
}
