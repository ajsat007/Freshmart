import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { CreditCard, MapPin, User, ArrowLeft, Check } from 'lucide-react';
import { useNavigate } from 'react-router';
import { useCart } from '@/react-app/context/CartContext';
import { useAuth } from '@getmocha/users-service/react';


export default function Checkout() {
  const navigate = useNavigate();
  const { cart, fetchCart } = useCart();
  const { user, redirectToLogin } = useAuth();
  
  const [isLoading, setIsLoading] = useState(false);
  
  const [shippingAddress, setShippingAddress] = useState('');
  const [billingAddress, setBillingAddress] = useState('');
  const [sameAsShipping, setSameAsShipping] = useState(true);
  const [orderComplete, setOrderComplete] = useState(false);

  useEffect(() => {
    if (!user) {
      redirectToLogin();
      return;
    }

    const fetchProfile = async () => {
      try {
        const response = await fetch('/api/profile');
        if (response.ok) {
          const data = await response.json();
          setShippingAddress(data.shipping_address || '');
          setBillingAddress(data.billing_address || '');
        }
      } catch (error) {
        console.error('Error fetching profile:', error);
      }
    };

    fetchProfile();
  }, [user, redirectToLogin]);

  const cartItems = cart?.items || [];
  const subtotal = cartItems.reduce((sum, item) => sum + (item.product?.price || 0) * item.quantity, 0);
  const tax = subtotal * 0.08;
  const total = subtotal + tax;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || cartItems.length === 0) return;

    setIsLoading(true);
    
    try {
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          shipping_address: shippingAddress,
          billing_address: sameAsShipping ? shippingAddress : billingAddress,
        }),
      });

      if (response.ok) {
        setOrderComplete(true);
        await fetchCart(); // Refresh cart (should be empty now)
        
        // Redirect to orders page after a delay
        setTimeout(() => {
          navigate('/orders');
        }, 3000);
      } else {
        console.error('Order creation failed');
      }
    } catch (error) {
      console.error('Error creating order:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!user) {
    return null; // Will redirect via useEffect
  }

  if (cartItems.length === 0) {
    navigate('/cart');
    return null;
  }

  if (orderComplete) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            className="bg-white rounded-2xl shadow-lg p-8 text-center"
          >
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Check className="w-8 h-8 text-green-600" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Order Complete!</h2>
            <p className="text-gray-600 mb-6">
              Thank you for your purchase. Your order has been successfully placed and you will receive a confirmation email shortly.
            </p>
            <p className="text-sm text-gray-500">
              Redirecting to your orders...
            </p>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <motion.button
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4 }}
          onClick={() => navigate('/cart')}
          className="flex items-center space-x-2 text-gray-600 hover:text-purple-600 mb-8 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back to Cart</span>
        </motion.button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Checkout Form */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="bg-white rounded-2xl shadow-lg p-8"
            >
              <h1 className="text-3xl font-bold text-gray-900 mb-8">Checkout</h1>

              <form onSubmit={handleSubmit} className="space-y-8">
                {/* Customer Information */}
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                    <User className="w-5 h-5 mr-2" />
                    Customer Information
                  </h2>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="font-medium">{user.google_user_data.name}</p>
                    <p className="text-gray-600">{user.email}</p>
                  </div>
                </div>

                {/* Shipping Address */}
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                    <MapPin className="w-5 h-5 mr-2" />
                    Shipping Address
                  </h2>
                  <textarea
                    value={shippingAddress}
                    onChange={(e) => setShippingAddress(e.target.value)}
                    placeholder="Enter your shipping address"
                    required
                    rows={3}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>

                {/* Billing Address */}
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                    <CreditCard className="w-5 h-5 mr-2" />
                    Billing Address
                  </h2>
                  
                  <div className="mb-4">
                    <label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={sameAsShipping}
                        onChange={(e) => setSameAsShipping(e.target.checked)}
                        className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                      />
                      <span className="text-gray-700">Same as shipping address</span>
                    </label>
                  </div>

                  {!sameAsShipping && (
                    <textarea
                      value={billingAddress}
                      onChange={(e) => setBillingAddress(e.target.value)}
                      placeholder="Enter your billing address"
                      required
                      rows={3}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  )}
                </div>

                {/* Payment Information */}
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">Payment Information</h2>
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <p className="text-blue-800 font-medium">Demo Mode</p>
                    <p className="text-blue-600 text-sm">
                      This is a demo store. No actual payment will be processed.
                    </p>
                  </div>
                </div>

                {/* Submit Button */}
                <motion.button
                  type="submit"
                  disabled={isLoading}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white py-4 rounded-xl font-semibold hover:from-purple-700 hover:to-blue-700 transition-all duration-200 disabled:opacity-50"
                >
                  {isLoading ? 'Processing...' : 'Complete Order'}
                </motion.button>
              </form>
            </motion.div>
          </div>

          {/* Order Summary */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="bg-white rounded-2xl shadow-lg p-6 h-fit"
          >
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Order Summary</h2>
            
            <div className="space-y-4 mb-6">
              {cartItems.map((item) => (
                <div key={item.id} className="flex items-center space-x-3">
                  <img
                    src={item.product?.image_url || '/placeholder-product.jpg'}
                    alt={item.product?.name}
                    className="w-12 h-12 object-cover rounded-lg"
                  />
                  <div className="flex-1">
                    <p className="font-medium text-sm">{item.product?.name}</p>
                    <p className="text-gray-600 text-sm">Qty: {item.quantity}</p>
                  </div>
                  <p className="font-medium">
                    ${((item.product?.price || 0) * item.quantity).toFixed(2)}
                  </p>
                </div>
              ))}
            </div>

            <div className="space-y-2 mb-4">
              <div className="flex justify-between">
                <span className="text-gray-600">Subtotal</span>
                <span className="font-medium">${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Shipping</span>
                <span className="font-medium">Free</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Tax</span>
                <span className="font-medium">${tax.toFixed(2)}</span>
              </div>
              <hr />
              <div className="flex justify-between text-lg font-semibold">
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
