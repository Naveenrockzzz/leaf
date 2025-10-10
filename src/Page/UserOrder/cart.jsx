import React from "react";
import { Link } from "react-router-dom";
import { CartCard } from "./cart-card";
import { useSelector, useDispatch } from "react-redux";
import { ShoppingBag } from "@mui/icons-material";
import { motion } from "framer-motion";
import ImageComponent from "../../component/image/ImageComponent";
import { updateCartItemQuantity, removeFromCart } from "../../feature/leafSlice";

export const Cart = ({ setOrderValue }) => {
  const { cart } = useSelector((state) => state.leaf);
  const dispatch = useDispatch();

  // Calculate pricing
  const subtotal = cart.reduce((acc, item) => {
    const price = parseFloat(item.OrigialPrice || item.discountPrice || 0);
    const quantity = item.quantity || 1;
    return acc + (price * quantity);
  }, 0);
  const shipping = subtotal > 0 ? 50 : 0;
  const tax = subtotal * 0.18;
  const total = subtotal + shipping + tax;

  const handleQuantityChange = (itemId, newQuantity) => {
    if (newQuantity < 1) return;
    dispatch(updateCartItemQuantity({ id: itemId, quantity: newQuantity }));
  };

  const handleRemoveItem = (itemId) => {
    dispatch(removeFromCart(itemId));
  };

  return (
    <div className="p-8 w-full">
      {cart.length === 0 ? (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-16"
        >
          <div className="flex flex-col items-center gap-6">
            <div className="bg-gradient-to-br from-blue-100 to-purple-100 rounded-full p-12">
              <ShoppingBag sx={{ fontSize: 60, color: '#6366f1' }} />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Your Cart is Empty</h2>
              <p className="text-gray-600">Add some products to get started</p>
            </div>
            <Link
              to="/product"
              className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-2xl font-semibold hover:shadow-lg transition-all duration-300"
            >
              Browse Products
            </Link>
          </div>
        </motion.div>
      ) : (
        <div className="space-y-6">
          {/* Cart Items */}
          <div className="space-y-4">
            {cart.map((item, index) => (
              <motion.div
                key={item.id || index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-gradient-to-r from-white to-gray-50 rounded-2xl p-6 shadow-md hover:shadow-lg transition-all duration-300 border border-gray-100"
              >
                <div className="flex flex-col md:flex-row gap-6">
                  {/* Image */}
                  <div className="md:w-32 md:h-32 w-full h-48 bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl overflow-hidden flex-shrink-0">
                    <ImageComponent
                      src={item?.image?.[0]?.url
                        ? `${import.meta.env.VITE_Image_BASE_URL}${item.image[0].url}`
                        : "/placeholder.png"}
                      cardCss="w-full h-full"
                      imgCss="object-cover w-full h-full hover:scale-110 transition-transform duration-300"
                    />
                  </div>

                  {/* Details */}
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                      {item?.title || "Product Name"}
                    </h3>
                    <div className="flex items-center gap-2 mb-4">
                      <span className="text-2xl font-bold text-blue-600">
                        ₹{parseFloat(item.OrigialPrice || item.discountPrice || 0).toFixed(2)}
                      </span>
                      {item?.discountPrice && item?.OrigialPrice && (
                        <span className="text-sm text-gray-500 line-through">
                          ₹{item.OrigialPrice}
                        </span>
                      )}
                    </div>

                    {/* Quantity Controls */}
                    <div className="flex items-center gap-4 flex-wrap">
                      <div className="flex items-center bg-gray-100 rounded-xl">
                        <button
                          onClick={() => handleQuantityChange(item.id, (item.quantity || 1) - 1)}
                          disabled={(item.quantity || 1) <= 1}
                          className="px-4 py-2 hover:bg-gray-200 rounded-l-xl transition-colors disabled:opacity-50"
                        >
                          -
                        </button>
                        <span className="px-6 py-2 font-bold min-w-[60px] text-center">
                          {item.quantity || 1}
                        </span>
                        <button
                          onClick={() => handleQuantityChange(item.id, (item.quantity || 1) + 1)}
                          disabled={(item.quantity || 1) >= 10}
                          className="px-4 py-2 hover:bg-gray-200 rounded-r-xl transition-colors disabled:opacity-50"
                        >
                          +
                        </button>
                      </div>
                      <button
                        onClick={() => handleRemoveItem(item.id)}
                        className="text-red-500 hover:text-red-700 font-medium text-sm hover:underline"
                      >
                        Remove
                      </button>
                    </div>
                  </div>

                  {/* Item Total */}
                  <div className="text-right">
                    <p className="text-sm text-gray-600">Item Total</p>
                    <p className="text-2xl font-bold text-gray-900">
                      ₹{(parseFloat(item.OrigialPrice || item.discountPrice || 0) * (item.quantity || 1)).toFixed(2)}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Summary & Checkout */}
          <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl p-6 border-2 border-blue-200">
            <div className="grid md:grid-cols-2 gap-6">
              {/* Price Summary */}
              <div className="space-y-3">
                <div className="flex justify-between text-gray-700">
                  <span>Subtotal:</span>
                  <span className="font-semibold">₹{subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-700">
                  <span>Shipping:</span>
                  <span className="font-semibold text-green-600">₹{shipping.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-700">
                  <span>Tax (18%):</span>
                  <span className="font-semibold">₹{tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-xl font-bold text-gray-900 pt-3 border-t-2 border-blue-200">
                  <span>Total:</span>
                  <span className="text-blue-600">₹{total.toFixed(2)}</span>
                </div>
              </div>

              {/* Checkout Button */}
              <div className="flex items-center justify-center">
                <button
                  onClick={() => setOrderValue(1)}
                  className="w-full py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-2xl font-bold text-lg hover:shadow-2xl hover:scale-105 transition-all duration-300"
                >
                  Proceed to Address
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
