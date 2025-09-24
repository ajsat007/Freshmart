import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Package, ShoppingCart, Users, TrendingUp, Calendar, DollarSign } from 'lucide-react';
import { useAuth } from '@getmocha/users-service/react';
import { Product, Order } from '@/shared/types';

interface AdminStats {
  totalProducts: number;
  totalOrders: number;
  totalRevenue: number;
  recentOrders: Order[];
}

export default function Admin() {
  const { user, redirectToLogin } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  
  const [stats, setStats] = useState<AdminStats>({
    totalProducts: 0,
    totalOrders: 0,
    totalRevenue: 0,
    recentOrders: []
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    if (!user) {
      redirectToLogin();
      return;
    }

    const checkAuthAndFetchData = async () => {
      try {
        // Try to fetch admin data to check authorization
        const [productsRes, ordersRes] = await Promise.all([
          fetch('/api/admin/products'),
          fetch('/api/admin/orders')
        ]);

        if (productsRes.status === 403 || ordersRes.status === 403) {
          setIsAuthorized(false);
          setIsLoading(false);
          return;
        }

        if (productsRes.ok && ordersRes.ok) {
          const productsData = await productsRes.json();
          const ordersData = await ordersRes.json();
          
          setProducts(productsData);
          setIsAuthorized(true);

          // Calculate stats
          const totalRevenue = ordersData.reduce((sum: number, order: Order) => sum + order.total_amount, 0);
          const recentOrders = ordersData.slice(0, 5);

          setStats({
            totalProducts: productsData.length,
            totalOrders: ordersData.length,
            totalRevenue,
            recentOrders
          });
        }
      } catch (error) {
        console.error('Error fetching admin data:', error);
        setIsAuthorized(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuthAndFetchData();
  }, [user, redirectToLogin]);

  if (!user) {
    return null; // Will redirect via useEffect
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  if (!isAuthorized) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="bg-white rounded-2xl shadow-lg p-12 text-center"
          >
            <Users className="w-16 h-16 text-red-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Access Denied</h2>
            <p className="text-gray-600 mb-8">
              You don't have admin privileges to access this page.
            </p>
            <a
              href="/"
              className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-3 rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all duration-200"
            >
              Go to Home
            </a>
          </motion.div>
        </div>
      </div>
    );
  }

  const statCards = [
    {
      title: 'Total Products',
      value: stats.totalProducts,
      icon: Package,
      color: 'from-blue-500 to-blue-600',
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-600'
    },
    {
      title: 'Total Orders',
      value: stats.totalOrders,
      icon: ShoppingCart,
      color: 'from-green-500 to-green-600',
      bgColor: 'bg-green-50',
      textColor: 'text-green-600'
    },
    {
      title: 'Total Revenue',
      value: `$${stats.totalRevenue.toFixed(2)}`,
      icon: DollarSign,
      color: 'from-purple-500 to-purple-600',
      bgColor: 'bg-purple-50',
      textColor: 'text-purple-600'
    },
    {
      title: 'Growth Rate',
      value: '+12.3%',
      icon: TrendingUp,
      color: 'from-orange-500 to-orange-600',
      bgColor: 'bg-orange-50',
      textColor: 'text-orange-600'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
          <p className="text-gray-600">Overview of your store performance</p>
        </motion.div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {statCards.map((card, index) => (
            <motion.div
              key={card.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              className="bg-white rounded-2xl shadow-lg p-6"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm font-medium">{card.title}</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">{card.value}</p>
                </div>
                <div className={`w-12 h-12 ${card.bgColor} rounded-full flex items-center justify-center`}>
                  <card.icon className={`w-6 h-6 ${card.textColor}`} />
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Orders */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="bg-white rounded-2xl shadow-lg p-6"
          >
            <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
              <ShoppingCart className="w-5 h-5 mr-2" />
              Recent Orders
            </h2>
            
            {stats.recentOrders.length === 0 ? (
              <p className="text-gray-500 text-center py-8">No orders yet</p>
            ) : (
              <div className="space-y-4">
                {stats.recentOrders.map((order) => (
                  <div key={order.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-900">Order #{order.id}</p>
                      <div className="flex items-center space-x-3 text-sm text-gray-600">
                        <span className="flex items-center">
                          <Calendar className="w-4 h-4 mr-1" />
                          {new Date(order.created_at).toLocaleDateString()}
                        </span>
                        <span>Customer</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-gray-900">${order.total_amount.toFixed(2)}</p>
                      <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${
                        order.status === 'completed' 
                          ? 'bg-green-100 text-green-800'
                          : order.status === 'shipped'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {order.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </motion.div>

          {/* Product Overview */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="bg-white rounded-2xl shadow-lg p-6"
          >
            <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
              <Package className="w-5 h-5 mr-2" />
              Product Overview
            </h2>
            
            {products.length === 0 ? (
              <p className="text-gray-500 text-center py-8">No products yet</p>
            ) : (
              <div className="space-y-4">
                {products.slice(0, 5).map((product) => (
                  <div key={product.id} className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                    <img
                      src={product.image_url || '/placeholder-product.jpg'}
                      alt={product.name}
                      className="w-12 h-12 object-cover rounded-lg"
                    />
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">{product.name}</p>
                      <p className="text-sm text-gray-600">Stock: {product.stock_quantity}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-gray-900">${product.price.toFixed(2)}</p>
                      <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${
                        product.is_active 
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {product.is_active ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        </div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-8 bg-white rounded-2xl shadow-lg p-6"
        >
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button className="p-4 bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg hover:from-blue-100 hover:to-blue-200 transition-all duration-200 text-left">
              <Package className="w-6 h-6 text-blue-600 mb-2" />
              <p className="font-medium text-gray-900">Add New Product</p>
              <p className="text-sm text-gray-600">Create a new product listing</p>
            </button>
            
            <button className="p-4 bg-gradient-to-r from-green-50 to-green-100 rounded-lg hover:from-green-100 hover:to-green-200 transition-all duration-200 text-left">
              <ShoppingCart className="w-6 h-6 text-green-600 mb-2" />
              <p className="font-medium text-gray-900">Manage Orders</p>
              <p className="text-sm text-gray-600">View and update order status</p>
            </button>
            
            <button className="p-4 bg-gradient-to-r from-purple-50 to-purple-100 rounded-lg hover:from-purple-100 hover:to-purple-200 transition-all duration-200 text-left">
              <TrendingUp className="w-6 h-6 text-purple-600 mb-2" />
              <p className="font-medium text-gray-900">View Analytics</p>
              <p className="text-sm text-gray-600">Check sales and performance</p>
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
