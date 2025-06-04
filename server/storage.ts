import { users, giveaways, claims, type User, type InsertUser, type Giveaway, type InsertGiveaway, type Claim, type InsertClaim } from "@shared/schema";

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  getAllGiveaways(): Promise<Giveaway[]>;
  getGiveaway(id: number): Promise<Giveaway | undefined>;
  createGiveaway(giveaway: InsertGiveaway): Promise<Giveaway>;
  
  createClaim(claim: InsertClaim): Promise<Claim>;
  getClaimsByHost(hostUsername: string): Promise<(Claim & { giveaway: Giveaway })[]>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private giveaways: Map<number, Giveaway>;
  private claims: Map<number, Claim>;
  private currentUserId: number;
  private currentGiveawayId: number;
  private currentClaimId: number;

  constructor() {
    this.users = new Map();
    this.giveaways = new Map();
    this.claims = new Map();
    this.currentUserId = 1;
    this.currentGiveawayId = 1;
    this.currentClaimId = 1;
    
    // Initialize with some sample giveaways
    this.initializeSampleData();
  }

  private initializeSampleData() {
    const sampleGiveaways: (InsertGiveaway & { endDate: Date })[] = [
      {
        title: "Premium Wireless Headphones",
        description: "Experience crystal-clear audio with these top-of-the-line wireless headphones featuring noise cancellation and 30-hour battery life.",
        category: "electronics",
        estimatedValue: 29900, // $299.00 estimated value
        imageUrl: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
        hostUsername: "TechLover92",
        condition: "new",
        location: "Downtown",
        duration: 7,
        endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
      },
      {
        title: "Bearded Brownies Deluxe Box",
        description: "Our signature brownie collection featuring 12 gourmet flavors, each crafted with premium ingredients and a touch of magic.",
        category: "food",
        estimatedValue: 8500, // $85.00 estimated value
        imageUrl: "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
        hostUsername: "BeardedBaker",
        condition: "new",
        location: "Midtown",
        duration: 3,
        endDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000)
      },
      {
        title: "Latest Smartphone",
        description: "Brand new flagship smartphone with cutting-edge camera technology, lightning-fast processor, and all-day battery life.",
        category: "electronics",
        estimatedValue: 99900, // $999.00 estimated value
        imageUrl: "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
        hostUsername: "GadgetGuru",
        condition: "new",
        location: "Uptown",
        duration: 14,
        endDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000)
      },
      {
        title: "Luxury Reading Chair",
        description: "Transform your reading corner with this plush, ergonomic chair designed for ultimate comfort during long reading sessions.",
        category: "home",
        estimatedValue: 45000, // $450.00 estimated value
        imageUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
        hostUsername: "HomeDesigner",
        condition: "like-new",
        location: "Suburbs",
        duration: 5,
        endDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000)
      },
      {
        title: "Photography Starter Kit",
        description: "Complete photography bundle including camera, lenses, tripod, and editing software to kickstart your photography journey.",
        category: "electronics",
        estimatedValue: 75000, // $750.00 estimated value
        imageUrl: "https://images.unsplash.com/photo-1502920917128-1aa500764cbd?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
        hostUsername: "PhotoPro",
        condition: "good",
        location: "Creative District",
        duration: 10,
        endDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000)
      },
      {
        title: "Coffee Connoisseur Set",
        description: "Premium coffee collection with beans from around the world, grinder, French press, and brewing accessories.",
        category: "food",
        estimatedValue: 18000, // $180.00 estimated value
        imageUrl: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
        hostUsername: "CoffeeMaster",
        condition: "new",
        location: "Coffee District",
        duration: 4,
        endDate: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000)
      },
      {
        title: "Gaming Accessories Bundle",
        description: "Level up your gaming with this complete RGB accessories set including mechanical keyboard, gaming mouse, and headset.",
        category: "electronics",
        estimatedValue: 32000, // $320.00 estimated value
        imageUrl: "https://images.unsplash.com/photo-1593640408182-31c70c8268f5?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
        hostUsername: "GamerPro",
        condition: "like-new",
        location: "Tech Quarter",
        duration: 6,
        endDate: new Date(Date.now() + 6 * 24 * 60 * 60 * 1000)
      },
      {
        title: "Luxury Spa Experience",
        description: "Pamper yourself with this complete spa collection featuring organic oils, candles, bath salts, and premium towels.",
        category: "other",
        estimatedValue: 19500, // $195.00 estimated value
        imageUrl: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
        hostUsername: "WellnessQueen",
        condition: "new",
        location: "Wellness Center",
        duration: 8,
        endDate: new Date(Date.now() + 8 * 24 * 60 * 60 * 1000)
      }
    ];

    sampleGiveaways.forEach((giveawayData) => {
      const id = this.currentGiveawayId++;
      const giveaway: Giveaway = {
        id,
        title: giveawayData.title,
        description: giveawayData.description,
        category: giveawayData.category,
        estimatedValue: giveawayData.estimatedValue,
        imageUrl: giveawayData.imageUrl,
        hostUsername: giveawayData.hostUsername,
        condition: giveawayData.condition || "new",
        location: giveawayData.location || null,
        isActive: "true",
        createdAt: new Date(),
        endDate: giveawayData.endDate,
      };
      this.giveaways.set(id, giveaway);
    });
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async getAllGiveaways(): Promise<Giveaway[]> {
    return Array.from(this.giveaways.values())
      .filter(giveaway => giveaway.isActive === "true")
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  async getGiveaway(id: number): Promise<Giveaway | undefined> {
    return this.giveaways.get(id);
  }

  async createGiveaway(insertGiveaway: InsertGiveaway): Promise<Giveaway> {
    const id = this.currentGiveawayId++;
    const now = new Date();
    const endDate = new Date(now.getTime() + insertGiveaway.duration * 24 * 60 * 60 * 1000);
    
    const giveaway: Giveaway = {
      id,
      title: insertGiveaway.title,
      description: insertGiveaway.description,
      category: insertGiveaway.category,
      estimatedValue: insertGiveaway.estimatedValue,
      imageUrl: insertGiveaway.imageUrl,
      hostUsername: insertGiveaway.hostUsername,
      condition: insertGiveaway.condition || "new",
      location: insertGiveaway.location || null,
      isActive: "true",
      createdAt: now,
      endDate: endDate,
      claimedBy: null,
    };
    
    this.giveaways.set(id, giveaway);
    return giveaway;
  }

  async createClaim(claim: InsertClaim): Promise<Claim> {
    const id = this.currentClaimId++;
    const newClaim: Claim = {
      id,
      giveawayId: claim.giveawayId,
      claimerName: claim.claimerName,
      claimerContact: claim.claimerContact || null,
      claimedAt: new Date(),
      status: "pending",
    };
    
    // Mark the giveaway as claimed
    const giveaway = this.giveaways.get(claim.giveawayId);
    if (giveaway) {
      giveaway.claimedBy = claim.claimerName;
      this.giveaways.set(claim.giveawayId, giveaway);
    }
    
    this.claims.set(id, newClaim);
    return newClaim;
  }

  async getClaimsByHost(hostUsername: string): Promise<(Claim & { giveaway: Giveaway })[]> {
    const hostGiveaways = Array.from(this.giveaways.values())
      .filter(g => g.hostUsername === hostUsername);
    
    const claims: (Claim & { giveaway: Giveaway })[] = [];
    
    for (const claim of Array.from(this.claims.values())) {
      const giveaway = hostGiveaways.find(g => g.id === claim.giveawayId);
      if (giveaway) {
        claims.push({ ...claim, giveaway });
      }
    }
    
    return claims.sort((a, b) => b.claimedAt.getTime() - a.claimedAt.getTime());
  }
}

export const storage = new MemStorage();
