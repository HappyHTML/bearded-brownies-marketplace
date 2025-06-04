import { useRoute } from "wouter";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ArrowLeft, MapPin, Users, Clock, Gift, Calendar } from "lucide-react";
import { useState } from "react";
import { Link } from "wouter";
import type { Giveaway } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

export default function GiveawayDetail() {
  const [, params] = useRoute("/giveaway/:id");
  const [claimName, setClaimName] = useState("");
  const [isClaimModalOpen, setIsClaimModalOpen] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: giveaway, isLoading, error } = useQuery<Giveaway>({
    queryKey: ["/api/giveaways", params?.id],
    queryFn: async () => {
      const response = await fetch(`/api/giveaways/${params?.id}`);
      if (!response.ok) throw new Error("Failed to fetch giveaway");
      return response.json();
    },
    enabled: !!params?.id,
  });

  const claimMutation = useMutation({
    mutationFn: async (data: { giveawayId: number; claimerName: string }) => {
      const response = await apiRequest("POST", "/api/giveaways/claim", data);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Claim Submitted!",
        description: "The host has been notified of your claim.",
      });
      setIsClaimModalOpen(false);
      setClaimName("");
      queryClient.invalidateQueries({ queryKey: ["/api/giveaways"] });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to submit claim. Please try again.",
        variant: "destructive",
      });
    },
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-300">Loading giveaway...</p>
        </div>
      </div>
    );
  }

  if (error || !giveaway) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 dark:text-red-400 mb-4">Giveaway not found</p>
          <Link href="/">
            <Button variant="outline">
              <ArrowLeft className="mr-2" size={16} />
              Back to Home
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const daysLeft = Math.ceil((new Date(giveaway.endDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
  const isExpired = daysLeft <= 0;
  const isClaimed = !!giveaway.claimedBy;

  const getConditionColor = (condition: string) => {
    switch (condition) {
      case "new": return "bg-green-500";
      case "like-new": return "bg-blue-500";
      case "good": return "bg-yellow-500";
      case "fair": return "bg-orange-500";
      default: return "bg-gray-500";
    }
  };

  const handleClaim = () => {
    if (!claimName.trim()) {
      toast({
        title: "Name Required",
        description: "Please enter your name to claim this giveaway.",
        variant: "destructive",
      });
      return;
    }

    claimMutation.mutate({
      giveawayId: giveaway.id,
      claimerName: claimName.trim(),
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <Link href="/">
          <Button variant="outline" className="mb-6">
            <ArrowLeft className="mr-2" size={16} />
            Back to Giveaways
          </Button>
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Image Section */}
          <div className="relative">
            <img 
              src={giveaway.imageUrl} 
              alt={giveaway.title}
              className={`w-full h-64 sm:h-80 lg:h-96 object-cover rounded-xl shadow-lg ${
                isClaimed ? 'grayscale' : ''
              }`}
            />
            {isClaimed && (
              <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center rounded-xl">
                <div className="bg-white px-6 py-3 rounded-full shadow-lg">
                  <span className="text-lg font-semibold text-gray-800">Claimed by {giveaway.claimedBy}</span>
                </div>
              </div>
            )}
            {!isClaimed && (
              <>
                <Badge className={`absolute top-4 right-4 text-white ${getConditionColor(giveaway.condition)}`}>
                  {giveaway.condition.charAt(0).toUpperCase() + giveaway.condition.slice(1)}
                </Badge>
                <Badge variant="secondary" className="absolute top-4 left-4 bg-green-100 text-green-800">
                  FREE GIVEAWAY
                </Badge>
              </>
            )}
            {isClaimed && (
              <Badge variant="secondary" className="absolute top-4 left-4 bg-gray-100 text-gray-600">
                CLAIMED
              </Badge>
            )}
          </div>

          {/* Details Section */}
          <div className="space-y-6">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold brand-charcoal mb-2">
                {giveaway.title}
              </h1>
              <p className="text-gray-600 dark:text-gray-300 text-base leading-relaxed">
                {giveaway.description}
              </p>
            </div>

            {/* Host Info */}
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center space-x-3">
                  <Avatar className="w-12 h-12 bg-primary">
                    <AvatarFallback className="text-primary-foreground">
                      {giveaway.hostUsername.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-semibold text-gray-900 dark:text-gray-100">
                      Hosted by {giveaway.hostUsername}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Giveaway Host
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-4">
              <Card>
                <CardContent className="p-4 text-center">
                  <Gift className="w-8 h-8 text-primary mx-auto mb-2" />
                  <p className="text-2xl font-bold brand-brown">${(giveaway.estimatedValue / 100).toFixed(0)}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Est. Value</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-4 text-center">
                  <Clock className="w-8 h-8 text-primary mx-auto mb-2" />
                  <p className="text-2xl font-bold brand-brown">
                    {isExpired ? "Ended" : `${daysLeft}d`}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {isExpired ? "Giveaway ended" : "Time left"}
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Additional Info */}
            <div className="space-y-3">
              <div className="flex items-center text-gray-600 dark:text-gray-300">
                <Gift className="mr-2" size={16} />
                <span>Estimated value: ${(giveaway.estimatedValue / 100).toFixed(0)}</span>
              </div>
              
              {giveaway.location && (
                <div className="flex items-center text-gray-600 dark:text-gray-300">
                  <MapPin className="mr-2" size={16} />
                  <span>{giveaway.location}</span>
                </div>
              )}
              
              <div className="flex items-center text-gray-600 dark:text-gray-300">
                <Calendar className="mr-2" size={16} />
                <span>Posted {new Date(giveaway.createdAt).toLocaleDateString()}</span>
              </div>
            </div>

            {/* Claim Button */}
            <Dialog open={isClaimModalOpen} onOpenChange={setIsClaimModalOpen}>
              <DialogTrigger asChild>
                <Button 
                  className="w-full py-3 text-lg"
                  disabled={isExpired || isClaimed}
                >
                  {isClaimed ? `Claimed by ${giveaway.claimedBy}` : isExpired ? "Giveaway Ended" : "Claim This Giveaway"}
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Claim Giveaway</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <p className="text-gray-600 dark:text-gray-300">
                    Enter your name to claim this giveaway. The host will be notified.
                  </p>
                  <div>
                    <Label htmlFor="claimName">Your Name</Label>
                    <Input
                      id="claimName"
                      value={claimName}
                      onChange={(e) => setClaimName(e.target.value)}
                      placeholder="Enter your full name"
                      className="mt-1"
                    />
                  </div>
                  <div className="flex gap-3">
                    <Button 
                      onClick={handleClaim}
                      disabled={claimMutation.isPending}
                      className="flex-1"
                    >
                      {claimMutation.isPending ? "Submitting..." : "Submit Claim"}
                    </Button>
                    <Button 
                      variant="outline"
                      onClick={() => setIsClaimModalOpen(false)}
                      className="flex-1"
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </div>
    </div>
  );
}