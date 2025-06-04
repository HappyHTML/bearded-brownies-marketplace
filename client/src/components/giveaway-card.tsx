import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { MapPin, Users, Clock, Gift } from "lucide-react";
import { Link } from "wouter";
import type { Giveaway } from "@shared/schema";

interface GiveawayCardProps {
  giveaway: Giveaway;
}

export default function GiveawayCard({ giveaway }: GiveawayCardProps) {
  const isNew = giveaway.condition === "new";
  const isLikeNew = giveaway.condition === "like-new";
  const isRecent = new Date(giveaway.createdAt).getTime() > Date.now() - (7 * 24 * 60 * 60 * 1000);
  const daysLeft = Math.ceil((new Date(giveaway.endDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
  const isClaimed = giveaway.claimedBy !== null && giveaway.claimedBy !== undefined;

  const getConditionColor = (condition: string) => {
    switch (condition) {
      case "new": return "bg-green-500";
      case "like-new": return "bg-blue-500";
      case "good": return "bg-yellow-500";
      case "fair": return "bg-orange-500";
      default: return "bg-gray-500";
    }
  };

  const cardContent = (
    <Card className={`group ${isClaimed ? 'cursor-not-allowed opacity-75' : 'cursor-pointer hover:shadow-xl'} overflow-hidden transition-all duration-300`}>
      <div className="relative">
        <img 
          src={giveaway.imageUrl} 
          alt={giveaway.title}
          className={`w-full h-40 sm:h-48 object-cover transition-transform duration-300 ${
            isClaimed ? 'grayscale' : 'group-hover:scale-105'
          }`}
        />
        {isClaimed && (
          <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
            <div className="bg-white px-3 py-1 rounded-full shadow-lg">
              <span className="text-sm font-semibold text-gray-800">Claimed by {giveaway.claimedBy}</span>
            </div>
          </div>
        )}
        {!isClaimed && (
          <Badge className={`absolute top-2 sm:top-3 right-2 sm:right-3 text-white text-xs ${getConditionColor(giveaway.condition)}`}>
            {giveaway.condition.charAt(0).toUpperCase() + giveaway.condition.slice(1)}
          </Badge>
        )}
        {isRecent && !isClaimed && (
          <Badge variant="secondary" className="absolute top-2 sm:top-3 left-2 sm:left-3 bg-white text-primary shadow-md text-xs">
            New
          </Badge>
        )}
      </div>

    <CardContent className="p-4 sm:p-6">
      <h3 className="font-semibold text-base sm:text-lg brand-charcoal mb-2 line-clamp-1">
        {giveaway.title}
      </h3>
      <p className="text-gray-600 dark:text-gray-300 text-xs sm:text-sm mb-3 sm:mb-4 line-clamp-2">
        {giveaway.description}
      </p>

      <div className="flex items-center justify-between mb-3 sm:mb-4">
        <div className="flex items-center space-x-2">
          <Avatar className="w-6 h-6 sm:w-8 sm:h-8 bg-primary">
            <AvatarFallback className="text-primary-foreground text-xs">
              {giveaway.hostUsername.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <span className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 truncate max-w-20 sm:max-w-none">
            {giveaway.hostUsername}
          </span>
        </div>
        <Badge variant="secondary" className={`text-xs ${isClaimed ? 'bg-gray-100 text-gray-600' : 'bg-green-100 text-green-800'}`}>
          {isClaimed ? 'CLAIMED' : 'FREE'}
        </Badge>
      </div>

      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
          <Clock className="mr-1" size={12} />
          <span>{isClaimed ? 'Claimed' : `${daysLeft}d left`}</span>
        </div>
        <Badge variant="outline" className="text-xs">
          {isClaimed ? 'Claimed' : 'Active'}
        </Badge>
      </div>

      {giveaway.location && (
        <div className="flex items-center text-xs text-gray-500 dark:text-gray-400 mb-2">
          <MapPin className="mr-1" size={12} />
          <span className="truncate">{giveaway.location}</span>
        </div>
      )}

      <div className="flex justify-between items-center text-xs text-gray-500 dark:text-gray-400">
        <div className="flex items-center">
          <Gift className="mr-1" size={12} />
          <span>Est. ${(giveaway.estimatedValue / 100).toFixed(0)} value</span>
        </div>
        <span>{new Date(giveaway.createdAt).toLocaleDateString()}</span>
      </div>
      </CardContent>
    </Card>
  );

  if (isClaimed) {
    return cardContent;
  }

  return (
    <Link href={`/giveaway/${giveaway.id}`}>
      {cardContent}
    </Link>
  );
}