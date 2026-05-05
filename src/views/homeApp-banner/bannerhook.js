import { useState, useEffect, useCallback } from 'react';
import { getAllBanners, deleteBanner, updateBanner } from '../../services/apiService';

export default function useBannerTable() {
  // State for banners and filters
  const [banners, setBanners] = useState([]);
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
  const [selectedBanner, setSelectedBanner] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedBannerId, setSelectedBannerId] = useState(null);
  const [formState, setFormState] = useState({});
  const [previewImage, setPreviewImage] = useState("");

  // Feature/Today Deal toggles (mocked if not present in data)
  // If your API supports these, remove the mock logic
  const handleFeatureToggle = async (banner, value) => {
    // Implement API call if supported, else update locally
    setBanners((prev) =>
      prev.map((b) =>
        b.id === banner.id ? { ...b, is_featured: value ? 1 : 0 } : b
      )
    );
    // Optionally, call updateBanner with new value
  };
  const handleTodayDealToggle = async (banner, value) => {
    setBanners((prev) =>
      prev.map((b) =>
        b.id === banner.id ? { ...b, is_today_deal: value ? 1 : 0 } : b
      )
    );
    // Optionally, call updateBanner with new value
  };

  // Status toggle handler
  const handleStatusToggle = async (banner, checked) => {
    try {
      const updatedBanner = { ...banner, status: checked ? 1 : 0 };
      const response = await updateBanner(updatedBanner);
      if (response.success) {
        setBanners((prev) =>
          prev.map((b) => (b.id === banner.id ? { ...b, status: checked ? 1 : 0 } : b))
        );
      } else {
        setError('Failed to update status.');
      }
    } catch (err) {
      setError('Failed to update status.');
    }
  };

  // Fetch banners
  const fetchBanners = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await getAllBanners();
      if (response.success) {
        // Add mock feature/today deal if not present
        const bannersWithFlags = response.data.map((b) => ({
          ...b,
          is_featured: b.is_featured !== undefined ? b.is_featured : 0,
          is_today_deal: b.is_today_deal !== undefined ? b.is_today_deal : 0,
        }));
        setBanners(bannersWithFlags);
        setPagination((p) => ({ ...p, total: bannersWithFlags.length }));
      } else {
        setError(response.error || 'Failed to fetch banners');
      }
    } catch (err) {
      setError(err.message || 'Failed to fetch banners');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBanners();
  }, [fetchBanners]);

  // Table change (pagination/sort)
  const onTableChange = (newPagination, filtersTable, newSorter) => {
    setPagination({
      ...pagination,
      current: newPagination.current,
      pageSize: newPagination.pageSize,
    });
    setSorter(newSorter);
  };

  // Modal logic
  const handleUpdate = (banner) => {
    setSelectedBanner(banner);
    setFormState(banner);
    setPreviewImage(banner.image_url ? `${import.meta.env.VITE_IMAGE_BASE_URL}${banner.image_url}` : "");
    setShow(true);
  };
  const handleDelete = (banner) => {
    setSelectedBannerId(banner.id);
    setShowDeleteModal(true);
  };
  const handleClose = () => {
    setShow(false);
    setSelectedBanner(null);
    setFormState({});
    setPreviewImage("");
  };
  const handleCloseDeleteModal = () => {
    setShowDeleteModal(false);
    setSelectedBannerId(null);
  };

  // Update banner handler
  const handleSave = async () => {
    try {
      const updatedData = await updateBanner(formState);
      if (updatedData.success) {
        setBanners((prevBanners) =>
          prevBanners.map((banner) =>
            banner.id === formState.id ? { ...banner, ...updatedData.data } : banner
          )
        );
        handleClose();
      } else {
        setError('Failed to update Banner.');
      }
    } catch (err) {
      setError('Failed to update Banner.');
    }
  };

  // Delete banner handler
  const confirmDelete = async () => {
    if (selectedBannerId) {
      try {
        const response = await deleteBanner(selectedBannerId);
        if (response.success) {
          setBanners((prev) => prev.filter((banner) => banner.id !== selectedBannerId));
          handleCloseDeleteModal();
        } else {
          setError(response.message);
        }
      } catch (err) {
        setError('Failed to delete banner. Please try again.');
      }
    }
  };

  // Form/image change handlers
  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormState((prev) => ({ ...prev, [name]: value }));
  };
  const handleImageChange = (file) => {
    if (file) {
      setPreviewImage(URL.createObjectURL(file));
      setFormState((prev) => ({ ...prev, image_url: file }));
    }
  };

  return {
    banners,
    loading,
    error,
    pagination,
    sorter,
    show,
    selectedBanner,
    showDeleteModal,
    selectedBannerId,
    formState,
    previewImage,
    onTableChange,
    handleUpdate,
    handleDelete,
    handleClose,
    handleCloseDeleteModal,
    handleSave,
    confirmDelete,
    handleFormChange,
    handleImageChange,
    handleFeatureToggle,
    handleTodayDealToggle,
    setBanners,
    handleStatusToggle, // <-- Exported
    fetchBanners
  };
}
