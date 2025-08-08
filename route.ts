import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { searchMedicationSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Get all medications
  app.get("/api/medications", async (req, res) => {
    try {
      const medications = await storage.getAllMedications();
      res.json(medications);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch medications" });
    }
  });

  // Get specific medication
  app.get("/api/medications/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid medication ID" });
      }
      
      const medication = await storage.getMedication(id);
      if (!medication) {
        return res.status(404).json({ message: "Medication not found" });
      }
      
      res.json(medication);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch medication" });
    }
  });

  // Search medications
  app.post("/api/medications/search", async (req, res) => {
    try {
      const searchCriteria = searchMedicationSchema.parse(req.body);
      const results = await storage.searchMedications(searchCriteria);
      res.json(results);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ 
          message: "Invalid search criteria",
          errors: error.errors
        });
      }
      res.status(500).json({ message: "Search failed" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
