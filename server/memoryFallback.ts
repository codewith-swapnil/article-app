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
    const businessCategory = this.categories.find(c => c.slug === 'business')!;
    const politicsCategory = this.categories.find(c => c.slug === 'politics')!;
    const sportsCategory = this.categories.find(c => c.slug === 'sports')!;

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
        featuredImage: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&h=400&fit=crop',
        categoryId: techCategory.id,
        author: 'राहुल शर्मा',
        authorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
        language: 'hi',
        tags: ['AI', 'प्रौद्योगिकी', 'भारत', 'नवाचार'],
        readTime: 5,
        published: true,
        createdAt: new Date('2024-01-15'),
        updatedAt: new Date('2024-01-15')
      },
      {
        id: nanoid(),
        title: 'डिजिटल पेमेंट्स में नया युग',
        slug: 'digital-payments-new-era',
        content: `
          <p>भारत में डिजिटल पेमेंट्स ने एक नया आयाम प्राप्त किया है। UPI से लेकर डिजिटल वॉलेट तक, भुगतान के तरीके पूरी तरह से बदल गए हैं।</p>
          
          <h2>UPI की सफलता</h2>
          <p>यूनिफाइड पेमेंट्स इंटरफेस (UPI) ने भारत में डिजिटल भुगतान को लोकप्रिय बनाया है। 2023-24 में UPI लेनदेन 131 बिलियन से अधिक हो गया।</p>
          
          <h2>भविष्य की संभावनाएं</h2>
          <p>क्रिप्टोकरेंसी और सेंट्रल बैंक डिजिटल करेंसी (CBDC) के साथ भुगतान के नए तरीके आ रहे हैं।</p>
        `,
        excerpt: 'भारत में डिजिटल भुगतान की दुनिया कैसे बदल रही है। UPI से CBDC तक - जानें नए युग की शुरुआत के बारे में।',
        featuredImage: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&h=400&fit=crop',
        categoryId: financeCategory.id,
        author: 'प्रिया गुप्ता',
        authorAvatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b5bb?w=150&h=150&fit=crop&crop=face',
        language: 'hi',
        tags: ['UPI', 'डिजिटल पेमेंट', 'फिनटेक'],
        readTime: 4,
        published: true,
        createdAt: new Date('2024-01-12'),
        updatedAt: new Date('2024-01-12')
      },
      {
        id: nanoid(),
        title: 'भारतीय स्टार्टअप इकोसिस्टम में नई लहर',
        slug: 'indian-startup-ecosystem-new-wave',
        content: `
          <p>भारतीय स्टार्टअप इकोसिस्टम में 2024 एक महत्वपूर्ण वर्ष साबित हो रहा है। नए यूनिकॉर्न्स से लेकर इनोवेटिव सोल्यूशन्स तक, उद्यमिता की नई दिशा देखने को मिल रही है।</p>
          
          <h2>फंडिंग ट्रेंड्स</h2>
          <p>इस साल भारतीय स्टार्टअप्स ने $8.8 बिलियन से अधिक फंडिंग जुटाई है, जो पिछले साल की तुलना में 15% अधिक है।</p>
          
          <h2>नए सेक्टर्स</h2>
          <ul>
            <li>हेल्थटेक में तेजी से वृद्धि</li>
            <li>एड-टेक में नवाचार</li>
            <li>क्लीन एनर्जी स्टार्टअप्स</li>
            <li>रूरल टेक सोल्यूशन्स</li>
          </ul>
        `,
        excerpt: 'भारतीय स्टार्टअप इकोसिस्टम में 2024 की नई लहर। फंडिंग ट्रेंड्स, नए सेक्टर्स और यूनिकॉर्न्स की कहानी।',
        featuredImage: 'https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=800&h=400&fit=crop',
        categoryId: businessCategory.id,
        author: 'अनिल कुमार',
        authorAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
        language: 'hi',
        tags: ['स्टार्टअप', 'यूनिकॉर्न', 'फंडिंग', 'इनोवेशन'],
        readTime: 6,
        published: true,
        createdAt: new Date('2024-01-10'),
        updatedAt: new Date('2024-01-10')
      },
      {
        id: nanoid(),
        title: 'भारतीय क्रिकेट टीम का विश्व कप प्रदर्शन',
        slug: 'indian-cricket-team-world-cup-performance',
        content: `
          <p>भारतीय क्रिकेट टीम का हाल का प्रदर्शन शानदार रहा है। युवा खिलाड़ियों के साथ अनुभवी खिलाड़ियों का संयोजन टीम को नई ऊंचाइयों तक ले जा रहा है।</p>
          
          <h2>मुख्य हाइलाइट्स</h2>
          <ul>
            <li>विराट कोहली का रिकॉर्ड ब्रेकिंग प्रदर्शन</li>
            <li>जसप्रीत बुमराह की घातक गेंदबाजी</li>
            <li>शुभमन गिल की निरंतरता</li>
            <li>हार्दिक पांड्या की ऑलराउंड भूमिका</li>
          </ul>
          
          <h2>आगामी चुनौतियां</h2>
          <p>आने वाले टूर्नामेंट में टीम को कड़ी चुनौतियों का सामना करना होगा।</p>
        `,
        excerpt: 'भारतीय क्रिकेट टीम के शानदार प्रदर्शन की पूरी कहानी। स्टार प्लेयर्स और उनके रिकॉर्ड्स।',
        featuredImage: 'https://images.unsplash.com/photo-1531415074968-036ba1b575da?w=800&h=400&fit=crop',
        categoryId: sportsCategory.id,
        author: 'संजय तिवारी',
        authorAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face',
        language: 'hi',
        tags: ['क्रिकेट', 'भारतीय टीम', 'विश्व कप', 'खेल'],
        readTime: 4,
        published: true,
        createdAt: new Date('2024-01-08'),
        updatedAt: new Date('2024-01-08')
      },
      {
        id: nanoid(),
        title: 'भारत की नई शिक्षा नीति: बदलाव की दिशा',
        slug: 'india-new-education-policy-direction',
        content: `
          <p>भारत की नई शिक्षा नीति 2020 ने शिक्षा क्षेत्र में व्यापक बदलाव की नींव रखी है। पारंपरिक शिक्षा से हटकर स्किल-बेस्ड लर्निंग पर जोर दिया जा रहा है।</p>
          
          <h2>मुख्य बदलाव</h2>
          <ul>
            <li>5+3+3+4 की नई संरचना</li>
            <li>मातृभाषा में शिक्षा को बढ़ावा</li>
            <li>डिजिटल एजुकेशन का विस्तार</li>
            <li>रिसर्च और इनोवेशन पर फोकस</li>
          </ul>
          
          <h2>चुनौतियां और समाधान</h2>
          <p>नई नीति के क्रियान्वयन में कई चुनौतियां हैं, लेकिन सही दिशा में काम हो रहा है।</p>
        `,
        excerpt: 'भारत की नई शिक्षा नीति 2020 कैसे बदल रही है देश की शिक्षा व्यवस्था। जानें मुख्य बदलाव और उनके प्रभाव।',
        featuredImage: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800&h=400&fit=crop',
        categoryId: politicsCategory.id,
        author: 'डॉ. मीरा शर्मा',
        authorAvatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
        language: 'hi',
        tags: ['शिक्षा नीति', 'शिक्षा', 'नीति', 'सुधार'],
        readTime: 7,
        published: true,
        createdAt: new Date('2024-01-05'),
        updatedAt: new Date('2024-01-05')
      },
      {
        id: nanoid(),
        title: 'Indian Tech Giants Leading Global Innovation',
        slug: 'indian-tech-giants-global-innovation',
        content: `
          <p>Indian technology companies are increasingly becoming global leaders in innovation. From software services to cutting-edge research, Indian firms are making their mark worldwide.</p>
          
          <h2>Key Developments</h2>
          <ul>
            <li>Tata Consultancy Services expanding AI capabilities</li>
            <li>Infosys leading digital transformation projects</li>
            <li>HCL Technologies winning major cloud contracts</li>
            <li>Wipro's breakthrough in quantum computing research</li>
          </ul>
          
          <h2>Global Recognition</h2>
          <p>International clients are increasingly recognizing the value and innovation capabilities of Indian tech companies.</p>
        `,
        excerpt: 'How Indian technology giants are leading innovation on the global stage. Success stories and future prospects.',
        featuredImage: 'https://images.unsplash.com/photo-1551434678-e076c223a692?w=800&h=400&fit=crop',
        categoryId: techCategory.id,
        author: 'Rajesh Patel',
        authorAvatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&h=150&fit=crop&crop=face',
        language: 'en',
        tags: ['Technology', 'Global', 'Innovation', 'India'],
        readTime: 5,
        published: true,
        createdAt: new Date('2024-01-03'),
        updatedAt: new Date('2024-01-03')
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
      title: insertArticle.title,
      slug: insertArticle.slug,
      content: insertArticle.content,
      excerpt: insertArticle.excerpt,
      featuredImage: insertArticle.featuredImage || null,
      categoryId: insertArticle.categoryId,
      author: insertArticle.author,
      authorAvatar: insertArticle.authorAvatar || null,
      language: insertArticle.language,
      tags: insertArticle.tags || null,
      readTime: insertArticle.readTime,
      published: insertArticle.published,
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