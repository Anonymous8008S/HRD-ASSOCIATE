import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Index from "./pages/Index";
import Properties from "./pages/Properties";
import PropertyDetail from "./pages/PropertyDetail";
import About from "./pages/About";
import PackersMovers from "./pages/Packersmovers";
import Contact from "./pages/Contact";
import Blog from "./pages/Blog";
import Commercial from "./pages/Commercial";
import Projects from "./pages/Projects";
import PostProperty from "./pages/PostProperty";
import NotFound from "./pages/NotFound";
import ScrollToTop from "@/components/ScrolltoTop";
import CommercialDetail from "@/pages/CommercialDetail";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <ScrollToTop />
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/properties" element={<Properties />} />
          <Route path="/properties/:id" element={<PropertyDetail />} />
          <Route path="/packers-movers" element={<PackersMovers />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/commercial" element={<Commercial />} />
          <Route path="/commercial/:id" element={<CommercialDetail />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/post-property" element={<PostProperty />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
