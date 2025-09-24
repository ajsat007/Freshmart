import { motion } from 'framer-motion';
import { ShoppingCart, Star } from 'lucide-react';
import { Link } from 'react-router';
import { Product } from '@/shared/types';
import { useCart } from '@/react-app/context/CartContext';
import { useAuth } from '@getmocha/users-service/react';

interface ProductCardProps {
  product: Product;
  index?: number;
}

export default function ProductCard({ product, index = 0 }: ProductCardProps) {
  const { addToCart } = useCart();
  const { user, redirectToLogin } = useAuth();

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!user) {
      redirectToLogin();
      return;
    }
    
    await addToCart(product.id, 1);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
      whileHover={{ y: -5 }}
      className="group"
    >
      <Link to={`/products/${product.slug}`}>
        <div className="bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100">
          {/* Image */}
          <div className="relative overflow-hidden">
            <img
              src={product.image_url || '/placeholder-product.jpg'}
              alt={product.name}
              className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            
            {/* Add to Cart Button */}
            <motion.button
              initial={{ opacity: 0, scale: 0.8 }}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={handleAddToCart}
              className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm p-2 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-white"
            >
              <ShoppingCart className="w-4 h-4 text-green-600" />
            </motion.button>
          </div>

          {/* Content */}
          <div className="p-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-semibold text-gray-900 group-hover:text-green-600 transition-colors truncate">
                {product.name}
              </h3>
              <div className="flex items-center space-x-1">
                <Star className="w-4 h-4 text-yellow-400 fill-current" />
                <span className="text-sm text-gray-600">4.5</span>
              </div>
            </div>
            
            <p className="text-gray-600 text-sm mb-4 line-clamp-2">
              {product.description}
            </p>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span className="text-2xl font-bold text-gray-900">
                  ₹{product.price.toFixed(0)}
                </span>
              </div>
              
              <div className="text-sm text-gray-500">
                {product.stock_quantity > 0 ? (
                  <span className="text-green-600">In Stock</span>
                ) : (
                  <span className="text-red-600">Out of Stock</span>
                )}
              </div>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
