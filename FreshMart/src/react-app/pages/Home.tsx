import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, ShoppingBag, Leaf, Truck, Shield, Clock } from 'lucide-react';
import { Link } from 'react-router';
import { Product, Category } from '@/shared/types';
import ProductCard from '@/react-app/components/ProductCard';

export default function Home() {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [productsRes, categoriesRes] = await Promise.all([
          fetch('/api/products'),
          fetch('/api/categories')
        ]);

        if (productsRes.ok && categoriesRes.ok) {
          const products = await productsRes.json();
          const cats = await categoriesRes.json();
          
          setFeaturedProducts(products.slice(0, 6));
          setCategories(cats);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const features = [
    {
      icon: Truck,
      title: 'Free Delivery',
      description: 'Free delivery on orders over ₹500 in Pune'
    },
    {
      icon: Leaf,
      title: 'Fresh & Organic',
      description: 'Farm-fresh produce delivered daily'
    },
    {
      icon: Clock,
      title: 'Quick Service',
      description: 'Same day delivery within 2 hours'
    }
  ];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-green-600 via-emerald-600 to-teal-700">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1542838132-92c53300491e?w=1200')] bg-cover bg-center opacity-15"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h1 className="text-5xl lg:text-6xl font-bold text-white mb-6">
                Fresh & Local
                <span className="block bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
                  Groceries
                </span>
              </h1>
              <p className="text-xl text-green-100 mb-8 leading-relaxed">
                Your neighborhood grocery store in Pune. Fresh fruits, vegetables, and daily essentials delivered to your doorstep.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/products">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex items-center space-x-2 bg-white text-green-600 px-8 py-4 rounded-xl font-semibold hover:bg-gray-50 transition-colors"
                  >
                    <ShoppingBag className="w-5 h-5" />
                    <span>Shop Now</span>
                    <ArrowRight className="w-5 h-5" />
                  </motion.button>
                </Link>
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative"
            >
              <div className="relative z-10">
                <img
                  src="https://images.unsplash.com/photo-1506617564039-2f3b650b7010?w=600"
                  alt="Fresh Groceries"
                  className="rounded-2xl shadow-2xl"
                />
              </div>
              <div className="absolute -top-4 -left-4 w-full h-full bg-gradient-to-br from-yellow-400 to-orange-500 rounded-2xl -z-10"></div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="text-center p-6"
              >
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-green-600 to-emerald-600 rounded-full mb-4">
                  <feature.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Shop by Category
            </h2>
            <p className="text-xl text-gray-600">
              Explore our fresh grocery categories and daily essentials
            </p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {categories.map((category, index) => (
              <motion.div
                key={category.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                whileHover={{ scale: 1.05 }}
              >
                <Link
                  to={`/products?category=${category.slug}`}
                  className="block bg-white rounded-xl p-6 text-center shadow-sm hover:shadow-lg transition-all duration-300"
                >
                  <div className="w-12 h-12 bg-gradient-to-r from-green-600 to-emerald-600 rounded-full mx-auto mb-4 flex items-center justify-center">
                    <Leaf className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-1">
                    {category.name}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {category.description}
                  </p>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Featured Products
            </h2>
            <p className="text-xl text-gray-600">
              Fresh picks and daily essentials for your family
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredProducts.map((product, index) => (
              <ProductCard key={product.id} product={product} index={index} />
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="text-center mt-12"
          >
            <Link to="/products">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-gradient-to-r from-green-600 to-emerald-600 text-white px-8 py-4 rounded-xl font-semibold hover:from-green-700 hover:to-emerald-700 transition-all duration-200"
              >
                View All Products
              </motion.button>
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
