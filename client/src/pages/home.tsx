import { useState, useEffect } from "react";
import { Search, Plus } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { HeroSection } from "@/components/hero-section";
import { CategoryFilter } from "@/components/category-filter";
import { ArticleCard } from "@/components/article-card";
import { AdminPanel } from "@/components/admin-panel";
import { LanguageSwitcher } from "@/components/language-switcher";
import { BannerAd, InFeedAd, SidebarAd } from "@/components/ads/google-ads";
import { useTranslation } from "react-i18next";
import { useQuery } from "@tanstack/react-query";
import { useIsMobile } from "@/hooks/use-mobile";
import type { ArticleWithCategory } from "@shared/schema";

export default function Home() {
  const { t, i18n } = useTranslation();
  const isMobile = useIsMobile();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [sortBy, setSortBy] = useState("latest");
  const [isAdminPanelOpen, setIsAdminPanelOpen] = useState(false);

  // Fetch articles based on filters
  const { data: articles = [], isLoading } = useQuery<ArticleWithCategory[]>({
    queryKey: ['/api/articles', { 
      categoryId: selectedCategory || undefined,
      search: searchQuery || undefined 
    }],
    queryFn: async ({ queryKey }) => {
      const [, params] = queryKey as [string, any];
      const searchParams = new URLSearchParams();
      
      if (params?.categoryId) searchParams.set('categoryId', params.categoryId);
      if (params?.search) searchParams.set('search', params.search);
      
      const response = await fetch(`/api/articles?${searchParams.toString()}`);
      if (!response.ok) throw new Error('Failed to fetch articles');
      return response.json();
    }
  });

  // Set initial language from localStorage
  useEffect(() => {
    const savedLanguage = localStorage.getItem('preferred-language');
    if (savedLanguage && i18n) {
      i18n.changeLanguage(savedLanguage);
    }
  }, [i18n]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Search is handled by the query key change
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center">
                <i className="fas fa-newspaper text-white text-sm"></i>
              </div>
              <span className="text-xl font-bold text-slate-900">IndiaDaily</span>
            </div>

            {/* Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              <a href="#" className="text-slate-700 hover:text-primary transition-colors font-medium">
                {t('nav.home')}
              </a>
              <a href="#" className="text-slate-700 hover:text-primary transition-colors font-medium">
                {t('nav.finance')}
              </a>
              <a href="#" className="text-slate-700 hover:text-primary transition-colors font-medium">
                {t('nav.technology')}
              </a>
              <a href="#" className="text-slate-700 hover:text-primary transition-colors font-medium">
                {t('nav.news')}
              </a>
              <a href="#" className="text-slate-700 hover:text-primary transition-colors font-medium">
                {t('nav.lifestyle')}
              </a>
            </nav>

            {/* Search and Actions */}
            <div className="flex items-center space-x-4">
              {!isMobile && (
                <form onSubmit={handleSearch} className="relative">
                  <Input
                    type="text"
                    placeholder={t('search.placeholder')}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-64 pl-10"
                  />
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                </form>
              )}
              
              <LanguageSwitcher />
              
              <Button onClick={() => setIsAdminPanelOpen(true)}>
                {t('nav.admin')}
              </Button>
            </div>
          </div>
        </div>

        {/* Mobile Search */}
        {isMobile && (
          <div className="px-4 pb-4">
            <form onSubmit={handleSearch} className="relative">
              <Input
                type="text"
                placeholder={t('search.placeholder')}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10"
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
            </form>
          </div>
        )}
      </header>

      {/* Hero Section */}
      <HeroSection />

      {/* Top Banner Ad */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <BannerAd className="text-center" />
      </div>

      {/* Category Filter */}
      <CategoryFilter
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
        sortBy={sortBy}
        onSortChange={setSortBy}
      />

      {/* Articles Grid */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-3">
            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden animate-pulse">
                    <div className="w-full h-48 bg-slate-200"></div>
                    <div className="p-6 space-y-4">
                      <div className="flex items-center space-x-2">
                        <div className="h-6 w-20 bg-slate-200 rounded-full"></div>
                        <div className="h-4 w-16 bg-slate-200 rounded"></div>
                      </div>
                      <div className="space-y-2">
                        <div className="h-6 bg-slate-200 rounded"></div>
                        <div className="h-6 bg-slate-200 rounded"></div>
                      </div>
                      <div className="space-y-2">
                        <div className="h-4 bg-slate-200 rounded"></div>
                        <div className="h-4 bg-slate-200 rounded"></div>
                        <div className="h-4 w-2/3 bg-slate-200 rounded"></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : articles.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-slate-600 text-lg">No articles found</p>
                <p className="text-slate-500 text-sm mt-2">
                  {searchQuery ? 'Try adjusting your search terms' : 'Check back later for new content'}
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {articles.map((article, index) => (
                  <div key={article.id}>
                    <ArticleCard article={article} />
                    {/* Insert in-feed ads every 3 articles */}
                    {(index + 1) % 3 === 0 && <InFeedAd />}
                  </div>
                ))}
              </div>
            )}
          </div>
          
          {/* Sidebar with Ads */}
          <div className="lg:col-span-1 space-y-8">
            <SidebarAd />
            <div className="glass-card p-6 rounded-lg">
              <h3 className="font-semibold text-slate-900 mb-4">Popular Categories</h3>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Technology</span>
                  <span className="text-slate-500">24</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Politics</span>
                  <span className="text-slate-500">18</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Sports</span>
                  <span className="text-slate-500">12</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Admin Panel Toggle */}
      <div className="fixed bottom-6 right-6 z-40">
        <Button
          size="lg"
          className="rounded-full w-16 h-16 bg-secondary hover:bg-orange-600"
          onClick={() => setIsAdminPanelOpen(true)}
        >
          <Plus className="h-6 w-6" />
        </Button>
      </div>

      {/* Admin Panel */}
      <AdminPanel
        isOpen={isAdminPanelOpen}
        onClose={() => setIsAdminPanelOpen(false)}
      />

      {/* Footer */}
      <footer className="bg-slate-900 text-white mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center">
                  <i className="fas fa-newspaper text-white text-sm"></i>
                </div>
                <span className="text-xl font-bold">IndiaDaily</span>
              </div>
              <p className="text-slate-300 text-sm leading-relaxed">
                {t('footer.description')}
              </p>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">{t('footer.categories')}</h3>
              <div className="space-y-2 text-sm">
                <a href="#" className="text-slate-300 hover:text-white transition-colors block">
                  {t('nav.finance')}
                </a>
                <a href="#" className="text-slate-300 hover:text-white transition-colors block">
                  {t('nav.technology')}
                </a>
                <a href="#" className="text-slate-300 hover:text-white transition-colors block">
                  {t('nav.news')}
                </a>
                <a href="#" className="text-slate-300 hover:text-white transition-colors block">
                  {t('nav.lifestyle')}
                </a>
                <a href="#" className="text-slate-300 hover:text-white transition-colors block">
                  {t('nav.sports')}
                </a>
              </div>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">{t('footer.languages')}</h3>
              <div className="space-y-2 text-sm">
                <a href="#" className="text-slate-300 hover:text-white transition-colors block">English</a>
                <a href="#" className="text-slate-300 hover:text-white transition-colors block">हिंदी (Hindi)</a>
                <a href="#" className="text-slate-300 hover:text-white transition-colors block">मराठी (Marathi)</a>
                <a href="#" className="text-slate-300 hover:text-white transition-colors block">தமிழ் (Tamil)</a>
              </div>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">{t('footer.connect')}</h3>
              <div className="space-y-2 text-sm">
                <a href="#" className="text-slate-300 hover:text-white transition-colors block">
                  {t('footer.aboutUs')}
                </a>
                <a href="#" className="text-slate-300 hover:text-white transition-colors block">
                  {t('footer.contact')}
                </a>
                <a href="#" className="text-slate-300 hover:text-white transition-colors block">
                  {t('footer.privacy')}
                </a>
                <a href="#" className="text-slate-300 hover:text-white transition-colors block">
                  {t('footer.terms')}
                </a>
              </div>
            </div>
          </div>
          
          <div className="border-t border-slate-700 mt-8 pt-8 text-center text-sm text-slate-400">
            <p>{t('footer.copyright')}</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
