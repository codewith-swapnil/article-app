import { useQuery } from "@tanstack/react-query";
import { useRoute } from "wouter";
import { ArrowLeft, Clock, User, Bookmark, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useTranslation } from "react-i18next";
import type { ArticleWithCategory } from "@shared/schema";

export default function Article() {
  const { t } = useTranslation();
  const [match, params] = useRoute("/article/:slug");
  
  const { data: article, isLoading, error } = useQuery<ArticleWithCategory>({
    queryKey: ['/api/articles', params?.slug],
    queryFn: async () => {
      const response = await fetch(`/api/articles/${params?.slug}`);
      if (!response.ok) throw new Error('Article not found');
      return response.json();
    },
    enabled: !!params?.slug
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="animate-pulse space-y-8">
            <div className="space-y-4">
              <div className="h-4 w-20 bg-slate-200 rounded"></div>
              <div className="h-8 bg-slate-200 rounded"></div>
              <div className="h-8 bg-slate-200 rounded"></div>
              <div className="h-8 w-3/4 bg-slate-200 rounded"></div>
            </div>
            <div className="h-96 bg-slate-200 rounded-2xl"></div>
            <div className="space-y-4">
              <div className="h-4 bg-slate-200 rounded"></div>
              <div className="h-4 bg-slate-200 rounded"></div>
              <div className="h-4 bg-slate-200 rounded"></div>
              <div className="h-4 w-2/3 bg-slate-200 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !article) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-slate-900 mb-4">Article Not Found</h1>
          <p className="text-slate-600 mb-8">The article you're looking for doesn't exist.</p>
          <Button onClick={() => window.history.back()}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Go Back
          </Button>
        </div>
      </div>
    );
  }

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat(
      article.language === 'hi' ? 'hi-IN' : 
      article.language === 'mr' ? 'mr-IN' : 
      article.language === 'ta' ? 'ta-IN' : 'en-IN',
      {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      }
    ).format(new Date(date));
  };

  const getAuthorInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const getCategoryColor = (categoryName: string) => {
    const colors: Record<string, string> = {
      'Finance': 'bg-blue-100 text-blue-800',
      'Technology': 'bg-green-100 text-green-800',
      'News': 'bg-red-100 text-red-800',
      'Lifestyle': 'bg-pink-100 text-pink-800',
      'Sports': 'bg-orange-100 text-orange-800',
    };
    return colors[categoryName] || 'bg-slate-100 text-slate-800';
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="border-b border-slate-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Button variant="ghost" onClick={() => window.history.back()}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
        </div>
      </div>

      {/* Article Content */}
      <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Article Header */}
        <header className="mb-8">
          <div className="flex items-center space-x-2 mb-4">
            <Badge className={getCategoryColor(article.category.name)}>
              {article.category.name}
            </Badge>
            <span className="text-slate-500 text-sm flex items-center">
              <Clock className="h-3 w-3 mr-1" />
              {t('article.readTime', { time: article.readTime })}
            </span>
          </div>

          <h1 className={`text-4xl font-bold text-slate-900 mb-6 leading-tight ${
            article.language === 'hi' ? 'font-hindi' : 
            article.language === 'ta' ? 'font-tamil' : ''
          }`}>
            {article.title}
          </h1>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center">
                <span className="text-white font-semibold">
                  {getAuthorInitials(article.author)}
                </span>
              </div>
              <div>
                <div className={`text-lg font-semibold text-slate-900 ${
                  article.language === 'hi' ? 'font-hindi' : 
                  article.language === 'ta' ? 'font-tamil' : ''
                }`}>
                  {article.author}
                </div>
                <div className="text-sm text-slate-500">
                  {formatDate(article.createdAt)}
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm">
                <Bookmark className="h-4 w-4 mr-2" />
                Save
              </Button>
              <Button variant="outline" size="sm">
                <Share2 className="h-4 w-4 mr-2" />
                Share
              </Button>
            </div>
          </div>
        </header>

        {/* Featured Image */}
        {article.featuredImage && (
          <div className="mb-8">
            <img 
              src={article.featuredImage} 
              alt={article.title}
              className="w-full h-auto rounded-2xl shadow-lg"
            />
          </div>
        )}

        {/* Article Content */}
        <div className={`prose prose-lg max-w-none ${
          article.language === 'hi' ? 'font-hindi' : 
          article.language === 'ta' ? 'font-tamil' : ''
        }`}>
          <div className="whitespace-pre-wrap text-slate-700 leading-relaxed">
            {article.content}
          </div>
        </div>

        {/* Tags */}
        {article.tags && article.tags.length > 0 && (
          <div className="mt-8 pt-8 border-t border-slate-200">
            <h3 className="text-sm font-semibold text-slate-900 mb-3">Tags</h3>
            <div className="flex flex-wrap gap-2">
              {article.tags.map((tag, index) => (
                <Badge key={index} variant="secondary" className="text-xs">
                  {tag}
                </Badge>
              ))}
            </div>
          </div>
        )}
      </article>
    </div>
  );
}
