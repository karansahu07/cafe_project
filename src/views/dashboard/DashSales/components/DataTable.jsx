import React from 'react';
import { Card, Table, Badge, Button, Space } from 'antd';
import { CheckCircle, XCircle, ChevronLeft, ChevronRight, Download, Filter, RefreshCw } from 'lucide-react';

const DataTable = ({ title, columns, data, pagination, actions }) => {
  return (
    <Card className="data-table-card shadow-sm mb-4" bordered={false}>
      {title && (
        <div style={{ padding: '16px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #f0f0f0' }}>
          <h5 style={{ margin: 0, fontSize: '16px', fontWeight: '600' }}>{title}</h5>
          {actions && (
            <Space>
              {actions.map((action, index) => {
                const getIcon = () => {
                  switch(action.icon) {
                    case 'download': return <Download size={16} />;
                    case 'filter_list': return <Filter size={16} />;
                    case 'refresh': return <RefreshCw size={16} />;
                    default: return null;
                  }
                };
                
                return (
                  <Button 
                    key={index} 
                    type="text" 
                    size="small" 
                    onClick={action.onClick}
                    icon={getIcon()}
                  >
                    {action.label}
                  </Button>
                );
              })}
            </Space>
          )}
        </div>
      )}
        <Table 
          dataSource={data} 
          columns={columns.map(column => ({
            title: column.label,
            dataIndex: column.key,
            key: column.key,
            render: (text, record) => column.render ? column.render(record) : renderCellContent(text, column.type)
          }))} 
          pagination={false}
          size="middle"
          className="ant-table-modern"
        />
        
        {pagination && (
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 24px', borderTop: '1px solid #f0f0f0' }}>
            <div style={{ fontSize: '14px', color: '#8c8c8c' }}>
              Showing {pagination.currentPage * pagination.pageSize - pagination.pageSize + 1} to {Math.min(pagination.currentPage * pagination.pageSize, pagination.totalItems)} of {pagination.totalItems} entries
            </div>
            <div>
              <Space>
                <Button 
                  type="text" 
                  size="small" 
                  disabled={pagination.currentPage === 1}
                  onClick={() => pagination.onPageChange(pagination.currentPage - 1)}
                  icon={<ChevronLeft size={16} />}
                />
                {generatePaginationButtons(pagination)}
                <Button 
                  type="text" 
                  size="small" 
                  disabled={pagination.currentPage === pagination.totalPages}
                  onClick={() => pagination.onPageChange(pagination.currentPage + 1)}
                  icon={<ChevronRight size={16} />}
                />
              </Space>
            </div>
          </div>
        )}

    </Card>
  );
};

const renderCellContent = (value, type) => {
  if (value === undefined || value === null) return '-';
  
  switch (type) {
    case 'status':
      return (
        <Badge 
          color={getStatusColor(value)}
          style={{ padding: '4px 8px', borderRadius: '12px' }}
        >
          {value}
        </Badge>
      );
    case 'image':
      return <img src={value} alt="" className="table-img" style={{ width: '40px', height: '40px', borderRadius: '4px' }} />;
    case 'boolean':
      return value ? (
        <CheckCircle size={18} color="#52c41a" />
      ) : (
        <XCircle size={18} color="#f5222d" />
      );
    default:
      return value;
  }
};

const getStatusColor = (status) => {
  const statusMap = {
    'active': 'success',
    'pending': 'warning',
    'inactive': 'secondary',
    'completed': 'info',
    'cancelled': 'danger'
  };
  
  return statusMap[status.toLowerCase()] || 'primary';
};

const generatePaginationButtons = (pagination) => {
  const { currentPage, totalPages, onPageChange } = pagination;
  const buttons = [];
  
  // Logic to show limited page buttons with ellipsis
  if (totalPages <= 5) {
    for (let i = 1; i <= totalPages; i++) {
      buttons.push(
        <button
          key={i}
          className={`btn btn-sm ${currentPage === i ? 'btn-primary' : 'btn-light'} mx-1`}
          onClick={() => onPageChange(i)}
        >
          {i}
        </button>
      );
    }
  } else {
    // Always show first page
    buttons.push(
      <button
        key={1}
        className={`btn btn-sm ${currentPage === 1 ? 'btn-primary' : 'btn-light'} mx-1`}
        onClick={() => onPageChange(1)}
      >
        1
      </button>
    );
    
    // Calculate start and end of the shown pages
    let startPage = Math.max(2, currentPage - 1);
    let endPage = Math.min(totalPages - 1, currentPage + 1);
    
    // Show ellipsis if needed before middle pages
    if (startPage > 2) {
      buttons.push(<span key="ellipsis-1">...</span>);
    }
    
    // Show middle pages
    for (let i = startPage; i <= endPage; i++) {
      buttons.push(
        <button
          key={i}
          className={`btn btn-sm ${currentPage === i ? 'btn-primary' : 'btn-light'} mx-1`}
          onClick={() => onPageChange(i)}
        >
          {i}
        </button>
      );
    }
    
    // Show ellipsis if needed after middle pages
    if (endPage < totalPages - 1) {
      buttons.push(<span key="ellipsis-2">...</span>);
    }
    
    // Always show last page
    buttons.push(
      <button
        key={totalPages}
        className={`btn btn-sm ${currentPage === totalPages ? 'btn-primary' : 'btn-light'} mx-1`}
        onClick={() => onPageChange(totalPages)}
      >
        {totalPages}
      </button>
    );
  }
  
  return buttons;
};

export default DataTable;