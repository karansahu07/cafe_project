import { useState, useEffect, useCallback, useMemo } from 'react';
import { getAllProducts, getAllCategories, getAllSubCategories, productfetchBrands, deleteProduct } from '../../../services/apiService';
import axios from 'axios';
import orderBy from 'lodash/orderBy';
import { getResolvedRoleId, getResolvedVendorId } from '../../../utils/authSession';

export default function useProductTable() {
  // Filters
  const [nameFilter, setNameFilter] = useState("");
  const [categoryFilter, setCategoryFilter] = useState([]);
  const [subCategoryFilter, setSubCategoryFilter] = useState([]);
  const [isFeaturedFilter, setIsFeaturedFilter] = useState();
  const [isTodayDealFilter, setIsTodayDealFilter] = useState();

  // Data
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });
  const [sorter, setSorter] = useState({});

  // Modal and form state
  const [show, setShow] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [formState, setFormState] = useState({});

  // Category/brand/subcategory
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [subCategories, setSubCategories] = useState([]);

  // Image preview state
  const [previewImage, setPreviewImage] = useState("");
  const [previewImages, setPreviewImages] = useState([]);

  const BASE_URL = import.meta.env.VITE_IMAGE_BASE_URL;
  const API_URL = import.meta.env.VITE_API_URL;
  const token = localStorage.getItem("token");
  const roleId = getResolvedRoleId();
  const isVendorUser = Number(roleId) === 3;
  const vendorId = getResolvedVendorId();

  // Fetch categories, brands, subcategories on mount
  useEffect(() => {
    getAllCategories().then((res) => {
      if (res.success) setCategories(res.data);
    });
    getAllSubCategories().then((res) => {
      if (res.success) setSubCategories(res.data);
    });
    productfetchBrands().then((res) => {
      if (res.success) setBrands(res.data);
    });
  }, []);

  // Memoize filters
  const filters = useMemo(() => ({
    name: nameFilter,
    categories: categoryFilter,
    subCategories: subCategoryFilter,
    is_featured: isFeaturedFilter,
    is_today_deal: isTodayDealFilter,
  }), [nameFilter, categoryFilter, subCategoryFilter, isFeaturedFilter, isTodayDealFilter]);

  // Fetch and filter data
  const fetchData = useCallback(async (params = {}) => {
    setLoading(true);
    setError(null);
    try {
      const response = await getAllProducts({
        vendorId: isVendorUser ? vendorId : undefined,
        page: params.pagination?.current || pagination.current,
        pageSize: params.pagination?.pageSize || pagination.pageSize,
        sortField: params.sorter?.field,
        sortOrder: params.sorter?.order,
      });
      let products = response.success ? (response.data.products || response.data) : [];

      // Extra safety: if vendor user, keep only own store products on client too.
      if (isVendorUser && vendorId) {
        products = products.filter((p) => String(p.vendor_id) === String(vendorId));
      }
      // --- FILTERING (frontend) ---
      if (filters.name) {
        products = products.filter(p => p.name?.toLowerCase().includes(filters.name.toLowerCase()));
      }
      if (filters.categories && filters.categories.length > 0) {
        products = products.filter(p => filters.categories.includes(p.category_id));
      }
      if (filters.subCategories && filters.subCategories.length > 0) {
        products = products.filter(p => filters.subCategories.includes(p.sub_category));
      }
      if (filters.is_featured !== undefined) {
        products = products.filter(p => String(p.is_featured) === String(filters.is_featured));
      }
      if (filters.is_today_deal !== undefined) {
        products = products.filter(p => String(p.is_today_deal) === String(filters.is_today_deal));
      }
      // --- SORTING (frontend) ---
      if (params.sorter && params.sorter.field && params.sorter.order) {
        const order = params.sorter.order === 'ascend' ? 'asc' : 'desc';
        products = orderBy(products, [params.sorter.field], [order]);
      }
      setData(products);
      setPagination({
        ...pagination,
        current: params.pagination?.current || pagination.current,
        pageSize: params.pagination?.pageSize || pagination.pageSize,
        total: products.length,
      });
    } catch (err) {
      setError(err.message || 'Failed to fetch products');
    } finally {
      setLoading(false);
    }
  }, [pagination.current, pagination.pageSize, filters, isVendorUser, vendorId]);

  useEffect(() => {
    fetchData({ pagination, sorter });
  }, []);
  // }, [fetchData, pagination.current, pagination.pageSize, sorter, filters]);

  const onTableChange = (newPagination, filtersTable, newSorter) => {
    setPagination({
      ...pagination,
      current: newPagination.current,
      pageSize: newPagination.pageSize,
    });
    setSorter(newSorter);
    fetchData({
      pagination: newPagination,
      sorter: newSorter,
    });
  };

  // Modal logic
  const handleUpdate = (user) => {
    console.log(user);
    setSelectedUser(user);
    setFormState(user);
    // Set preview for featured image
    if (user && user.featured_image) {
      setPreviewImage(BASE_URL + user.featured_image);
    } else {
      setPreviewImage("");
    }
    // Set previews for gallery images
    if (user && Array.isArray(user.gallery_images)) {
      const galleryPreviews = user.gallery_images.map(img => {
        if (typeof img === 'string') return BASE_URL + img;
        if (img && img.image_path) return BASE_URL + img.image_path;
        return '';
      });
      setPreviewImages(galleryPreviews);
    } else {
      setPreviewImages([]);
    }
    setShow(true);
  };
  const handleDelete = (user) => {
    setSelectedUserId(user.id);
    setShowDeleteModal(true);
  };
  const handleClose = () => {
    setShow(false);
    setSelectedUser(null);
    setFormState({});
    setPreviewImage(""); // Reset preview image
    setPreviewImages([]); // Reset gallery previews
  };
  const handleCloseDeleteModal = () => {
    setShowDeleteModal(false);
    setSelectedUserId(null);
  };

  // Update product handler
  const handleSave = async () => {
    try {
      if (!token) return;
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data"
        }
      };

      const formData = new FormData();
      console.log(formState?.gallery_images);
      // return
      
      Object.entries(formState).forEach(([key, value]) => {
        if (
          key !== "featured_image" &&
          key !== "gallery_images" &&
          key !== "attributes" &&
          key !== "variants" &&
          key !== "addons" &&
          value !== undefined &&
          value !== null 
        ) {
          formData.append(key, value);
        }
      });
      if (Array.isArray(formState?.attributes) && formState?.attributes.length > 0) {
        formData.append("attributes", JSON.stringify(formState?.attributes));
      }

      // Append featured image if it's a File
      if (formState.featured_image instanceof File) {
        formData.append("featuredImage", formState.featured_image);
      }

      // Append gallery images (both new files and existing URLs)
      if (formState.gallery_images && formState.gallery_images.length > 0) {
        formState.gallery_images.forEach((file) => {
          if (file instanceof File) {
            formData.append("galleryImages", file); // New upload
          } else if (typeof file === 'string') {
            formData.append("existingGalleryImages", file); // Already a URL
          } else if (file && typeof file === 'object') {
            // Try to extract URL from known properties
            if (file.image_path) {
              formData.append("existingGalleryImages", file.image_path);
            } else if (file.url) {
              formData.append("existingGalleryImages", file.url);
            } else {
              // Fallback: toString (should not happen)
              formData.append("existingGalleryImages", String(file));
            }
          }
        });
      }
      // if (Array.isArray(formState?.variants) && formState?.variants.length > 0) {
      //   formData.append("variants", JSON.stringify(formState?.variants));
      // }
      // if (Array.isArray(formState?.addons) && formState?.addons.length > 0) {
      //   formData.append("addons", JSON.stringify(formState?.addons));
      // }
      const response = await axios.post(`${API_URL}/products/update-products`, formData, config);
      if (response.data.success) {
        // Update only the edited product in local data
        setData(prevData => prevData.map(product =>
          product.id === formState.id ? { ...product, ...response.data.product } : product
        ));
        handleClose();
        // Do NOT refetch all products
      } else {
        alert("Failed to update product");
      }
    } catch (err) {
      alert("Error updating product");
    }
  };

  // Delete product handler
  const confirmDelete = async () => {
    try {
      if (!token) return;
      const config = {
        headers: { Authorization: `Bearer ${token}` },
        data: { id: selectedUserId },
      };
      const response = await  deleteProduct ([selectedUserId]);
      if (response.data.success) {
        handleCloseDeleteModal();
        onTableChange(pagination, {}, {}); // refresh table
      } else {
        alert("Failed to delete product");
      }
    } catch (err) {
      alert("Error deleting product");
    }
  };

  // Form change handler
  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormState((prev) => ({ ...prev, [name]: value }));
  };

  // Image handlers
  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setPreviewImage(imageUrl);
      setFormState((prev) => ({ ...prev, featured_image: file }));
    }
  };
  const handleGalleryImagesChange = (event) => {
    const files = Array.from(event.target.files);
    // Combine existing and new files
    const currentGallery = formState.gallery_images || [];
    const totalImages = currentGallery.length + files.length;
    if (totalImages > 5) {
      // Only allow up to 5 images
      const allowedFiles = files.slice(0, 5 - currentGallery.length);
      const imageUrls = allowedFiles.map(file => URL.createObjectURL(file));
      setPreviewImages(prev => [...prev, ...imageUrls].slice(0, 5));
      setFormState(prev => ({
        ...prev,
        gallery_images: [...currentGallery, ...allowedFiles].slice(0, 5),
      }));
    } else {
      const imageUrls = files.map(file => URL.createObjectURL(file));
      setPreviewImages(prev => [...prev, ...imageUrls]);
      setFormState(prev => ({
        ...prev,
        gallery_images: [...currentGallery, ...files],
      }));
    }
  };
  const handleDeleteFeaturedImage = () => {
    setFormState(prev => ({ ...prev, featured_image: null }));
    setPreviewImage("");
  };
  const handleDeleteGalleryImage = (index) => {
    setFormState(prev => {
      const updated = [...(prev.gallery_images || [])];
      updated.splice(index, 1);
      return { ...prev, gallery_images: updated };
    });
    setPreviewImages(prev => {
      const updated = [...prev];
      updated.splice(index, 1);
      return updated;
    });
  };

  // Toggle Featured (new version)
  const handleToggleFeatured = async (userId, isChecked) => {
    setLoading(true);
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json"
      }
    };
    const payload = {
      id: userId,
      is_featured: isChecked ? 1 : 0
    };
    try {
      const response = await axios.put(`${API_URL}/products/makeproductfeatures`, payload, config);
      setData((prevData) =>
        prevData.map((user) =>
          user.id === userId ? { ...user, is_featured: isChecked ? 1 : 0 } : user
        )
      );
    } catch (error) {
      console.error("Error updating featured status:", error.response?.data || error);
    } finally {
      setLoading(false);
    }
  };

  // Toggle Today Deal (new version)
  const handleToggleTodayDeal = async (userId, isChecked) => {
    setLoading(true);
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json"
      }
    };
    const payload = {
      id: userId,
      is_today_deal: isChecked ? 1 : 0
    };
    try {
      const response = await axios.put(`${API_URL}/products/makeproductweeklydeal`, payload, config);
      setData((prevData) =>
        prevData.map((user) =>
          user.id === userId ? { ...user, is_today_deal: isChecked ? 1 : 0 } : user
        )
      );
    } catch (error) {
      console.error("Error updating today's deal status:", error.response?.data || error);
    } finally {
      setLoading(false);
    }
  };

  return {
    // Filters and their setters
    nameFilter, setNameFilter,
    categoryFilter, setCategoryFilter,
    subCategoryFilter, setSubCategoryFilter,
    isFeaturedFilter, setIsFeaturedFilter,
    isTodayDealFilter, setIsTodayDealFilter,
    // Data and table logic
    data, loading, pagination, onTableChange, error,
    // Modal and form logic
    show, selectedUser, showDeleteModal, formState, categories, brands, subCategories, previewImage, previewImages,
    handleUpdate, handleDelete, handleClose, handleCloseDeleteModal, handleSave, confirmDelete, handleFormChange,
    handleImageChange, handleGalleryImagesChange, handleDeleteFeaturedImage, handleDeleteGalleryImage,
    handleToggleFeatured, handleToggleTodayDeal,
  };
}
