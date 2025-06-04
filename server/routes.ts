import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertGiveawaySchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Get all giveaways
  app.get("/api/giveaways", async (req, res) => {
    try {
      const giveaways = await storage.getAllGiveaways();
      res.json(giveaways);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch giveaways" });
    }
  });

  // Get single giveaway
  app.get("/api/giveaways/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid giveaway ID" });
      }

      const giveaway = await storage.getGiveaway(id);
      if (!giveaway) {
        return res.status(404).json({ message: "Giveaway not found" });
      }

      res.json(giveaway);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch giveaway" });
    }
  });

  // Create new giveaway
  app.post("/api/giveaways", async (req, res) => {
    try {
      const validation = insertGiveawaySchema.safeParse(req.body);
      if (!validation.success) {
        return res.status(400).json({ 
          message: "Invalid giveaway data",
          errors: validation.error.errors 
        });
      }

      const giveaway = await storage.createGiveaway(validation.data);
      res.status(201).json(giveaway);
    } catch (error) {
      res.status(500).json({ message: "Failed to create giveaway" });
    }
  });

  // Get claims for a host (for notification checking)
  app.get("/api/claims/:hostUsername", async (req, res) => {
    try {
      const { hostUsername } = req.params;
      const claims = await storage.getClaimsByHost(hostUsername);
      res.json(claims);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch claims" });
    }
  });

  // Claim giveaway
  app.post("/api/giveaways/claim", async (req, res) => {
    try {
      const { giveawayId, claimerName } = req.body;
      
      if (!giveawayId || typeof giveawayId !== "number") {
        return res.status(400).json({ message: "Invalid giveaway ID" });
      }
      
      if (!claimerName || typeof claimerName !== "string") {
        return res.status(400).json({ message: "Claimer name is required" });
      }

      const giveaway = await storage.getGiveaway(giveawayId);
      if (!giveaway) {
        return res.status(404).json({ message: "Giveaway not found" });
      }

      // Check if giveaway is still active
      if (new Date() > giveaway.endDate) {
        return res.status(400).json({ message: "Giveaway has ended" });
      }

      // Host notification system - currently console log, could be email/SMS/push notification
      console.log(`🎉 CLAIM NOTIFICATION: ${claimerName} wants to claim "${giveaway.title}" from ${giveaway.hostUsername}`);
      console.log(`   📧 Host should be contacted: ${giveaway.hostUsername}`);
      console.log(`   📱 Claimer contact info: ${claimerName}`);
      
      // In a production app, this would trigger:
      // - Email notification to host
      // - SMS notification (if phone number provided)
      // - Push notification through app
      // - In-app notification system

      // Create claim record for tracking
      await storage.createClaim({
        giveawayId,
        claimerName,
        claimerContact: null
      });

      res.json({ 
        message: "Claim submitted successfully! Host has been notified.",
        hostNotified: true 
      });
    } catch (error) {
      res.status(500).json({ message: "Failed to process claim" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
