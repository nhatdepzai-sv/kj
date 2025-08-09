import { pgTable, text, serial, integer } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const medications = pgTable("medications", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  genericName: text("generic_name").notNull(),
  manufacturer: text("manufacturer").notNull(),
  ndc: text("ndc").notNull(),
  shape: text("shape").notNull(),
  color: text("color").notNull(),
  imprint: text("imprint").notNull(),
  size: text("size").notNull(),
  dosage: text("dosage").notNull(),
  usage: text("usage").notNull(),
  imageUrl: text("image_url").notNull(),
  confidence: text("confidence").notNull().default("high"),
});

export const insertMedicationSchema = createInsertSchema(medications).omit({
  id: true,
});

export const searchMedicationSchema = z.object({
  shape: z.string().optional(),
  color: z.string().optional(),
  imprint: z.string().optional(),
  size: z.string().optional(),
});

export type InsertMedication = z.infer<typeof insertMedicationSchema>;
export type Medication = typeof medications.$inferSelect;
export type SearchMedication = z.infer<typeof searchMedicationSchema>;

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
