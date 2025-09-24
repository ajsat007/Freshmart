import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router';
import { motion } from 'framer-motion';
import { ArrowLeft, Star, ShoppingCart, Heart, Share2, Truck, Shield, RotateCcw } from 'lucide-react';
import { Product } from '@/shared/types';
import { useCart } from '@/react-app/context/CartContext';
import { useAuth } from '@getmocha/users-service/react';

export default function ProductDetail() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  
  const { addToCart } = useCart();
  const { user, redirectToLogin } = useAuth();

  useEffect(() => {
    const fetchProduct = async () => {
      if (!slug) return;
      
      try {
        const response = await fetch(`/api/products/${slug}`);
        if (response.ok) {
          const data = await response.json();
          setProduct(data);
        } else {
          navigate('/products');
        }
      } catch (error) {
        console.error('Error fetching product:', error);
        navigate('/products');
      } finally {
        setIsLoading(false);
      }
    };

    fetchProduct();
  }, [slug, navigate]);

  const handleAddToCart = async () => {
    if (!user) {
      redirectToLogin();
      return;
    }
    
    if (!product) return;
    
    await addToCart(product.id, quantity);
    // Show success notification or redirect to cart
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 text-lg">Product not found.</p>
      </div>
    );
  }

  const images = [product.image_url].filter((url): url is string => Boolean(url));
  const features = [
    { icon: Truck, text: 'Free shipping on orders over $50' },
    { icon: Shield, text: '30-day money-back guarantee' },
    { icon: RotateCcw, text: 'Easy returns and exchanges' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <motion.button
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4 }}
          onClick={() => navigate(-1)}
          className="flex items-center space-x-2 text-gray-600 hover:text-purple-600 mb-8 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back to Products</span>
        </motion.button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Product Images */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
              <div className="aspect-square">
                <img
                  src={images[selectedImage] || product.image_url || '/placeholder-product.jpg'}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              </div>
              
              {images.length > 1 && (
                <div className="p-4 flex space-x-2 overflow-x-auto">
                  {images.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImage(index)}
                      className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-colors ${
                        selectedImage === index ? 'border-purple-600' : 'border-gray-200'
                      }`}
                    >
                      <img src={image} alt="" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>
          </motion.div>

          {/* Product Info */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-2">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                    ))}
                  </div>
                  <span className="text-gray-600">(4.5) • 128 reviews</span>
                </div>
                
                <div className="flex items-center space-x-2">
                  <button className="p-2 text-gray-600 hover:text-red-600 transition-colors">
                    <Heart className="w-5 h-5" />
                  </button>
                  <button className="p-2 text-gray-600 hover:text-purple-600 transition-colors">
                    <Share2 className="w-5 h-5" />
                  </button>
                </div>
              </div>

              <h1 className="text-3xl font-bold text-gray-900 mb-4">{product.name}</h1>
              
              <div className="flex items-center space-x-4 mb-6">
                <span className="text-3xl font-bold text-purple-600">
                  ${product.price.toFixed(2)}
                </span>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  product.stock_quantity > 0 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-red-100 text-red-800'
                }`}>
                  {product.stock_quantity > 0 ? 'In Stock' : 'Out of Stock'}
                </span>
              </div>

              <p className="text-gray-600 mb-8 leading-relaxed">
                {product.description}
              </p>

              {/* Quantity Selector */}
              <div className="flex items-center space-x-4 mb-8">
                <span className="font-medium text-gray-900">Quantity:</span>
                <div className="flex items-center border border-gray-300 rounded-lg">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-3 py-2 hover:bg-gray-50 transition-colors"
                  >
                    -
                  </button>
                  <span className="px-4 py-2 font-medium">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="px-3 py-2 hover:bg-gray-50 transition-colors"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Add to Cart Button */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleAddToCart}
                disabled={product.stock_quantity === 0}
                className={`w-full py-4 rounded-xl font-semibold transition-all duration-200 flex items-center justify-center space-x-2 ${
                  product.stock_quantity > 0
                    ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:from-purple-700 hover:to-blue-700'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                <ShoppingCart className="w-5 h-5" />
                <span>
                  {product.stock_quantity > 0 ? 'Add to Cart' : 'Out of Stock'}
                </span>
              </motion.button>

              {/* Features */}
              <div className="mt-8 space-y-4">
                {features.map((feature, index) => (
                  <div key={index} className="flex items-center space-x-3 text-gray-600">
                    <feature.icon className="w-5 h-5 text-purple-600" />
                    <span>{feature.text}</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>

        {/* Product Details Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-16 bg-white rounded-2xl shadow-lg p-8"
        >
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Product Details</h2>
          <div className="prose max-w-none">
            <p className="text-gray-600 leading-relaxed">
              {product.description || "This product combines premium quality with exceptional design. Crafted with attention to detail and built to last, it's the perfect addition to your collection."}
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
