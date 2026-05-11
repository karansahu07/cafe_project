import React, { useState } from 'react'
import { Input, Select, Button, Drawer, Grid } from 'antd'
import { FilterOutlined } from '@ant-design/icons'
import dayjs from 'dayjs'
import DateRangeSelector from '../../../components/DateRangeSelector'
import { getOrderStatus } from './hooks/useOrder'
import styles from './orders.module.scss'

const { useBreakpoint } = Grid

const OrderFilters = ({
  searchInput,
  onSearchInputChange,
  onSearchSubmit,
  vendorId,
  onVendorChange,
  status,
  onStatusChange,
  dateRange,
  onDateRangeChange,
  vendors,
  vendorsLoading,
  hideVendorFilter = false,
}) => {
  const screens = useBreakpoint()
  const isMobile = !!screens.xs && !screens.md

  const [filterDrawerOpen, setFilterDrawerOpen] = useState(false)
  const [tempFilters, setTempFilters] = useState({
    searchInput: searchInput || '',
    vendorId: vendorId || '',
    status: typeof status === 'number' ? status : null,
    dateRange: dateRange,
  })

  const applyFilters = () => {
    onSearchInputChange?.(tempFilters.searchInput)
    if (!hideVendorFilter) {
      onVendorChange?.(tempFilters.vendorId || '')
    }
    onStatusChange?.(tempFilters.status)
    onDateRangeChange?.(tempFilters.dateRange)
    setFilterDrawerOpen(false)
    onSearchSubmit?.(tempFilters.searchInput)
  }

  const resetFilters = () => {
    const defaultDateRange = {
      preset: 'this_month',
      start: dayjs().startOf('month'),
      end: dayjs().endOf('month'),
    }
    setTempFilters({
      searchInput: '',
      vendorId: hideVendorFilter ? (vendorId || '') : '',
      status: null,
      dateRange: defaultDateRange,
    })
  }

  if (!isMobile) {
    return (
      <div className={styles.filtersContainer} style={{ display: 'flex', flexWrap: 'nowrap', gap: 12, alignItems: 'center', overflowX: 'auto' }}>
        <div className={styles.filterItem}>
          <Input.Search
            placeholder="Search orders"
            value={searchInput}
            onChange={e => onSearchInputChange?.(e.target.value)}
            onSearch={val => onSearchSubmit?.(val)}
            allowClear
          />
        </div>
        {!hideVendorFilter ? (
          <div className={styles.filterItem}>
            <Select
              showSearch
              allowClear
              loading={vendorsLoading}
              placeholder="Filter by Vendor"
              value={vendorId || undefined}
              onChange={val => onVendorChange?.(val || '')}
              optionFilterProp="children"
              style={{ minWidth: 200 }}
            >
              {vendors.map(vendor => (
                <Select.Option key={vendor.id} value={vendor.id}>
                  {vendor.name}
                </Select.Option>
              ))}
            </Select>
          </div>
        ) : null}
        <div className={styles.filterItem}>
          <Select
            allowClear
            placeholder="Filter by Status"
            value={status}
            onChange={val => onStatusChange?.(val)}
            className={styles.statusSelect}
            style={{ minWidth: 180 }}
          >
            {[0, 1, 2, 3, 4, 5].map(statusCode => {
              const s = getOrderStatus(statusCode)
              return (
                <Select.Option key={statusCode} value={statusCode}>
                  {s.text}
                </Select.Option>
              )
            })}
          </Select>
        </div>
        <div className={styles.dateRangeContainer}>
          <DateRangeSelector
            preset={dateRange.preset}
            start={dateRange.start}
            end={dateRange.end}
            onChange={onDateRangeChange}
          />
        </div>
      </div>
    )
  }

  return (
    <>
      <div className={styles.mobileFiltersContainer}>
        <Button
          type="default"
          icon={<FilterOutlined />}
          onClick={() => {
            setTempFilters({
              searchInput: searchInput || '',
              vendorId: vendorId || '',
              status: typeof status === 'number' ? status : null,
              dateRange: dateRange,
            })
            setFilterDrawerOpen(true)
          }}
          className={styles.filterToggleButton}
        >
          Filters
        </Button>
      </div>
      <Drawer
        title="Filter Orders"
        placement="right"
        onClose={() => setFilterDrawerOpen(false)}
        open={filterDrawerOpen}
        width={360}
        className={styles.filterSheet}
      >
        <div className={styles.sheetFilterItem}>
          <label>Search Orders</label>
          <Input.Search
            placeholder="Search orders"
            value={tempFilters.searchInput}
            onChange={e => setTempFilters({ ...tempFilters, searchInput: e.target.value })}
            allowClear
          />
        </div>

        {!hideVendorFilter ? (
          <div className={styles.sheetFilterItem}>
            <label>Vendor</label>
            <Select
              showSearch
              allowClear
              loading={vendorsLoading}
              placeholder="Filter by Vendor"
              value={tempFilters.vendorId || undefined}
              onChange={val => setTempFilters({ ...tempFilters, vendorId: val || '' })}
              style={{ width: '100%' }}
              optionFilterProp="children"
            >
              {vendors.map(vendor => (
                <Select.Option key={vendor.id} value={vendor.id}>
                  {vendor.name}
                </Select.Option>
              ))}
            </Select>
          </div>
        ) : null}

        <div className={styles.sheetFilterItem}>
          <label>Status</label>
          <Select
            allowClear
            placeholder="Filter by Status"
            value={tempFilters.status}
            onChange={val => setTempFilters({ ...tempFilters, status: val })}
            style={{ width: '100%' }}
          >
            {[0, 1, 2, 3, 4, 5].map(statusCode => {
              const s = getOrderStatus(statusCode)
              return (
                <Select.Option key={statusCode} value={statusCode}>
                  {s.text}
                </Select.Option>
              )
            })}
          </Select>
        </div>

        <div className={styles.sheetFilterItem}>
          <label>Date Range</label>
          <DateRangeSelector
            preset={tempFilters.dateRange.preset}
            start={tempFilters.dateRange.start}
            end={tempFilters.dateRange.end}
            onChange={newDateRange => setTempFilters({ ...tempFilters, dateRange: newDateRange })}
          />
        </div>

        <div className={styles.sheetActions}>
          <Button onClick={resetFilters}>Reset</Button>
          <Button type="primary" onClick={applyFilters}>Apply Filters</Button>
        </div>
      </Drawer>
    </>
  )
}

export default OrderFilters

