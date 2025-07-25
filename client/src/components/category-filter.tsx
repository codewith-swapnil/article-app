import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Filter } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useQuery } from "@tanstack/react-query";
import type { Category } from "@shared/schema";

interface CategoryFilterProps {
  selectedCategory: string;
  onCategoryChange: (categoryId: string) => void;
  sortBy: string;
  onSortChange: (sortBy: string) => void;
}

export function CategoryFilter({ 
  selectedCategory, 
  onCategoryChange, 
  sortBy, 
  onSortChange 
}: CategoryFilterProps) {
  const { t } = useTranslation();

  const { data: categories = [] } = useQuery<Category[]>({
    queryKey: ['/api/categories']
  });

  const categoryButtons = [
    { id: '', name: t('categories.all') },
    ...categories.map(cat => ({ id: cat.id, name: cat.name }))
  ];

  return (
    <section className="bg-slate-100 border-y border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between py-4">
          <div className="flex items-center space-x-6 overflow-x-auto">
            {categoryButtons.map((category) => (
              <Button
                key={category.id}
                variant={selectedCategory === category.id ? "default" : "ghost"}
                onClick={() => onCategoryChange(category.id)}
                className="whitespace-nowrap"
              >
                {category.name}
              </Button>
            ))}
          </div>
          
          <div className="hidden lg:flex items-center space-x-2 text-sm text-slate-600">
            <Filter className="h-4 w-4" />
            <span>Filter by:</span>
            <Select value={sortBy} onValueChange={onSortChange}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="latest">Latest</SelectItem>
                <SelectItem value="popular">Most Read</SelectItem>
                <SelectItem value="trending">Trending</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
    </section>
  );
}
