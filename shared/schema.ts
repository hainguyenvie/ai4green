import { pgTable, text, serial, integer, boolean, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const materials = pgTable("materials", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  type: text("type").notNull(),
  quantity: integer("quantity").notNull().default(1),
  scanSessionId: text("scan_session_id").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const projects = pgTable("projects", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  category: text("category").notNull(),
  difficulty: text("difficulty").notNull(),
  duration: integer("duration").notNull(), // in minutes
  ageRange: text("age_range").notNull(),
  rating: integer("rating").default(0),
  materials: jsonb("materials").$type<string[]>().notNull(),
  steps: jsonb("steps").$type<Array<{
    number: number;
    title: string;
    description: string;
    imageUrl?: string;
    checklist?: string[];
  }>>().notNull(),
  objectives: jsonb("objectives").$type<string[]>().notNull(),
  concepts: jsonb("concepts").$type<Record<string, string>>().notNull(),
  questions: jsonb("questions").$type<string[]>().notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const submissions = pgTable("submissions", {
  id: serial("id").primaryKey(),
  projectId: integer("project_id").references(() => projects.id),
  title: text("title").notNull(),
  photos: jsonb("photos").$type<string[]>().default([]),
  difficulty: text("difficulty").notNull(),
  satisfaction: integer("satisfaction").notNull(),
  safety: text("safety").notNull(),
  feedback: text("feedback"),
  learningOutcomes: jsonb("learning_outcomes").$type<string[]>().default([]),
  shareWithCommunity: boolean("share_with_community").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertMaterialSchema = createInsertSchema(materials).omit({
  id: true,
  createdAt: true,
});

export const insertProjectSchema = createInsertSchema(projects).omit({
  id: true,
  createdAt: true,
});

export const insertSubmissionSchema = createInsertSchema(submissions).omit({
  id: true,
  createdAt: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type InsertMaterial = z.infer<typeof insertMaterialSchema>;
export type Material = typeof materials.$inferSelect;
export type InsertProject = z.infer<typeof insertProjectSchema>;
export type Project = typeof projects.$inferSelect;
export type InsertSubmission = z.infer<typeof insertSubmissionSchema>;
export type Submission = typeof submissions.$inferSelect;
