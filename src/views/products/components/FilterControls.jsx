import React, { useState } from 'react';
import { Input, Select, Button as AntButton, Row, Col } from 'antd';
import { ReloadOutlined } from '@ant-design/icons';
import { set } from 'lodash-es';

function FilterControls({
  // nameFilter, setNameFilter,
  // categoryFilter, setCategoryFilter,
  // subCategoryFilter, setSubCategoryFilter,
  // isFeaturedFilter, setIsFeaturedFilter,
  // isTodayDealFilter, setIsTodayDealFilter,
  categories, subCategories,
  filters={name:"", categories:[], subCategories:[], isFeatured:null, isTodayDeal:null},
  handleResetFilters,
  vertical = false,
  setDrawerOpen,
  setFilters=()=>{},
 
}) {

  const [nameFilter, setNameFilter] = useState(filters.name ||"");
  const [categoryFilter, setCategoryFilter] = useState(filters.categories || []);
  const [subCategoryFilter, setSubCategoryFilter] = useState(filters.subCategories || []);
  const [isFeaturedFilter, setIsFeaturedFilter] = useState(filters.isFeatured ?? null);
  const [isTodayDealFilter, setIsTodayDealFilter] = useState(filters.isTodayDeal ?? null);
  // ✅ Common Apply Function
  const handleApplyFilters = () => {
    const filters = {
      name: nameFilter || "",
      categories: categoryFilter || [],
      subCategories: subCategoryFilter || [],
      isFeatured: isFeaturedFilter ?? null,
      isTodayDeal: isTodayDealFilter ?? null,
    };

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
          onChange={e => setNameFilter(e.target.value)}
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
          onChange={setCategoryFilter}
        >
          {categories.map(cat => (
            <Select.Option key={cat.id} value={cat.id}>{cat.name}</Select.Option>
          ))}
        </Select>
        <Select
          mode="multiple"
          allowClear
          showSearch
          filterOption={(input, option) =>
            option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
          }
          placeholder="Subcategory"
          style={{ width: '100%' }}
          value={subCategoryFilter}
          onChange={setSubCategoryFilter}
        >
          {subCategories.map(sub => (
            <Select.Option key={sub.id} value={sub.id}>{sub.name}</Select.Option>
          ))}
        </Select>
        <Select
          allowClear
          placeholder="Featured"
          style={{ width: '100%' }}
          value={isFeaturedFilter}
          onChange={setIsFeaturedFilter}
        >
          <Select.Option value={1}>Yes</Select.Option>
          <Select.Option value={0}>No</Select.Option>
        </Select>
        <Select
          allowClear
          placeholder="Today Deal"
          style={{ width: '100%' }}
          value={isTodayDealFilter}
          onChange={setIsTodayDealFilter}
        >
          <Select.Option value={1}>Yes</Select.Option>
          <Select.Option value={0}>No</Select.Option>
        </Select>
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
          onChange={e => setNameFilter(e.target.value)}
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
          onChange={setCategoryFilter}
        >
          {categories.map(cat => (
            <Select.Option key={cat.id} value={cat.id}>{cat.name}</Select.Option>
          ))}
        </Select>
      </Col>
      <Col span={4}>
        <Select
          mode="multiple"
          allowClear
          showSearch
          filterOption={(input, option) =>
            option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
          }
          placeholder="Subcategory"
          style={{ width: '100%' }}
          value={subCategoryFilter}
          onChange={setSubCategoryFilter}
        >
          {subCategories.map(sub => (
            <Select.Option key={sub.id} value={sub.id}>{sub.name}</Select.Option>
          ))}
        </Select>
      </Col>
      <Col span={3}>
        <Select
          allowClear
          placeholder="Featured"
          style={{ width: '100%' }}
          value={isFeaturedFilter}
          onChange={setIsFeaturedFilter}
        >
          <Select.Option value={1}>Yes</Select.Option>
          <Select.Option value={0}>No</Select.Option>
        </Select>
      </Col>
      <Col span={3}>
        <Select
          allowClear
          placeholder="Today Deal"
          style={{ width: '100%' }}
          value={isTodayDealFilter}
          onChange={setIsTodayDealFilter}
        >
          <Select.Option value={1}>Yes</Select.Option>
          <Select.Option value={0}>No</Select.Option>
        </Select>
      </Col>
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
