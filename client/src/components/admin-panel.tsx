import { useState } from "react";
import { X, Plus, Edit, BarChart3, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ImageUpload } from "@/components/ui/image-upload";
import { useTranslation } from "react-i18next";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import type { Category } from "@shared/schema";

interface AdminPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AdminPanel({ isOpen, onClose }: AdminPanelProps) {
  const { t } = useTranslation();
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    excerpt: '',
    categoryId: '',
    language: 'en',
    tags: '',
    featuredImage: '',
    author: 'Admin',
    published: false
  });

  // Fetch categories
  const { data: categories = [] } = useQuery<Category[]>({
    queryKey: ['/api/categories'],
    enabled: isOpen
  });

  // Fetch stats
  const { data: stats } = useQuery<{ totalArticles: number; todaysViews: number }>({
    queryKey: ['/api/articles/stats'],
    enabled: isOpen
  });

  // Fetch recent articles for admin panel
  const { data: recentArticles = [] } = useQuery({
    queryKey: ['/api/articles', { published: false, limit: 5 }],
    enabled: isOpen
  });

  // Create article mutation
  const createArticleMutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      const payload = {
        ...data,
        tags: data.tags.split(',').map(tag => tag.trim()).filter(Boolean),
        excerpt: data.excerpt || data.content.substring(0, 150) + '...'
      };
      return apiRequest('POST', '/api/articles', payload);
    },
    onSuccess: () => {
      toast({
        title: "Article created successfully",
        description: "Your article has been published."
      });
      setFormData({
        title: '',
        content: '',
        excerpt: '',
        categoryId: '',
        language: 'en',
        tags: '',
        featuredImage: '',
        author: 'Admin',
        published: false
      });
      queryClient.invalidateQueries({ queryKey: ['/api/articles'] });
    },
    onError: () => {
      toast({
        title: "Failed to create article",
        description: "Please try again.",
        variant: "destructive"
      });
    }
  });

  const handleSubmit = (published: boolean) => {
    if (!formData.title || !formData.content || !formData.categoryId) {
      toast({
        title: "Missing required fields",
        description: "Please fill in title, content, and category.",
        variant: "destructive"
      });
      return;
    }

    createArticleMutation.mutate({
      ...formData,
      published
    });
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleImageUploaded = (url: string) => {
    setFormData(prev => ({
      ...prev,
      featuredImage: url
    }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50">
      <div className="absolute right-0 top-0 h-full w-full max-w-md bg-white shadow-xl">
        <div className="p-6 border-b border-slate-200">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-slate-900">{t('admin.title')}</h2>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-5 w-5" />
            </Button>
          </div>
        </div>
        
        <div className="p-6 space-y-6 overflow-y-auto h-full pb-20">
          {/* Quick Stats */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">
                {stats?.totalArticles || 0}
              </div>
              <div className="text-sm text-blue-800">Articles</div>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <div className="text-2xl font-bold text-green-600">
                {stats?.todaysViews || 0}
              </div>
              <div className="text-sm text-green-800">Views Today</div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="space-y-3">
            <h3 className="font-semibold text-slate-900">{t('admin.quickActions')}</h3>
            <Button className="w-full">
              <Plus className="h-4 w-4 mr-2" />
              {t('admin.newArticle')}
            </Button>
            <Button variant="outline" className="w-full">
              <Edit className="h-4 w-4 mr-2" />
              {t('admin.draftArticles')} ({recentArticles.filter((a: any) => !a.published).length})
            </Button>
            <Button variant="outline" className="w-full">
              <BarChart3 className="h-4 w-4 mr-2" />
              {t('admin.analytics')}
            </Button>
          </div>

          {/* Recent Articles */}
          <div className="space-y-3">
            <h3 className="font-semibold text-slate-900">{t('admin.recentArticles')}</h3>
            <div className="space-y-2">
              {recentArticles.slice(0, 3).map((article: any) => (
                <div key={article.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                  <div>
                    <div className="text-sm font-medium text-slate-900 truncate">
                      {article.title}
                    </div>
                    <div className="text-xs text-slate-500">
                      {article.published ? 'Published' : 'Draft'}
                    </div>
                  </div>
                  <Button variant="ghost" size="sm">
                    <Edit className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </div>

          {/* Article Form */}
          <div className="space-y-4">
            <h3 className="font-semibold text-slate-900">{t('admin.createNew')}</h3>
            <div className="space-y-3">
              <Input
                type="text"
                placeholder={t('admin.articleTitle')}
                value={formData.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
              />
              
              <Select value={formData.categoryId} onValueChange={(value) => handleInputChange('categoryId', value)}>
                <SelectTrigger>
                  <SelectValue placeholder={t('admin.selectCategory')} />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <Select value={formData.language} onValueChange={(value) => handleInputChange('language', value)}>
                <SelectTrigger>
                  <SelectValue placeholder={t('admin.selectLanguage')} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="en">English</SelectItem>
                  <SelectItem value="hi">हिंदी (Hindi)</SelectItem>
                  <SelectItem value="mr">मराठी (Marathi)</SelectItem>
                  <SelectItem value="ta">தமிழ் (Tamil)</SelectItem>
                </SelectContent>
              </Select>
              
              <ImageUpload onImageUploaded={handleImageUploaded} />
              
              <Textarea
                placeholder={t('admin.articleContent')}
                rows={4}
                value={formData.content}
                onChange={(e) => handleInputChange('content', e.target.value)}
              />
              
              <Input
                type="text"
                placeholder={t('admin.tags')}
                value={formData.tags}
                onChange={(e) => handleInputChange('tags', e.target.value)}
              />
              
              <div className="flex space-x-2">
                <Button
                  className="flex-1"
                  onClick={() => handleSubmit(true)}
                  disabled={createArticleMutation.isPending}
                >
                  {createArticleMutation.isPending ? 'Publishing...' : t('admin.publish')}
                </Button>
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => handleSubmit(false)}
                  disabled={createArticleMutation.isPending}
                >
                  {t('admin.saveDraft')}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
