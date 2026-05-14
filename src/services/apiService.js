import axios from './axiosInstanse';

const token = localStorage.getItem('token');
const config = {
  headers: {
    Authorization: `Bearer ${localStorage.getItem('token') || token}`,
    'Content-Type': 'application/json'
  }
};
const configwithform = {
  headers: {
    Authorization: `Bearer ${token}`,
    'Content-Type': 'multipart/form-data'
  }
};

const getVendorAuthHeaders = () => {
  const vendorToken = localStorage.getItem('vendor_ini_token') || localStorage.getItem('user_token');
  return vendorToken ? { Authorization: `Bearer ${vendorToken}` } : {};
};

const getVendorJsonConfig = () => ({
  headers: {
    ...getVendorAuthHeaders(),
    'Content-Type': 'application/json'
  }
});
const getVendorFormConfig = () => ({
  headers: {
    ...getVendorAuthHeaders(),
    'Content-Type': 'multipart/form-data'
  }
});

//

// Fetch all categories
export const getAllCategories = async () => {
  try {
    const response = await axios.post('/category/fetch-categories', { is_web: true }, config);
    return { success: true, data: response.data.categories || [] };
  } catch (error) {
    console.error('Failed to fetch categories:', error);
    return { success: false, error: error.response?.data || 'Something went wrong' };
  }
};
export const getAllSubCategoriesbyID = async (catID) => {
  try {
    const response = await axios.post('/subcategory/subcategoriesbycatID', { catID }, config);
    return { success: true, data: response.data.subcategories || [] };
  } catch (error) {
    console.error('Failed to fetch subcategories:', error);
    return { success: false, error: error.response?.data || 'Something went wrong' };
  }
};
export const getAllSubCategories = async () => {
  try {
    const response = await axios.post('/subcategory/fetch-subcategories', { is_web: true }, config);
    return { success: true, data: response.data.subcategories || [] };
  } catch (error) {
    console.error('Failed to fetch subcategories:', error);
    return { success: false, error: error.response?.data || 'Something went wrong' };
  }
};
export const getAllProducts = async (options = {}) => {
  try {
    const vendorId = options?.vendorId;

    if (vendorId) {
      const response = await axios.post(
        "/products/getallproductsbyvendorID",
        { vendor_id: vendorId },
        config
      );

      return { success: true, data: response.data?.product || response.data?.products || [] };
    }

    const response = await axios.post("/products/getproducts", {},config);

    return { success: true, data: response.data?.products || [] };
  } catch (error) {
    console.error('Failed to fetch products:', error);
    return { success: false, error: error.response?.data || 'Something went wrong' };
  }
}


// ✅ Update a product
export const updateProduct = async (formData) => {
  try {
    const response = await axios.post('/products/update-products', formData, configwithform);
    return { success: response.data.success !== undefined ? response.data.success : true, data: response.data };
  } catch (error) {
    console.error('Failed to update product:', error);
    return { success: false, error: error.response?.data || error.message };
  }
}

// ✅ Add a new product brand
export const addProductBrand = async (formData) => {
  try {
    const response = await axios.post('/productbrands/product-brands', formData, configwithform);
    return { success: true, data: response.data };
  } catch (error) {
    console.error('Failed to add product brand:', error);
    return { success: false, error: error.response?.data || 'Failed to add product brand' };
  }
}

// ✅ Update a product brand
export const updateProductBrand = async (formData) => {
  try {
    const response = await axios.put('/productbrands/product-brands', formData, configwithform);
    return { success: true, data: response.data };
  } catch (error) {
    console.error('Failed to update product brand:', error);
    return { success: false, error: error.response?.data || error.message };
  }
}

// ✅ Delete a product brand
export const deleteProductBrand = async (id) => {
  try {
    const response = await axios.delete('/productbrands/product-brands', {
      ...config,
      data: { id }
    });
    return { success: true, data: response.data };
  } catch (error) {
    console.error('Failed to delete product brand:', error);
    return { success: false, error: error.response?.data || error.message };
  }
}

// update category divs
export const saveproductCategories = async (category, index) => {
  try {
    const payload = { category, index };
    const response = await axios.put('/dynamiccat/save-categories', payload, config);
    return response.data;
  } catch (error) {
    console.error('Failed to update category', error);
    throw error;
  }
}

// fetch product brands
export const productfetchBrands = async () => {
  try {
    const response = await axios.get('/productbrands/allproduct-brands', configwithform);
    console.log('brands', response.data.productBrands);
    return { success: true, data: response.data.productBrands || [] };
  } catch (error) {
    // setError is not defined in this scope, so just log the error
    console.error('Failed to fetch brands:', error);
    return { success: false, error: error.response?.data || error.message };
  }
}

