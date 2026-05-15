import { useState, useEffect, useCallback } from 'react';
import { getAllCategories, deletecategory, updateCategory, updateCategoryStatus } from '../../services/apiService';

export default function useCatagoryHook() {
  const [allCategories, setAllCategories] = useState([]); // Store all data here
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({ current: 1, pageSize: 10, total: 0 });
  const [sorter, setSorter] = useState({ field: 'sr', order: 'ascend' });
  const [search, setSearch] = useState('');
  const [editModal, setEditModal] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [previewImage, setPreviewImage] = useState("");
  const [formLoading, setFormLoading] = useState(false);

  // Fetch all categories ONCE
  useEffect(() => {
    const fetchAll = async () => {
      setLoading(true);
      setError(null);
      try {
        // Get role_id from localStorage (1 = superadmin, 3 = vendor)
        let role_id = localStorage.getItem('role_id');
        if (!role_id) {
          // fallback: try user_role or similar if your app uses a different key
          role_id = localStorage.getItem('user_role');
        }
        const response = await getAllCategories(role_id);
        let categories = response.success ? response.data || response : [];
        // Only keep allowed fields
        categories = categories.map((cat, idx) => ({
          id: cat.id,
          listed_by: cat.listed_by,
          name: cat.name,
          description: cat.description,
          category_logo: cat.category_logo,
          created_at: cat.created_at,
          sr: idx + 1
        }));
        setAllCategories(categories);
      } catch (err) {
        setError(err.message || 'Failed to fetch categories');
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, []);

  // In-memory filter/search/sort/paginate
  useEffect(() => {
    let filtered = allCategories;
    if (search) {
      filtered = filtered.filter(cat => cat.name && cat.name.toLowerCase().includes(search.toLowerCase()));
    }
    // Sorting
    if (sorter && sorter.field && sorter.order) {
      const { field, order } = sorter;
      filtered = [...filtered].sort((a, b) => {
        if (order === 'ascend') return a[field] > b[field] ? 1 : -1;
        return a[field] < b[field] ? 1 : -1;
      });
    }
    // Pagination
    const total = filtered.length;
    const { current, pageSize } = pagination;
    const paged = filtered.slice((current - 1) * pageSize, current * pageSize);
    setData(paged);
    setPagination(prev => ({ ...prev, total }));
  }, [allCategories, search, pagination.current, pagination.pageSize, sorter]);

  const onTableChange = (newPagination, filters, newSorter) => {
    setPagination(prev => ({ ...prev, current: newPagination.current, pageSize: newPagination.pageSize }));
    setSorter(newSorter);
  };

  // Toggle active status
  const handleToggleActive = async (categoryId, isActive) => {
    setLoading(true);
    try {
      const res= await updateCategoryStatus(categoryId, isActive);
      setData(prev => prev.map(cat => cat.id === res?.data?.category?.id ? { ...cat, status: res?.data?.category?.status } : cat));
    } catch (err) {
      setError('Failed to update status');
    } finally {
      setLoading(false);
    }
  };

  // Edit modal
  const openEditModal = (category) => {
    setSelectedCategory(category);
    setPreviewImage(category.category_logo ? `${import.meta.env.VITE_IMAGE_BASE_URL}${category.category_logo}` : "");
    setEditModal(true);
  };
  const closeEditModal = () => {
    setEditModal(false);
    setSelectedCategory(null);
    setPreviewImage("");
  };
  const handleSave = async (formValues) => {
    setFormLoading(true);
    try {
      const updatedCategory = {
        id: selectedCategory.id,
        name: formValues.name,
        description: formValues.description,
        category_logo: selectedCategory.category_logo,
        // Do NOT send status/approval fields
      };
      const result = await updateCategory(updatedCategory);
      if (result.success && result.data) {
        setData(prev => prev.map(cat => cat.id === result.data.id ? { ...cat, ...result.data } : cat));
        closeEditModal();
        setPreviewImage("");
      } else {
        setError(result.error || 'Failed to update category');
      }
    } catch (err) {
      setError('Failed to update category');
    } finally {
      setFormLoading(false);
    }
  };

  // Delete modal
  const openDeleteModal = (category) => {
    setSelectedCategory(category);
    setDeleteModal(true);
  };
  const closeDeleteModal = () => {
    setDeleteModal(false);
    setSelectedCategory(null);
  };
  const handleDelete = async () => {
    setFormLoading(true);
    try {
      await deletecategory(selectedCategory.id);
      setData(prev => prev.filter(cat => cat.id !== selectedCategory.id));
      closeDeleteModal();
    } catch (err) {
      setError('Failed to delete category');
    } finally {
      setFormLoading(false);
    }
  };

  // Image change for edit modal
  const handleImageChange = (file) => {
    setPreviewImage(URL.createObjectURL(file));
    setSelectedCategory(prev => ({ ...prev, category_logo: file }));
  };

  return {
    data,
    loading,
    error,
    pagination,
    sorter,
    onTableChange,
    handleToggleActive,
    editModal,
    openEditModal,
    closeEditModal,
    selectedCategory,
    previewImage,
    handleImageChange,
    handleSave,
    formLoading,
    deleteModal,
    openDeleteModal,
    closeDeleteModal,
    handleDelete,
    search,
    setSearch,
  };
}
