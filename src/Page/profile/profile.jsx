import { useState, useEffect } from "react";
import { Tabs, Tab, useMediaQuery } from "@mui/material";
import ImageComponent from "../../component/image/ImageComponent";
import { AccountSetting } from "./account-setting";
import { Cart } from "./cart";
import { Order } from "./order";
import { useSelector, useDispatch } from "react-redux";
import { Address } from "./address";
import { fetchOrders } from "../../feature/leafSlice";
import { useSearchParams } from "react-router-dom";
import {
  Person as PersonIcon,
  ShoppingCart as ShoppingCartIcon,
  Home as HomeIcon,
  ListAlt as ListAltIcon,
} from "@mui/icons-material";

export const Profile = () => {
  const [searchParams] = useSearchParams();
  const tabParam = searchParams.get('tab');
  
  // Map tab names to index
  const tabMap = {
    'account': 0,
    'cart': 1,
    'address': 2,
    'orders': 3
  };
  
  const [value, setValue] = useState(tabMap[tabParam] || 0);
  const user = useSelector((state) => state.leaf.user);
  const dispatch = useDispatch();
  
  const handleTabChange = (event, newValue) => {
    setValue(newValue);
  };

  // Fetch orders when component mounts or user changes
  useEffect(() => {
    if (user.id) {
      dispatch(fetchOrders(user.id));
    }
  }, [user.id, dispatch]);

  const isMobile = useMediaQuery("(max-width:768px)");

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 py-8 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Profile Header Card */}
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden mb-8">
          <div className="bg-gradient-to-r from-blue-600 via-blue-500 to-purple-600 h-32"></div>
          <div className="px-8 pb-8">
            <div className="flex md:flex-row flex-col md:items-end items-center gap-6 -mt-16">
              {/* Profile Picture */}
              <div className="relative">
                <div className="ring-4 ring-white rounded-full overflow-hidden bg-white shadow-xl">
                  <ImageComponent cardCss="size-32" variant="circular" />
                </div>
                <div className="absolute bottom-2 right-2 bg-green-500 rounded-full p-1 ring-4 ring-white">
                  <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                  </svg>
                </div>
              </div>

              {/* Profile Info */}
              <div className="flex-1 text-center md:text-left">
                <h1 className="text-3xl font-bold text-gray-900 mb-1">
                  {user?.name || "Guest User"}
                </h1>
                <p className="text-gray-600 flex items-center gap-2 justify-center md:justify-start">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z"/>
                    <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z"/>
                  </svg>
                  {user?.email}
                </p>
                <p className="text-gray-600 flex items-center gap-2 justify-center md:justify-start mt-1">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z"/>
                  </svg>
                  {user?.phone || "Not provided"}
                </p>
              </div>

              {/* Quick Stats */}
              <div className="flex gap-4">
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl px-6 py-4 text-center">
                  <p className="text-3xl font-bold text-blue-600">{user.addresses?.length || 0}</p>
                  <p className="text-xs text-gray-600 mt-1">Addresses</p>
                </div>
                <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl px-6 py-4 text-center">
                  <p className="text-3xl font-bold text-purple-600">0</p>
                  <p className="text-xs text-gray-600 mt-1">Orders</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs Section */}
        <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
          <Tabs
            value={value}
            onChange={handleTabChange}
            variant="scrollable"
            scrollButtons="auto"
            orientation={isMobile ? "vertical" : "horizontal"}
            sx={{
              borderBottom: 1,
              borderColor: "divider",
              backgroundColor: "white",
              padding: "0.5rem 1rem",
              "& .MuiTab-root": {
                textTransform: "none",
                fontWeight: 600,
                fontSize: "1rem",
                minHeight: "60px",
                borderRadius: "12px",
                margin: "0 0.25rem",
                transition: "all 0.3s",
                "&:hover": {
                  backgroundColor: "#f3f4f6",
                },
                "&.Mui-selected": {
                  color: "#2563eb",
                  backgroundColor: "#eff6ff",
                },
              },
              "& .MuiTabs-indicator": {
                height: "3px",
                borderRadius: "3px 3px 0 0",
                backgroundColor: "#2563eb",
              },
            }}
          >
            <Tab 
              icon={<PersonIcon />} 
              iconPosition="start"
              label={isMobile ? "" : "Account Settings"} 
            />
            <Tab 
              icon={<ShoppingCartIcon />} 
              iconPosition="start"
              label={isMobile ? "" : "Shopping Cart"} 
            />
            <Tab 
              icon={<HomeIcon />} 
              iconPosition="start"
              label={isMobile ? "" : "My Addresses"} 
            />
            <Tab 
              icon={<ListAltIcon />} 
              iconPosition="start"
              label={isMobile ? "" : "My Orders"} 
            />
          </Tabs>

          {/* Tab Content */}
          <div className="min-h-[500px]">
            {value === 0 && <AccountSetting />}
            {value === 1 && <Cart />}
            {value === 2 && <Address />}
            {value === 3 && <Order />}
          </div>
        </div>
      </div>
    </div>
  );
};
