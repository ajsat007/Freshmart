import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, Filter, Grid, List } from 'lucide-react';
import { useSearchParams } from 'react-router';
import { Product, Category } from '@/shared/types';
import ProductCard from '@/react-app/components/ProductCard';

export default function Products() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState('name');
  
  const [searchParams, setSearchParams] = useSearchParams();

  useEffect(() => {
    const category = searchParams.get('category');
    if (category) {
      setSelectedCategory(category);
    }
  }, [searchParams]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const [categoriesRes] = await Promise.all([
          fetch('/api/categories')
        ]);

        if (categoriesRes.ok) {
          const cats = await categoriesRes.json();
          setCategories(cats);
        }
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setIsLoading(true);
        const url = selectedCategory ? `/api/products?category=${selectedCategory}` : '/api/products';
        const response = await fetch(url);
        
        if (response.ok) {
          const data = await response.json();
          setProducts(data);
        }
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, [selectedCategory]);

  const filteredProducts = products
    .filter(product =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description?.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      switch (sortBy) {
        case 'price':
          return a.price - b.price;
        case 'price-desc':
          return b.price - a.price;
        case 'name':
          return a.name.localeCompare(b.name);
        default:
          return 0;
      }
    });

  const handleCategoryChange = (categorySlug: string) => {
    setSelectedCategory(categorySlug);
    if (categorySlug) {
      setSearchParams({ category: categorySlug });
    } else {
      setSearchParams({});
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Our Grocery Selection</h1>
          <p className="text-xl text-gray-600">
            Fresh produce and daily essentials for your home
          </p>
        </motion.div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <motion.aside
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="lg:w-64 space-y-6"
          >
            {/* Search */}
            <div className="bg-white p-6 rounded-xl shadow-sm">
              <h3 className="font-semibold text-gray-900 mb-4 flex items-center">
                <Search className="w-5 h-5 mr-2" />
                Search
              </h3>
              <input
                type="text"
                placeholder="Search groceries..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>

            {/* Categories */}
            <div className="bg-white p-6 rounded-xl shadow-sm">
              <h3 className="font-semibold text-gray-900 mb-4 flex items-center">
                <Filter className="w-5 h-5 mr-2" />
                Categories
              </h3>
              <div className="space-y-2">
                <button
                  onClick={() => handleCategoryChange('')}
                  className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                    selectedCategory === ''
                      ? 'bg-green-100 text-green-600 font-medium'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  All Categories
                </button>
                {categories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => handleCategoryChange(category.slug)}
                    className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                      selectedCategory === category.slug
                        ? 'bg-green-100 text-green-600 font-medium'
                        : 'text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    {category.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Sort */}
            <div className="bg-white p-6 rounded-xl shadow-sm">
              <h3 className="font-semibold text-gray-900 mb-4">Sort By</h3>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                <option value="name">Name</option>
                <option value="price">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
              </select>
            </div>
          </motion.aside>

          {/* Main Content */}
          <main className="flex-1">
            {/* Toolbar */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="bg-white p-4 rounded-xl shadow-sm mb-6 flex items-center justify-between"
            >
              <p className="text-gray-600">
                Showing {filteredProducts.length} products
              </p>
              
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-lg transition-colors ${
                    viewMode === 'grid'
                      ? 'bg-green-100 text-green-600'
                      : 'text-gray-400 hover:text-gray-600'
                  }`}
                >
                  <Grid className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-lg transition-colors ${
                    viewMode === 'list'
                      ? 'bg-green-100 text-green-600'
                      : 'text-gray-400 hover:text-gray-600'
                  }`}
                >
                  <List className="w-5 h-5" />
                </button>
              </div>
            </motion.div>

            {/* Products Grid */}
            {filteredProducts.length > 0 ? (
              <div className={`grid gap-6 ${
                viewMode === 'grid' 
                  ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3' 
                  : 'grid-cols-1'
              }`}>
                {filteredProducts.map((product, index) => (
                  <ProductCard key={product.id} product={product} index={index} />
                ))}
              </div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6 }}
                className="text-center py-12"
              >
                <p className="text-gray-500 text-lg">No products found.</p>
              </motion.div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
