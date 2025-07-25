import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useEffect } from "react";
import "./lib/i18n";
import Home from "@/pages/home";
import Article from "@/pages/article";
import Admin from "@/pages/admin";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/article/:slug" component={Article} />
      <Route path="/admin" component={Admin} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  useEffect(() => {
    // Set document title and meta description for SEO
    document.title = "IndiaDaily - Modern Article Publishing Platform";
    
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', 'Modern article publishing platform for Indian users with multi-language support for finance, technology, news, and lifestyle content.');
    }

    // Add Open Graph meta tags for social sharing
    const ogTitle = document.createElement('meta');
    ogTitle.setAttribute('property', 'og:title');
    ogTitle.setAttribute('content', 'IndiaDaily - Daily Articles in Multiple Indian Languages');
    document.head.appendChild(ogTitle);

    const ogDescription = document.createElement('meta');
    ogDescription.setAttribute('property', 'og:description');
    ogDescription.setAttribute('content', 'Your trusted source for daily articles on finance, technology, and lifestyle. Serving the Indian community with quality content in Hindi, Marathi, Tamil, and English.');
    document.head.appendChild(ogDescription);

    const ogType = document.createElement('meta');
    ogType.setAttribute('property', 'og:type');
    ogType.setAttribute('content', 'website');
    document.head.appendChild(ogType);

    // Add language attribute to html element
    document.documentElement.setAttribute('lang', 'en');
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
