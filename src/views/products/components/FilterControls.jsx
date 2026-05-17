import React, { useState } from 'react';
import { Input, Select, Button as AntButton, Row, Col } from 'antd';
import { ReloadOutlined } from '@ant-design/icons';
import { set } from 'lodash-es';

function FilterControls({
  // parent setters for filters
  setNameFilter,
  setCategoryFilter,
  categories, subCategories,
  filters={name:"", categories:[]},
  handleResetFilters,
  vertical = false,
  setDrawerOpen,
  setFilters=()=>{},
}) {

  const [nameFilter, setLocalNameFilter] = useState(filters.name ||"");
  const [categoryFilter, setLocalCategoryFilter] = useState(filters.categories || []);
  const [subCategoryFilter, setLocalSubCategoryFilter] = useState([]);
  // ✅ Common Apply Function
  const handleApplyFilters = () => {
    const filters = {
      name: nameFilter || "",
      categories: categoryFilter || [],
    };

    // update parent-level filter state so product list can refresh
    if (typeof setNameFilter === 'function') setNameFilter(filters.name);
    if (typeof setCategoryFilter === 'function') setCategoryFilter(filters.categories);
    // compatibility hook
    setFilters(filters);
    console.log("Applied Filters:", filters);

    if (vertical && setDrawerOpen) {
      setDrawerOpen(false);
    }
  };

  if (vertical) {
    // Mobile/Drawer: stack vertically
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <Input
          className="custom-filter-input"
          placeholder="Search by product name"
          value={nameFilter}
          onChange={e => setLocalNameFilter(e.target.value)}
          allowClear
        />
        <Select
          mode="multiple"
          allowClear
          showSearch
          filterOption={(input, option) =>
            option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
          }
          placeholder="Category"
          style={{ width: '100%' }}
          value={categoryFilter}
          onChange={setLocalCategoryFilter}
        >
          {categories.map(cat => (
            <Select.Option key={cat.id} value={cat.id}>{cat.name}</Select.Option>
          ))}
        </Select>
        {/* Subcategory, Featured and Today Deal filters removed as per UI requirement */}
        <AntButton
          type="primary"
          block
          style={{ marginTop: 16 }}
          onClick={handleApplyFilters}
        >
          Apply Filters
        </AntButton>
        <AntButton
          size="middle"
          className="btn-danger"
          icon={<ReloadOutlined />}
          onClick={handleResetFilters}
          style={{ marginLeft: 0 }}
        >
          Reset Filters
        </AntButton>
      </div>
    );
  }

  // Desktop: row layout
  return (
    <Row gutter={16} align="middle">
      <Col span={6}>
        <Input
          className="custom-filter-input"
          placeholder="Search by product name"
          value={nameFilter}
          onChange={e => setLocalNameFilter(e.target.value)}
          allowClear
        />
      </Col>
      <Col span={4}>
        <Select
          mode="multiple"
          allowClear
          showSearch
          filterOption={(input, option) =>
            option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
          }
          placeholder="Category"
          style={{ width: '100%' }}
          value={categoryFilter}
          onChange={setLocalCategoryFilter}
        >
          {categories.map(cat => (
            <Select.Option key={cat.id} value={cat.id}>{cat.name}</Select.Option>
          ))}
        </Select>
      </Col>
      {/* Removed Subcategory, Featured and Today Deal columns from desktop filters */}
      <AntButton
        type="primary"
        style={{ marginTop: 16 }}
        onClick={handleApplyFilters}
      >
        Apply Filters
      </AntButton>
      <Col span={4} style={{ textAlign: 'right' }}>
        <AntButton
          size="middle"
          className="btn-danger"
          icon={<ReloadOutlined />}
          onClick={handleResetFilters}
          style={{ marginLeft: 8 }}
        >
          Reset Filters
        </AntButton>
      </Col>
    </Row>
  );
}

export default React.memo(FilterControls);
