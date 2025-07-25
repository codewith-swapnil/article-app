import { useState } from "react";
import { Bookmark } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useTranslation } from "react-i18next";
import { Link } from "wouter";
import type { ArticleWithCategory } from "@shared/schema";

interface ArticleCardProps {
  article: ArticleWithCategory;
}

export function ArticleCard({ article }: ArticleCardProps) {
  const { t } = useTranslation();
  const [isBookmarked, setIsBookmarked] = useState(false);

  const handleBookmark = () => {
    setIsBookmarked(!isBookmarked);
    // In a real app, this would save to localStorage or user preferences
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat(
      article.language === 'hi' ? 'hi-IN' : 
      article.language === 'mr' ? 'mr-IN' : 
      article.language === 'ta' ? 'ta-IN' : 'en-IN',
      {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      }
    ).format(new Date(date));
  };

  const getCategoryColor = (categoryName: string) => {
    const colors: Record<string, string> = {
      'Finance': 'bg-blue-100 text-blue-800',
      'Technology': 'bg-green-100 text-green-800',
      'News': 'bg-red-100 text-red-800',
      'Lifestyle': 'bg-pink-100 text-pink-800',
      'Sports': 'bg-orange-100 text-orange-800',
      'Environment': 'bg-green-100 text-green-800',
      'वित्त': 'bg-blue-100 text-blue-800',
      'तकनीक': 'bg-green-100 text-green-800',
      'स्वास्थ्य': 'bg-purple-100 text-purple-800',
    };
    return colors[categoryName] || 'bg-slate-100 text-slate-800';
  };

  const getAuthorInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  return (
    <article className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-lg transition-shadow">
      {article.featuredImage && (
        <Link href={`/article/${article.slug}`} className="block">
          <img 
            src={article.featuredImage} 
            alt={article.title}
            className="w-full h-48 object-cover hover:opacity-90 transition-opacity"
          />
        </Link>
      )}
      <div className="p-6">
        <div className="flex items-center space-x-2 mb-3">
          <Badge className={getCategoryColor(article.category.name)}>
            {article.category.name}
          </Badge>
          <span className="text-slate-500 text-sm">
            {t('article.readTime', { time: article.readTime })}
          </span>
        </div>
        
        <Link href={`/article/${article.slug}`}>
          <h3 
            className={`text-xl font-semibold text-slate-900 mb-3 leading-tight hover:text-primary cursor-pointer line-clamp-2 ${
              article.language === 'hi' ? 'font-hindi' : 
              article.language === 'ta' ? 'font-tamil' : ''
            }`}
          >
            {article.title}
          </h3>
        </Link>
        
        <p 
          className={`text-slate-600 mb-4 line-clamp-3 ${
            article.language === 'hi' ? 'font-hindi' : 
            article.language === 'ta' ? 'font-tamil' : ''
          }`}
        >
          {article.excerpt}
        </p>
        
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center">
              <span className="text-white text-xs font-semibold">
                {getAuthorInitials(article.author)}
              </span>
            </div>
            <div>
              <div className={`text-sm font-medium text-slate-900 ${
                article.language === 'hi' ? 'font-hindi' : 
                article.language === 'ta' ? 'font-tamil' : ''
              }`}>
                {article.author}
              </div>
              <div className="text-xs text-slate-500">
                {formatDate(article.createdAt)}
              </div>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleBookmark}
            className={`${isBookmarked ? 'text-primary' : 'text-slate-400 hover:text-primary'}`}
          >
            <Bookmark className={`h-4 w-4 ${isBookmarked ? 'fill-current' : ''}`} />
          </Button>
        </div>
        
        <Link href={`/article/${article.slug}`}>
          <Button variant="outline" className="w-full">
            Read Full Article
          </Button>
        </Link>
      </div>
    </article>
  );
}
