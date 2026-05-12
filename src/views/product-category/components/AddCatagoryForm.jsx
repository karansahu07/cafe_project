import { useState, useEffect, useCallback } from 'react';
import { productfetchBrands, getAllCategories, addProductBrand, updateProductBrand, deleteProductBrand } from '../../services/apiService';

const API_URL = import.meta.env.VITE_API_URL;
const IMAGE_BASE_URL = import.meta.env.VITE_IMAGE_BASE_URL;
const token = localStorage.getItem('token');

export default function useBrandHook() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({ current: 1, pageSize: 10, total: 0 });
  const [sorter, setSorter] = useState({ field: 'name', order: 'ascend' });
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [categories, setCategories] = useState([]);
  const [editModal, setEditModal] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [selectedBrand, setSelectedBrand] = useState(null);
  const [previewImage, setPreviewImage] = useState("");
  const [formLoading, setFormLoading] = useState(false);

  // Fetch brands and categories
  const fetchData = useCallback(async (params = {}) => {
    setLoading(true);
    setError(null);
    try {
      const [catRes, brandRes] = await Promise.all([
        getAllCategories(),
        productfetchBrands(),
      ]);
      let brands = brandRes.success ? brandRes.data || [] : [];
      let cats = catRes.success ? catRes.data || [] : [];
      // Add category name to brands
      brands = brands.map((brand) => ({
        ...brand,
        category_name: cats.find((c) => c.id === brand.categoryid)?.name || 'N/A',
      }));
      // Search filter
      if (search) {
        brands = brands.filter((brand) =>
          brand.name.toLowerCase().includes(search.toLowerCase())
        );
      }
      // Category filter
      if (categoryFilter) {
        brands = brands.filter((brand) => String(brand.categoryid) === String(categoryFilter));
      }
      // Sorting
      if (params.sorter && params.sorter.field && params.sorter.order) {
        const { field, order } = params.sorter;
        brands = [...brands].sort((a, b) => {
          if (order === 'ascend') return a[field] > b[field] ? 1 : -1;
          return a[field] < b[field] ? 1 : -1;
        });
      }
      // Pagination
      const total = brands.length;
      const { current, pageSize } = params.pagination || pagination;
      const paged = brands.slice((current - 1) * pageSize, current * pageSize);
      setData(paged);
      setPagination((prev) => ({ ...prev, current, pageSize, total }));
      setCategories(cats);
    } catch (err) {
      setError(err.message || 'Failed to fetch brands');
    } finally {
      setLoading(false);
    }
  }, [search, categoryFilter]);

  useEffect(() => {
    fetchData({ pagination, sorter });
    // eslint-disable-next-line
  }, [search, categoryFilter, pagination.current, pagination.pageSize, sorter]);

  const onTableChange = (newPagination, filters, newSorter) => {
    setPagination((prev) => ({ ...prev, current: newPagination.current, pageSize: newPagination.pageSize }));
    setSorter(newSorter);
  };

  // Edit modal
  const openEditModal = (brand) => {
    setSelectedBrand(brand);
    setPreviewImage(brand.brand_logo ? `${IMAGE_BASE_URL}${brand.brand_logo}` : "");
    setEditModal(true);
  };
  const closeEditModal = () => {
    setEditModal(false);
    setSelectedBrand(null);
    setPreviewImage("");
  };

  // Delete modal
  const openDeleteModal = (brand) => {
    setSelectedBrand(brand);
    setDeleteModal(true);
  };
  const closeDeleteModal = () => {
    setDeleteModal(false);
    setSelectedBrand(null);
  };

  // Image change for edit modal
  const handleImageChange = (file) => {
    setPreviewImage(URL.createObjectURL(file));
    setSelectedBrand((prev) => ({ ...prev, brand_logo: file }));
  };


const updateStatus = async (brandId, isActive) => {
  setFormLoading(true);
  try {
    const formData = new FormData();
    formData.append("id", brandId);
    formData.append("status", isActive ? 1 : 0);
    const response = await updateProductBrand(formData);
    if (response.success && response.data && response.data.productBrand) {
      setData((prev) => prev.map((brand) => brand.id === brandId ? response.data.productBrand : brand));
    }
  } catch (err) {
    setError("Failed to update brand status.");
  } finally {
    setFormLoading(false);
  }
}

  // Edit save
  const handleEditSave = async (values, fileObj) => {
    setFormLoading(true);
    // console.log(values, fileObj,selectedBrand);return;
    try {
      if (selectedBrand) {
        const formData = new FormData();
        formData.append("id", selectedBrand.id);
        formData.append("name", values.name);
        formData.append("description", values.description);
        formData.append("categoryid", values.categoryid);
        formData.append("status", values.status ? 1 : 0);
        if (selectedBrand.brand_logo instanceof File) {
          formData.append("brand_logo", selectedBrand.brand_logo );
        }
        //  else if (selectedBrand.brand_logo) {
        //   formData.append("brand_logo", selectedBrand.brand_logo);
        // }
        const response = await updateProductBrand(formData);
        if (response.success && response.data && response.data.productBrand) {
          setData((prev) =>
            prev.map((brand) =>
              brand.id === selectedBrand.id ? response.data.productBrand : brand
            )
          );
        }
        closeEditModal();
      }
    } catch (err) {
      setError("Failed to update brand.");
    } finally {
      setFormLoading(false);
    }
  };

  // Delete
  const handleDelete = async () => {
    setFormLoading(true);
    try {
      if (selectedBrand) {
        await deleteProductBrand(selectedBrand.id);
        setData((prev) => prev.filter((brand) => brand.id !== selectedBrand.id));
        closeDeleteModal();
      }
    } catch (err) {
      setError("Failed to delete brand. Please try again.");
    } finally {
      setFormLoading(false);
    }
  };

  return {
    data,
    loading,
    error,
    pagination,
    sorter,
    search,
    setSearch,
    categoryFilter,
    setCategoryFilter,
    categories,
    onTableChange,
    editModal,
    openEditModal,
    closeEditModal,
    selectedBrand,
    previewImage,
    handleImageChange,
    formLoading,
    deleteModal,
    openDeleteModal,
    closeDeleteModal,
    handleEditSave,
    handleDelete,
    updateStatus,
  };
} 