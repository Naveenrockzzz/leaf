import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { get, post, remove, update } from "./api";
import { storeLeafUser } from "../helper/helper";
const initialState = {
  leaf: [],
  activeTab: "Home",
  loading: false,

  user: {
    loading: false,
    addresses: [],
    name: "",
    email: "",
    id: "",
    phone: "",
    alternatePhone: "",
  },

  cart: [],
  order: [],
  wishList: [],
  category: [],
  product: [],

  OrderItem: [{ item: [], totalPrice: 0, address: {}, paymentInfo: {} }],
};

export const createUserData = createAsyncThunk(
  "user/create",
  async (user, { rejectWithValue }) => {
    try {
      const response = await post("/auth/signup", user);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Signup failed!");
    }
  }
);

export const loginUser = createAsyncThunk(
  "user/login",
  async (data, { rejectWithValue }) => {
    try {
      const response = await post("/auth/login", data);
      return response;
    } catch (error) {
      return rejectWithValue(error?.response?.data || "SignIn failed!");
    }
  }
);

export const createUserAddress = createAsyncThunk(
  "user/address",
  async (data, { rejectWithValue }) => {
    try {
      const res = await post("/addresses", { data: data });
      return res;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Something went wrong!");
    }
  }
);

export const fetchUserDetails = createAsyncThunk("user/details", async (id) => {
  try {
    const response = await get(`/user-accounts/${id}?populate=*`);
    return response.data;
  } catch (error) {
    return error;
  }
});

export const UpdateUserDetails = createAsyncThunk(
  "user/Updatedetails",
  async ({ id, data }) => {
    try {
      const response = await update(`/user-accounts/${id}`, { data });

      return response.data.data;
    } catch (error) {
      return error;
    }
  }
);

export const deleteAddress = createAsyncThunk(
  "user/deleteAddress",
  async (id) => {
    const response = await remove(`/addresses/${id}`);
    return id;
  }
);
export const UpdateUserAddress = createAsyncThunk(
  "user/UpdateAddress",
  async ({ id, data }) => {
    try {
      const response = await update(`/addresses/${id}`, { data });
      return response.data;
    } catch (error) {
      throw error;
    }
  }
);

export const fetchProductList = createAsyncThunk("shop/product", async () => {
  try {
    const response = await get(`/products?populate=*`);
    return response.data;
  } catch (error) {
    return error;
  }
});

export const fetchCategorytList = createAsyncThunk("category", async () => {
  try {
    const response = await get(`/categories?populate=*`);
    return response.data;
  } catch (error) {
    return error;
  }
});

// Review APIs
export const createReview = createAsyncThunk(
  "review/create",
  async (reviewData, { rejectWithValue }) => {
    try {
      const response = await post("/reviews", { data: reviewData });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to create review");
    }
  }
);

export const fetchReviews = createAsyncThunk(
  "review/fetch",
  async (productId) => {
    try {
      const response = await get(`/reviews?filters[product][documentId][$eq]=${productId}&populate=*`);
      return response.data;
    } catch (error) {
      return error;
    }
  }
);

// Order APIs
export const createOrder = createAsyncThunk(
  "order/create",
  async (orderData, { rejectWithValue }) => {
    try {
      const response = await post("/orders", { data: orderData });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to create order");
    }
  }
);

export const fetchOrders = createAsyncThunk(
  "order/fetch",
  async (userId) => {
    try {
      const response = await get(`/orders?filters[user][documentId][$eq]=${userId}&populate=*`);
      return response.data;
    } catch (error) {
      return error;
    }
  }
);

export const fetchOrderDetails = createAsyncThunk(
  "order/details",
  async (orderId) => {
    try {
      const response = await get(`/orders/${orderId}?populate=*`);
      return response.data;
    } catch (error) {
      return error;
    }
  }
);

