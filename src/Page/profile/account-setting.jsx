import React, { useEffect, useState } from "react";
import { Tabs, Tab, TextField, Button, Box, Typography } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { UpdateUserDetails } from "../../feature/leafSlice";
import { toast } from "react-toastify";
export const AccountSetting = () => {
  const [editMode, setEditMode] = useState(false);
  const user = useSelector((state) => state.leaf.user);
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    alternatePhone: "",
  });
  const handleChange = (event) => {
    setFormData({ ...formData, [event.target.name]: event.target.value });
  };

  useEffect(() => {
    if (user) {
      setFormData({
        name: user?.name || "",
        email: user?.email || "",
        phone: user?.phone || "",
        alternatePhone: user?.alternatePhone || "",
      });
    }
  }, [user]);
  const handleEdit = () => {
    setEditMode(!editMode);
  };

  const handleSave = () => {
    dispatch(UpdateUserDetails({ id: user?.id, data: formData }))
      .unwrap()
      .then((res) => {
        toast.success("User details updated successfully!");
        setEditMode(false);
      })
      .catch((err) => {
        toast.error(err?.message || "Failed to update user details", {
          position: "top-right",
        });
      });
  };
  return (
    <div className="bg-gradient-to-br from-gray-50 to-blue-50 p-8 w-full min-h-[400px]">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Personal Information</h2>
              <p className="text-gray-500 text-sm mt-1">Update your account details</p>
            </div>
            <div className="flex gap-3">
              {!editMode ? (
                <button
                  onClick={handleEdit}
                  className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl font-medium hover:from-blue-700 hover:to-blue-800 transition-all duration-300 shadow-md hover:shadow-lg"
                >
                  Edit Profile
                </button>
              ) : (
                <>
                  <button
                    onClick={handleEdit}
                    className="px-6 py-2.5 bg-gray-200 text-gray-700 rounded-xl font-medium hover:bg-gray-300 transition-all duration-300"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSave}
                    className="px-6 py-2.5 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-xl font-medium hover:from-green-700 hover:to-green-800 transition-all duration-300 shadow-md hover:shadow-lg"
                  >
                    Save Changes
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Form Fields */}
          <div className="space-y-6">
            {/* Name */}
            <div className="relative">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Full Name
              </label>
              <TextField
                fullWidth
                disabled={!editMode}
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter your full name"
                variant="outlined"
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '12px',
                    backgroundColor: editMode ? 'white' : '#f9fafb',
                    '&:hover fieldset': {
                      borderColor: editMode ? '#3b82f6' : '#e5e7eb',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: '#3b82f6',
                      borderWidth: '2px',
                    },
                  },
                }}
              />
            </div>

            {/* Email */}
            <div className="relative">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Email Address
              </label>
              <TextField
                fullWidth
                disabled={!editMode}
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="your.email@example.com"
                variant="outlined"
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '12px',
                    backgroundColor: editMode ? 'white' : '#f9fafb',
                    '&:hover fieldset': {
                      borderColor: editMode ? '#3b82f6' : '#e5e7eb',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: '#3b82f6',
                      borderWidth: '2px',
                    },
                  },
                }}
              />
            </div>

            {/* Phone */}
            <div className="relative">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Phone Number
              </label>
              <TextField
                fullWidth
                disabled={!editMode}
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="+91 98765 43210"
                variant="outlined"
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '12px',
                    backgroundColor: editMode ? 'white' : '#f9fafb',
                    '&:hover fieldset': {
                      borderColor: editMode ? '#3b82f6' : '#e5e7eb',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: '#3b82f6',
                      borderWidth: '2px',
                    },
                  },
                }}
              />
            </div>

            {/* Alternate Phone */}
            <div className="relative">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Alternate Phone Number
                <span className="text-gray-400 text-xs ml-2">(Optional)</span>
              </label>
              <TextField
                fullWidth
                disabled={!editMode}
                name="alternatePhone"
                value={formData.alternatePhone}
                onChange={handleChange}
                placeholder="+91 98765 43210"
                variant="outlined"
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '12px',
                    backgroundColor: editMode ? 'white' : '#f9fafb',
                    '&:hover fieldset': {
                      borderColor: editMode ? '#3b82f6' : '#e5e7eb',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: '#3b82f6',
                      borderWidth: '2px',
                    },
                  },
                }}
              />
            </div>
          </div>
        </div>

        {/* Info Cards */}
        <div className="grid md:grid-cols-2 gap-4">
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-6 text-white shadow-lg">
            <div className="flex items-center gap-3">
              <div className="bg-white/20 rounded-xl p-3">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z"/>
                </svg>
              </div>
              <div>
                <p className="text-sm text-blue-100">Account Status</p>
                <p className="text-xl font-bold">Active Member</p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-2xl p-6 text-white shadow-lg">
            <div className="flex items-center gap-3">
              <div className="bg-white/20 rounded-xl p-3">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                </svg>
              </div>
              <div>
                <p className="text-sm text-green-100">Profile Status</p>
                <p className="text-xl font-bold">Verified</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
