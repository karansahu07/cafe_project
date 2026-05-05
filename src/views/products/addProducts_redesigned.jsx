import React, { useState, useEffect } from "react";
import { 
  Card, 
  Row, 
  Col, 
  Form, 
  Input, 
  Select, 
  Upload, 
  Button, 
  Space, 
  message, 
  Switch, 
  Steps, 
  Typography, 
  Divider, 
  Progress,
  Tag,
  Alert,
  Tooltip
} from "antd";
import { 
  PlusOutlined, 
  UploadOutlined, 
  InfoCircleOutlined,
  CheckCircleOutlined,
  ShoppingCartOutlined,
  DollarOutlined,
  AppstoreOutlined,
  SettingOutlined
} from "@ant-design/icons";
import { getAllCategories, getAllSubCategoriesbyID, productfetchBrands, addProduct } from "../../services/apiService";
import useAddProductHook from "./hooks/useAddProductHook";
import ProductVariants from "./components/ProductVariants";
import Addons from "./components/Addons";
import InputWithSuggestions from "./components/InputWithSuggestions";
import { unitOptions, quantityOptions } from "./components/options";
import { formatPrice } from "../../services/utils/gen_utility";

const { Title, Text, Paragraph } = Typography;
const { TextArea } = Input;
const { Dragger } = Upload;
const { Step } = Steps;