// Wishlist APIs
export const addToWishlist = createAsyncThunk(
  "wishlist/add",
  async ({ userId, productId }, { rejectWithValue }) => {
    try {
      const response = await post("/wishlists", { 
        data: { 
          user: userId, 
          product: productId 
        } 
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to add to wishlist");
    }
  }
);

export const fetchWishlist = createAsyncThunk(
  "wishlist/fetch",
  async (userId) => {
    try {
      const response = await get(`/wishlists?filters[user][documentId][$eq]=${userId}&populate=*`);
      return response.data;
    } catch (error) {
      return error;
    }
  }
);

export const removeFromWishlist = createAsyncThunk(
  "wishlist/remove",
  async (wishlistId) => {
    try {
      await remove(`/wishlists/${wishlistId}`);
      return wishlistId;
    } catch (error) {
      return error;
    }
  }
);

// Cart APIs
export const addToCartAPI = createAsyncThunk(
  "cart/add",
  async ({ userId, productId, quantity }, { rejectWithValue }) => {
    try {
      const response = await post("/carts", { 
        data: { 
          user: userId, 
          product: productId,
          quantity: quantity 
        } 
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to add to cart");
    }
  }
);

export const fetchCart = createAsyncThunk(
  "cart/fetch",
  async (userId) => {
    try {
      const response = await get(`/carts?filters[user][documentId][$eq]=${userId}&populate=*`);
      return response.data;
    } catch (error) {
      return error;
    }
  }
);

export const updateCartAPI = createAsyncThunk(
  "cart/update",
  async ({ cartId, quantity }, { rejectWithValue }) => {
    try {
      const response = await update(`/carts/${cartId}`, { data: { quantity } });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to update cart");
    }
  }
);

export const removeFromCartAPI = createAsyncThunk(
  "cart/remove",
  async (cartId) => {
    try {
      await remove(`/carts/${cartId}`);
      return cartId;
    } catch (error) {
      return error;
    }
  }
);

const leafSlice = createSlice({
  name: "leaf",
  initialState,
  reducers: {
    setActiveTab: (state, action) => {
      state.activeTab = action.payload;
    },

    addToCart: (state, action) => {
      const item = action.payload;
      const existItem = state.cart.find((i) => i.id === item.id);
      if (existItem) {
        existItem.quantity += item.quantity || 1;
      } else {
        state.cart.push({ ...item, quantity: item.quantity || 1 });
      }
    },

    // Remove item from cart
    removeFromCart: (state, action) => {
      const id = action.payload;
      state.cart = state.cart.filter((item) => item.id !== id);
    },

    // Update item quantity
    updateCartItemQuantity: (state, action) => {
      const { id, quantity } = action.payload;
      const item = state.cart.find((item) => item.id === id);
      if (item) {
        item.quantity = quantity;
      }
    },

    // Clear cart
    clearCart: (state) => {
      state.cart = [];
    },
  },

  extraReducers: (builder) => {
    // signup
    builder
      .addCase(createUserData.pending, (state) => {
        state.user.loading = true;
        state.user.error = "";
      })
      .addCase(createUserData.fulfilled, (state, action) => {
        state.user.loading = false;
        localStorage.setItem("leafUserid", action?.payload?.user?.documentId);
      })
      .addCase(createUserData.rejected, (state, action) => {
        state.user.loading = false;
      });

    // login

    builder.addCase(loginUser.pending, (state, action) => {
      state.user.loading = true;
    });

    builder.addCase(loginUser.fulfilled, (state, action) => {
      state.user.loading = false;
      storeLeafUser(action.payload);
    });
    builder.addCase(loginUser.rejected, (state, action) => {
      state.user.loading = false;
    });

    //addresses
    builder.addCase(createUserAddress.pending, (state, action) => {
      state.user.loading = true;
    });
    builder.addCase(createUserAddress.fulfilled, (state, action) => {
      state.user.loading = false;
      state.user.addresses.push(action.payload);
    });
    builder.addCase(createUserAddress.rejected, (state, action) => {
      state.user.loading = false;
    });

    //user details

    builder.addCase(fetchUserDetails.pending, (state, action) => {
      state.loading = true;
    });
    builder.addCase(fetchUserDetails.fulfilled, (state, action) => {
      state.loading = false;
      (state.user.name = action.payload?.name),
        (state.user.email = action.payload?.email),
        (state.user.phone = action.payload?.phone),
        (state.user.alternatePhone = action.payload?.alternatePhone),
        (state.user.id = action.payload?.documentId),
        (state.user.addresses = action.payload.addresses);
    });

    builder.addCase(fetchUserDetails.rejected, (state, action) => {
      state.loading = false;
    });

    //update user  details

    builder.addCase(UpdateUserDetails.pending, (state, action) => {
      state.user.loading = true;
    });
    builder.addCase(UpdateUserDetails.fulfilled, (state, action) => {
      state.loading = false;
      (state.user.name = action.payload?.name),
        (state.user.email = action.payload?.email),
        (state.user.phone = action.payload?.phone),
        (state.user.alternatePhone = action.payload?.alternatePhone);
    });
    builder.addCase(UpdateUserDetails.rejected, (state, action) => {
      state.loading = false;
    });

    // delete Address

    builder.addCase(deleteAddress.pending, (state, action) => {
      state.user.loading = true;
    });
    builder.addCase(deleteAddress.fulfilled, (state, action) => {
      state.user.loading = false;
      state.user.addresses = state.user.addresses.filter(
        (item) => item.documentId !== action.payload
      );
    });
    builder.addCase(deleteAddress.rejected, (state, action) => {
      state.user.loading = false;
    });

    // update address
    builder.addCase(UpdateUserAddress.pending, (state, action) => {
      state.user.loading = true;
    });
    builder.addCase(UpdateUserAddress.fulfilled, (state, action) => {
      state.user.loading = false;
      const index = state.user.addresses.findIndex(
        (address) => address.documentId === action.payload.data.documentId
      );

      if (index !== -1) {
        state.user.addresses.splice(index, 1, action.payload.data);
      }
    });
    builder.addCase(UpdateUserAddress.rejected, (state, action) => {
      state.user.loading = false;
    });

    // Fetch Product List
    builder.addCase(fetchProductList.pending, (state, action) => {
      state.loading = true;
    });
    builder.addCase(fetchProductList.fulfilled, (state, action) => {
      state.loading = false;
      state.product = action.payload;
    });
    builder.addCase(fetchProductList.rejected, (state, action) => {
      state.loading = false;
    });

    // Fetch CategorytList
    builder.addCase(fetchCategorytList.pending, (state, action) => {
      state.loading = true;
    });
    builder.addCase(fetchCategorytList.fulfilled, (state, action) => {
      state.loading = false;
      state.category = action.payload;
    });
    builder.addCase(fetchCategorytList.rejected, (state, action) => {
      state.loading = false;
    });

    // Create Review
    builder.addCase(createReview.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(createReview.fulfilled, (state, action) => {
      state.loading = false;
    });
    builder.addCase(createReview.rejected, (state) => {
      state.loading = false;
    });

    // Fetch Reviews
    builder.addCase(fetchReviews.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(fetchReviews.fulfilled, (state, action) => {
      state.loading = false;
    });
    builder.addCase(fetchReviews.rejected, (state) => {
      state.loading = false;
    });

    // Create Order
    builder.addCase(createOrder.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(createOrder.fulfilled, (state, action) => {
      state.loading = false;
      state.order.push(action.payload);
    });
    builder.addCase(createOrder.rejected, (state) => {
      state.loading = false;
    });

    // Fetch Orders
    builder.addCase(fetchOrders.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(fetchOrders.fulfilled, (state, action) => {
      state.loading = false;
      state.order = action.payload;
    });
    builder.addCase(fetchOrders.rejected, (state) => {
      state.loading = false;
    });

    // Fetch Order Details
    builder.addCase(fetchOrderDetails.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(fetchOrderDetails.fulfilled, (state, action) => {
      state.loading = false;
    });
    builder.addCase(fetchOrderDetails.rejected, (state) => {
      state.loading = false;
    });

    // Add to Wishlist
    builder.addCase(addToWishlist.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(addToWishlist.fulfilled, (state, action) => {
      state.loading = false;
      state.wishList.push(action.payload);
    });
    builder.addCase(addToWishlist.rejected, (state) => {
      state.loading = false;
    });

    // Fetch Wishlist
    builder.addCase(fetchWishlist.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(fetchWishlist.fulfilled, (state, action) => {
      state.loading = false;
      state.wishList = action.payload;
    });
    builder.addCase(fetchWishlist.rejected, (state) => {
      state.loading = false;
    });

    // Remove from Wishlist
    builder.addCase(removeFromWishlist.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(removeFromWishlist.fulfilled, (state, action) => {
      state.loading = false;
      state.wishList = state.wishList.filter(item => item.id !== action.payload);
    });
    builder.addCase(removeFromWishlist.rejected, (state) => {
      state.loading = false;
    });

    // Add to Cart API
    builder.addCase(addToCartAPI.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(addToCartAPI.fulfilled, (state, action) => {
      state.loading = false;
    });
    builder.addCase(addToCartAPI.rejected, (state) => {
      state.loading = false;
    });

    // Fetch Cart
    builder.addCase(fetchCart.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(fetchCart.fulfilled, (state, action) => {
      state.loading = false;
      state.cart = action.payload;
    });
    builder.addCase(fetchCart.rejected, (state) => {
      state.loading = false;
    });

    // Update Cart
    builder.addCase(updateCartAPI.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(updateCartAPI.fulfilled, (state, action) => {
      state.loading = false;
    });
    builder.addCase(updateCartAPI.rejected, (state) => {
      state.loading = false;
    });

    // Remove from Cart API
    builder.addCase(removeFromCartAPI.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(removeFromCartAPI.fulfilled, (state, action) => {
      state.loading = false;
    });
    builder.addCase(removeFromCartAPI.rejected, (state) => {
      state.loading = false;
    });
  },
});
export const {
  setActiveTab,
  addToCart,
  removeFromCart,
  updateCartItemQuantity,
  clearCart,
} = leafSlice.actions;

export default leafSlice.reducer;
