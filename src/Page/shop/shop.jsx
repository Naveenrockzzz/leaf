import React, { useEffect, useState } from "react";
import { get } from "../../feature/api";
import { ShopCard } from "./shop-card";
import { Pagination } from "./Pagination";
import { useNavigate, useParams } from "react-router-dom";

export const Shop = () => {
  const [categories, setCategories] = useState([]);
  const [activeCategoryName, setActiveCategoryName] = useState("All Products");
  const [products, setProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 12;

  const { categoryId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await get("/categories");
        const fetched = res.data || [];
        setCategories(fetched);

        if (categoryId) {
          const selectedCategory = fetched.find(
            (cat) => cat.documentId === categoryId
          );
          if (selectedCategory) {
            setActiveCategoryName(selectedCategory.Name);
          } else {
            setActiveCategoryName("Unknown Category");
          }
        } else {
          setActiveCategoryName("All Products");
        }
      } catch (err) {
        // Handle error silently or show user-friendly message
      }
    };

    fetchCategories();
  }, [categoryId]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        let url = "/products?populate=*";
        if (categoryId) {
          url += `&filters[category][documentId][$eq]=${categoryId}`;
        }

        const res = await get(url);
        setProducts(res.data || []);
      } catch (err) {
        // Handle error silently or show user-friendly message
      }
    };

    fetchProducts();
  }, [categoryId]);

  const totalPages = Math.ceil(products.length / productsPerPage);
  const displayedProducts = products.slice(
    (currentPage - 1) * productsPerPage,
    currentPage * productsPerPage
  );

  const handleCategoryClick = (id, name) => {
    setCurrentPage(1);
    if (id) {
      navigate(`/product/category/${id}`);
    } else {
      navigate("/product");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Page Header */}
        <div className="text-center mb-12 mt-20">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            {activeCategoryName}
          </h1>
          <p className="text-gray-600 text-lg">
            Discover our curated collection of premium products
          </p>
        </div>

        {/* Category Pills */}
        <div className="bg-white rounded-3xl shadow-lg p-6 mb-8">
          <div className="flex flex-wrap justify-center gap-3">
            <button
              className={`group relative px-6 py-3 rounded-2xl font-medium text-sm transition-all duration-300 ${
                !categoryId
                  ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg scale-105"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200 hover:scale-105"
              }`}
              onClick={() => handleCategoryClick(null, "All Products")}
            >
              {!categoryId && (
                <span className="absolute -top-1 -right-1 flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-purple-500"></span>
                </span>
              )}
              <span className="flex items-center gap-2">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z"/>
                </svg>
                All Products
              </span>
            </button>

            {categories.map((category) => {
              const isActive = category.documentId === categoryId;
              return (
                <button
                  key={category.documentId}
                  className={`group relative px-6 py-3 rounded-2xl font-medium text-sm transition-all duration-300 ${
                    isActive
                      ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg scale-105"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200 hover:scale-105"
                  }`}
                  onClick={() =>
                    handleCategoryClick(category.documentId, category.Name)
                  }
                >
                  {isActive && (
                    <span className="absolute -top-1 -right-1 flex h-3 w-3">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-3 w-3 bg-purple-500"></span>
                    </span>
                  )}
                  {category.Name}
                </button>
              );
            })}
          </div>
        </div>

        {/* Products Grid */}
        {displayedProducts.length === 0 ? (
          <div className="bg-white rounded-3xl shadow-lg p-16 text-center">
            <div className="flex flex-col items-center gap-4">
              <div className="bg-gray-100 rounded-full p-8">
                <svg className="w-24 h-24 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"/>
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-900">No Products Found</h3>
              <p className="text-gray-600">We couldn't find any items in this category yet.</p>
              <button
                onClick={() => handleCategoryClick(null, "All Products")}
                className="mt-4 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-2xl font-medium hover:shadow-lg transition-all duration-300"
              >
                View All Products
              </button>
            </div>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-12">
              {displayedProducts.map((item, index) => (
                <ShopCard key={item.documentId || index} id={index} item={item} />
              ))}
            </div>

            {totalPages > 1 && (
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={(newPage) => {
                  if (newPage >= 1 && newPage <= totalPages) {
                    setCurrentPage(newPage);
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }
                }}
              />
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Shop;
