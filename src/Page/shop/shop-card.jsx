import { useState } from "react";
import ImageComponent from "../../component/image/ImageComponent";
import FavoriteIcon from "@mui/icons-material/Favorite";
import ShoppingCartCheckoutIcon from "@mui/icons-material/ShoppingCartCheckout";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { addToCart } from "../../feature/leafSlice";
import { motion } from "framer-motion";
import { toast } from "react-toastify";

export const ShopCard = ({ id, item }) => {
  const [isFavorite, setIsFavorite] = useState([]);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.leaf);

  const handleAddFavorite = (e, id) => {
    e.stopPropagation();
    
    // Check if user is logged in
    if (!user?.id) {
      toast.info("Please login to add items to wishlist");
      navigate("/sign-in");
      return;
    }
    
    if (isFavorite.includes(id)) {
      setIsFavorite(isFavorite.filter((favId) => favId !== id));
      toast.success("Removed from wishlist");
    } else {
      setIsFavorite([...isFavorite, id]);
      toast.success("Added to wishlist");
    }
  };

  const showProductDetails = (id) => {
    navigate(`/product/details/${id}`);
  };

  const handleAddToCart = (e) => {
    e.stopPropagation();
    
    // Check if user is logged in
    if (!user?.id) {
      toast.info("Please login to add items to cart");
      navigate("/sign-in");
      return;
    }
    
    dispatch(addToCart({ ...item, quantity: 1 }));
    toast.success("Added to cart!");
  };

  // ✅ Safe access to image URL
  const imageUrl = item?.image?.[0]?.url
  ? `${import.meta.env.VITE_Image_BASE_URL}${item.image[0].url}`
  : "/placeholder.png";

  // Calculate discount percentage
  const originalPrice = parseFloat(item?.OrigialPrice || 0);
  const discountPrice = parseFloat(item?.discountPrice || 0);
  const discountPercent = originalPrice > 0 && discountPrice > 0 && discountPrice < originalPrice
    ? Math.round(((originalPrice - discountPrice) / originalPrice) * 100)
    : 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      onClick={() => showProductDetails(item?.documentId)}
      className="group relative bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500 cursor-pointer border border-green-100"
    >
      {/* Discount Badge - Only show if discount > 0 */}
      {discountPercent > 0 && (
        <div className="absolute top-4 left-4 z-10 bg-gradient-to-r from-green-600 to-green-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg">
          {discountPercent}% OFF
        </div>
      )}

      {/* Wishlist Icon */}
      <div 
        onClick={(e) => handleAddFavorite(e, id)}
        className="absolute top-4 right-4 z-10 bg-white rounded-full p-2 shadow-md hover:shadow-lg transition-all duration-300 hover:scale-110"
      >
        <FavoriteIcon
          sx={{
            width: "20px",
            height: "20px",
            fill: isFavorite.includes(id) ? "#16a34a" : "#d1d5db",
            transition: "all 0.3s"
          }}
        />
      </div>

      {/* Product Image */}
      <div className="relative w-full h-72 bg-gradient-to-br from-gray-50 to-gray-100 overflow-hidden">
        <div className="absolute inset-0 flex justify-center items-center">
          <motion.div
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.3 }}
            className="w-full h-full"
          >
            <ImageComponent
              src={item?.image?.[0]?.url
                ? `${import.meta.env.VITE_Image_BASE_URL}${item.image[0].url}`
                : "/placeholder.png"}
              cardCss="w-full h-full"
              imgCss="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
            />
          </motion.div>
        </div>
        
        {/* Quick Add to Cart - Shows on Hover */}
        <div className="absolute bottom-0 left-0 right-0 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
          <button
            onClick={handleAddToCart}
            className="w-full bg-gradient-to-r from-green-600 to-green-700 text-white py-3 font-semibold hover:from-green-700 hover:to-green-800 transition-all duration-300 flex items-center justify-center gap-2"
          >
            <ShoppingCartCheckoutIcon sx={{ fontSize: "20px" }} />
            Quick Add to Cart
          </button>
        </div>
      </div>

      {/* Product Info */}
      <div className="p-5">
        <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2 min-h-[56px] group-hover:text-green-600 transition-colors">
          {item?.title || "Product Name"}
        </h3>
        
        <div className="flex items-center justify-between mt-3">
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span className="text-2xl font-bold text-green-700">
                ₹{discountPrice > 0 && discountPrice < originalPrice ? discountPrice.toFixed(2) : originalPrice.toFixed(2)}
              </span>
              {/* Only show original price if there's a real discount */}
              {discountPercent > 0 && (
                <span className="text-sm text-gray-500 line-through">
                  ₹{originalPrice.toFixed(2)}
                </span>
              )}
            </div>
            {/* Only show savings if there's a real discount */}
            {discountPercent > 0 && (
              <span className="text-xs text-green-600 font-medium mt-1">
                You save ₹{(originalPrice - discountPrice).toFixed(2)}
              </span>
            )}
          </div>
        </div>

        {/* Rating (placeholder - can be connected to reviews) */}
        <div className="flex items-center gap-1 mt-3">
          <div className="flex text-green-500">
            {"★".repeat(4)}{"☆"}
          </div>
          <span className="text-xs text-gray-500">(4.0)</span>
        </div>
      </div>
    </motion.div>
  );
};
