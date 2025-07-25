import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Plus, Edit, Trash2, Eye, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AdminPanel } from "@/components/admin-panel";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import type { ArticleWithCategory } from "@shared/schema";

export default function Admin() {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [isAdminPanelOpen, setIsAdminPanelOpen] = useState(false);

  // Fetch all articles (including drafts)
  const { data: articles = [], isLoading } = useQuery<ArticleWithCategory[]>({
    queryKey: ['/api/articles', { published: undefined, search: searchQuery || undefined }],
    queryFn: async ({ queryKey }) => {
      const [, params] = queryKey as [string, any];
      const searchParams = new URLSearchParams();
      
      if (params?.search) searchParams.set('search', params.search);
      searchParams.set('published', 'false'); // Get all articles including drafts
      
      const response = await fetch(`/api/articles?${searchParams.toString()}`);
      if (!response.ok) throw new Error('Failed to fetch articles');
      return response.json();
    }
  });

  // Fetch stats
  const { data: stats } = useQuery<{ totalArticles: number; todaysViews: number }>({
    queryKey: ['/api/articles/stats']
  });

  // Delete article mutation
  const deleteArticleMutation = useMutation({
    mutationFn: async (id: string) => {
      return apiRequest('DELETE', `/api/articles/${id}`);
    },
    onSuccess: () => {
      toast({
        title: "Article deleted successfully",
        description: "The article has been removed."
      });
      queryClient.invalidateQueries({ queryKey: ['/api/articles'] });
    },
    onError: () => {
      toast({
        title: "Failed to delete article",
        description: "Please try again.",
        variant: "destructive"
      });
    }
  });

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this article?')) {
      deleteArticleMutation.mutate(id);
    }
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(new Date(date));
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
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-slate-900">Admin Dashboard</h1>
              <p className="text-slate-600 mt-1">Manage your articles and content</p>
            </div>
            <Button onClick={() => setIsAdminPanelOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              New Article
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Articles</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats?.totalArticles || 0}</div>
              <p className="text-xs text-slate-600">Published articles</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Today's Views</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats?.todaysViews || 0}</div>
              <p className="text-xs text-slate-600">Views in last 24 hours</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Draft Articles</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {articles.filter(a => !a.published).length}
              </div>
              <p className="text-xs text-slate-600">Unpublished drafts</p>
            </CardContent>
          </Card>
        </div>

        {/* Articles Table */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>All Articles</CardTitle>
              <div className="relative w-64">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input
                  placeholder="Search articles..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-4">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="animate-pulse flex items-center space-x-4">
                    <div className="h-4 bg-slate-200 rounded flex-1"></div>
                    <div className="h-4 bg-slate-200 rounded w-24"></div>
                    <div className="h-4 bg-slate-200 rounded w-20"></div>
                    <div className="h-4 bg-slate-200 rounded w-32"></div>
                  </div>
                ))}
              </div>
            ) : articles.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-slate-600">No articles found</p>
                <Button 
                  className="mt-4"
                  onClick={() => setIsAdminPanelOpen(true)}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Create your first article
                </Button>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Language</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {articles.map((article) => (
                    <TableRow key={article.id}>
                      <TableCell>
                        <div className="max-w-xs">
                          <div className="font-medium truncate">{article.title}</div>
                          <div className="text-sm text-slate-500 truncate">
                            {article.excerpt}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={getCategoryColor(article.category.name)}>
                          {article.category.name}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">
                          {article.language.toUpperCase()}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant={article.published ? "default" : "secondary"}>
                          {article.published ? "Published" : "Draft"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm text-slate-600">
                        {formatDate(article.createdAt)}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Button variant="ghost" size="sm">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => handleDelete(article.id)}
                            disabled={deleteArticleMutation.isPending}
                          >
                            <Trash2 className="h-4 w-4 text-red-600" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Admin Panel */}
      <AdminPanel
        isOpen={isAdminPanelOpen}
        onClose={() => setIsAdminPanelOpen(false)}
      />
    </div>
  );
}
