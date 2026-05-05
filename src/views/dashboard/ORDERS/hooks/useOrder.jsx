import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import dayjs from 'dayjs';

export const getOrderStatus = (status) => {
  switch (status) {
    case 0: return { text: 'Pending', color: 'orange' };
    case 1: return { text: 'Confirmed', color: 'blue' };
    case 2: return { text: 'Delivery Assigned', color: 'purple' };
    case 3: return { text: 'Order Picked Up', color: 'cyan' };
    case 4: return { text: 'Order Delivered', color: 'green' };
    case 5: return { text: 'Order Rejected', color: 'red' };
    default: return { text: 'Unknown', color: 'gray' };
  }
};

const useOrder = () => {
  const [orders, setOrders] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(5);
  const [search, setSearch] = useState('');
  const [vendorId, setVendorId] = useState('');
  const [status, setStatus] = useState(null);
  const [dateRange, setDateRange] = useState({
    preset: 'this_month',
    start: dayjs().startOf('month'),
    end: dayjs().endOf('month')
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const API_URL = import.meta.env.VITE_API_URL;
  const token = localStorage.getItem('token');

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const payload = {
        search: search || undefined,
        page,
        limit,
        vendor_id: vendorId || undefined,
        status: status !== null ? status : undefined,
        start_date: dateRange.start.format('YYYY-MM-DD'),
        end_date: dateRange.end.format('YYYY-MM-DD')
      };
      const config = {
        headers: { Authorization: token ? `Bearer ${token}` : '' },
      };
      const { data } = await axios.post(`${API_URL}/order/list`, payload, config);
      setOrders(data.orders || []);
      setTotal(data.total || 0);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }, [search, page, limit, vendorId, status, dateRange.start, dateRange.end, API_URL, token]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  // Reset page to 1 when search, vendorId, status, or dateRange changes
  useEffect(() => {
    if (page !== 1) {
      setPage(1);
    }
  }, [search, vendorId, status, dateRange.start, dateRange.end]);

  return {
    orders,
    total,
    page,
    limit,
    search,
    vendorId,
    status,
    dateRange,
    loading,
    error,
    setPage,
    setLimit,
    setSearch,
    setVendorId,
    setStatus,
    setDateRange,
    refetch: fetchOrders,
  };
};

export default useOrder;
