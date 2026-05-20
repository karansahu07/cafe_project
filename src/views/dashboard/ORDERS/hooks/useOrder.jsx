import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import dayjs from 'dayjs';
import { getResolvedRoleId, getResolvedVendorId } from '../../../../utils/authSession';

export const getOrderStatus = (status) => {
  if (status == null) return { text: 'Pending', color: 'orange' };

  if (typeof status === 'string') {
    const normalized = status.trim().toLowerCase();
    switch (normalized) {
      case 'pending': return { text: 'Pending', color: 'orange' };
      case 'confirmed': return { text: 'Confirmed', color: 'blue' };
      case 'delivery assigned':
      case 'delivery_assigned':
      case 'out for delivery':
      case 'out_for_delivery': return { text: 'Out for delivery', color: 'purple' };
      case 'order delivered':
      case 'order_delivered': return { text: 'Order Delivered', color: 'green' };
      case 'rejected':
      case 'order rejected':
      case 'order_rejected':
      case 'cancelled':
      case 'canceled':
      case 'cancelled_by_vendor':
      case 'cancelled_by_user': return { text: 'Rejected', color: 'red' };
      default: return { text: status, color: 'gray' };
    }
  }

  switch (status) {
    case 0: return { text: 'Pending', color: 'orange' };
    case 1: return { text: 'Confirmed', color: 'blue' };
    case 2: return { text: 'Out for delivery', color: 'purple' };
    case 3: return { text: 'Rejected', color: 'red' };
    case 4: return { text: 'Order Delivered', color: 'green' };
    case 5: return { text: 'Cancelled', color: 'orange' };
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
      // If user requested Pending (0) we want both null and 0 statuses.
      // Some backends don't accept a multi-value status filter, so fetch without status and filter client-side.
      let responseData;
      if (typeof status === 'number' && Number(status) === 0) {
        const payloadNoStatus = { ...payload };
        delete payloadNoStatus.status;
        const resp = await axios.post(`${API_URL}/order/list`, payloadNoStatus, config);
        responseData = resp.data;
      } else {
        const resp = await axios.post(`${API_URL}/order/list`, payload, config);
        responseData = resp.data;
      }

      const responseOrders = Array.isArray(responseData) ? responseData : (Array.isArray(responseData?.orders) ? responseData.orders : []);

      // Apply client-side filtering for status when needed
      let filteredByStatus = responseOrders;
      if (status !== null && typeof status !== 'undefined') {
        const sNum = Number(status);
        if (!Number.isNaN(sNum)) {
          if (sNum === 0) {
            filteredByStatus = responseOrders.filter((o) => o.order_status == null || Number(o.order_status) === 0);
          } else {
            filteredByStatus = responseOrders.filter((o) => Number(o.order_status) === sNum);
          }
        }
      }
      const sorted = sortOrdersByNewest(filteredByStatus);

      // Determine total count — if we applied client-side filtering (Pending),
      // use the filtered length so pagination matches client view.
      const appliedClientSidePending = (typeof status === 'number' && Number(status) === 0);
      const totalCount = appliedClientSidePending ? filteredByStatus.length : (responseData?.total ?? filteredByStatus.length);

      // If the current page is out of range for the computed total, reset to page 1 so table shows data.
      const maxPage = Math.max(1, Math.ceil(totalCount / (limit || 1)));
      if (page > maxPage) {
        setPage(1);
        // setOrders to current sorted page (we'll refetch after page changes)
        setOrders(sorted);
        setTotal(totalCount);
        return;
      }

      setOrders(sorted);
      setTotal(totalCount);
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
