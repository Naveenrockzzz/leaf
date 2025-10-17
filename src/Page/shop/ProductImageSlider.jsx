import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './product.css';

const ProductImageSlider = ({ images }) => {
  const [mainImage, setMainImage] = useState('');
  const [imageIndex, setImageIndex] = useState(0);

  useEffect(() => {
    if (images && images.length > 0) {
      setMainImage(images[0]);
      setImageIndex(0);
    }
  }, [images]);

  const handleImageChange = (img, index) => {
    setMainImage(img);
    setImageIndex(index);
  };

  if (!images || images.length === 0) {
    return (
      <div className="flex items-center justify-center w-full h-96 bg-gray-100 rounded-2xl">
        <p className="text-gray-400">No images available</p>
      </div>
    );
  }

  return (
    <div className="image-slider-wrapper">
      <div className="main-image-container">
        <AnimatePresence mode="wait">
          <motion.img
            key={mainImage}
            src={mainImage}
            alt="Main Product"
            className="main-image"
            loading="lazy"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          />
        </AnimatePresence>
        
        {/* Image indicator */}
        {images.length > 1 && (
          <div className="absolute top-4 right-4 bg-black/50 backdrop-blur-sm text-white px-3 py-1 rounded-full text-sm font-medium">
            {imageIndex + 1} / {images.length}
          </div>
        )}
        
        <div className="thumbnail-inside-container">
          {images.map((img, index) => (
            <motion.img
              key={index}
              src={img}
              alt={`Thumbnail ${index + 1}`}
              className={`thumbnail ${mainImage === img ? 'active' : ''}`}
              loading="lazy"
              onClick={() => handleImageChange(img, index)}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProductImageSlider;
