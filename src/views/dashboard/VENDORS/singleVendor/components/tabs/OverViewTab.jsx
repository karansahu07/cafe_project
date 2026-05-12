import React from 'react';
import { Table, Input, Space, Avatar, Button, Badge, Switch, Tooltip, Tag } from 'antd';
import { EditOutlined, DeleteOutlined, EyeOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import useVendors from './hooks/useVendors';
import { convertTimeRange, formatPhone } from '../../../../services/utils/gen_utility';

export default function VendorTable() {
  const navigate = useNavigate();
  const {
    vendors,
    loading,
    search,
    page,
    pageSize,
    total,
    onSearch,
    onPageChange,
    handleToggleStatus,
  } = useVendors();

  const columns = [
    {
      title: 'Sr. No.',
      key: 'srno',
      width: 80,
      render: (text, record, index) => (page - 1) * pageSize + index + 1,
      align: 'center',
    },
    {
      title: 'Image',
      dataIndex: 'store_image',
      key: 'storeImage',
      render: (img) => <Avatar size={45} src={img} alt="store" />,
      width: 50,
    },
    {
      title: 'Store Name',
      dataIndex: 'store_name',
      key: 'storeName',
      width: 200,
      render: (text, record) => (
        <div style={{ minWidth: 180 }}>
          <b>{text ? text.charAt(0).toUpperCase() + text.slice(1) : ''}</b>
          <div style={{ fontSize: 12, color: '#888', fontWeight: 400, marginTop: 2 }}>
            {record.store_address || '-'}
          </div>
        </div>
      ),
    },
    {
      title: 'Customer ID',
      dataIndex: 'custom_id',
      key: 'customId',
      width: 140,
      render: (text) => <span style={{ minWidth: 120, display: 'inline-block',fontSize: 12 }}>{text}</span>,
    },
   
    {
      title: 'Timing',
      dataIndex: 'vendor_timing',
      key: 'timing',
      width: 140,
      render: (timing,row) => <span style={{ minWidth: 120, display: 'inline-block',fontSize: 12 }}>{row?.vendor_start_time && row.vendor_close_time && convertTimeRange(row.vendor_start_time, row.vendor_close_time) || '-'}</span>,
    },
    {
      title: 'Phone',
      dataIndex: 'phonenumber',
      key: 'Phone',
      width: 160,
      render: (number, record) => formatPhone(number, record.prefix),
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'Email',
      width: 180,
      render: (text) => <span style={{ minWidth: 120, display: 'inline-block' }}>{text}</span>,
    },
    // Address column removed, address shown under Store Name
    // {
    //   title: 'Store ID',
    //   dataIndex: 'vendor_id',
    //   key: 'storeid',
    // },
    // {
    //   title: 'Action',
    //   key: 'action',
    //   width: 180,
    //   render: (_, record) => (
    //     <Space>
    //       <Tooltip title={record.status === 1 ? 'Set Inactive' : 'Set Active'}>
    //         <Switch
    //           checked={record.status === 1}
    //           // onChange={...} // TODO: implement status toggle handler
    //           checkedChildren="Active"
    //           unCheckedChildren="Inactive"
    //           onChange={checked => handleToggleStatus(record.vendor_id, checked ? 1 : 0)}

    //         />
    //       </Tooltip>
    //       <Tooltip title="View">
    //         <Button
    //           size="small"
    //           type="link"
    //           icon={<EyeOutlined />}
    //           onClick={() => navigate(`/vendors/${record.vendor_id}`)}
    //         />
    //       </Tooltip>
    //       <Tooltip title="Edit">
    //         <Button size="small" type="link" icon={<EditOutlined />} />
    //       </Tooltip>
    //       <Tooltip title="Delete">
    //         <Button size="small" type="link" danger icon={<DeleteOutlined />} />
    //       </Tooltip>
    //     </Space>
    //   ),
    // },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'Status',
      align: 'center',

      render: (_, record) => (
        <Tooltip title={record.status === 1 ? 'Set Inactive' : 'Set Active'}>
          <Switch
            checked={record.status === 1}
            // onChange={...} // TODO: implement status toggle handler
            checkedChildren="Active"
            unCheckedChildren="Inactive"
            onChange={checked => handleToggleStatus(record.vendor_id, checked ? 1 : 0)}

          />
        </Tooltip>)
    },
    {
      title: 'Action',
      key: 'action',
      // width: 180,
      align: 'center',
      render: (_, record) => (
        // </Space>
          <Tooltip title="View">
            <Button
              // size="small"
              type="primary"rider_id
              icon={<EyeOutlined />}
              href={`/vendors/${record.vendor_id}`}
              target="_blank"
              rel="noopener noreferrer"
            >view</Button>
          </Tooltip> 
      ),
    },
  ];

  return (
    <div className='p2'>
      <Space style={{ marginBottom: 16 }}>
        <Input
          placeholder="Search Store Name"
          value={search.storeName}
          onChange={e => onSearch('storeName', e.target.value)}
          allowClear
          style={{ width: 180 }}
        />
        <Input
          placeholder="Search Store ID"
          value={search.customId}
          onChange={e => onSearch('customId', e.target.value)}
          allowClear
          style={{ width: 180 }}
        />
      </Space>
      <Table
        columns={columns}
        dataSource={vendors}
        loading={loading}
        size="small"
        rowKey="storeid"
        pagination={{
          current: page,
          pageSize,
          total,
          showSizeChanger: true,
          onChange: onPageChange,
        }}
        scroll={{ x: 'max-content', y: "67vh" }} // Enable both horizontal and vertical scroll
        className="custom-pagination-bg"
        // bordered
      />
      {/* Custom style for pagination background */}
      <style>{`
        .custom-pagination-bg .ant-table-pagination {
          background: #fff !important;
          padding: 12px 16px;
          margin:0 !important;
          border-radius: 0 0 8px 8px;
        }
      `}</style>
    </div>
  );
}
