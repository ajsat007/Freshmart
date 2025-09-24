import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Package, Calendar, CreditCard, Truck, CheckCircle } from 'lucide-react';
import { useAuth } from '@getmocha/users-service/react';
import { Order } from '@/shared/types';

export default function Orders() {
  const { user, redirectToLogin } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      redirectToLogin();
      return;
    }

    const fetchOrders = async () => {
      try {
        const response = await fetch('/api/orders');
        if (response.ok) {
          const data = await response.json();
          setOrders(data);
        }
      } catch (error) {
        console.error('Error fetching orders:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrders();
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

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return CheckCircle;
      case 'shipped':
        return Truck;
      case 'pending':
        return Package;
      default:
        return Package;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'text-green-600 bg-green-100';
      case 'shipped':
        return 'text-blue-600 bg-blue-100';
      case 'pending':
        return 'text-yellow-600 bg-yellow-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-gray-900 mb-2">My Orders</h1>
          <p className="text-gray-600">Track and manage your order history</p>
        </motion.div>

        {orders.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="bg-white rounded-2xl shadow-lg p-12 text-center"
          >
            <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-4">No orders yet</h2>
            <p className="text-gray-600 mb-8">
              When you place orders, they will appear here.
            </p>
            <a
              href="/products"
              className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-3 rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all duration-200"
            >
              Start Shopping
            </a>
          </motion.div>
        ) : (
          <div className="space-y-6">
            {orders.map((order, index) => {
              const StatusIcon = getStatusIcon(order.status);
              return (
                <motion.div
                  key={order.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  className="bg-white rounded-2xl shadow-lg overflow-hidden"
                >
                  {/* Order Header */}
                  <div className="bg-gradient-to-r from-purple-50 to-blue-50 p-6 border-b border-gray-100">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                      <div className="flex items-center space-x-4 mb-4 md:mb-0">
                        <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full flex items-center justify-center">
                          <Package className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900">
                            Order #{order.id}
                          </h3>
                          <div className="flex items-center space-x-4 text-sm text-gray-600">
                            <div className="flex items-center space-x-1">
                              <Calendar className="w-4 h-4" />
                              <span>{new Date(order.created_at).toLocaleDateString()}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <CreditCard className="w-4 h-4" />
                              <span>${order.total_amount.toFixed(2)}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-3">
                        <span className={`px-3 py-1 rounded-full text-sm font-medium flex items-center space-x-1 ${getStatusColor(order.status)}`}>
                          <StatusIcon className="w-4 h-4" />
                          <span className="capitalize">{order.status}</span>
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Order Details */}
                  <div className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-2">Shipping Address</h4>
                        <p className="text-gray-600 text-sm">
                          {order.shipping_address || 'No shipping address provided'}
                        </p>
                      </div>
                      
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-2">Payment Status</h4>
                        <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${
                          order.payment_status === 'completed' 
                            ? 'bg-green-100 text-green-800'
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {order.payment_status === 'completed' ? 'Paid' : 'Pending'}
                        </span>
                      </div>
                    </div>

                    {/* Order Items */}
                    {order.items && order.items.length > 0 && (
                      <div className="mt-6">
                        <h4 className="font-semibold text-gray-900 mb-4">Items</h4>
                        <div className="space-y-3">
                          {order.items.map((item) => (
                            <div key={item.id} className="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg">
                              <img
                                src={item.product?.image_url || '/placeholder-product.jpg'}
                                alt={item.product?.name}
                                className="w-12 h-12 object-cover rounded-lg"
                              />
                              <div className="flex-1">
                                <p className="font-medium text-gray-900">{item.product?.name}</p>
                                <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                              </div>
                              <p className="font-semibold text-gray-900">
                                ${(item.price * item.quantity).toFixed(2)}
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
