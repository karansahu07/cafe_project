import React, { useState } from 'react'
import { Table, Alert, Space, Button,Tag } from 'antd';
import dayjs from 'dayjs';
import { useParams } from 'react-router-dom';
import useOrder, { getOrderStatus } from './hooks/useOrder';
import useVendors from './hooks/useVendors';
import SingleOrder from './SingleOrder';
import DateRangeSelector from '../../../components/DateRangeSelector';
import OrderFilters from './OrderFilters';
import useDebounce from '../../../hooks/useDebounce';
import styles from './orders.module.scss';

const getCustomerName = (record) => {
  const first = record?.user?.firstname || record?.user?.first_name || record?.firstname || '';
  const last = record?.user?.lastname || record?.user?.last_name || record?.lastname || '';
  const full = `${first} ${last}`.trim();
  return full || record?.user?.name || record?.user?.username || record?.name || '-';
};

const getCustomerPhone = (record) => {
  return record?.user?.phonenumber || record?.user?.phone || record?.phonenumber || record?.phone || '-';
};

const getCustomerEmail = (record) => {
  return record?.user?.email || record?.email || '-';
};

const getCustomerAddress = (record) => {
  const addressObj = record?.address || {};
  const address = addressObj?.address || '';
  const floor = addressObj?.floor || '';
  const landmark = addressObj?.landmark || '';
  const line = [address, floor, landmark].filter(Boolean).join(', ');
  return line || '-';
};

const getCreatedAtValue = (record) => record?.order_created_at || record?.created_at || null;

const Orders = () => {
  const { orderId } = useParams();
  const {
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
  } = useOrder();
  const { vendors, loading: vendorsLoading } = useVendors();
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [searchInput, setSearchInput] = useState(search);
  
  const debouncedSearch = useDebounce(searchInput, 500); // 500ms debounce for search
  
  // Update the search state when debounced search changes
  React.useEffect(() => {
    setSearch(debouncedSearch);
  }, [debouncedSearch, setSearch]);

  React.useEffect(() => {
    if (!orderId) return;
    const query = String(orderId);
    setSearchInput(query);
    setSearch(query);
  }, [orderId, setSearch]);
  
  

  const columns = [
    {
      title: 'Order ID',
      dataIndex: 'order_id',
      key: 'order_id',
    },
    {
      title: 'Customer Name',
      key: 'customer_name',
      render: (_, record) => getCustomerName(record),
    },
    {
      title: 'Customer Phone',
      key: 'customer_phone',
      render: (_, record) => getCustomerPhone(record),
    },
    {
      title: 'Customer Email',
      key: 'customer_email',
      render: (_, record) => getCustomerEmail(record),
    },
    {
      title: 'Customer Address',
      key: 'customer_address',
      width: 260,
      render: (_, record) => getCustomerAddress(record),
    },
    {
      title: 'Vendor',
      dataIndex: ['vendor', 'store_name'],
      key: 'vendor',
      render: (_, record) => record.vendor?.store_name || record?.store_name || '-',
    },
    {
      title: 'Total Qty',
      dataIndex: 'total_quantity',
      key: 'total_quantity',
    },
    {
      title: 'Total Price',
      dataIndex: 'total_price',
      key: 'total_price',
    },
    {
      title: 'Payment',
      dataIndex: 'payment_method',
      key: 'payment_method',
    },
    {
      title: 'Status',
      dataIndex: 'order_status',
      key: 'order_status',
      render: (status) => {
        const s = getOrderStatus(status);
        return <Tag color={s.color}>{s.text}</Tag>;
      },
    },
    {
      title: 'Created At',
      key: 'created_at',
      render: (_, record) => {
        const value = getCreatedAtValue(record);
        return value ? new Date(value).toLocaleString() : '-';
      },
      sorter: (a, b) => {
        const aTime = new Date(getCreatedAtValue(a) || 0).getTime();
        const bTime = new Date(getCreatedAtValue(b) || 0).getTime();
        return aTime - bTime;
      },
      defaultSortOrder: 'descend',
    },
    {
      title: 'Action',
      key: 'action',
      render: (_, record) => (
        <Space>
          <Button type="link" onClick={() => setSelectedOrder(record)}>
            View
          </Button>
        </Space>
      ),
    },
  ];

  if (selectedOrder) {
    return <SingleOrder order={selectedOrder} onBack={() => setSelectedOrder(null)} />;
  }

  return (
    <div className="p2"> 
      <h2>Orders</h2>
      <OrderFilters
        searchInput={searchInput}
        onSearchInputChange={setSearchInput}
        onSearchSubmit={setSearch}
        vendorId={vendorId}
        onVendorChange={setVendorId}
        status={status}
        onStatusChange={setStatus}
        dateRange={dateRange}
        onDateRangeChange={setDateRange}
        vendors={vendors}
        vendorsLoading={vendorsLoading}
        hideVendorFilter={isVendorScoped}
      />
      {error && <Alert type="error" message="Error loading orders" description={error.message || String(error)} showIcon style={{ marginBottom: 16 }} />}
      <Table
        columns={columns}
        dataSource={orders}
        rowKey="order_id"
        loading={loading}
        scroll={{ x: 'max-content' }}
        pagination={{
          current: page,
          pageSize: limit,
          total: total,
          onChange: (page, pageSize) => {
            setPage(page);
            setLimit(pageSize);
          },
          showSizeChanger: true,
          pageSizeOptions: ['10', '25', '50',"100","200","500"],
        }}
      />
    </div>
  );
}

export default Orders