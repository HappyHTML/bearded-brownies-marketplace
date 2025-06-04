import { pgTable, text, serial, integer, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const giveaways = pgTable("giveaways", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  category: text("category").notNull(),
  estimatedValue: integer("estimated_value").notNull(), // in cents, just for reference
  imageUrl: text("image_url").notNull(),
  hostUsername: text("host_username").notNull(),
  condition: text("condition").notNull().default("new"), // new, like-new, good, fair
  isActive: text("is_active").notNull().default("true"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  location: text("location"),
  endDate: timestamp("end_date").notNull(),
  claimedBy: text("claimed_by"),
});

export const claims = pgTable("claims", {
  id: serial("id").primaryKey(),
  giveawayId: integer("giveaway_id").references(() => giveaways.id).notNull(),
  claimerName: text("claimer_name").notNull(),
  claimerContact: text("claimer_contact"),
  claimedAt: timestamp("claimed_at").notNull().defaultNow(),
  status: text("status").notNull().default("pending"), // pending, approved, rejected
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertGiveawaySchema = createInsertSchema(giveaways).omit({
  id: true,
  isActive: true,
  createdAt: true,
  endDate: true,
}).extend({
  estimatedValue: z.number().min(0, "Estimated value must be at least $0"),
  duration: z.number().min(1).max(30, "Duration must be between 1-30 days"),
});

export const insertClaimSchema = createInsertSchema(claims).omit({
  id: true,
  claimedAt: true,
  status: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type InsertGiveaway = z.infer<typeof insertGiveawaySchema>;
export type Giveaway = typeof giveaways.$inferSelect;
export type InsertClaim = z.infer<typeof insertClaimSchema>;
export type Claim = typeof claims.$inferSelect;
