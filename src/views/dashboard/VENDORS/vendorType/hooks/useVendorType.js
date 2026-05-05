import { useState, useEffect } from 'react';
import { message } from 'antd';
import {
  getAllVendorTypes,
  createVendorType,
  updateVendorType,
  deleteVendorType
} from 'services/apiService';

export default function useVendorType() {
  const [allVendorTypes, setAllVendorTypes] = useState([]);
  const [filteredVendorTypes, setFilteredVendorTypes] = useState([]);
  const [search, setSearch] = useState('');
  const [pagination, setPagination] = useState({ current: 1, pageSize: 10 });
  const [loading, setLoading] = useState(false);
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editRecord, setEditRecord] = useState(null);
  const [formValues, setFormValues] = useState({ vendor_type: '', vendor_type_image: null, status: 'active' });
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [deleteTargetId, setDeleteTargetId] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  // Fetch all vendor types once
  useEffect(() => {
    fetchVendorTypes();
    // eslint-disable-next-line
  }, []);

  const fetchVendorTypes = async () => {
    setLoading(true);
    const res = await getAllVendorTypes();
    if (res.success) {
    console.log(res);
    
      // Map status 1/0 to 'active'/'inactive' for UI
      const mapped = res.data.map(vt => ({
        ...vt,
        status: vt.status === 1 ? 'active' : 'inactive',
      }));
      setAllVendorTypes(mapped);
      setFilteredVendorTypes(mapped);
    } else {
      message.error('Failed to fetch vendor types');
    }
    setLoading(false);
  };

  // Search handler (local filtering)
  const handleSearch = (val) => {
    const value = typeof val === 'string' ? val : search;
    const filtered = allVendorTypes.filter(vt =>
      vt.vendor_type?.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredVendorTypes(filtered);
    setPagination(p => ({ ...p, current: 1 }));
  };

  // Pagination handler
  const handleTableChange = (pag) => {
    setPagination(pag);
  };

  // Add modal handlers
  const openAddModal = () => {
    setFormValues({ vendor_type: '', vendor_type_image: null, status: 'active' });
    setAddModalOpen(true);
  };
  const closeAddModal = () => {
    setAddModalOpen(false);
  };
  const handleAdd = async () => {
    if (!formValues.vendor_type || !formValues.vendor_type_image) {
      message.error('Type and icon are required');
      return;
    }
    setLoading(true);
    const formData = new FormData();
    formData.append('vendor_type', formValues.vendor_type);
    // Send status as 1 or 0
    formData.append('status', formValues.status === 'active' ? 1 : 0);
    formData.append('vendor_type_image', formValues.vendor_type_image);
    const res = await createVendorType(formData);
    setLoading(false);
    if (res.success) {
      message.success('Vendor type added');
      setAddModalOpen(false);
      fetchVendorTypes();
      setFormValues({ vendor_type: '', vendor_type_image: null, status: 'active' });
    } else {
      message.error(res.error || 'Failed to add vendor type');
    }
  };

  // Edit modal handlers
  const openEditModal = (record) => {
    setEditRecord(record);
    setFormValues({
      vendor_type: record.vendor_type,
      vendor_type_image: record.vendor_type_image || null, // Store existing image URL
      status: record.status
    });
    setEditModalOpen(true);
  };
  const closeEditModal = () => {
    setEditModalOpen(false);
    setEditRecord(null);
  };
  const handleEdit = async () => {
    if (!formValues.vendor_type) {
      message.error('Type is required');
      return;
    }
    setLoading(true);
    const formData = new FormData();
    formData.append('vendor_type', formValues.vendor_type);
    // Send status as 1 or 0
    formData.append('status', formValues.status === 'active' ? 1 : 0);
    // Only send vendor_type_image if it's a File (new upload)
    if (formValues.vendor_type_image && typeof formValues.vendor_type_image !== 'string') {
      formData.append('vendor_type_image', formValues.vendor_type_image);
    }
    const res = await updateVendorType(editRecord._id || editRecord.id, formData);
    setLoading(false);
    if (res.success) {
      message.success('Vendor type updated');
      setEditModalOpen(false);
      setEditRecord(null);
      // Use the updated vendor type from the API response
      console.log(res.data);
      
      const updatedType = res.data.data
        ? {
            ...res.data.data,
            status: res.data.data.status === 1 ? 'active' : 'inactive',
            vendor_type_image: res.data.data.vendor_type_image // always use updated image from API
          }
        : {
            ...editRecord,
            vendor_type: formValues.vendor_type,
            status: formValues.status,
            vendor_type_image:
              (res.data.vendorType && res.data.vendorType.vendor_type_image) ||
              (typeof formValues.vendor_type_image === 'string'
                ? formValues.vendor_type_image
                : editRecord.vendor_type_image),
          };
      setAllVendorTypes(prev =>
        prev.map(vt =>
          (vt._id || vt.id) === (updatedType._id || updatedType.id) ? updatedType : vt
        )
      );
      setFilteredVendorTypes(prev =>
        prev.map(vt =>
          (vt._id || vt.id) === (updatedType._id || updatedType.id) ? updatedType : vt
        )
      );
      setFormValues({ vendor_type: '', vendor_type_image: null, status: 'active' });
    } else {
      message.error(res.error || 'Failed to update vendor type');
    }
  };

  // Status switch handler
  const handleStatusSwitch = async (id, currentStatus) => {
    setLoading(true);
    const formData = new FormData();
    // Toggle status: send as 1 or 0
    const newStatus = currentStatus === 'active' ? 0 : 1;
    formData.append('status', newStatus);
    const res = await updateVendorType(id, formData);
    setLoading(false);
    if (res.success) {
      // Update only the status of the relevant item in-place
      setAllVendorTypes(prev => prev.map(vt => {
        if ((vt._id || vt.id) === id) {
          return {
            ...vt,
            status: newStatus === 1 ? 'active' : 'inactive',
            ...(res.data.vendorType && res.data.vendorType.vendor_type_image ? { vendor_type_image: res.data.vendorType.vendor_type_image } : {})
          };
        }
        return vt;
      }));
      setFilteredVendorTypes(prev => prev.map(vt => {
        if ((vt._id || vt.id) === id) {
          return {
            ...vt,
            status: newStatus === 1 ? 'active' : 'inactive',
            ...(res.data.vendorType && res.data.vendorType.vendor_type_image ? { vendor_type_image: res.data.vendorType.vendor_type_image } : {})
          };
        }
        return vt;
      }));
    } else {
      message.error(res.error || 'Failed to update status');
    }
  };

  // Drag & drop icon upload
  const handleIconDrop = (file) => {
    setFormValues(fv => ({ ...fv, vendor_type_image: file }));
  };

  // Delete handler
  const requestDelete = (id) => {
    setDeleteTargetId(id);
    setDeleteConfirmOpen(true);
  };

  const cancelDelete = () => {
    setDeleteConfirmOpen(false);
    setDeleteTargetId(null);
  };

  const confirmDelete = async () => {
    if (!deleteTargetId) return;
    setDeletingId(deleteTargetId);
    const res = await deleteVendorType(deleteTargetId);
    setDeletingId(null);
    setDeleteConfirmOpen(false);
    if (res.success) {
      message.success('Vendor type deleted');
      // Remove the deleted item from local state
      setAllVendorTypes(prev => prev.filter(vt => (vt._id || vt.id) !== deleteTargetId));
      setFilteredVendorTypes(prev => prev.filter(vt => (vt._id || vt.id) !== deleteTargetId));
      setDeleteTargetId(null);
    } else {
      setDeleteTargetId(null);
      message.error(res.error || 'Failed to delete vendor type');
    }
  };

  // Table data for current page
  const pagedData = filteredVendorTypes.slice(
    (pagination.current - 1) * pagination.pageSize,
    pagination.current * pagination.pageSize
  );

  return {
    loading,
    search,
    setSearch,
    handleSearch,
    pagination,
    handleTableChange,
    pagedData,
    filteredVendorTypes,
    total: filteredVendorTypes.length,
    openAddModal,
    closeAddModal,
    addModalOpen,
    handleAdd,
    formValues,
    setFormValues,
    handleIconDrop,
    openEditModal,
    closeEditModal,
    editModalOpen,
    handleEdit,
    editRecord,
    handleStatusSwitch,
    // delete helpers
    deleteConfirmOpen,
    deletingId,
    requestDelete,
    cancelDelete,
    confirmDelete,
  };
}