export const getShowSelectedCategory = async (index) => {
    try {
        const response = await axios.post("/dynamiccat/showselectedcategory", { index },config);
        return { success: true, data: response.data.products };
    } catch (error) {
        console.error("Failed to fetch selected category:", error);
        return { success: false, error: error.response?.data || "Something went wrong" };
    }
};

export const addBanner = async (formData) => {
    try {
        const response = await axios.post("/banners/app-banners", formData, configwithform);
        return { success: true, data: response.data };
    } catch (error) {
        console.error("Failed to add banner:", error);
        return { success: false, error: error?.response?.data || "Failed to add banner" };
    }
};

export const addCategory = async (formData) => {
    try {
        const response = await axios.post(`/category/categories`, formData, configwithform);
        return { success: true, data: response.data };
    } catch (error) {
        return { success: false, error: error.response?.data || error.message };
    }
};

export const getAllBanners = async () => {
    try {
        const response = await axios.get("/banners/app-banners",config);
        return { success: true, data: response.data.banners};
    } catch (error) {
        console.error("Failed to fetch products:", error);
        return { success: false, error: error.response?.data || "Something went wrong" };
    }
};

export const deleteBanner = async (bannerId) => {
  
    try {
      if (!bannerId) throw new Error("Banner ID is required");
  
        await axios.delete(`/banners/app-banners`, {
        ...config,
        data: { id: bannerId }, // ✅ Proper way to pass data in DELETE request
      });
      return { success: true };
    } catch (error) {
      console.error("Error deleting banner:", error);
      return { success: false, message: error.response?.data?.message || "Failed to delete banner" };
    }
  };

  export const deletecategory = async (categoryID) => {
    console.log("id",categoryID)
    try {
      if (!categoryID) throw new Error("Category ID is required");
  
        await axios.delete(`/category/categories`, {
        ...config,
        data: { id: categoryID }, // ✅ Proper way to pass data in DELETE request
      });
      return { success: true };
    } catch (error) {
      console.error("Error deleting banner:", error);
      return { success: false, message: error.response?.data?.message || "Failed to delete banner" };
    }
  };

  export const updateBanner = async (payload) => {
    try {
      let formData;
      if (payload instanceof FormData) {
        formData = payload;
      } else {
        formData = new FormData();
        if (!payload || !payload.id) throw new Error("Missing banner id");
        formData.append("id", payload.id);
        if (payload.title !== undefined) formData.append("title", payload.title);
        if (payload.status !== undefined) {
          const statusVal = typeof payload.status === 'boolean' ? (payload.status ? 1 : 0) : payload.status;
          formData.append("status", statusVal);
        }
        if (payload.image_url instanceof File) {
          formData.append("banner_image", payload.image_url);
        }
      }
  
      const response = await axios.put(`/banners/app-banners`, formData, configwithform);
  
      return { success: true, data: response.data.banner };
    } catch (err) {
      console.error("Update failed:", err.response?.data || err.message);
      throw err;
    }
  };
  export const updateCategory = async (selectedCategory) => {
    try {
      const formData = new FormData();
      formData.append("id", selectedCategory.id);
      formData.append("name", selectedCategory.name);
      formData.append("description", selectedCategory.description);
      // Do NOT send status/approval fields
      if (selectedCategory.category_logo instanceof File) {
        formData.append("category_logo", selectedCategory.category_logo); // New image
      } else if (selectedCategory.category_logo) {
        formData.append("existing_category_logo", selectedCategory.category_logo); // Retain existing image
      }
      const response = await axios.put(`/category/categories`, formData, configwithform);
      return { success: true, data: response.data.category };
    } catch (err) {
      console.error("Update failed:", err.response?.data || err.message);
      return { success: false, error: err.response?.data || err.message };
    }
  };
  export const getAllUnverifiedUsers = async () => {
    try {
        const response = await axios.get(`/users/unverifiedUsers`, config); // ✅ Pass directly
        return { success: true, vendors: response.data.vendors, delivery_partners: response.data.delivery_partners };
    } catch (error) {
        console.error("Error fetching unverified vendors:", error);
        return { success: false, data: [] };
    }
};

export const verifyUser = async (userId,verification_status) => {
    try {
      const response = await axios.put(
        `/users/verify-user`, 
        { userId,verification_status },
        config
      );
      console.log(response.data)
      return response.data;
    } catch (error) {
      console.error("Verification failed:", error);
      return { success: false };
    }
};

