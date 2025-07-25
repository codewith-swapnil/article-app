import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/indiadaily';
    await mongoose.connect(mongoURI);
    console.log('MongoDB connected successfully');
    
    // Seed some initial data if collections are empty
    await seedInitialData();
  } catch (error) {
    console.error('MongoDB connection error:', error);
    // Don't exit process in development, just warn
    console.warn('Continuing without MongoDB - using in-memory fallback');
  }
};

const seedInitialData = async () => {
  try {
    // Check if categories exist
    const categoriesCount = await Category.countDocuments();
    if (categoriesCount === 0) {
      const categories = [
        { name: 'प्रौद्योगिकी', slug: 'technology' },
        { name: 'वित्त', slug: 'finance' },
        { name: 'व्यापार', slug: 'business' },
        { name: 'राजनीति', slug: 'politics' },
        { name: 'खेल', slug: 'sports' }
      ];
      
      for (const cat of categories) {
        await Category.create(cat);
      }
      console.log('✓ Initial categories created');
    }

    // Check if articles exist
    const articlesCount = await Article.countDocuments();
    if (articlesCount === 0) {
      const techCategory = await Category.findOne({ slug: 'technology' });
      const financeCategory = await Category.findOne({ slug: 'finance' });
      
      if (techCategory && financeCategory) {
        const articles = [
          {
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
            featuredImage: '/api/placeholder/800/400',
            categoryId: techCategory._id,
            author: 'राहुल शर्मा',
            language: 'hi',
            tags: ['AI', 'प्रौद्योगिकी', 'भारत', 'नवाचार'],
            readTime: 5,
            published: true
          },
          {
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
            featuredImage: '/api/placeholder/800/400',
            categoryId: financeCategory._id,
            author: 'प्रिया गुप्ता',
            language: 'hi',
            tags: ['UPI', 'डिजिटल पेमेंट', 'फिनटेक'],
            readTime: 4,
            published: true
          }
        ];
        
        for (const article of articles) {
          await Article.create(article);
        }
        console.log('✓ Sample articles created');
      }
    }
  } catch (error) {
    console.error('Error seeding data:', error);
  }
};

// User Schema
const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true }
}, { timestamps: true });

// Category Schema
const categorySchema = new mongoose.Schema({
  name: { type: String, required: true },
  slug: { type: String, required: true, unique: true }
}, { timestamps: true });

// Article Schema
const articleSchema = new mongoose.Schema({
  title: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  content: { type: String, required: true },
  excerpt: { type: String, required: true },
  featuredImage: { type: String },
  categoryId: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
  author: { type: String, required: true },
  authorAvatar: { type: String },
  language: { type: String, required: true, default: 'hi' },
  tags: [{ type: String }],
  readTime: { type: Number, required: true, default: 5 },
  published: { type: Boolean, required: true, default: false }
}, { timestamps: true });

export const User = mongoose.model('User', userSchema);
export const Category = mongoose.model('Category', categorySchema);
export const Article = mongoose.model('Article', articleSchema);

export { connectDB };