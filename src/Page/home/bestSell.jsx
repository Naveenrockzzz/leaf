import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import ReactFlipCard from 'reactjs-flip-card';
import 'reactjs-flip-card/dist/ReactFlipCard.css';
import { motion } from "framer-motion";

// Fallback images from assets
import ProductImage1 from '../../assets/Homepage/1.png';
import ProductImage2 from '../../assets/Homepage/2.png';
import ProductImage3 from '../../assets/Homepage/3.png';
import ProductImage4 from '../../assets/Homepage/4.png';
import ProductImage5 from '../../assets/Homepage/5.png';
import ProductImage6 from '../../assets/Homepage/6.png';
import ProductImage7 from '../../assets/Homepage/7.png';
import ProductImage8 from '../../assets/Homepage/8.png';
import ProductImage9 from '../../assets/Homepage/9.png';

// Array of fallback images
const fallbackImages = [
  ProductImage1,
  ProductImage2,
  ProductImage3,
  ProductImage4,
  ProductImage5,
  ProductImage6,
  ProductImage7,
  ProductImage8,
  ProductImage9,
];

// Hook to detect mobile screen
const useIsMobile = () => {
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);
  return isMobile;
};

export const BestSell = () => {
  const isMobile = useIsMobile();
  const navigate = useNavigate();
  
  // Get categories from Redux store (already fetched in App.jsx)
  const { category } = useSelector((state) => state.leaf);

  // Helper function to get image source
  const getImageSource = (cat, index) => {
    // If category has an image from Strapi, use it
    if (cat?.image?.url) {
      return `${import.meta.env.VITE_Image_BASE_URL}${cat.image.url}`;
    }
    // Otherwise use fallback image based on index
    const fallbackIndex = index % fallbackImages.length;
    return fallbackImages[fallbackIndex];
  };

  // Console log to debug
  useEffect(() => {
    console.log('=== CATEGORIES DATA ===');
    console.log('Total categories:', category?.length);
    console.log('Categories:', category);
    
    if (category && category.length > 0) {
      category.forEach((cat, index) => {
        console.log(`\n--- Category ${index + 1}: ${cat?.Name} ---`);
        console.log('Document ID:', cat?.documentId);
        console.log('Has image from Strapi?', !!cat?.image?.url);
        console.log('Image object:', cat?.image);
        console.log('Image URL:', cat?.image?.url);
        console.log('Will use:', cat?.image?.url ? 'Strapi image' : `Fallback image ${index % fallbackImages.length + 1}`);
        console.log('Final image source:', getImageSource(cat, index));
      });
    }
  }, [category]);

  const handleNavigate = (categoryId) => {
    if (categoryId) {
      navigate(`/product/category/${categoryId}`);
    } else {
      navigate("/product");
    }
  };

  return (
    <section id="best-sell-section" className="md:px-[10%] sm:px-[5%] px-2 py-4 md:mt-8 sm:mt-4">
      <header className="text-center mb-6">
        <h2 className="md:text-2xl text-xl font-semibold">Explore Our Products</h2>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {category?.map((cat, idx) => (
          <div key={cat.documentId || idx} className="w-full aspect-[3/4]">
            <ReactFlipCard
              containerStyle={{ width: '100%', height: '100%' }}
              containerCss="clickable"
              flipTrigger={isMobile ? 'onClick' : 'onHover'}
              direction="horizontal"
              frontStyle={{
                borderRadius: '1rem',
                overflow: 'hidden',
                backgroundColor: "#1b7b31"
              }}
              backStyle={{
                borderRadius: '1rem',
                backgroundColor: '#ffffff',
                overflow: 'hidden',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '1.5rem',
                textAlign: 'center',
                border: "2px solid green",
                flexDirection: 'column'
              }}
              frontComponent={
                <motion.div
                  className="w-full h-full"
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 1 }}
                  viewport={{ once: true }}
                >
                  <img
                    src={getImageSource(cat, idx)}
                    alt={cat?.Name || `Category ${idx + 1}`}
                    className="w-full h-full object-cover"
                    loading="lazy"
                    onLoad={() => console.log(`✅ Image loaded for: ${cat?.Name}`, cat?.image?.url ? '(Strapi)' : '(Fallback)')}
                    onError={(e) => {
                      console.error(`❌ Image failed to load for: ${cat?.Name}`);
                      console.error('Failed URL:', e.target.src);
                    }}
                  />
                </motion.div>
              }
              backComponent={
                <div className="flex flex-col items-center justify-center h-full">
                  <h3 className="font-bold text-xl md:text-2xl text-black mb-3">
                    {cat?.Name}
                  </h3>
                  
                  {/* Dynamic description from Strapi */}
                  {cat?.description && (
                    <p className="text-sm text-gray-700 mb-4 leading-relaxed">
                      {cat.description}
                    </p>
                  )}
                  
                  <button
                    className="mt-auto bg-green-600 hover:bg-green-700 text-white px-6 py-2.5 rounded-full transition duration-300 font-medium"
                    onClick={() => handleNavigate(cat?.documentId)}
                  >
                    View Products
                  </button>
                </div>
              }
            />
          </div>
        ))}
      </div>

      {/* Empty state if no categories */}
      {(!category || category.length === 0) && (
        <div className="text-center py-12">
          <p className="text-gray-600">No categories available</p>
        </div>
      )}
    </section>
  );
};
