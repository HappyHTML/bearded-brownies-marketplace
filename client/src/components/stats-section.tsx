import type { Giveaway } from "@shared/schema";

interface StatsSectionProps {
  giveaways: Giveaway[];
}

export default function StatsSection({ giveaways }: StatsSectionProps) {
  const activeGiveaways = giveaways.length;
  const uniqueHosts = new Set(giveaways.map(giveaway => giveaway.hostUsername)).size;
  const totalValue = giveaways.reduce((sum, giveaway) => sum + giveaway.estimatedValue, 0);

  return (
    <section className="py-8 sm:py-12 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 text-center">
          <div>
            <div className="text-2xl sm:text-3xl font-bold brand-brown">{activeGiveaways}</div>
            <div className="text-gray-600 dark:text-gray-300 mt-1 text-sm sm:text-base">Active Giveaways</div>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-bold brand-brown">{uniqueHosts}</div>
            <div className="text-gray-600 dark:text-gray-300 mt-1 text-sm sm:text-base">Generous Hosts</div>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-bold brand-brown">${(totalValue / 100).toLocaleString()}+</div>
            <div className="text-gray-600 dark:text-gray-300 mt-1 text-sm sm:text-base">Total Value</div>
          </div>
        </div>
      </div>
    </section>
  );
}
