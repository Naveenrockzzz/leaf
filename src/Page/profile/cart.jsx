import React from "react";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { ShoppingBag } from "@mui/icons-material";
import { motion } from "framer-motion";
import ImageComponent from "../../component/image/ImageComponent";
import { removeFromCart, updateCartItemQuantity } from "../../feature/leafSlice";

export const Cart = () => {
  const { cart } = useSelector((state) => state.leaf);
  const dispatch = useDispatch();

  const handleQuantityChange = (itemId, newQuantity) => {
    if (newQuantity < 1) return;
    dispatch(updateCartItemQuantity({ id: itemId, quantity: newQuantity }));
  };

  const handleRemoveItem = (itemId) => {
    dispatch(removeFromCart(itemId));
  };

  // Calculate total
  const total = cart.reduce((acc, item) => {
    const price = parseFloat(item.OrigialPrice || item.discountPrice || 0);
    return acc + (price * (item.quantity || 1));
  }, 0);

  return (
    <div className="bg-gradient-to-br from-gray-50 to-blue-50 p-8 w-full min-h-[400px]">
      {cart?.length === 0 ? (
        /* Beautiful Empty State */
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center justify-center py-16 text-center"
        >
          <div className="bg-gradient-to-br from-blue-100 to-purple-100 rounded-full p-12 mb-6">
            <ShoppingBag sx={{ fontSize: 60, color: '#6366f1' }} />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-3">Your Cart is Empty</h2>
          <p className="text-gray-600 mb-8">
            Start adding products to your cart
          </p>
              <Link
                to="/product"
                className="px-8 py-3 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-2xl font-semibold hover:shadow-lg hover:scale-105 transition-all duration-300"
              >
                Browse Products
              </Link>
        </motion.div>
      ) : (
        <div className="space-y-6">
          {/* Cart Summary Header */}
          <div className="bg-white rounded-2xl shadow-lg p-6 flex items-center justify-between">
            <div>
              <h3 className="text-2xl font-bold text-gray-900">Shopping Cart</h3>
              <p className="text-gray-600">{cart.length} items in cart</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-600">Total</p>
              <p className="text-3xl font-bold text-green-600">₹{total.toFixed(2)}</p>
            </div>
          </div>

          {/* Cart Items Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {cart?.map((item, index) => (
              <motion.div
                key={item.id || index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 group"
              >
                {/* Product Image */}
                <div className="relative h-48 bg-gradient-to-br from-gray-100 to-gray-200 overflow-hidden">
                  <ImageComponent
                    src={item?.image?.[0]?.url
                      ? `${import.meta.env.VITE_Image_BASE_URL}${item.image[0].url}`
                      : "/placeholder.png"}
                    cardCss="w-full h-full"
                    imgCss="object-cover w-full h-full group-hover:scale-110 transition-transform duration-300"
                  />
                  
                  {/* Remove Button */}
                  <button
                    onClick={() => handleRemoveItem(item.id)}
                    className="absolute top-2 right-2 bg-white rounded-full p-2 shadow-md hover:bg-red-50 hover:shadow-lg transition-all"
                  >
                    <svg className="w-4 h-4 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"/>
                    </svg>
                  </button>
                </div>

                {/* Product Info */}
                <div className="p-4">
                  <h4 className="font-bold text-gray-900 mb-2 line-clamp-2 h-12">
                    {item?.title || "Product Name"}
                  </h4>
                  <p className="text-2xl font-bold text-green-600 mb-3">
                    ₹{parseFloat(item.OrigialPrice || item.discountPrice || 0).toFixed(2)}
                  </p>

                  {/* Quantity Controls */}
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm text-gray-600 font-medium">Qty:</span>
                    <div className="flex items-center bg-gray-100 rounded-lg">
                      <button
                        onClick={() => handleQuantityChange(item.id, (item.quantity || 1) - 1)}
                        disabled={(item.quantity || 1) <= 1}
                        className="px-3 py-1 hover:bg-gray-200 rounded-l-lg transition disabled:opacity-50"
                      >
                        -
                      </button>
                      <span className="px-4 py-1 font-bold min-w-[40px] text-center">
                        {item.quantity || 1}
                      </span>
                      <button
                        onClick={() => handleQuantityChange(item.id, (item.quantity || 1) + 1)}
                        disabled={(item.quantity || 1) >= 10}
                        className="px-3 py-1 hover:bg-gray-200 rounded-r-lg transition disabled:opacity-50"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  {/* Item Total */}
                  <div className="text-right text-sm text-gray-600">
                    Item Total: <span className="font-bold text-gray-900">
                      ₹{(parseFloat(item.OrigialPrice || item.discountPrice || 0) * (item.quantity || 1)).toFixed(2)}
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Checkout Actions */}
          <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl p-6 border-2 border-blue-200">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div>
                <p className="text-gray-700 font-semibold">Ready to checkout?</p>
                <p className="text-3xl font-bold text-gray-900">₹{total.toFixed(2)}</p>
              </div>
              <Link
                to="/order"
                className="px-8 py-4 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-2xl font-bold text-lg hover:shadow-2xl hover:scale-105 transition-all duration-300"
              >
                Proceed to Checkout
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