export const getAllDiscounts = async () => {
    try {
        const response = await axios.get("/productdiscount/get-discounts", config); // remove empty object; only config needed
        return response.data;
    } catch (error) {
        console.error("❌ Failed to fetch discounts:", error);
        return { success: false, error: error.response?.data || "Something went wrong" };
    }
};


export const saveOrUpdateDiscount = async (selected) => {
    try {
  
      const formData = new FormData();
      Object.entries(selected).forEach(([key, value]) => {
        formData.append(key, value);
      });
  
      const url = selected.id
        ? `/productdiscount/update-discount`
        : `/productdiscount/add-update-discount`;
  
      const method = selected.id ? "put" : "post";
  
      const res = await axios[method](url, formData, config);
      return { success: true, data: res.data };
    } catch (err) {
      return {
        success: false,
        error: err.response?.data || err.message,
      };
    }
  };
  
  
//   Delete a product discount
export const deleteDiscount = async (discount_id) => {
    try {
      const token = localStorage.getItem("token");
  
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        data: { discount_id }, // 👈 send id in request body
      };
  
      await axios.delete(`/productdiscount/delete-discount`, config);
      return { success: true };
    } catch (err) {
      return { success: false, error: err.response?.data || err.message };
    }
  };

export const updateSubCategory = async (formData) => {
  try {
    const token = localStorage.getItem("token");
    const config = {
      headers: {
        Authorization: token ? `Bearer ${token}` : "",
        "Content-Type": "multipart/form-data",
      },
    };
    const response = await axios.put(`/subcategory/subcategories`, formData, config);
    return { success: true, data: response.data.subcategories };
  } catch (err) {
    return { success: false, error: err.response?.data || err.message };
  }
};

export const deleteSubCategory = async (subcategoryId) => {
  try {
    const token = localStorage.getItem("token");
    const config = {
      headers: { Authorization: token ? `Bearer ${token}` : "" },
      data: { id: subcategoryId },
    };
    await axios.delete(`/subcategory/subcategories`, config);
    return { success: true };
  } catch (err) {
    return { success: false, error: err.response?.data || err.message };
  }
};

// Toggle subcategory status (only id and status as FormData)
export const updateCategoryStatus = async (categoryId, status) => {
  try {
    const formData = new FormData();
    formData.append('id', categoryId);
    formData.append('status', status);
    const response = await axios.put(`/category/categories`, formData, configwithform);
    return { success: true, data: response.data };
  } catch (error) {
    return { success: false, error: error.response?.data || error.message };
  }
};

export const addProduct = async (formData) => {
  try {
  
    const config = {
      headers: {
        Authorization: token ? `Bearer ${token}` : "",
        "Content-Type": "multipart/form-data",
      },
    };
    const response = await axios.post(`/products/products`, formData, config);
    return { success: true, data: response.data };
  } catch (error) {
    console.log(error);
    
    return { success: false, error: error.response?.data || error.message };
  }
};



export const getProductById = async (id) => {
  try {
    const response = await axios.post(`/products/productbyid`,{id},config);    
    return response.data;
  } catch (error) {
    return { success: false, message: error.message, data: [] };
  }
};

export const getAllVendors = async (active = false) => {   
  try {
    
    const response = await axios.get(`/vendors/getallvendorsforadmin${active ? "?filter=active":""}`,config);
    return response.data;
  } catch (error) {
    return { success: false, message: error.message, data: [] };
  }
};

export const getVendorById = async (id) => {
  try {
    const response = await axios.get(`/vendors/getallvendorsforadminbyID/${id}`, config);
    return response.data;
  } catch (error) {
    return { success: false, message: error.message, data: null };
  }
};

export const getAllRiders = async (active = false) => {   
  try {
    
    const response = await axios.get(`/riders/getallridersforadmin${active ? "?filter=active":""}`,config);
    return response.data;
  } catch (error) {
    return { success: false, message: error.message, data: [] };
  }
};
// Vendor Type APIs
export const createVendorType = async (formData) => {
  try {
    const response = await axios.post(`/vendors/type`, formData, configwithform);
    return { success: true, data: response.data };
  } catch (error) {
    return { success: false, error: error.response?.data || error.message };
  }
};

export const getAllVendorTypes = async () => {
  try {
    const response = await axios.get(`/vendors/type`, config);
    return { success: true, data: response.data.data || [] };
  } catch (error) {
    return { success: false, error: error.response?.data || error.message };
  }
};

