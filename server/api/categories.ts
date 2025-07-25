import { Router } from "express";
import { IStorage } from "../storage";
import { insertCategorySchema } from "@shared/schema";

export function createCategoryRouter(storage: IStorage) {
  const router = Router();

  // Get all categories
  router.get('/', async (req, res) => {
    try {
      const categories = await storage.getCategories();
      res.json(categories);
    } catch (error) {
      res.status(500).json({ 
        message: 'Failed to fetch categories',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  });

  // Get category by slug
  router.get('/:slug', async (req, res) => {
    try {
      const { slug } = req.params;
      const category = await storage.getCategoryBySlug(slug);
      
      if (!category) {
        return res.status(404).json({ message: 'Category not found' });
      }
      
      res.json(category);
    } catch (error) {
      res.status(500).json({ 
        message: 'Failed to fetch category',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  });

  // Create new category
  router.post('/', async (req, res) => {
    try {
      const validatedData = insertCategorySchema.parse(req.body);
      const category = await storage.createCategory(validatedData);
      
      res.status(201).json(category);
    } catch (error) {
      if (error instanceof Error && error.name === 'ZodError') {
        return res.status(400).json({ 
          message: 'Invalid category data',
          errors: error.message
        });
      }
      
      res.status(500).json({ 
        message: 'Failed to create category',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  });

  return router;
}