import { useState } from "react";
import ImageComponent from "../../component/image/ImageComponent";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { removeFromCart, updateCartItemQuantity } from "../../feature/leafSlice";
import { Delete, Add, Remove } from "@mui/icons-material";
import { motion } from "framer-motion";
import { toast } from "react-toastify";

export const CartCard = ({ item, index }) => {
  const dispatch = useDispatch();
  const [quantity, setQuantity] = useState(item.quantity || 1);

  const price = parseFloat(item.OrigialPrice || item.discountPrice || 0);
  const itemTotal = price * quantity;

  const handleQuantityChange = (newQuantity) => {
    if (newQuantity < 1) return;
    if (newQuantity > 10) {
      toast.info("Maximum quantity is 10");
      return;
    }
    setQuantity(newQuantity);
    dispatch(updateCartItemQuantity({ id: item.id, quantity: newQuantity }));
  };

  const handleRemove = () => {
    dispatch(removeFromCart(item.id));
    toast.success("Item removed from cart");
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      transition={{ duration: 0.3, delay: index * 0.1 }}
      className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100"
    >
      <div className="flex flex-col sm:flex-row gap-6 p-6">
        {/* Product Image */}
        <Link 
          to={`/product/details/${item?.documentId}`}
          className="sm:w-40 sm:h-40 w-full h-48 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl overflow-hidden flex-shrink-0 group"
        >
          <ImageComponent
            src={item?.image?.[0]?.url
              ? `${import.meta.env.VITE_Image_BASE_URL}${item.image[0].url}`
              : "/placeholder.png"}
            cardCss="w-full h-full"
            imgCss="object-cover w-full h-full group-hover:scale-110 transition-transform duration-300"
          />
        </Link>

        {/* Product Details */}
        <div className="flex-1 flex flex-col justify-between">
          <div>
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <Link 
                  to={`/product/details/${item?.documentId}`}
                  className="text-xl font-bold text-gray-900 hover:text-blue-600 transition-colors line-clamp-2"
                >
                  {item?.title || "Product Name"}
                </Link>
                {item?.category?.Name && (
                  <p className="text-sm text-gray-500 mt-1">
                    Category: {item.category.Name}
                  </p>
                )}
              </div>
              
              {/* Remove Button */}
              <button
                onClick={handleRemove}
                className="ml-4 p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all duration-300"
                title="Remove from cart"
              >
                <Delete sx={{ fontSize: 24 }} />
              </button>
            </div>

            {/* Price */}
            <div className="mb-4">
              <div className="flex items-center gap-2">
                <span className="text-2xl font-bold text-gray-900">
                  ₹{price.toFixed(2)}
                </span>
                {item?.discountPrice && item?.OrigialPrice && (
                  <>
                    <span className="text-sm text-gray-500 line-through">
                      ₹{item.OrigialPrice}
                    </span>
                    <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full font-semibold">
                      Save ₹{(parseFloat(item.OrigialPrice) - parseFloat(item.discountPrice)).toFixed(2)}
                    </span>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Quantity Controls & Total */}
          <div className="flex items-center justify-between flex-wrap gap-4">
            {/* Quantity Selector */}
            <div className="flex items-center gap-3">
              <span className="text-sm text-gray-600 font-medium">Quantity:</span>
              <div className="flex items-center bg-gray-100 rounded-xl">
                <button
                  onClick={() => handleQuantityChange(quantity - 1)}
                  disabled={quantity <= 1}
                  className="p-2 hover:bg-gray-200 rounded-l-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Remove sx={{ fontSize: 20 }} />
                </button>
                <span className="px-6 py-2 font-bold text-gray-900 min-w-[60px] text-center">
                  {quantity}
                </span>
                <button
                  onClick={() => handleQuantityChange(quantity + 1)}
                  disabled={quantity >= 10}
                  className="p-2 hover:bg-gray-200 rounded-r-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Add sx={{ fontSize: 20 }} />
                </button>
              </div>
            </div>

            {/* Item Total */}
            <div className="text-right">
              <p className="text-sm text-gray-600">Item Total</p>
              <p className="text-2xl font-bold text-green-600">
                ₹{itemTotal.toFixed(2)}
              </p>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