const ProductRegistration = () => {
  const [form] = Form.useForm();
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedUnit, setSelectedUnit] = useState();
  const [discountPercent, setDiscountPercent] = useState(0);

  // Use the custom hook for all logic/state
  const {
    categories,
    brands,
    subCategories,
    vendors,
    selectedVendor,
    handleVendorChange,
    loading,
    galleryImages,
    galleryPreviews,
    handleCategoryChange,
    handleGalleryDraggerChange,
    handleRemoveGalleryImage,
    galleryDraggerProps,
    handleFinish,
    hasVariants,
    setHasVariants,
    hasAddOns,
    setHasAddOns,
    variants,
    removeVariant,
    editingVariantIdx,
    newVariantDraft,
    setNewVariantDraft,
    startEditVariant,
    saveEditVariant,
    cancelEditVariant,
    saveNewVariant,
    addons,
    editingAddonIdx,
    newAddonDraft,
    setNewAddonDraft,
    startEditAddon,
    saveEditAddon,
    cancelEditAddon,
    saveNewAddon,
    removeAddon,
  } = useAddProductHook(form);

  // Handle unit change for dynamic quantity suggestions
  const handleUnitChange = (unit) => {
    setSelectedUnit(unit);
    form.setFieldsValue({ quantity: "" });
  };

  // Steps configuration
  const steps = [
    {
      title: 'Basic Info',
      icon: <InfoCircleOutlined />,
      description: 'Product details'
    },
    {
      title: 'Pricing',
      icon: <DollarOutlined />,
      description: 'Price & discounts'
    },
    {
      title: 'Media',
      icon: <AppstoreOutlined />,
      description: 'Images & gallery'
    },
    {
      title: 'Options',
      icon: <SettingOutlined />,
      description: 'Variants & add-ons'
    }
  ];

  // Calculate completion percentage
  const getCompletionPercentage = () => {
    const values = form.getFieldsValue();
    let completed = 0;
    const required = ['name', 'description', 'category', 'price'];
    
    required.forEach(field => {
      if (values[field]) completed++;
    });
    
    if (galleryImages.length > 0) completed++;
    
    return Math.round((completed / (required.length + 1)) * 100);
  };

  // Step content components
  const renderBasicInfo = () => (
    <Card 
      title={
        <Space>
          <InfoCircleOutlined style={{ color: '#1890ff' }} />
          <Title level={4} style={{ margin: 0 }}>Basic Product Information</Title>
        </Space>
      }
      style={{ marginBottom: 24 }}
    >
      <Row gutter={[24, 16]}>
        <Col xs={24} md={12}>
          <Form.Item
            label={<Text strong>Product Name</Text>}
            name="name"
            rules={[{ required: true, message: "Please enter product name" }]}
          >
            <Input 
              size="large"
              placeholder="Enter product name" 
              prefix={<ShoppingCartOutlined style={{ color: '#bfbfbf' }} />}
            />
          </Form.Item>
        </Col>
        
        <Col xs={24} md={12}>
          <Form.Item
            label={<Text strong>Brand</Text>}
            name="product_brand"
            rules={[{ required: true, message: "Please select brand" }]}
          >
            <Select 
              size="large"
              placeholder="Select brand"
              showSearch
              filterOption={(input, option) =>
                option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
              }
            >
              {brands.map(brand => (
                <Select.Option key={brand.brand_id} value={brand.brand_id}>
                  {brand.brand_name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
        </Col>

        <Col xs={24} md={12}>
          <Form.Item
            label={<Text strong>Category</Text>}
            name="category"
            rules={[{ required: true, message: "Please select category" }]}
          >
            <Select 
              size="large"
              placeholder="Select category"
              onChange={handleCategoryChange}
              showSearch
            >
              {categories.map(cat => (
                <Select.Option key={cat.category_id} value={cat.category_id}>
                  {cat.category_name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
        </Col>

        <Col xs={24} md={12}>
          <Form.Item
            label={<Text strong>Sub Category</Text>}
            name="sub_category"
            rules={[{ required: true, message: "Please select sub category" }]}
          >
            <Select 
              size="large"
              placeholder="Select sub category"
              disabled={!subCategories.length}
              showSearch
            >
              {subCategories.map(subCat => (
                <Select.Option key={subCat.sub_category_id} value={subCat.sub_category_id}>
                  {subCat.sub_category_name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
        </Col>

        <Col xs={24}>
          <Form.Item
            label={<Text strong>Description</Text>}
            name="description"
            rules={[{ required: true, message: "Please enter description" }]}
          >
            <TextArea 
              rows={4} 
              placeholder="Enter detailed product description"
              showCount
              maxLength={500}
            />
          </Form.Item>
        </Col>

        <Col xs={24} md={12}>
          <Form.Item
            label={<Text strong>Vendor</Text>}
            name="vendor"
          >
            <Select 
              size="large"
              placeholder="Select vendor (optional)"
              onChange={handleVendorChange}
              allowClear
              showSearch
            >
              {vendors.map(vendor => (
                <Select.Option key={vendor.id} value={vendor.id}>
                  {vendor.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
        </Col>

        <Col xs={24} md={12}>
          <Form.Item
            label={<Text strong>Fast Delivery</Text>}
            name="fast_delivery_available"
            valuePropName="checked"
          >
            <Switch 
              checkedChildren="Available" 
              unCheckedChildren="Not Available"
            />
          </Form.Item>
        </Col>
      </Row>
    </Card>
  );

  const renderPricing = () => (
    <Card 
      title={
        <Space>
          <DollarOutlined style={{ color: '#52c41a' }} />
          <Title level={4} style={{ margin: 0 }}>Pricing & Inventory</Title>
        </Space>
      }
      style={{ marginBottom: 24 }}
    >
      <Row gutter={[24, 16]}>
        <Col xs={24} md={8}>
          <Form.Item
            label={<Text strong>Price ($)</Text>}
            name="price"
            rules={[{ required: true, message: "Please enter price" }]}
          >
            <Input 
              size="large"
              type="number" 
              placeholder="0.00"
              prefix="$"
              onChange={e => {
                const price = Number(e.target.value);
                const discount = Number(form.getFieldValue('discount_price'));
                form.setFieldsValue({ price: price });
                if (discount && discount > price) {
                  form.setFieldsValue({ discount_price: price });
                }
                const percent = price && discount && discount <= price ? Math.round(((price - discount) / price) * 100) : 0;
                setDiscountPercent(percent);
              }}
            />
          </Form.Item>
        </Col>

        <Col xs={24} md={8}>
          <Form.Item
            label={<Text strong>Discount Price ($)</Text>}
            name="discount_price"
            rules={[{ required: true, message: "Please enter discount price" }]}
          >
            <Input 
              size="large"
              type="number" 
              placeholder="0.00"
              prefix=" $"
              onChange={e => {
                const discount = Number(e.target.value);
                const price = Number(form.getFieldValue('price'));
                if (discount > price) {
                  form.setFieldsValue({ discount_price: price });
                  setDiscountPercent(0);
                  return;
                }
                form.setFieldsValue({ discount_price: discount });
                const percent = price && discount && discount <= price ? Math.round(((price - discount) / price) * 100) : 0;
                setDiscountPercent(percent);
              }}
            />
          </Form.Item>
        </Col>

        <Col xs={24} md={8}>
          <Form.Item
            label={<Text strong>Stock Quantity</Text>}
            name="stock"
            rules={[{ required: true, message: "Please enter stock" }]}
          >
            <Input 
              size="large"
              type="number" 
              placeholder="Available quantity"
            />
          </Form.Item>
        </Col>

        {/* Price Preview */}
        <Col xs={24}>
          <Card size="small" style={{ background: '#f6ffed', border: '1px solid #b7eb8f' }}>
            <Title level={5} style={{ margin: '0 0 16px 0', color: '#52c41a' }}>
              <CheckCircleOutlined /> Price Preview
            </Title>
            <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
              {[1].map(idx => {
                const price = Number(form.getFieldValue('price'));
                const discount = Number(form.getFieldValue('discount_price'));
                const percent = price && discount && discount <= price ? Math.round(((price - discount) / price) * 100) : 0;
                return (
                  <div key={idx} style={{ 
                    border: '1px solid #d9f7be', 
                    borderRadius: 8, 
                    padding: 16, 
                    minWidth: 150, 
                    background: 'white',
                    textAlign: 'center'
                  }}>
                    <div>
                      <Text delete style={{ color: '#8c8c8c', fontSize: 14 }}>
                        {formatPrice(price || 0)}
                      </Text>
                      <br />
                      <Text strong style={{ color: '#52c41a', fontSize: 18 }}>
                        {discount && discount <= price ? formatPrice(discount) : 0}
                      </Text>
                    </div>
                    <Tag color="green" style={{ marginTop: 8 }}>
                      Save {percent}%
                    </Tag>
                  </div>
                );
              })}
            </div>
          </Card>
        </Col>

        {/* Unit/Quantity fields only if not hasVariants */}
        {!hasVariants && (
          <>
            <Col xs={24} md={12}>
              <Form.Item
                label={<Text strong>Unit</Text>}
                name="unit"
                rules={[{ required: true, message: "Please enter unit" }]}
              >
                <InputWithSuggestions
                  options={unitOptions}
                  value={selectedUnit}
                  onChange={val => {
                    setSelectedUnit(val);
                    handleUnitChange(val);
                    form.setFieldsValue({ quantity: "" });
                  }}
                  placeholder="Unit (e.g. kg, pcs)"
                />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item
                label={<Text strong>Quantity</Text>}
                name="quantity"
                rules={[{ required: true, message: "Please enter quantity" }]}
              >
                <InputWithSuggestions
                  options={Array.isArray(quantityOptions[selectedUnit]) ? quantityOptions[selectedUnit] : []}
                  placeholder="Quantity"
                  type="number"
                />
              </Form.Item>
            </Col>
          </>
        )}
      </Row>
    </Card>
  );

  const renderMedia = () => (
    <Card 
      title={
        <Space>
          <AppstoreOutlined style={{ color: '#722ed1' }} />
          <Title level={4} style={{ margin: 0 }}>Product Images</Title>
        </Space>
      }
      style={{ marginBottom: 24 }}
    >
      <Row gutter={[24, 24]}>
        <Col xs={24} md={12}>
          <Form.Item
            label={<Text strong>Featured Image</Text>}
            name="product_image"
            rules={[{ required: true, message: "Please upload featured image" }]}
          >
            <Dragger
              name="product_image"
              maxCount={1}
              accept="image/*"
              style={{ 
                minHeight: 200,
                background: '#fafafa'
              }}
            >
              <p className="ant-upload-drag-icon">
                <UploadOutlined style={{ fontSize: 48, color: '#722ed1' }} />
              </p>
              <p className="ant-upload-text" style={{ fontSize: 16 }}>
                Click or drag featured image to upload
              </p>
              <p className="ant-upload-hint">
                Supports: JPG, PNG, GIF (Max: 5MB)
              </p>
            </Dragger>
          </Form.Item>
        </Col>

        <Col xs={24} md={12}>
          <div>
            <Text strong style={{ marginBottom: 16, display: 'block' }}>
              Gallery Images ({galleryImages.length}/5)
            </Text>
            <Dragger
              {...galleryDraggerProps}
              style={{ 
                minHeight: 200,
                background: galleryImages.length >= 5 ? '#f5f5f5' : '#fafafa',
                opacity: galleryImages.length >= 5 ? 0.5 : 1
              }}
            >
              <p className="ant-upload-drag-icon">
                <PlusOutlined style={{ fontSize: 32, color: '#722ed1' }} />
              </p>
              <p className="ant-upload-text">
                {galleryImages.length >= 5 ? 'Maximum 5 images reached' : 'Add gallery images'}
              </p>
              <p className="ant-upload-hint">
                Multiple images supported
              </p>
            </Dragger>
            
            {galleryPreviews.length > 0 && (
              <div style={{ 
                display: 'grid', 
                gridTemplateColumns: 'repeat(auto-fill, minmax(80px, 1fr))', 
                gap: 8, 
                marginTop: 16 
              }}>
                {galleryPreviews.map((preview, idx) => (
                  <div key={idx} style={{ position: 'relative' }}>
                    <img 
                      src={preview} 
                      alt={`Gallery ${idx + 1}`}
                      style={{ 
                        width: '100%', 
                        height: 80, 
                        objectFit: 'cover', 
                        borderRadius: 4,
                        border: '1px solid #d9d9d9'
                      }} 
                    />
                    <Button
                      type="text"
                      danger
                      size="small"
                      style={{ 
                        position: 'absolute', 
                        top: 4, 
                        right: 4,
                        background: 'rgba(255,255,255,0.8)'
                      }}
                      onClick={() => handleRemoveGalleryImage(idx)}
                    >
                      ×
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </Col>
      </Row>
    </Card>
  );

  const renderOptions = () => (
    <Space direction="vertical" size="large" style={{ width: '100%' }}>
      {/* Variants Section */}
      <Card 
        title={
          <Space>
            <Switch 
              checked={hasVariants} 
              onChange={setHasVariants}
              checkedChildren="ON"
              unCheckedChildren="OFF"
            />
            <Title level={4} style={{ margin: 0 }}>Product Variants</Title>
            <Tooltip title="Enable if product has different sizes, colors, etc.">
              <InfoCircleOutlined style={{ color: '#8c8c8c' }} />
            </Tooltip>
          </Space>
        }
        style={{ marginBottom: 24 }}
      >
        {hasVariants ? (
          <ProductVariants
            variants={variants}
            editingVariantIdx={editingVariantIdx}
            newVariantDraft={newVariantDraft}
            setNewVariantDraft={setNewVariantDraft}
            startEditVariant={startEditVariant}
            saveEditVariant={saveEditVariant}
            cancelEditVariant={cancelEditVariant}
            saveNewVariant={saveNewVariant}
            removeVariant={removeVariant}
            productPrice={form.getFieldValue('price')}
            productDiscountPrice={form.getFieldValue('discount_price')}
          />
        ) : (
          <Alert
            message="Variants Disabled"
            description="Enable variants if your product comes in different sizes, colors, or other variations."
            type="info"
            showIcon
          />
        )}
      </Card>

      {/* Add-ons Section */}
      <Card 
        title={
          <Space>
            <Switch 
              checked={hasAddOns} 
              onChange={setHasAddOns}
              checkedChildren="ON"
              unCheckedChildren="OFF"
            />
            <Title level={4} style={{ margin: 0 }}>Product Add-ons</Title>
            <Tooltip title="Additional items customers can purchase with this product">
              <InfoCircleOutlined style={{ color: '#8c8c8c' }} />
            </Tooltip>
          </Space>
        }
      >
        {hasAddOns ? (
          <Addons
            addons={addons}
            editingAddonIdx={editingAddonIdx}
            newAddonDraft={newAddonDraft}
            setNewAddonDraft={setNewAddonDraft}
            startEditAddon={startEditAddon}
            saveEditAddon={saveEditAddon}
            cancelEditAddon={cancelEditAddon}
            saveNewAddon={saveNewAddon}
            removeAddon={removeAddon}
          />
        ) : (
          <Alert
            message="Add-ons Disabled"
            description="Enable add-ons to offer additional items customers can purchase with this product."
            type="info"
            showIcon
          />
        )}
      </Card>
    </Space>
  );

  const renderStepContent = () => {
    switch (currentStep) {
      case 0: return renderBasicInfo();
      case 1: return renderPricing();
      case 2: return renderMedia();
      case 3: return renderOptions();
      default: return renderBasicInfo();
    }
  };

  return (
    <div style={{ padding: '24px', background: '#f0f2f5', minHeight: '100vh' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        {/* Header */}
        <Card style={{ marginBottom: 24 }}>
          <Row align="middle" justify="space-between">
            <Col>
              <Title level={2} style={{ margin: 0 }}>
                <PlusOutlined /> Add New Product
              </Title>
              <Paragraph style={{ margin: '8px 0 0 0', color: '#8c8c8c' }}>
                Create a new product with all the details
              </Paragraph>
            </Col>
            <Col>
              <div style={{ textAlign: 'right' }}>
                <Text type="secondary">Completion</Text>
                <Progress 
                  percent={getCompletionPercentage()} 
                  size="small" 
                  style={{ width: 120, marginTop: 4 }}
                />
              </div>
            </Col>
          </Row>
        </Card>

        {/* Steps */}
        <Card style={{ marginBottom: 24 }}>
          <Steps 
            current={currentStep} 
            items={steps}
            responsive={false}
            style={{ marginBottom: 0 }}
          />
        </Card>

        {/* Form */}
        <Form
          form={form}
          layout="vertical"
          onFinish={handleFinish}
          size="large"
        >
          {renderStepContent()}

          {/* Navigation */}
          <Card>
            <Row justify="space-between" align="middle">
              <Col>
                {currentStep > 0 && (
                  <Button 
                    size="large"
                    onClick={() => setCurrentStep(currentStep - 1)}
                  >
                    Previous
                  </Button>
                )}
              </Col>
              <Col>
                <Space>
                  {currentStep < steps.length - 1 ? (
                    <Button 
                      type="primary" 
                      size="large"
                      onClick={() => setCurrentStep(currentStep + 1)}
                    >
                      Next
                    </Button>
                  ) : (
                    <Button 
                      type="primary" 
                      size="large"
                      htmlType="submit" 
                      loading={loading}
                      icon={<CheckCircleOutlined />}
                    >
                      Create Product
                    </Button>
                  )}
                </Space>
              </Col>
            </Row>
          </Card>
        </Form>
      </div>
    </div>
  );
};

export default ProductRegistration;
