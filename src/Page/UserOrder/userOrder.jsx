import React from "react";
import { useState } from "react";
import { useMediaQuery } from "@mui/material";
import { useSelector } from "react-redux";
import { Cart } from "./cart";
import { Address } from "./address";
import { Payment } from "./payment/payment";
import { ShoppingCart, LocationOn, Payment as PaymentIcon, CheckCircle } from "@mui/icons-material";
import { motion } from "framer-motion";

export const UserOrder = () => {
  const [orderValue, setOrderValue] = useState(0);
  const { cart } = useSelector((state) => state.leaf);
  const isMd = useMediaQuery("(max-width:768px)");

  const steps = [
    { label: "Cart", icon: ShoppingCart, step: 0 },
    { label: "Address", icon: LocationOn, step: 1 },
    { label: "Payment", icon: PaymentIcon, step: 2 },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 py-8 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Page Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Checkout</h1>
          <p className="text-gray-600">Complete your order in 3 easy steps</p>
        </div>

        {/* Progress Stepper */}
        <div className="bg-white rounded-3xl shadow-lg p-8 mb-8">
          <div className="flex items-center justify-between relative">
            {/* Progress Line */}
            <div className="absolute top-8 left-0 right-0 h-1 bg-gray-200 -z-10 hidden md:block">
              <div 
                className="h-full bg-gradient-to-r from-blue-600 to-purple-600 transition-all duration-500"
                style={{ width: `${(orderValue / (steps.length - 1)) * 100}%` }}
              />
            </div>

            {steps.map((step, index) => {
              const Icon = step.icon;
              const isCompleted = orderValue > step.step;
              const isActive = orderValue === step.step;
              
              return (
                <div key={step.step} className="flex-1 flex flex-col items-center">
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    className={`
                      relative w-16 h-16 rounded-full flex items-center justify-center mb-3 cursor-pointer transition-all duration-300
                      ${isCompleted ? 'bg-gradient-to-br from-green-500 to-green-600 shadow-lg' : 
                        isActive ? 'bg-gradient-to-br from-blue-600 to-purple-600 shadow-2xl ring-4 ring-blue-200' : 
                        'bg-gray-200'}
                    `}
                    onClick={() => setOrderValue(step.step)}
                  >
                    {isCompleted ? (
                      <CheckCircle sx={{ fontSize: 32, color: 'white' }} />
                    ) : (
                      <Icon sx={{ fontSize: 32, color: isActive ? 'white' : '#9ca3af' }} />
                    )}
                  </motion.div>
                  <span className={`
                    font-semibold text-sm md:text-base
                    ${isActive ? 'text-blue-600' : isCompleted ? 'text-green-600' : 'text-gray-500'}
                  `}>
                    {step.label}
                  </span>
                  {isActive && (
                    <motion.div
                      layoutId="activeStep"
                      className="mt-2 h-1 w-full bg-gradient-to-r from-blue-600 to-purple-600 rounded-full"
                    />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Content Area */}
        <motion.div
          key={orderValue}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
          className="bg-white rounded-3xl shadow-xl overflow-hidden"
        >
          {orderValue === 0 && <Cart setOrderValue={setOrderValue} />}
          {orderValue === 1 && <Address setOrderValue={setOrderValue} />}
          {orderValue === 2 && <Payment />}
        </motion.div>
      </div>
    </div>
  );
};