export const getVendorTypesForSignup = async () => {
  try {
    const response = await axios.get(`/vendors/type`, getVendorJsonConfig());
    return { success: true, data: response.data.data || [] };
  } catch (error) {
    return { success: false, error: error.response?.data || error.message };
  }
};

export const updateVendorType = async (id, formData) => {
  try {
    const response = await axios.put(`/vendors/type/${id}`, formData, configwithform);
    return { success: true, data: response.data };
  } catch (error) {
    return { success: false, error: error.response?.data || error.message };
  }
};

export const deleteVendorType = async (id) => {
  try {
    const response = await axios.delete(`/vendors/type/${id}`, config);
    return { success: true, data: response.data };
  } catch (error) {
    return { success: false, error: error.response?.data || error.message };
  }
};




// Toggle vendor status
export const updateVendorStatus = async (vendorId, newStatus) => {
  try {
    // const token = localStorage.getItem('token');
    const response = await axios.post(
      `/vendors/vendor-status`,
      {
        user_id: vendorId,
        status: newStatus,
        role_id: 1,
      },
     config
      
    );
    return { success: true, data: response.data };
  } catch (error) {
    return { success: false, error: error.response?.data || error.message };
  }
};
export const getRiderById = async (id) => {
  try {
    const response = await axios.get(`/riders/getallridersforadminbyID/${id}`, config);
    return response.data;
  } catch (error) {
    return { success: false, message: error.message, data: [] };
  }
};

export const updateRiderStatus = async (riderId, newStatus) => {
  try {
    // const token = localStorage.getItem('token');
    const response = await axios.post(
      `/riders/rider-status`,
      {
        user_id: riderId,
        status: newStatus,
        role_id: 1,
      },
     config
      
    );
    return { success: true, data: response.data };
  } catch (error) {
    return { success: false, error: error.response?.data || error.message };
  }
};

// Create Store - Vendor signup flow
export const vendorSignup = async (payload) => {
  try {
    const response = await axios.post(`/vendors/vendor-signup`, payload, getVendorJsonConfig());
    return { success: true, data: response.data };
  } catch (error) {
    return { success: false, error: error.response?.data || error.message };
  }
};

export const vendorVerification = async (formData) => {
  try {
    const response = await axios.post(`/vendors/vendor-verification`, formData, getVendorFormConfig());
    return { success: true, data: response.data };
  } catch (error) {
    return { success: false, error: error.response?.data || error.message };
  }
};

export const storeBusinessDetails = async (formData) => {
  try {
    const response = await axios.post(`/vendors/store-bussinessdetails`, formData, getVendorFormConfig());
    return { success: true, data: response.data };
  } catch (error) {
    return { success: false, error: error.response?.data || error.message };
  }
};

export const storeAdditionalDetails = async (formData) => {
  try {
    const response = await axios.post(`/vendors/store-additionaldetails`, formData, getVendorFormConfig());
    return { success: true, data: response.data };
  } catch (error) {
    return { success: false, error: error.response?.data || error.message };
  }
};

export const addBankDetails = async (formData) => {
  try {
    const response = await axios.post(`/users/addbankdetails`, formData, getVendorFormConfig());
    return { success: true, data: response.data };
  } catch (error) {
    return { success: false, error: error.response?.data || error.message };
  }
};

export const deleteProduct = async (product_ids) => {
  try {
    const response = await axios.delete(`/products/products`, {
      ...config,             // includes your headers
      data: { product_ids }  // includes your body (important!)
    });
    return { success: true, data: response.data };
  } catch (error) {
    return { success: false, error: error.response?.data || error.message };
  }
};

// Vendor dashboard analytics by date range (hourly if same day, else daily)
export const getVendorAnalytics = async (vendor_Id, start_date, end_date) => {
  try {
    const payload = { vendor_Id, start_date, end_date,role_id:3, };
    const response = await axios.post(`/vendors/vendordashboard-analytics`, payload, config);
    return { success: true, data: response.data || [] };
  } catch (error) {
    return { success: false, error: error.response?.data || error.message };
  }
};

// Rider dashboard analytics by date range (hourly if same day, else daily)
export const getRiderAnalytics = async (rider_Id, start_date, end_date) => {
  try {
    const payload = { rider_Id, start_date, end_date, role_id: 2 };
    const response = await axios.post(`/riders/riderdashboard-analytics`, payload, config);
    return { success: true, data: response.data || [] };
  } catch (error) {
    return { success: false, error: error.response?.data || error.message };
  }
};
