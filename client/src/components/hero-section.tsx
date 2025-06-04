import { Button } from "@/components/ui/button";

export default function HeroSection() {
  return (
    <section className="bg-gradient-to-br from-primary-foreground to-white dark:from-gray-800 dark:to-gray-900 py-8 sm:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h1 className="text-2xl sm:text-4xl md:text-5xl font-bold brand-charcoal mb-4 sm:mb-6">
          Shop with Friends
        </h1>
        <p className="text-base sm:text-xl text-gray-600 dark:text-gray-300 mb-6 sm:mb-8 max-w-2xl mx-auto">
          Your trusted marketplace for buying and selling with friends. Find amazing deals from people you know and trust!
        </p>
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center">
          <Button className="bg-primary text-primary-foreground hover:bg-primary/90 px-6 sm:px-8 py-2 sm:py-3 shadow-lg w-full sm:w-auto">
            Browse All Items
          </Button>
          <Button variant="outline" className="border-primary text-primary hover:bg-primary hover:text-primary-foreground px-6 sm:px-8 py-2 sm:py-3 w-full sm:w-auto">
            Learn More
          </Button>
        </div>
      </div>
    </section>
  );
}
