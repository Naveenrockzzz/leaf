import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import EditIcon from "@mui/icons-material/Edit";
import { deleteAddress, loginUser } from "../../feature/leafSlice";
import { Link } from "react-router-dom";
export const Address = ({ setOrderValue }) => {
  const { addresses } = useSelector((state) => state.leaf.user);
  const dispatch = useDispatch();
  const [selectedAddress, setSelectedAddress] = useState(null);

  const SelectAddress = (address) => {
    setSelectedAddress(address);
    // Store selected address in localStorage for payment step
    localStorage.setItem('selectedAddress', JSON.stringify(address));
    setOrderValue(2);
  };


  return (
    <div className="p-8 w-full min-h-[400px]">
      {addresses?.length === 0 ? (
        /* Empty State */
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="bg-gradient-to-br from-blue-100 to-purple-100 rounded-full p-12 mb-6">
            <svg className="w-20 h-20 text-indigo-600" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd"/>
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-3">No Delivery Address Found</h2>
          <p className="text-gray-600 mb-8 max-w-md">
            Please add a delivery address to continue with your order
          </p>
              <Link
                to="/address"
                className="px-8 py-4 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-2xl font-semibold text-lg hover:shadow-2xl hover:scale-105 transition-all duration-300"
              >
                + Add New Address
              </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Select Delivery Address</h2>
              <p className="text-gray-600 text-sm mt-1">Choose where you want your order delivered</p>
            </div>
            <Link
              to="/address"
              className="px-4 py-2 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-xl font-medium hover:shadow-lg transition-all duration-300 text-sm"
            >
              + Add New
            </Link>
          </div>

          {/* Address Cards */}
          <div className="grid md:grid-cols-2 gap-4">
            {addresses?.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                onClick={() => SelectAddress(item)}
                className={`
                  relative group cursor-pointer rounded-2xl p-6 transition-all duration-300
                  ${selectedAddress?.documentId === item?.documentId 
                    ? 'bg-gradient-to-br from-green-50 to-green-100 border-2 border-green-500 shadow-lg' 
                    : 'bg-white border-2 border-gray-200 hover:border-green-300 hover:shadow-md'
                  }
                `}
              >
                {/* Selected Indicator */}
                {selectedAddress?.documentId === item?.documentId && (
                  <div className="absolute top-4 right-4">
                    <div className="bg-gradient-to-r from-green-600 to-green-700 text-white rounded-full p-1">
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                      </svg>
                    </div>
                  </div>
                )}

                {/* Address Icon */}
                <div className="mb-3">
                  <div className={`inline-flex p-3 rounded-xl ${
                    selectedAddress?.documentId === item?.documentId 
                      ? 'bg-green-100' 
                      : 'bg-gray-100 group-hover:bg-green-50'
                  }`}>
                    <svg className={`w-6 h-6 ${
                      selectedAddress?.documentId === item?.documentId 
                        ? 'text-green-600' 
                        : 'text-gray-600 group-hover:text-green-600'
                    }`} fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd"/>
                    </svg>
                  </div>
                </div>

                {/* Address Details */}
                <div className="mb-4">
                  <p className="text-gray-800 font-medium leading-relaxed">
                    {item?.address1}, {item?.address2}
                  </p>
                  <p className="text-gray-600 mt-1">
                    {item?.city}, {item?.district}
                  </p>
                  <p className="text-gray-600">
                    {item?.state} - {item?.pin_code}
                  </p>
                </div>

                {/* Edit Button */}
                <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                  <span className={`text-sm font-semibold ${
                    selectedAddress?.documentId === item?.documentId 
                      ? 'text-green-600' 
                      : 'text-gray-600'
                  }`}>
                    {selectedAddress?.documentId === item?.documentId ? 'Selected' : 'Click to select'}
                  </span>
                  <Link 
                    to={`/address/${item?.documentId}`}
                    onClick={(e) => e.stopPropagation()}
                    className="text-green-600 hover:text-green-700 font-medium text-sm flex items-center gap-1 hover:underline"
                  >
                    <EditIcon sx={{ fontSize: 16 }} />
                    Edit
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Continue Button */}
          {selectedAddress && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gradient-to-br from-green-50 to-green-100 rounded-2xl p-6 border-2 border-green-300"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="bg-green-500 text-white rounded-full p-2">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                    </svg>
                  </div>
                  <div>
                    <p className="font-semibold text-green-800">Address Selected!</p>
                    <p className="text-sm text-green-700">Ready to proceed to payment</p>
                  </div>
                </div>
                <button
                  onClick={() => setOrderValue(2)}
                  className="px-6 py-3 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-xl font-bold hover:shadow-lg hover:scale-105 transition-all duration-300"
                >
                  Continue to Payment →
                </button>
              </div>
            </motion.div>
          )}
        </div>
      )}
    </div>
  );
};
