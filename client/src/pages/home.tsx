import Navigation from "@/components/navigation";
import HeroSection from "@/components/hero-section";
import StatsSection from "@/components/stats-section";
import GiveawayCard from "@/components/giveaway-card";
import HostGiveawayModal from "@/components/host-giveaway-modal";
import CTASection from "@/components/cta-section";
import Footer from "@/components/footer";
import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";
import type { Giveaway } from "@shared/schema";

export default function Home() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filterCategory, setFilterCategory] = useState("all");
  const [sortBy, setSortBy] = useState("newest");

  const { data: giveaways, isLoading, error } = useQuery<Giveaway[]>({
    queryKey: ["/api/giveaways"],
  });

  const filteredAndSortedGiveaways = giveaways
    ?.filter(giveaway => filterCategory === "all" || giveaway.category === filterCategory)
    ?.sort((a, b) => {
      switch (sortBy) {
        case "newest":
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        case "condition":
          const conditionOrder = { "new": 4, "like-new": 3, "good": 2, "fair": 1 };
          return conditionOrder[b.condition as keyof typeof conditionOrder] - conditionOrder[a.condition as keyof typeof conditionOrder];
        case "location":
          return (a.location || "").localeCompare(b.location || "");
        case "value":
          return b.estimatedValue - a.estimatedValue;
        default:
          return 0;
      }
    }) || [];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navigation onHostGiveaway={() => setIsModalOpen(true)} />
      <HeroSection />
      {/*<StatsSection giveaways={giveaways || []} />*/}
      
      <main className="py-8 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Header */}
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold brand-charcoal mb-4">Friend Giveaways</h2>
            <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto text-sm sm:text-base">
              Check out free giveaways from your friends! Win amazing items from people you know and trust.
            </p>
          </div>

          {/* Filter/Sort Bar - Mobile Optimized */}
          <div className="flex flex-col gap-4 mb-6 sm:mb-8 bg-white dark:bg-gray-800 p-3 sm:p-4 rounded-lg shadow-sm">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                <span className="text-gray-700 dark:text-gray-300 font-medium text-sm sm:text-base">Filter by:</span>
                <Select value={filterCategory} onValueChange={setFilterCategory}>
                  <SelectTrigger className="w-full sm:w-48">
                    <SelectValue placeholder="All Categories" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    <SelectItem value="electronics">Electronics</SelectItem>
                    <SelectItem value="food">Food & Treats</SelectItem>
                    <SelectItem value="home">Home & Garden</SelectItem>
                    <SelectItem value="fashion">Fashion</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                <span className="text-gray-700 dark:text-gray-300 font-medium text-sm sm:text-base">Sort by:</span>
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-full sm:w-48">
                    <SelectValue placeholder="Newest First" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="newest">Newest First</SelectItem>
                    <SelectItem value="condition">Best Condition</SelectItem>
                    <SelectItem value="location">By Location</SelectItem>
                    <SelectItem value="participants">Most Popular</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Items Grid - Mobile Optimized */}
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-4 sm:p-6">
                  <Skeleton className="w-full h-40 sm:h-48 mb-4" />
                  <Skeleton className="h-5 sm:h-6 w-3/4 mb-2" />
                  <Skeleton className="h-3 sm:h-4 w-full mb-4" />
                  <div className="flex justify-between items-center">
                    <Skeleton className="h-3 sm:h-4 w-1/3" />
                    <Skeleton className="h-3 sm:h-4 w-1/4" />
                  </div>
                </div>
              ))}
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <p className="text-red-600 dark:text-red-400 text-sm sm:text-base">Failed to load items. Please try again later.</p>
            </div>
          ) : filteredAndSortedGiveaways.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-600 dark:text-gray-400 text-sm sm:text-base">No giveaways found matching your criteria.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
              {filteredAndSortedGiveaways.map((giveaway) => (
                <GiveawayCard key={giveaway.id} giveaway={giveaway} />
              ))}
            </div>
          )}
        </div>
      </main>

      <CTASection onHostGiveaway={() => setIsModalOpen(true)} />
      <Footer />
      
      <HostGiveawayModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />
    </div>
  );
}
