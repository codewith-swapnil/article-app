import { User, Category, Article } from './mongodb';
import type { 
  User as UserType, 
  InsertUser, 
  Category as CategoryType, 
  InsertCategory,
  Article as ArticleType, 
  InsertArticle, 
  UpdateArticle,
  ArticleWithCategory 
} from "@shared/schema";

export interface IStorage {
  getUser(id: string): Promise<UserType | undefined>;
  getUserByUsername(username: string): Promise<UserType | undefined>;
  createUser(user: InsertUser): Promise<UserType>;
  
  // Categories
  getCategories(): Promise<CategoryType[]>;
  getCategoryBySlug(slug: string): Promise<CategoryType | undefined>;
  createCategory(category: InsertCategory): Promise<CategoryType>;
  
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
  createArticle(article: InsertArticle): Promise<ArticleType>;
  updateArticle(id: string, updates: UpdateArticle): Promise<ArticleType>;
  deleteArticle(id: string): Promise<void>;
  getFeaturedArticle(): Promise<ArticleWithCategory | undefined>;
  getArticleStats(): Promise<{ totalArticles: number; todaysViews: number }>;
}

export class MongoStorage implements IStorage {
  async getUser(id: string): Promise<UserType | undefined> {
    const user = await User.findById(id);
    return user ? { id: user._id.toString(), username: user.username, password: user.password } : undefined;
  }

  async getUserByUsername(username: string): Promise<UserType | undefined> {
    const user = await User.findOne({ username });
    return user ? { id: user._id.toString(), username: user.username, password: user.password } : undefined;
  }

  async createUser(insertUser: InsertUser): Promise<UserType> {
    const user = new User(insertUser);
    const savedUser = await user.save();
    return { id: savedUser._id.toString(), username: savedUser.username, password: savedUser.password };
  }

  async getCategories(): Promise<CategoryType[]> {
    const categories = await Category.find().sort({ name: 1 });
    return categories.map(cat => ({
      id: cat._id.toString(),
      name: cat.name,
      slug: cat.slug,
      createdAt: cat.createdAt
    }));
  }

  async getCategoryBySlug(slug: string): Promise<CategoryType | undefined> {
    const category = await Category.findOne({ slug });
    return category ? {
      id: category._id.toString(),
      name: category.name,
      slug: category.slug,
      createdAt: category.createdAt
    } : undefined;
  }

  async createCategory(insertCategory: InsertCategory): Promise<CategoryType> {
    const category = new Category(insertCategory);
    const savedCategory = await category.save();
    return {
      id: savedCategory._id.toString(),
      name: savedCategory.name,
      slug: savedCategory.slug,
      createdAt: savedCategory.createdAt
    };
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
      language = 'hi',
      search,
      limit = 20,
      offset = 0
    } = options;

    const query: any = { published };

    if (categoryId) {
      query.categoryId = categoryId;
    }

    if (language) {
      query.language = language;
    }

    if (search) {
      query.title = { $regex: search, $options: 'i' };
    }

    const articles = await Article.find(query)
      .populate('categoryId')
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip(offset);

