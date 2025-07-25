import { 
  type User, 
  type InsertUser, 
  type Category, 
  type InsertCategory,
  type Article, 
  type InsertArticle, 
  type UpdateArticle,
  type ArticleWithCategory,
  users,
  categories,
  articles
} from "@shared/schema";
import { db } from "./db";
import { eq, desc, ilike, and, inArray } from "drizzle-orm";

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Categories
  getCategories(): Promise<Category[]>;
  getCategoryBySlug(slug: string): Promise<Category | undefined>;
  createCategory(category: InsertCategory): Promise<Category>;
  
  // Articles
  getArticles(options?: {
    published?: boolean;
    categoryId?: string;
    language?: string;
    search?: string;
    limit?: number;
    offset?: number;
  }): Promise<ArticleWithCategory[]>;
  getArticleBySlug(slug: string): Promise<ArticleWithCategory | undefined>;
  getArticleById(id: string): Promise<ArticleWithCategory | undefined>;
  createArticle(article: InsertArticle): Promise<Article>;
  updateArticle(id: string, updates: UpdateArticle): Promise<Article>;
  deleteArticle(id: string): Promise<void>;
  getFeaturedArticle(): Promise<ArticleWithCategory | undefined>;
  getArticleStats(): Promise<{ totalArticles: number; todaysViews: number }>;
}

export class DatabaseStorage implements IStorage {
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(insertUser)
      .returning();
    return user;
  }

  async getCategories(): Promise<Category[]> {
    return await db.select().from(categories).orderBy(categories.name);
  }

  async getCategoryBySlug(slug: string): Promise<Category | undefined> {
    const [category] = await db.select().from(categories).where(eq(categories.slug, slug));
    return category || undefined;
  }

  async createCategory(insertCategory: InsertCategory): Promise<Category> {
    const [category] = await db
      .insert(categories)
      .values(insertCategory)
      .returning();
    return category;
  }

  async getArticles(options: {
    published?: boolean;
    categoryId?: string;
    language?: string;
    search?: string;
    limit?: number;
    offset?: number;
  } = {}): Promise<ArticleWithCategory[]> {
    const {
      published = true,
      categoryId,
      language,
      search,
      limit = 20,
      offset = 0
    } = options;

    let query = db
      .select()
      .from(articles)
      .leftJoin(categories, eq(articles.categoryId, categories.id))
      .where(eq(articles.published, published));

    const conditions = [eq(articles.published, published)];

    if (categoryId) {
      conditions.push(eq(articles.categoryId, categoryId));
    }

    if (language) {
      conditions.push(eq(articles.language, language));
    }

    if (search) {
      conditions.push(ilike(articles.title, `%${search}%`));
    }

    if (conditions.length > 1) {
      query = query.where(and(...conditions));
    }

    const results = await query
      .orderBy(desc(articles.createdAt))
      .limit(limit)
      .offset(offset);

    return results.map(result => ({
      ...result.articles,
      category: result.categories!
    }));
  }

  async getArticleBySlug(slug: string): Promise<ArticleWithCategory | undefined> {
    const [result] = await db
      .select()
      .from(articles)
      .leftJoin(categories, eq(articles.categoryId, categories.id))
      .where(eq(articles.slug, slug));

    if (!result) return undefined;

    return {
      ...result.articles,
      category: result.categories!
    };
  }

  async getArticleById(id: string): Promise<ArticleWithCategory | undefined> {
    const [result] = await db
      .select()
      .from(articles)
      .leftJoin(categories, eq(articles.categoryId, categories.id))
      .where(eq(articles.id, id));

    if (!result) return undefined;

    return {
      ...result.articles,
      category: result.categories!
    };
  }

  async createArticle(insertArticle: InsertArticle): Promise<Article> {
    const [article] = await db
      .insert(articles)
      .values({
        ...insertArticle,
        updatedAt: new Date()
      })
      .returning();
    return article;
  }

  async updateArticle(id: string, updates: UpdateArticle): Promise<Article> {
    const [article] = await db
      .update(articles)
      .set({
        ...updates,
        updatedAt: new Date()
      })
      .where(eq(articles.id, id))
      .returning();
    return article;
  }

  async deleteArticle(id: string): Promise<void> {
    await db.delete(articles).where(eq(articles.id, id));
  }

  async getFeaturedArticle(): Promise<ArticleWithCategory | undefined> {
    const [result] = await db
      .select()
      .from(articles)
      .leftJoin(categories, eq(articles.categoryId, categories.id))
      .where(eq(articles.published, true))
      .orderBy(desc(articles.createdAt))
      .limit(1);

    if (!result) return undefined;

    return {
      ...result.articles,
      category: result.categories!
    };
  }

  async getArticleStats(): Promise<{ totalArticles: number; todaysViews: number }> {
    const totalArticles = await db.select().from(articles).where(eq(articles.published, true));
    
    return {
      totalArticles: totalArticles.length,
      todaysViews: 1200 // This would be implemented with a proper analytics system
    };
  }
}

export const storage = new DatabaseStorage();
