import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import dayjs from 'dayjs';
import { getResolvedRoleId, getResolvedVendorId } from '../../../../utils/authSession';

export const getOrderStatus = (status) => {
  if (typeof status === 'string') {
    const normalized = status.trim().toLowerCase();
    switch (normalized) {
      case 'pending': return { text: 'Pending', color: 'orange' };
      case 'confirmed': return { text: 'Confirmed', color: 'blue' };
      case 'delivery assigned':
      case 'delivery_assigned': return { text: 'Delivery Assigned', color: 'purple' };
      case 'order picked up':
      case 'order_picked_up': return { text: 'Order Picked Up', color: 'cyan' };
      case 'order delivered':
      case 'order_delivered': return { text: 'Order Delivered', color: 'green' };
      case 'rejected':
      case 'order rejected':
      case 'order_rejected': return { text: 'Order Rejected', color: 'red' };
      default: return { text: status, color: 'gray' };
    }
  }

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

const sortOrdersByNewest = (list) => {
  return [...list].sort((a, b) => {
    const aTime = new Date(a?.order_created_at || a?.created_at || 0).getTime();
    const bTime = new Date(b?.order_created_at || b?.created_at || 0).getTime();
    return bTime - aTime;
  });
};

const matchesSearch = (item, query) => {
  if (!query) return true;
  const q = String(query).trim().toLowerCase();
  const bag = [
    item?.order_uid,
    item?.order_id,
    item?.firstname,
    item?.lastname,
    item?.phonenumber,
    item?.email,
    item?.store_name,
    item?.address,
  ].map((v) => String(v || '').toLowerCase());
  return bag.some((v) => v.includes(q));
};

const useOrder = () => {
  const roleId = Number(getResolvedRoleId());
  const isVendorScoped = roleId === 3;
  const lockedVendorId = getResolvedVendorId() || '';

  const [orders, setOrders] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(5);
  const [search, setSearch] = useState('');
  const [vendorId, setVendorId] = useState(isVendorScoped ? String(lockedVendorId) : '');
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
      const config = {
        headers: { Authorization: token ? `Bearer ${token}` : '' },
      };
      
      const payload = {
        search: search || undefined,
        page,
        limit,
        vendor_id: isVendorScoped ? String(lockedVendorId) : (vendorId || undefined),
        status: status !== null ? status : undefined,
        start_date: dateRange.start.format('YYYY-MM-DD'),
        end_date: dateRange.end.format('YYYY-MM-DD')
      };

      const { data } = await axios.post(`${API_URL}/order/list`, payload, config);
      const responseOrders = Array.isArray(data) ? data : (Array.isArray(data?.orders) ? data.orders : []);
      const sorted = sortOrdersByNewest(responseOrders);

      setOrders(sorted);
      setTotal(data?.total || sorted.length);
    } catch (err) {
      setError(err);
      setOrders([]);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  }, [search, page, limit, vendorId, status, dateRange.start, dateRange.end, API_URL, token, isVendorScoped, lockedVendorId, roleId]);

  useEffect(() => {
    if (!isVendorScoped) return;
    if (!lockedVendorId) return;
    if (String(vendorId) === String(lockedVendorId)) return;
    setVendorId(String(lockedVendorId));
  }, [isVendorScoped, lockedVendorId, vendorId]);

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
    isVendorScoped,
    lockedVendorId,
    refetch: fetchOrders,
  };
};

export default useOrder;
