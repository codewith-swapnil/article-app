import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertArticleSchema, updateArticleSchema, insertCategorySchema } from "@shared/schema";
import multer from "multer";
import path from "path";
import { z } from "zod";

// Configure multer for image uploads
const upload = multer({
  dest: 'uploads/',
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|webp/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'));
    }
  }
});

function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function estimateReadTime(content: string): number {
  const wordsPerMinute = 200;
  const wordCount = content.split(/\s+/).length;
  return Math.ceil(wordCount / wordsPerMinute);
}

export async function registerRoutes(app: Express): Promise<Server> {
  // Categories
  app.get("/api/categories", async (req, res) => {
    try {
      const categories = await storage.getCategories();
      res.json(categories);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch categories" });
    }
  });

  app.post("/api/categories", async (req, res) => {
    try {
      const categoryData = insertCategorySchema.parse(req.body);
      categoryData.slug = generateSlug(categoryData.name);
      
      const category = await storage.createCategory(categoryData);
      res.status(201).json(category);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid category data", errors: error.errors });
      } else {
        res.status(500).json({ message: "Failed to create category" });
      }
    }
  });

  // Articles
  app.get("/api/articles", async (req, res) => {
    try {
      const {
        published = 'true',
        categoryId,
        language = 'en',
        search,
        limit = '20',
        offset = '0'
      } = req.query;

      const articles = await storage.getArticles({
        published: published === 'true',
        categoryId: categoryId as string,
        language: language as string,
        search: search as string,
        limit: parseInt(limit as string),
        offset: parseInt(offset as string)
      });

      res.json(articles);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch articles" });
    }
  });

  app.get("/api/articles/featured", async (req, res) => {
    try {
      const article = await storage.getFeaturedArticle();
      if (!article) {
        return res.status(404).json({ message: "No featured article found" });
      }
      res.json(article);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch featured article" });
    }
  });

  app.get("/api/articles/stats", async (req, res) => {
    try {
      const stats = await storage.getArticleStats();
      res.json(stats);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch stats" });
    }
  });

  app.get("/api/articles/:slug", async (req, res) => {
    try {
      const article = await storage.getArticleBySlug(req.params.slug);
      if (!article) {
        return res.status(404).json({ message: "Article not found" });
      }
      res.json(article);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch article" });
    }
  });

  app.post("/api/articles", async (req, res) => {
    try {
      const articleData = insertArticleSchema.parse(req.body);
      articleData.slug = generateSlug(articleData.title);
      articleData.readTime = estimateReadTime(articleData.content);
      
      const article = await storage.createArticle(articleData);
      res.status(201).json(article);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid article data", errors: error.errors });
      } else {
        res.status(500).json({ message: "Failed to create article" });
      }
    }
  });

  app.put("/api/articles/:id", async (req, res) => {
    try {
      const updates = updateArticleSchema.parse(req.body);
      if (updates.title) {
        updates.slug = generateSlug(updates.title);
      }
      if (updates.content) {
        updates.readTime = estimateReadTime(updates.content);
      }
      
      const article = await storage.updateArticle(req.params.id, updates);
      res.json(article);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid article data", errors: error.errors });
      } else {
        res.status(500).json({ message: "Failed to update article" });
      }
    }
  });

  app.delete("/api/articles/:id", async (req, res) => {
    try {
      await storage.deleteArticle(req.params.id);
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Failed to delete article" });
    }
  });

  // Image upload
  app.post("/api/upload", upload.single('image'), async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: "No image file provided" });
      }

      // In a real application, you would upload to a cloud storage service
      // For now, return a placeholder URL
      const imageUrl = `/uploads/${req.file.filename}`;
      res.json({ url: imageUrl });
    } catch (error) {
      res.status(500).json({ message: "Failed to upload image" });
    }
  });

  // Serve uploaded images
  app.use('/uploads', (req, res, next) => {
    // In production, images should be served from a CDN or cloud storage
    res.setHeader('Access-Control-Allow-Origin', '*');
    next();
  });

  // Search endpoint
  app.get("/api/search", async (req, res) => {
    try {
      const { q, language = 'en' } = req.query;
      
      if (!q || typeof q !== 'string') {
        return res.status(400).json({ message: "Search query is required" });
      }

      const articles = await storage.getArticles({
        search: q,
        language: language as string,
        limit: 10
      });

      res.json(articles);
    } catch (error) {
      res.status(500).json({ message: "Search failed" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
