import { useState, useEffect } from 'react';
import { getAllVendors, updateVendorStatus } from '../../../../../services/apiService';

export default function useVendors() {
  const [vendors, setVendors] = useState([]);
  const [allVendors, setAllVendors] = useState([]); // Store all vendors for client-side filtering
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState({ storeName: '', customId: '' }); // Add customId for searching
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    setLoading(true);
    setError(null);
    getAllVendors()
      .then((res) => {
        if (res.success === false) {
          setError(res.message || 'Failed to fetch vendors');
          setAllVendors([]);
        } else {
          // API may return {success, data: []} or just the array
          const vendorList = res.data || res.vendors || res || [];
          setAllVendors(vendorList);
        }
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message || 'Failed to fetch vendors');
        setAllVendors([]);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    let filtered = allVendors;
    if (search.storeName) {
      filtered = filtered.filter(v =>
        v.store_name && v.store_name.toLowerCase().includes(search.storeName.toLowerCase())
      );
    }
    if (search.customId) {
      filtered = filtered.filter(v =>
        v.custom_id && v.custom_id.toLowerCase().includes(search.customId.toLowerCase())
      );
    }
    setTotal(filtered.length);
    const start = (page - 1) * pageSize;
    const end = start + pageSize;
    setVendors(filtered.slice(start, end));
  }, [allVendors, search, page, pageSize]);

  const onSearch = (field, value) => {
    setSearch(prev => ({ ...prev, [field]: value }));
    setPage(1); // Reset to first page on search
  };

  const onPageChange = (newPage, newPageSize) => {
    setPage(newPage);
    setPageSize(newPageSize);
  };

  // Toggle vendor status using centralized API service
  const handleToggleStatus = async (vendorId, newStatus) => {
    try {
      const res = await updateVendorStatus(vendorId, newStatus);
      if (res.success) {
        setAllVendors(prev => prev.map(v => v.vendor_id === vendorId ? { ...v, status: newStatus } : v));
      } else {
        setError(res.error || 'Failed to update vendor status');
      }
    } catch (err) {
      setError('Failed to update vendor status');
    }
  };


  return {
    vendors,
    loading,
    error,
    search,
    page,
    pageSize,
    total,
    onSearch,
    onPageChange,
    handleToggleStatus,
  };
}
