import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { addToCart, fetchReviews, addToWishlist, removeFromWishlist, fetchWishlist } from "../../feature/leafSlice";
import ProductImageSlider from "./ProductImageSlider";
import { ShopCard } from "./shop-card";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import LocalOfferIcon from "@mui/icons-material/LocalOffer";
import Inventory2Icon from "@mui/icons-material/Inventory2";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import EventIcon from "@mui/icons-material/Event";
import FavoriteIcon from "@mui/icons-material/Favorite";
import RateReviewIcon from "@mui/icons-material/RateReview";
import { get } from "../../feature/api";


export const ProductDetails = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { product, user, wishList } = useSelector((state) => state.leaf);
  const productDetails = product?.find((item) => item?.documentId === id);

  const [mainImage, setMainImage] = useState("");
  const [reviews, setReviews] = useState([]);
  const [reviewsLoading, setReviewsLoading] = useState(false);

  // Check if product is in wishlist
  const isInWishlist = wishList?.some(
    (item) => item?.product?.documentId === productDetails?.documentId
  );

  useEffect(() => {
    window.scrollTo(0, 0);
    setMainImage(productDetails?.image?.[0]?.url);
    
    // Fetch reviews for this product
    const fetchProductReviews = async () => {
      if (productDetails?.documentId) {
        setReviewsLoading(true);
        try {
          const response = await get(`/reviews?filters[product][documentId][$eq]=${productDetails.documentId}&populate=*`);
          setReviews(response.data || []);
        } catch (error) {
          console.error("Failed to fetch reviews:", error);
        } finally {
          setReviewsLoading(false);
        }
      }
    };
    
    fetchProductReviews();
    
    // Fetch wishlist if user is logged in
    if (user?.id) {
      dispatch(fetchWishlist(user.id));
    }
  }, [productDetails, user?.id, dispatch]);

  const handleAddToCart = () => {
    if (!user?.id) {
      toast.info("Please login to add items to cart");
      navigate("/sign-in");
      return;
    }
    dispatch(addToCart({ ...productDetails, quantity: 1 }));
    toast.success("Added to cart!");
  };

  const handleToggleWishlist = async () => {
    if (!user?.id) {
      toast.info("Please login to add items to wishlist");
      navigate("/sign-in");
      return;
    }

    if (isInWishlist) {
      // Find the wishlist item and remove it
      const wishlistItem = wishList.find(
        (item) => item?.product?.documentId === productDetails?.documentId
      );
      if (wishlistItem) {
        await dispatch(removeFromWishlist(wishlistItem.documentId));
        toast.success("Removed from wishlist");
      }
    } else {
      await dispatch(addToWishlist({ userId: user.id, productId: productDetails.documentId }));
      toast.success("Added to wishlist");
    }
  };

  const handleWriteReview = () => {
    if (!user?.id) {
      toast.info("Please login to write a review");
      navigate("/sign-in");
      return;
    }
    navigate(`/product/${productDetails.documentId}/review`);
  };

  // Calculate discount percentage
  const originalPrice = parseFloat(productDetails?.OrigialPrice || 0);
  const discountPrice = parseFloat(productDetails?.discountPrice || 0);
  const discountPercent = originalPrice > 0 && discountPrice > 0 && discountPrice < originalPrice
    ? Math.round(((originalPrice - discountPrice) / originalPrice) * 100)
    : 0;

  // Calculate average rating from reviews
  const averageRating = reviews.length > 0
    ? (reviews.reduce((sum, review) => sum + (review.rating || 0), 0) / reviews.length).toFixed(1)
    : 0;

  // Calculate estimated delivery date (3-4 working days from now)
  const getEstimatedDelivery = () => {
    const today = new Date();
    const startDate = new Date(today);
    const endDate = new Date(today);
    
    // Add 3-4 working days
    let daysAdded = 0;
    while (daysAdded < 3) {
      startDate.setDate(startDate.getDate() + 1);
      if (startDate.getDay() !== 0 && startDate.getDay() !== 6) {
        daysAdded++;
      }
    }
    
    daysAdded = 0;
    while (daysAdded < 4) {
      endDate.setDate(endDate.getDate() + 1);
      if (endDate.getDay() !== 0 && endDate.getDay() !== 6) {
        daysAdded++;
      }
    }
    
    const formatDate = (date) => {
      return date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
    };
    
    return `${formatDate(startDate)} - ${formatDate(endDate)}`;
  };

  // Get rating distribution
  const getRatingDistribution = () => {
    const distribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    reviews.forEach(review => {
      if (review.rating) {
        distribution[review.rating]++;
      }
    });
    return distribution;
  };

  const ratingDistribution = getRatingDistribution();

  if (!productDetails) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Product not found</h2>
          <button
            onClick={() => navigate("/product")}
            className="px-6 py-3 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-2xl font-medium hover:shadow-lg transition-all duration-300"
          >
            Back to Shop
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <div className="text-sm text-gray-600 mb-6 mt-20">
          <span className="cursor-pointer hover:text-green-600" onClick={() => navigate("/product")}>
            Shop
          </span>
          {productDetails?.category?.Name && (
            <>
              <span className="mx-2">/</span>
              <span className="cursor-pointer hover:text-green-600">
                {productDetails.category.Name}
              </span>
            </>
          )}
          <span className="mx-2">/</span>
          <span className="text-gray-900 font-medium">{productDetails?.title}</span>
        </div>

        {/* Main Product Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white rounded-3xl shadow-lg overflow-hidden mb-8"
        >
          <div className="grid md:grid-cols-2 gap-10 p-8">
            {/* Images */}
            <ProductImageSlider
              images={
                productDetails?.image?.map(
                  (img) => `${import.meta.env.VITE_Image_BASE_URL}${img.url}`
                ) || []
              }
            />

            {/* Product Info */}
            <div className="space-y-4">
              {/* Category Badge */}
              {productDetails?.category?.Name && (
                <span className="inline-block px-4 py-1 bg-gradient-to-r from-green-100 to-blue-100 text-green-700 rounded-full text-sm font-medium">
                  {productDetails.category.Name}
                </span>
              )}

              {/* Title */}
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
                {productDetails?.title}
              </h1>

              {/* Rating */}
              {reviews.length > 0 && (
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1">
                    <div className="flex text-yellow-500">
                      {"★".repeat(Math.round(averageRating))}
                      {"☆".repeat(5 - Math.round(averageRating))}
                    </div>
                    <span className="text-lg font-semibold text-gray-900">{averageRating}</span>
                  </div>
                  <span className="text-gray-500">({reviews.length} reviews)</span>
                </div>
              )}

              {/* Price */}
              <div className="flex items-baseline gap-3">
                <span className="text-4xl font-bold text-green-700">
                  ₹{discountPrice > 0 && discountPrice < originalPrice ? discountPrice.toFixed(2) : originalPrice.toFixed(2)}
                </span>
                {discountPercent > 0 && (
                  <>
                    <span className="text-xl text-gray-500 line-through">
                      ₹{originalPrice.toFixed(2)}
                    </span>
                    <span className="px-3 py-1 bg-gradient-to-r from-green-600 to-green-500 text-white rounded-full text-sm font-bold">
                      {discountPercent}% OFF
                    </span>
                  </>
                )}
              </div>

              {/* Savings */}
              {discountPercent > 0 && (
                <p className="text-green-600 font-medium">
                  You save ₹{(originalPrice - discountPrice).toFixed(2)} on this product!
                </p>
              )}

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleAddToCart}
                  className="flex-1 bg-gradient-to-r from-green-600 to-green-700 text-white py-4 rounded-2xl text-lg font-semibold hover:shadow-lg transition-all duration-300"
                >
                  Add to Cart
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleToggleWishlist}
                  className="bg-white border-2 border-green-600 p-4 rounded-2xl hover:bg-green-50 transition-all duration-300"
                >
                  <FavoriteIcon
                    sx={{
                      fontSize: "28px",
                      fill: isInWishlist ? "#16a34a" : "#d1d5db",
                    }}
                  />
                </motion.button>
              </div>

              {/* Description Accordion */}
              <Accordion 
                className="rounded-2xl shadow-sm mt-4" 
                sx={{ 
                  border: '1px solid #e5e7eb',
                  '&:before': { display: 'none' }
                }}
              >
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon />}
                  aria-controls="panel1a-content"
                  id="panel1a-header"
                >
                  <h3 className="font-semibold text-lg">Description & Details</h3>
                </AccordionSummary>
                <AccordionDetails>
                  <p className="text-gray-700 leading-relaxed">
                    {productDetails?.description || "No description available for this product."}
                  </p>
                  
                  {/* Product Specifications */}
                  {(productDetails?.Height || productDetails?.Width || productDetails?.Breadth || productDetails?.weight) && (
                    <div className="mt-4 pt-4 border-t border-gray-200">
                      <h4 className="font-semibold text-gray-900 mb-3">Specifications</h4>
                      <div className="grid grid-cols-2 gap-3 text-sm">
                        {productDetails?.Height && (
                          <div>
                            <span className="text-gray-600">Height:</span>
                            <span className="ml-2 font-medium">{productDetails.Height} cm</span>
                          </div>
                        )}
                        {productDetails?.Width && (
                          <div>
                            <span className="text-gray-600">Width:</span>
                            <span className="ml-2 font-medium">{productDetails.Width} cm</span>
                          </div>
                        )}
                        {productDetails?.Breadth && (
                          <div>
                            <span className="text-gray-600">Breadth:</span>
                            <span className="ml-2 font-medium">{productDetails.Breadth} cm</span>
                          </div>
                        )}
                        {productDetails?.weight && (
                          <div>
                            <span className="text-gray-600">Weight:</span>
                            <span className="ml-2 font-medium">{productDetails.weight} kg</span>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </AccordionDetails>
              </Accordion>

              {/* Shipping Info Accordion */}
              <Accordion 
                className="rounded-2xl shadow-sm mt-4" 
                sx={{ 
                  border: '1px solid #e5e7eb',
                  '&:before': { display: 'none' }
                }}
              >
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon />}
                  aria-controls="panel2a-content"
                  id="panel2a-header"
                >
                  <h3 className="font-semibold text-lg">Shipping Information</h3>
                </AccordionSummary>

                <AccordionDetails>
                  <div className="grid grid-cols-2 gap-4">
                    {/* Discount */}
                    {discountPercent > 0 && (
                      <div className="flex items-center gap-3 rounded-xl p-4 bg-gradient-to-br from-green-50 to-blue-50 border border-green-200">
                        <LocalOfferIcon className="text-green-600" />
                        <div>
                          <p className="text-xs text-gray-600 font-medium">Discount</p>
                          <p className="text-lg font-bold text-green-700">{discountPercent}%</p>
                        </div>
                      </div>
                    )}

                    {/* Package */}
                    <div className="flex items-center gap-3 rounded-xl p-4 bg-gradient-to-br from-gray-50 to-gray-100 border border-gray-200">
                      <Inventory2Icon className="text-gray-700" />
                      <div>
                        <p className="text-xs text-gray-600 font-medium">Package</p>
                        <p className="text-sm font-semibold text-gray-900">Regular Package</p>
                      </div>
                    </div>

                    {/* Delivery Time */}
                    <div className="flex items-center gap-3 rounded-xl p-4 bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200">
                      <LocalShippingIcon className="text-blue-600" />
                      <div>
                        <p className="text-xs text-gray-600 font-medium">Delivery</p>
                        <p className="text-sm font-semibold text-gray-900">3–4 Working Days</p>
                      </div>
                    </div>

                    {/* Estimated Delivery Date */}
                    <div className="flex items-center gap-3 rounded-xl p-4 bg-gradient-to-br from-purple-50 to-pink-50 border border-purple-200">
                      <EventIcon className="text-purple-600" />
                      <div>
                        <p className="text-xs text-gray-600 font-medium">Estimated</p>
                        <p className="text-sm font-semibold text-gray-900">{getEstimatedDelivery()}</p>
                      </div>
                    </div>
                  </div>
                </AccordionDetails>
              </Accordion>
            </div>   
          </div>
        </motion.div>

        {/* Reviews Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="bg-white rounded-3xl shadow-lg p-8 mt-8"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Customer Reviews</h2>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleWriteReview}
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-2xl font-medium hover:shadow-lg transition-all duration-300"
            >
              <RateReviewIcon sx={{ fontSize: "20px" }} />
              Write a Review
            </motion.button>
          </div>

          {reviewsLoading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-4 border-green-600 border-t-transparent"></div>
            </div>
          ) : reviews.length > 0 ? (
            <div className="grid md:grid-cols-2 gap-8">
              {/* Rating Overview */}
              <div className="text-center md:text-left">
                <div className="flex items-baseline gap-3 justify-center md:justify-start">
                  <p className="text-6xl font-bold text-gray-900">{averageRating}</p>
                  <span className="text-2xl text-gray-500">/ 5</span>
                </div>
                <div className="flex items-center gap-2 justify-center md:justify-start mt-3">
                  <div className="flex text-yellow-500 text-2xl">
                    {"★".repeat(Math.round(averageRating))}
                    {"☆".repeat(5 - Math.round(averageRating))}
                  </div>
                </div>
                <p className="text-gray-600 mt-2">Based on {reviews.length} review{reviews.length !== 1 ? 's' : ''}</p>
                
                {/* Rating Distribution */}
                <div className="mt-6 space-y-3">
                  {[5, 4, 3, 2, 1].map((star) => {
                    const count = ratingDistribution[star] || 0;
                    const percentage = reviews.length > 0 ? (count / reviews.length) * 100 : 0;
                    return (
                      <div key={star} className="flex items-center gap-3">
                        <span className="w-8 text-sm font-medium text-gray-700">{star}★</span>
                        <div className="bg-gray-200 rounded-full h-3 flex-1 overflow-hidden">
                          <div 
                            className="bg-gradient-to-r from-yellow-400 to-yellow-500 h-3 rounded-full transition-all duration-500"
                            style={{ width: `${percentage}%` }}
                          ></div>
                        </div>
                        <span className="w-12 text-sm text-gray-600">{count}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Recent Reviews */}
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {reviews.slice(0, 5).map((review, index) => (
                  <motion.div
                    key={review.documentId || index}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    className="border border-gray-200 rounded-2xl p-5 hover:shadow-md transition-shadow"
                  >
                    <div className="flex gap-4 items-start">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-green-400 to-blue-500 flex items-center justify-center text-white font-bold text-lg">
                        {review?.user?.name?.charAt(0).toUpperCase() || "U"}
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="font-semibold text-gray-900">
                              {review?.user?.name || "Anonymous User"}
                            </h4>
                            <div className="flex text-yellow-500 text-sm mt-1">
                              {"★".repeat(review.rating || 0)}
                              {"☆".repeat(5 - (review.rating || 0))}
                            </div>
                          </div>
                          <p className="text-sm text-gray-500">
                            {new Date(review.createdAt).toLocaleDateString('en-IN', { 
                              day: 'numeric', 
                              month: 'short', 
                              year: 'numeric' 
                            })}
                          </p>
                        </div>
                        <p className="text-gray-700 mt-3 leading-relaxed">
                          {review.description || "No comment provided."}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="bg-gray-100 rounded-full p-8 inline-block mb-4">
                <RateReviewIcon sx={{ fontSize: "48px", color: "#9ca3af" }} />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No Reviews Yet</h3>
              <p className="text-gray-600 mb-6">Be the first to review this product!</p>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleWriteReview}
                className="px-8 py-3 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-2xl font-medium hover:shadow-lg transition-all duration-300"
              >
                Write First Review
              </motion.button>
            </div>
          )}
        </motion.div>

        {/* You Might Also Like */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-8"
        >
          <div className="bg-white rounded-3xl shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">You Might Also Like</h2>
            <div className="grid md:grid-cols-3 sm:grid-cols-2 gap-6">
              {product
                ?.filter(item => item.documentId !== productDetails?.documentId)
                ?.slice(0, 3)
                .map((item, index) => (
                  <ShopCard key={item.documentId || index} id={index} item={item} />
                ))}
            </div>
            
            {product?.length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-600">No related products found</p>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
};
