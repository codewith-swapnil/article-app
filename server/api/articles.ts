import { Router } from "express";
import { IStorage } from "../storage";
import { insertArticleSchema, updateArticleSchema } from "@shared/schema";

export function createArticleRouter(storage: IStorage) {
  const router = Router();

  // Get all articles with filtering
  router.get('/', async (req, res) => {
    try {
      const { 
        published = 'true',
        categoryId,
        language,
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
      res.status(500).json({ 
        message: 'Failed to fetch articles',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  });

  // Get featured article
  router.get('/featured', async (req, res) => {
    try {
      const article = await storage.getFeaturedArticle();
      if (!article) {
        return res.status(404).json({ message: 'No featured article found' });
      }
      res.json(article);
    } catch (error) {
      res.status(500).json({ 
        message: 'Failed to fetch featured article',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  });

  // Get article stats
  router.get('/stats', async (req, res) => {
    try {
      const stats = await storage.getArticleStats();
      res.json(stats);
    } catch (error) {
      res.status(500).json({ 
        message: 'Failed to fetch article stats',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  });

  // Get single article by slug
  router.get('/:slug', async (req, res) => {
    try {
      const { slug } = req.params;
      const article = await storage.getArticleBySlug(slug);
      
      if (!article) {
        return res.status(404).json({ message: 'Article not found' });
      }
      
      res.json(article);
    } catch (error) {
      res.status(500).json({ 
        message: 'Failed to fetch article',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  });

  // Create new article
  router.post('/', async (req, res) => {
    try {
      const validatedData = insertArticleSchema.parse(req.body);
      const article = await storage.createArticle(validatedData);
      
      res.status(201).json(article);
    } catch (error) {
      if (error instanceof Error && error.name === 'ZodError') {
        return res.status(400).json({ 
          message: 'Invalid article data',
          errors: error.message
        });
      }
      
      res.status(500).json({ 
        message: 'Failed to create article',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  });

  // Update article
  router.put('/:id', async (req, res) => {
    try {
      const { id } = req.params;
      const validatedData = updateArticleSchema.parse(req.body);
      
      const article = await storage.updateArticle(id, validatedData);
      res.json(article);
    } catch (error) {
      if (error instanceof Error && error.name === 'ZodError') {
        return res.status(400).json({ 
          message: 'Invalid article data',
          errors: error.message
        });
      }
      
      if (error instanceof Error && error.message === 'Article not found') {
        return res.status(404).json({ message: 'Article not found' });
      }
      
      res.status(500).json({ 
        message: 'Failed to update article',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  });

  // Delete article
  router.delete('/:id', async (req, res) => {
    try {
      const { id } = req.params;
      await storage.deleteArticle(id);
      
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ 
        message: 'Failed to delete article',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  });

  return router;
}