import type { 
  User, 
  InsertUser, 
  Category, 
  InsertCategory,
  Article, 
  InsertArticle, 
  UpdateArticle,
  ArticleWithCategory 
} from "@shared/schema";
import { nanoid } from "nanoid";

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

export class MemoryStorage implements IStorage {
  private users: User[] = [];
  private categories: Category[] = [
    { id: nanoid(), name: 'प्रौद्योगिकी', slug: 'technology', createdAt: new Date() },
    { id: nanoid(), name: 'वित्त', slug: 'finance', createdAt: new Date() },
    { id: nanoid(), name: 'व्यापार', slug: 'business', createdAt: new Date() },
    { id: nanoid(), name: 'राजनीति', slug: 'politics', createdAt: new Date() },
    { id: nanoid(), name: 'खेल', slug: 'sports', createdAt: new Date() }
  ];
  private articles: Article[] = [];

  constructor() {
    this.seedInitialData();
  }

  private seedInitialData() {
    const techCategory = this.categories.find(c => c.slug === 'technology')!;
    const financeCategory = this.categories.find(c => c.slug === 'finance')!;

    this.articles = [
      {
        id: nanoid(),
        title: 'भारतीय प्रौद्योगिकी क्षेत्र में AI की क्रांति',
        slug: 'ai-revolution-indian-technology-sector',
        content: `
          <p>कृत्रिम बुद्धिमत्ता (AI) भारतीय प्रौद्योगिकी क्षेत्र में एक नई क्रांति ला रही है। स्टार्टअप से लेकर बड़ी कंपनियों तक, सभी AI के माध्यम से अपने व्यापार को बदल रहे हैं।</p>
          
          <h2>मुख्य विकास</h2>
          <p>भारत में AI का उपयोग विभिन्न क्षेत्रों में हो रहा है:</p>
          <ul>
            <li>स्वास्थ्य सेवा में निदान और उपचार</li>
            <li>कृषि में फसल की निगरानी</li>
            <li>शिक्षा में व्यक्तिगत शिक्षण</li>
            <li>वित्तीय सेवाओं में धोखाधड़ी की रोकथाम</li>
          </ul>
          
          <h2>चुनौतियां और अवसर</h2>
          <p>जहाँ एक ओर AI नई संभावनाएं प्रदान कर रहा है, वहीं डेटा प्राइवेसी और नौकरियों पर प्रभाव जैसी चुनौतियां भी हैं।</p>
        `,
        excerpt: 'कृत्रिम बुद्धिमत्ता भारतीय प्रौद्योगिकी क्षेत्र में क्रांतिकारी बदलाव ला रही है। जानें कैसे AI स्टार्टअप और बड़ी कंपनियों के व्यापार को बदल रहा है।',
        featuredImage: null,
        categoryId: techCategory.id,
        author: 'राहुल शर्मा',
        authorAvatar: null,
        language: 'hi',
        tags: ['AI', 'प्रौद्योगिकी', 'भारत', 'नवाचार'],
        readTime: 5,
        published: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: nanoid(),
        title: 'डिजिटल पेमेंट्स में नया युग',
        slug: 'digital-payments-new-era',
        content: `
          <p>भारत में डिजिटल पेमेंट्स ने एक नया आयाम प्राप्त किया है। UPI से लेकर डिजिटल वॉलेट तक, भुगतान के तरीके पूरी तरह से बदल गए हैं।</p>
          
          <h2>UPI की सफलता</h2>
          <p>यूनिफाइड पेमेंट्स इंटरफेस (UPI) ने भारत में डिजिटल भुगतान को लोकप्रिय बनाया है।</p>
          
          <h2>भविष्य की संभावनाएं</h2>
          <p>क्रिप्टोकरेंसी और सेंट्रल बैंक डिजिटल करेंसी (CBDC) के साथ भुगतान के नए तरीके आ रहे हैं।</p>
        `,
        excerpt: 'भारत में डिजिटल भुगतान की दुनिया कैसे बदल रही है। UPI से CBDC तक - जानें नए युग की शुरुआत के बारे में।',
        featuredImage: null,
        categoryId: financeCategory.id,
        author: 'प्रिया गुप्ता',
        authorAvatar: null,
        language: 'hi',
        tags: ['UPI', 'डिजिटल पेमेंट', 'फिनटेक'],
        readTime: 4,
        published: true,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];
  }

  async getUser(id: string): Promise<User | undefined> {
    return this.users.find(u => u.id === id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return this.users.find(u => u.username === username);
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const user: User = {
      id: nanoid(),
      ...insertUser,
    };
    this.users.push(user);
    return user;
  }

  async getCategories(): Promise<Category[]> {
    return [...this.categories].sort((a, b) => a.name.localeCompare(b.name));
  }

  async getCategoryBySlug(slug: string): Promise<Category | undefined> {
    return this.categories.find(c => c.slug === slug);
  }

  async createCategory(insertCategory: InsertCategory): Promise<Category> {
    const category: Category = {
      id: nanoid(),
      ...insertCategory,
      createdAt: new Date(),
    };
    this.categories.push(category);
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
      language = 'hi',
      search,
      limit = 20,
      offset = 0
    } = options;

    let filtered = this.articles.filter(article => {
      if (article.published !== published) return false;
      if (categoryId && article.categoryId !== categoryId) return false;
      if (language && article.language !== language) return false;
      if (search && !article.title.toLowerCase().includes(search.toLowerCase())) return false;
      return true;
    });

    // Sort by creation date (newest first)
    filtered.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

    // Apply pagination
    const paginated = filtered.slice(offset, offset + limit);

    // Join with categories
    return paginated.map(article => ({
      ...article,
      category: this.categories.find(c => c.id === article.categoryId)!
    }));
  }

  async getArticleBySlug(slug: string): Promise<ArticleWithCategory | undefined> {
    const article = this.articles.find(a => a.slug === slug);
    if (!article) return undefined;

    return {
      ...article,
      category: this.categories.find(c => c.id === article.categoryId)!
    };
  }

  async getArticleById(id: string): Promise<ArticleWithCategory | undefined> {
    const article = this.articles.find(a => a.id === id);
    if (!article) return undefined;

    return {
      ...article,
      category: this.categories.find(c => c.id === article.categoryId)!
    };
  }

  async createArticle(insertArticle: InsertArticle): Promise<Article> {
    const article: Article = {
      id: nanoid(),
      ...insertArticle,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.articles.push(article);
    return article;
  }

  async updateArticle(id: string, updates: UpdateArticle): Promise<Article> {
    const index = this.articles.findIndex(a => a.id === id);
    if (index === -1) throw new Error('Article not found');

    this.articles[index] = {
      ...this.articles[index],
      ...updates,
      updatedAt: new Date(),
    };
    return this.articles[index];
  }

  async deleteArticle(id: string): Promise<void> {
    const index = this.articles.findIndex(a => a.id === id);
    if (index !== -1) {
      this.articles.splice(index, 1);
    }
  }

  async getFeaturedArticle(): Promise<ArticleWithCategory | undefined> {
    const publishedArticles = this.articles
      .filter(a => a.published)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

    if (publishedArticles.length === 0) return undefined;

    const article = publishedArticles[0];
    return {
      ...article,
      category: this.categories.find(c => c.id === article.categoryId)!
    };
  }

  async getArticleStats(): Promise<{ totalArticles: number; todaysViews: number }> {
    const totalArticles = this.articles.filter(a => a.published).length;
    return {
      totalArticles,
      todaysViews: 1200
    };
  }
}