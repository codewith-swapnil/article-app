import { useState } from "react";
import { Bookmark, Clock, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useTranslation } from "react-i18next";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import type { ArticleWithCategory } from "@shared/schema";

export function HeroSection() {
  const { t } = useTranslation();
  const [isBookmarked, setIsBookmarked] = useState(false);

  const { data: featuredArticle, isLoading } = useQuery<ArticleWithCategory>({
    queryKey: ['/api/articles/featured']
  });

  const handleBookmark = () => {
    setIsBookmarked(!isBookmarked);
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(new Date(date));
  };

  const getAuthorInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  if (isLoading) {
    return (
      <section className="bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center animate-pulse">
            <div className="space-y-6">
              <div className="flex items-center space-x-2">
                <div className="h-6 w-20 bg-slate-200 rounded"></div>
                <div className="h-4 w-16 bg-slate-200 rounded"></div>
              </div>
              <div className="space-y-3">
                <div className="h-8 bg-slate-200 rounded"></div>
                <div className="h-8 bg-slate-200 rounded"></div>
                <div className="h-8 w-3/4 bg-slate-200 rounded"></div>
              </div>
              <div className="space-y-2">
                <div className="h-4 bg-slate-200 rounded"></div>
                <div className="h-4 bg-slate-200 rounded"></div>
                <div className="h-4 w-2/3 bg-slate-200 rounded"></div>
              </div>
            </div>
            <div className="h-96 bg-slate-200 rounded-2xl"></div>
          </div>
        </div>
      </section>
    );
  }

  if (!featuredArticle) {
    return (
      <section className="bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <p className="text-slate-600">No featured article available</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 to-purple-50/30 animate-float"></div>
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="animate-slide-in-right">
            <div className="flex items-center space-x-2 mb-4">
              <Badge className="bg-gradient-to-r from-secondary to-orange-500 text-white px-4 py-2 animate-pulse">
                {t('article.featured')}
              </Badge>
              <span className="text-slate-500 text-sm">{featuredArticle.category.name}</span>
              <span className="text-slate-300">•</span>
              <span className="text-slate-500 text-sm flex items-center">
                <Clock className="h-3 w-3 mr-1" />
                {t('article.readTime', { time: featuredArticle.readTime })}
              </span>
            </div>
            
            <Link href={`/article/${featuredArticle.slug}`}>
              <h1 className={`text-4xl font-bold text-slate-900 mb-6 leading-tight hover:text-primary cursor-pointer transition-colors ${
                featuredArticle.language === 'hi' ? 'font-hindi' : 
                featuredArticle.language === 'ta' ? 'font-tamil' : ''
              }`}>
                {featuredArticle.title}
              </h1>
            </Link>
            
            <p className={`text-lg text-slate-600 mb-8 leading-relaxed ${
              featuredArticle.language === 'hi' ? 'font-hindi' : 
              featuredArticle.language === 'ta' ? 'font-tamil' : ''
            }`}>
              {featuredArticle.excerpt}
            </p>
            
            <div className="flex items-center space-x-4 mb-6">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center">
                  <span className="text-white font-semibold text-sm">
                    {getAuthorInitials(featuredArticle.author)}
                  </span>
                </div>
                <div>
                  <div className={`text-sm font-semibold text-slate-900 ${
                    featuredArticle.language === 'hi' ? 'font-hindi' : 
                    featuredArticle.language === 'ta' ? 'font-tamil' : ''
                  }`}>
                    {featuredArticle.author}
                  </div>
                  <div className="text-xs text-slate-500">
                    {formatDate(featuredArticle.createdAt)}
                  </div>
                </div>
              </div>
              

            </div>
            
            <div className="flex space-x-4">
              <Link href={`/article/${featuredArticle.slug}`}>
                <Button size="lg" className="btn-gradient text-white border-none hover:text-white px-8">
                  {t('article.readFull')}
                </Button>
              </Link>
              <Button 
                variant="outline" 
                size="lg" 
                onClick={handleBookmark}
                className={`glass-card border-2 ${isBookmarked ? 'text-primary border-primary bg-primary/10' : 'border-primary/30'}`}
              >
                <Bookmark className={`mr-2 h-4 w-4 ${isBookmarked ? 'fill-current' : ''}`} />
                {t('article.bookmark')}
              </Button>
            </div>
          </div>
          
          <div className="relative animate-fade-in-up">
            <div className="relative z-10">
              <img 
                src={featuredArticle.featuredImage || 'https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=800&h=400&fit=crop'} 
                alt={featuredArticle.title}
                className="w-full h-96 object-cover rounded-2xl shadow-2xl hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-2xl"></div>
            </div>
            <div className="absolute -inset-4 bg-gradient-to-r from-primary/20 to-secondary/20 rounded-2xl blur-2xl animate-pulse"></div>
          </div>
        </div>
      </div>
    </section>
  );
}
