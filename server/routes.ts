import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertMaterialSchema, insertSubmissionSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Materials endpoints
  app.get("/api/materials/:sessionId", async (req, res) => {
    try {
      const materials = await storage.getMaterialsBySession(req.params.sessionId);
      res.json(materials);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch materials" });
    }
  });

  app.post("/api/materials", async (req, res) => {
    try {
      const material = insertMaterialSchema.parse(req.body);
      const created = await storage.createMaterial(material);
      res.json(created);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ error: "Invalid material data", details: error.errors });
      } else {
        res.status(500).json({ error: "Failed to create material" });
      }
    }
  });

  app.put("/api/materials/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const updates = req.body;
      const updated = await storage.updateMaterial(id, updates);
      if (updated) {
        res.json(updated);
      } else {
        res.status(404).json({ error: "Material not found" });
      }
    } catch (error) {
      res.status(500).json({ error: "Failed to update material" });
    }
  });

  app.delete("/api/materials/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      await storage.deleteMaterial(id);
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Failed to delete material" });
    }
  });

  // Projects endpoints
  app.get("/api/projects", async (req, res) => {
    try {
      const materials = req.query.materials as string;
      if (materials) {
        const materialTypes = materials.split(',');
        const projects = await storage.getProjectsByMaterials(materialTypes);
        res.json(projects);
      } else {
        const projects = await storage.getAllProjects();
        res.json(projects);
      }
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch projects" });
    }
  });

  app.get("/api/projects/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const project = await storage.getProject(id);
      if (project) {
        res.json(project);
      } else {
        res.status(404).json({ error: "Project not found" });
      }
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch project" });
    }
  });

  // Submissions endpoints
  app.post("/api/submissions", async (req, res) => {
    try {
      const submission = insertSubmissionSchema.parse(req.body);
      const created = await storage.createSubmission(submission);
      res.json(created);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ error: "Invalid submission data", details: error.errors });
      } else {
        res.status(500).json({ error: "Failed to create submission" });
      }
    }
  });

  app.get("/api/submissions", async (req, res) => {
    try {
      const publicOnly = req.query.public === 'true';
      const submissions = publicOnly 
        ? await storage.getPublicSubmissions()
        : await storage.getAllSubmissions();
      res.json(submissions);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch submissions" });
    }
  });

  // AI scan simulation endpoint
  app.post("/api/scan", async (req, res) => {
    try {
      // Simulate AI scanning delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Return mock identified materials
      const mockMaterials = [
        { name: "Plastic Bottle", type: "PET Plastic", quantity: 2 },
        { name: "Cardboard Box", type: "Corrugated Cardboard", quantity: 1 },
        { name: "Aluminum Can", type: "Beverage Can", quantity: 3 }
      ];
      
      res.json(mockMaterials);
    } catch (error) {
      res.status(500).json({ error: "Failed to process scan" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