    return articles.map(article => {
      const category = article.categoryId as any;
      return {
        id: article._id.toString(),
        title: article.title,
        slug: article.slug,
        content: article.content,
        excerpt: article.excerpt,
        featuredImage: article.featuredImage || null,
        categoryId: category._id.toString(),
        author: article.author,
        authorAvatar: article.authorAvatar || null,
        language: article.language,
        tags: article.tags || null,
        readTime: article.readTime,
        published: article.published,
        createdAt: article.createdAt,
        updatedAt: article.updatedAt,
        category: {
          id: category._id.toString(),
          name: category.name,
          slug: category.slug,
          createdAt: category.createdAt
        }
      };
    });
  }

  async getArticleBySlug(slug: string): Promise<ArticleWithCategory | undefined> {
    const article = await Article.findOne({ slug }).populate('categoryId');
    
    if (!article) return undefined;

    const category = article.categoryId as any;
    return {
      id: article._id.toString(),
      title: article.title,
      slug: article.slug,
      content: article.content,
      excerpt: article.excerpt,
      featuredImage: article.featuredImage || null,
      categoryId: category._id.toString(),
      author: article.author,
      authorAvatar: article.authorAvatar || null,
      language: article.language,
      tags: article.tags || null,
      readTime: article.readTime,
      published: article.published,
      createdAt: article.createdAt,
      updatedAt: article.updatedAt,
      category: {
        id: category._id.toString(),
        name: category.name,
        slug: category.slug,
        createdAt: category.createdAt
      }
    };
  }

  async getArticleById(id: string): Promise<ArticleWithCategory | undefined> {
    const article = await Article.findById(id).populate('categoryId');
    
    if (!article) return undefined;

    const category = article.categoryId as any;
    return {
      id: article._id.toString(),
      title: article.title,
      slug: article.slug,
      content: article.content,
      excerpt: article.excerpt,
      featuredImage: article.featuredImage || null,
      categoryId: category._id.toString(),
      author: article.author,
      authorAvatar: article.authorAvatar || null,
      language: article.language,
      tags: article.tags || null,
      readTime: article.readTime,
      published: article.published,
      createdAt: article.createdAt,
      updatedAt: article.updatedAt,
      category: {
        id: category._id.toString(),
        name: category.name,
        slug: category.slug,
        createdAt: category.createdAt
      }
    };
  }

  async createArticle(insertArticle: InsertArticle): Promise<ArticleType> {
    const article = new Article(insertArticle);
    const savedArticle = await article.save();
    return {
      id: savedArticle._id.toString(),
      title: savedArticle.title,
      slug: savedArticle.slug,
      content: savedArticle.content,
      excerpt: savedArticle.excerpt,
      featuredImage: savedArticle.featuredImage || null,
      categoryId: savedArticle.categoryId.toString(),
      author: savedArticle.author,
      authorAvatar: savedArticle.authorAvatar || null,
      language: savedArticle.language,
      tags: savedArticle.tags || null,
      readTime: savedArticle.readTime,
      published: savedArticle.published,
      createdAt: savedArticle.createdAt,
      updatedAt: savedArticle.updatedAt
    };
  }

  async updateArticle(id: string, updates: UpdateArticle): Promise<ArticleType> {
    const article = await Article.findByIdAndUpdate(id, updates, { new: true });
    if (!article) throw new Error('Article not found');
    
    return {
      id: article._id.toString(),
      title: article.title,
      slug: article.slug,
      content: article.content,
      excerpt: article.excerpt,
      featuredImage: article.featuredImage || null,
      categoryId: article.categoryId.toString(),
      author: article.author,
      authorAvatar: article.authorAvatar || null,
      language: article.language,
      tags: article.tags || null,
      readTime: article.readTime,
      published: article.published,
      createdAt: article.createdAt,
      updatedAt: article.updatedAt
    };
  }

  async deleteArticle(id: string): Promise<void> {
    await Article.findByIdAndDelete(id);
  }

  async getFeaturedArticle(): Promise<ArticleWithCategory | undefined> {
    const article = await Article.findOne({ published: true })
      .populate('categoryId')
      .sort({ createdAt: -1 });

    if (!article) return undefined;

    const category = article.categoryId as any;
    return {
      id: article._id.toString(),
      title: article.title,
      slug: article.slug,
      content: article.content,
      excerpt: article.excerpt,
      featuredImage: article.featuredImage || null,
      categoryId: category._id.toString(),
      author: article.author,
      authorAvatar: article.authorAvatar || null,
      language: article.language,
      tags: article.tags || null,
      readTime: article.readTime,
      published: article.published,
      createdAt: article.createdAt,
      updatedAt: article.updatedAt,
      category: {
        id: category._id.toString(),
        name: category.name,
        slug: category.slug,
        createdAt: category.createdAt
      }
    };
  }

  async getArticleStats(): Promise<{ totalArticles: number; todaysViews: number }> {
    const totalArticles = await Article.countDocuments({ published: true });
    
    return {
      totalArticles,
      todaysViews: 1200 // This would be implemented with a proper analytics system
    };
  }
}

export const storage = new MongoStorage();