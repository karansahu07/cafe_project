import React, { useState, useEffect } from 'react';
import { Card, Row, Col } from 'react-bootstrap';
import { Form, Input, Select, Upload, Button, Space, message, Checkbox, Switch, InputNumber, Modal, Slider } from 'antd';
import { PlusOutlined, MinusCircleOutlined, UploadOutlined, DollarOutlined } from '@ant-design/icons';
import Cropper from 'react-easy-crop';
import imageCompression from 'browser-image-compression';
import ProductVariants from './components/ProductVariants';
import { unitOptions } from './components/options';
import Addons from './components/Addons';
import '../../assets/scss/pages/uploder_override.scss';
import useAddProductHook from './hooks/useAddProductHook';
import { useWatch } from 'antd/es/form/Form';
import PricePreview from './viewSingleProduct/components/PricePreview';
const { Option } = Select;
const { Dragger } = Upload;

const ProductRegistration = ({ data }) => {
  const [form] = Form.useForm();

  // Use the custom hook for all logic/state
  const {
    categories,
    brands,
    subCategories,
    vendors,
    showModal,
    selectedVendor,
    loading,
    galleryImages,
    galleryPreviews,
    galleryDraggerProps,
    hasVariants,
    hasAddOns,
    variants,
    addons,
    editingAddonIdx,
    newAddonDraft,
    editingVariantIdx,
    newVariantDraft,
    selectedUnit,
    uploadProps,
    setDiscountPercent,
    setSelectedUnit,
    handleVendorChange,
    setShowModal,
    handleCategoryChange,
    handleGalleryDraggerChange,
    handleRemoveGalleryImage,
    handleFinish,
    setHasVariants,
    setHasAddOns,
    removeVariant,
    setNewVariantDraft,
    startEditVariant,
    saveEditVariant,
    cancelEditVariant,
    saveNewVariant,
    setNewAddonDraft,
    startEditAddon,
    saveEditAddon,
    cancelEditAddon,
    saveNewAddon,
    removeAddon,
    normFile,
    validateFileUpload,
    handleUnitChange,
    enableDiscount,
    price,
    discountPrice,
    isVendorUser,
    loggedInVendorId
  } = useAddProductHook(form, data);   

  // Cropper state (3:2 aspect) for product & gallery images
  const ASPECT_RATIO = 3 / 2;
  const OUTPUT_WIDTH = 1156;
  const OUTPUT_HEIGHT = Math.round(OUTPUT_WIDTH / ASPECT_RATIO);
  const [cropModalOpen, setCropModalOpen] = useState(false);
  const [rawImageUrl, setRawImageUrl] = useState(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [cropContext, setCropContext] = useState({ type: null }); // 'featured' | 'gallery'
  const [productPreview, setProductPreview] = useState(null);
  const CROP_CONTAINER_WIDTH = 640;
  const CROP_CONTAINER_HEIGHT = 400;
  const [cropScale, setCropScale] = useState(0.8); // resizable crop box (0.4 - 1.0 of container)

  const onCropComplete = (croppedArea, croppedPixels) => {
    setCroppedAreaPixels(croppedPixels);
  };

  const getCroppedBlob = (imageSrc, cropPixels) => {
    return new Promise((resolve, reject) => {
      const image = new Image();
      image.crossOrigin = 'anonymous';
      image.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('Canvas not supported'));
          return;
        }
        const { width, height, x, y } = cropPixels;
        // Force final output to fixed 3:2 at 1156px width
        canvas.width = OUTPUT_WIDTH;
        canvas.height = OUTPUT_HEIGHT;
        ctx.drawImage(
          image,
          x,
          y,
          width,
          height,
          0,
          0,
          OUTPUT_WIDTH,
          OUTPUT_HEIGHT
        );
        canvas.toBlob((blob) => {
          if (!blob) return reject(new Error('Canvas is empty'));
          resolve(blob);
        }, 'image/jpeg', 0.92);
      };
      image.onerror = reject;
      image.src = imageSrc;
    });
  };

  const openCropperForFile = (type, file) => {
    const url = URL.createObjectURL(file);
    setRawImageUrl(url);
    setCrop({ x: 0, y: 0 });
    const isSmallScreen = typeof window !== 'undefined' && window.innerWidth < 576;
    // Default crop scale smaller on small screens
    setCropScale(isSmallScreen ? 0.4 : 0.8);
    setZoom(1);
    setCroppedAreaPixels(null);
    setCropContext({ type, file });
    setCropModalOpen(true);
  };

  const handleCropConfirm = async () => {
    try {
      if (!rawImageUrl || !croppedAreaPixels || !cropContext?.file) return;
      const croppedBlob = await getCroppedBlob(rawImageUrl, croppedAreaPixels);
      const compressedBlob = await imageCompression(croppedBlob, {
        maxSizeMB: 0.5,
        useWebWorker: true,
        maxWidthOrHeight: 2000,
      });
      const compressedFile = new File([compressedBlob], cropContext.file.name || 'image.jpg', { type: 'image/jpeg' });

      if (cropContext.type === 'featured') {
        const fileList = [{
          uid: `${Date.now()}`,
          name: compressedFile.name,
          status: 'done',
          url: URL.createObjectURL(compressedFile),
          originFileObj: compressedFile,
        }];
        form.setFieldsValue({ product_image: fileList });
        setTimeout(() => form.validateFields(['product_image']), 50);
        setProductPreview(fileList[0].url);
      } else if (cropContext.type === 'gallery') {
        // leverage existing handler from hook to append
        if (typeof handleGalleryDraggerChange === 'function') {
          handleGalleryDraggerChange({ fileList: [{ originFileObj: compressedFile }] });
        }
      }

      setCropModalOpen(false);
      URL.revokeObjectURL(rawImageUrl);
      setRawImageUrl(null);
      setCropContext({ type: null });
    } catch (err) {
      message.error('Failed to process image. Try another file.');
    }
  };

  const handleCropCancel = () => {
    if (rawImageUrl) URL.revokeObjectURL(rawImageUrl);
    setRawImageUrl(null);
    setCropModalOpen(false);
    setCropContext({ type: null });
  };

  return (
    <div className="p2 d-flex justify-content-center">
      <div style={{ width: '100%', maxWidth: 700 }}>
        <Card className="borderless w-100">
          <Card.Body>
            <h4 className="mb-3 f-w-400 text-center">Add Product</h4>
            <Form form={form} layout="vertical" onFinish={handleFinish} autoComplete="off">
              <Row gutter={16}>
                <Col md={24} xs={24}>
                  {isVendorUser ? (
                    <Form.Item label="Vendor" required>
                      <Input value={loggedInVendorId ? `Vendor #${loggedInVendorId}` : 'Vendor not resolved'} disabled />
                    </Form.Item>
                  ) : (
                    <Form.Item label="Vendor" required>
                      <Select
                        placeholder="Select Vendor"
                        value={selectedVendor}
                        onChange={handleVendorChange}
                        allowClear
                        showSearch
                        optionFilterProp="children"
                        onClear={() => handleVendorChange(null)}
                        filterOption={(input, option) => option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                        style={{ width: '100%' }}
                      >
                        {vendors.map((vendor) => (
                          <Option key={vendor.id} value={vendor.id}>
                            {vendor.name}
                          </Option>
                        ))}
                      </Select>
                    </Form.Item>
                  )}
                </Col>
                <Col md={6} xs={24}>
                  <Form.Item
                    label="Brand Name"
                    name="product_brand"
                    // rules={[{ required: true, message: "Please select a brand" }]}
                  >
                    <Select placeholder="Select Brand" showSearch optionFilterProp="children">
                      {brands.map((brand) => (
                        <Option key={brand.id} value={String(brand.id)}>
                          {brand.name}
                        </Option>
                      ))}
                    </Select>
                  </Form.Item>
                </Col>
                <Col md={6} xs={24}>
                  <Form.Item label="Product Name" name="name" rules={[{ required: true, message: 'Please enter product name' }]}>
                    <Input placeholder="Product Name" />
                  </Form.Item>
                </Col>
                <Col md={12} xs={24}>
                  <Form.Item
                    label="Product Description"
                    name="description"
                    rules={[{ required: true, message: 'Please enter product description' }]}
                  >
                    <Input.TextArea rows={3} placeholder="Product Description" />
                  </Form.Item>
                </Col>
                <Col md={6} xs={24}>
                  <Form.Item label="Category" name="category" rules={[{ required: true, message: 'Please select a category' }]}>
                    <Select placeholder="Select Category" showSearch optionFilterProp="children" onChange={handleCategoryChange}>
                      {categories.map((cat) => (
                        <Option key={cat.id} value={cat.id}>
                          {cat.name}
                        </Option>
                      ))}
                    </Select>
                  </Form.Item>
                </Col>
                <Col md={6} xs={24}>
                  <Form.Item
                    label="Subcategory"
                    name="sub_category"
                    // rules={[{ required: true, message: "Please select a subcategory" }]}
                  >
                    <Select placeholder="Select Subcategory" showSearch optionFilterProp="children">
                      {subCategories.map((sub) => (
                        <Option key={sub.id} value={sub.id}>
                          {sub.name}
                        </Option>
                      ))}
                    </Select>
                  </Form.Item>
                </Col>

                <Col md={6} xs={24}>
                  <Form.Item
                    label="Product Image"
                    name="product_image"
                    valuePropName="fileList"
                    style={{ marginBottom: 0 }}
                    getValueFromEvent={normFile}
                    rules={[
                      {
                        required: true,
                        validator: validateFileUpload,
                        message: 'Please upload a product image'
                      }
                    ]}
                  >
                    <div style={{ width: '100%' }}>
                      <Dragger
                        name="product_image"
                        maxCount={1}
                        accept="image/*"
                        beforeUpload={(file) => {
                          const isImage = file.type.startsWith('image/');
                          if (!isImage) {
                            message.error('You can only upload image files!');
                            return Upload.LIST_IGNORE;
                          }
                          const isLt5M = file.size / 1024 / 1024 < 5;
                          if (!isLt5M) {
                            message.error('Image must be smaller than 5MB!');
                            return Upload.LIST_IGNORE;
                          }
                          openCropperForFile('featured', file);
                          return Upload.LIST_IGNORE;
                        }
                        }
                        showUploadList={false}
                        style={{
                          width: '100%',
                          minHeight: 120,
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}
                      >
                        <p className="ant-upload-drag-icon">
                          <UploadOutlined />
                        </p>
                        <p className="ant-upload-text">Click or drag image to upload</p>
                        <p className="ant-upload-hint">Max file size: 5MB</p>
                      </Dragger>
                      {/* Product image preview (old/gallery style) */}
                      {(() => {
                        const list = form.getFieldValue('product_image') || [];
                        if (!list.length) return null;
                        const file = list[0];
                        const url = file.url || file.thumbUrl;
                        return (
                          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, minHeight: 60, marginTop: 8 }}>
                            <div style={{ position: 'relative', display: 'inline-block' }}>
                              <img
                                src={url}
                                alt={file.name || 'Product Preview'}
                                style={{ width: 50, height: 50, objectFit: 'cover', borderRadius: 4, border: '1px solid #d9d9d9' }}
                              />
                              <Button
                                type="text"
                                style={{
                                  position: 'absolute',
                                  top: -5,
                                  right: -5,
                                  background: '#ff4d4f',
                                  color: 'white',
                                  borderRadius: '50%',
                                  width: 20,
                                  height: 20,
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  cursor: 'pointer',
                                  fontSize: '12px',
                                  border: '2px solid white',
                                  zIndex: 1,
                                  padding: 0
                                }}
                                onClick={() => {
                                  form.setFieldsValue({ product_image: [] });
                                  setProductPreview(null);
                                  setTimeout(() => {
                                    form.validateFields(['product_image']);
                                  }, 50);
                                }}
                              >
                                ×
                              </Button>
                            </div>
                          </div>
                        );
                      })()}
                      {/* <div 
                        style={{ 
                          display: 'flex', 
                          flexWrap: 'wrap', 
                          gap: 8, 
                          marginTop: 8,
                          minHeight: 60
                        }}
                        className="upload-preview-container"
                      >
                      </div> */}
                    </div>
                  </Form.Item>
                </Col>
                <Col md={6} xs={24}>
                  <Form.Item style={{ marginBottom: 0 }} label={`Gallery Images (${galleryImages.length}/5)`} required>
                    <Dragger
                      multiple
                      accept="image/*"
                      showUploadList={false}
                      beforeUpload={(file) => {
                        if (galleryImages.length >= 5) {
                          message.warning('Maximum 5 images allowed.');
                          return Upload.LIST_IGNORE;
                        }
                        openCropperForFile('gallery', file);
                        return Upload.LIST_IGNORE;
                      }}
                    >
                      <p className="ant-upload-drag-icon">
                        <UploadOutlined />
                      </p>
                      <p className="ant-upload-text">
                        {galleryImages.length >= 5 ? 'Maximum 5 images reached.' : 'Click or drag images to upload'}
                      </p>
                      <p className="ant-upload-hint">
                        {galleryImages.length >= 5 ? 'Remove images to enable upload' : 'Max 5 images, 5MB each'}
                      </p>
                    </Dragger>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, minHeight: 60, marginTop: 8 }}>
                      {galleryPreviews.map((url, idx) => (
                        <div key={idx} style={{ position: 'relative', display: 'inline-block' }}>
                          <img
                            src={url}
                            alt={`Gallery Preview ${idx + 1}`}
                            style={{ width: 50, height: 50, objectFit: 'cover', borderRadius: 4, border: '1px solid #d9d9d9' }}
                          />
                          <Button
                            type="text"
                            style={{
                              position: 'absolute',
                              top: -5,
                              right: -5,
                              background: '#ff4d4f',
                              color: 'white',
                              borderRadius: '50%',
                              width: 20,
                              height: 20,
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              cursor: 'pointer',
                              fontSize: '12px',
                              border: '2px solid white',
                              zIndex: 1,
                              padding: 0
                            }}
                            onClick={() => handleRemoveGalleryImage(idx)}
                          >
                            ×
                          </Button>
                        </div>
                      ))}
                    </div>
                    {galleryImages.length >= 5 && (
                      <div style={{ color: '#ff4d4f', fontSize: 12, marginTop: 4 }}>Maximum 5 images allowed.</div>
                    )}
                  </Form.Item>
                </Col>

                {/* Variants Section */}
                <Col md={24} xs={24}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', padding: '8px 0' }}>
                    <Form.Item name="has_variants" valuePropName="checked" style={{ margin: 0, marginRight: 12 }}>
                      <Checkbox
                        checked={hasVariants && hasAddOns}
                        onChange={(e) => {
                          setHasVariants(e.target.checked);
                          setHasAddOns(e.target.checked);
                        }}
                      />
                    </Form.Item>
                    <div>
                      <div style={{ fontWeight: 500, marginBottom: 4 }}>
                        is this product is rasturant product or having variants and addons?{' '}
                      </div>
                      <div style={{ fontSize: 12, color: '#666' }}>If you want to add variants and addons for this product</div>
                    </div>
                  </div>
                </Col>
                {hasVariants && (
                  <Col md={24} xs={24}>
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
                  </Col>
                )}

                {hasAddOns && (
                  <Col md={24} xs={24}>
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
                  </Col>
                )}
                {hasVariants && (
                  <Col md={6} xs={24}>
                    <Form.Item label="Is this product available" name="is_available" valuePropName="checked" initialValue={false}>
                      <Switch checkedChildren="Yes" unCheckedChildren="No" />
                    </Form.Item>
                  </Col>
                )}
                {/* Unit/Quantity fields */}
                {!hasVariants && (
                  <>
                    <Col md={6} xs={24}>
                      <Form.Item label="Product Price" name="price" rules={[{ required: true, message: 'Please enter product price' }]}>
                        <Input
                          type="number"
                          placeholder="0.00"
                          prefix={<DollarOutlined style={{ color: 'rgba(0,0,0,.25)' }} />}
                          onChange={(e) => {
                            const price = Number(e.target.value);

                            const discount = Number(form.getFieldValue('discount_price'));
                            form.setFieldsValue({ price: price });
                            form.setFieldsValue({ discount_price: price });
                            form.setFieldsValue({ discount_percent: 0 });

                            if (discount && discount > price) {
                              form.setFieldsValue({ discount_price: price });
                            }
                            // if(!discount){
                            // }
                            const percent = price && discount && discount <= price ? Math.round(((price - discount) / price) * 100) : 0;
                            setDiscountPercent(percent);
                          }}
                        />
                      </Form.Item>
                    </Col>

                    <Col md={6} xs={24}>
                      <div style={{ display: 'flex', alignItems: 'flex-start', padding: '8px 0' }}>
                        <Form.Item name="enable_discount" valuePropName="checked" initialValue={false} style={{ margin: 0, marginRight: 12 }}>
                          <Checkbox
                            onChange={(e) => {
                              const checked = e.target.checked;
                              const price = Number(form.getFieldValue('price'));

                              if (checked) {
                                form.setFieldsValue({ discount_price: price, discount_percent: 0 });
                              } else {
                                form.setFieldsValue({ discount_price: undefined, discount_percent: undefined });
                              }
                            }}
                          />
                        </Form.Item>
                        <div>
                          <div style={{ fontWeight: 500, marginBottom: 4 }}>
                            Do you want to add a discount?{' '}
                          </div>
                          <div style={{ fontSize: 12, color: '#666' }}>
                            Enable this to add discount for your product
                          </div>
                        </div>
                      </div>
                    </Col>

                    {enableDiscount && (
                      <>
                        <Col md={6} xs={24}>
                          <Form.Item
                            label="Selling Price"
                            name="discount_price"
                            rules={[
                              { required: true, message: 'Please enter selling price' },
                              ({ getFieldValue }) => ({
                                validator(_, value) {
                                  const productPrice = getFieldValue('price');
                                  if (value === undefined || value === null || value === '') {
                                    return Promise.reject('Please enter selling price');
                                  }
                                  if (Number(value) > Number(productPrice)) {
                                    return Promise.reject('Selling price (discount) cannot be greater than product price');
                                  }
                                  return Promise.resolve();
                                }
                              })
                            ]}
                          >
                            <InputNumber
                              style={{ width: '100%' }}
                              placeholder="Discount Price"
                              prefix={<DollarOutlined />}
                              min={0}
                              onChange={(discount) => {
                                if (price && Number(discount) <= Number(price)) {
                                  const percent = parseFloat((((Number(price) - discount) / Number(price)) * 100).toFixed(2));
                                  form.setFieldsValue({ discount_percent: percent });
                                  setDiscountPercent(percent);
                                } else {
                                  form.setFieldsValue({ discount_percent: 0 });
                                  setDiscountPercent(0);
                                }
                              }}
                            />
                          </Form.Item>
                        </Col>

                        <Col md={6} xs={24}>
                          <Form.Item
                            label="Discount Percent"
                            name="discount_percent"
                            rules={[{ required: true, message: 'Please enter discount percent' }]}
                          >
                            <InputNumber
                              style={{ width: '100%' }}
                              placeholder="Discount Percent"
                              // prefix={<PercentageOutlined />}
                              min={0}
                              max={100}
                              onChange={(percent) => {
                                const price = Number(form.getFieldValue('price'));
                                if (!price || percent > 100) {
                                  form.setFieldsValue({ discount_percent: 0, discount_price: price });
                                  setDiscountPercent(0);
                                  return;
                                }
                                const discount = parseFloat((price - (price * percent) / 100).toFixed(2));
                                form.setFieldsValue({ discount_percent: percent, discount_price: discount });
                                setDiscountPercent(percent);
                              }}
                            />
                          </Form.Item>
                        </Col>
                      </>
                    )}

                    {/* Price Preview Section */}
                    <Col md={12} xs={24}>
                      <PricePreview price={price || 0} discountPrice={discountPrice || 0} enableDiscount={enableDiscount} />
                    </Col>
                

                    <Col md={6} xs={24}>
                      <Form.Item label="Unit" name="unit" rules={[{ required: true, message: 'Please select a unit' }]}>
                        <Select
                          showSearch
                          placeholder="Select a unit (e.g. kg, pcs)"
                          optionFilterProp="children"
                          filterOption={(input, option) =>
                            option.children.toLowerCase().includes(input.toLowerCase()) ||
                            option.value.toLowerCase().includes(input.toLowerCase())
                          }
                          onChange={(value) => {
                            setSelectedUnit(value);
                            handleUnitChange(value);
                            form.setFieldsValue({ quantity: '' }); // Clear quantity when unit changes
                          }}
                          style={{ width: '100%' }}
                        >
                          {unitOptions.map((unit) => (
                            <Select.Option key={unit.value} value={unit.value}>
                              {unit.label} ({unit.value})
                            </Select.Option>
                          ))}
                        </Select>
                      </Form.Item>
                    </Col>
                    <Col md={6} xs={24}>
                      <Form.Item label="Quantity" name="quantity" rules={[{ required: true, message: 'Please enter quantity' }]}>
                        <Input type="number" placeholder="0" addonAfter={selectedUnit || ''} style={{ width: '100%' }} />
                      </Form.Item>
                    </Col>
                    <Col md={6} xs={24}>
                      <Form.Item label="Stock Quantity" name="stock" rules={[{ required: true, message: 'Please enter stock quantity' }]}>
                        <Input type="number" min={0} placeholder="Available stock" />
                      </Form.Item>
                    </Col>
                  </>
                )}

                <Col md={24} xs={24}>
                  <Form.List name="attributes">
                    {(fields, { add, remove }) => (
                      <>
                        <label>Additional Details (Attributes)</label>
                        {fields.map(({ key, name, ...restField }) => (
                          <Space key={key} style={{ display: 'flex', marginBottom: 8 }} align="baseline">
                            <Form.Item {...restField} name={[name, 'key']} rules={[{ required: true, message: 'Key required' }]}>
                              <Input placeholder="Key" />
                            </Form.Item>
                            <Form.Item {...restField} name={[name, 'value']} rules={[{ required: true, message: 'Value required' }]}>
                              <Input placeholder="Value" />
                            </Form.Item>
                            <MinusCircleOutlined onClick={() => remove(name)} />
                          </Space>
                        ))}
                        <Form.Item>
                          <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                            Add Attribute
                          </Button>
                        </Form.Item>
                      </>
                    )}
                  </Form.List>
                </Col>
                <Col md={24} className="text-center">
                  <Button type="primary" htmlType="submit" loading={loading} style={{ width: 200 }}>
                    Add Product
                  </Button>
                </Col>
              </Row>
            </Form>
          </Card.Body>
        </Card>
      </div>
      {/* Success Modal (Ant Design) */}
      <Modal
        open={showModal}
        onCancel={() => setShowModal(false)}
        footer={null}
        centered
      >
        <div style={{ textAlign: 'center' }}>
          <h4>Product Created Successfully</h4>
          <p>The Product has been added successfully!</p>
          <Button type="primary" onClick={() => setShowModal(false)}>
            OK
          </Button>
        </div>
      </Modal>
      {/* Crop Modal for product & gallery images */}
      <Modal
        open={cropModalOpen}
        onCancel={handleCropCancel}
        onOk={handleCropConfirm}
        okText="Crop & Use"
        centered
        destroyOnClose
        width={700}
      >
        <div style={{ position: 'relative', width: '100%', height: 400, background: '#333' }}>
          {rawImageUrl && (
            <Cropper
              image={rawImageUrl}
              crop={crop}
              zoom={zoom}
              minZoom={0.4}
              maxZoom={3}
              aspect={ASPECT_RATIO}
              cropSize={{
                width: Math.round(CROP_CONTAINER_WIDTH * cropScale),
                height: Math.round(CROP_CONTAINER_HEIGHT * cropScale)
              }}
              onCropChange={setCrop}
              onZoomChange={setZoom}
              onCropComplete={onCropComplete}
              onMediaLoaded={({ naturalWidth, naturalHeight }) => {
                const targetW = CROP_CONTAINER_WIDTH * cropScale;
                const targetH = CROP_CONTAINER_HEIGHT * cropScale;
                const fitZoom = Math.max(targetW / naturalWidth, targetH / naturalHeight);
                const isSmallScreen = typeof window !== 'undefined' && window.innerWidth < 576;
                const initialZoom = isSmallScreen ? Math.max(0.4, fitZoom) : Math.max(fitZoom, 1);
                setZoom(initialZoom);
              }}
              restrictPosition={false}
              showGrid
            />
          )}
        </div>
        <div style={{ marginTop: 12 }}>
          <div style={{ marginBottom: 6 }}>Zoom</div>
          <Slider min={0.4} max={3} step={0.01} value={zoom} onChange={setZoom} />
        </div>
        <div style={{ marginTop: 12 }}>
          <div style={{ marginBottom: 6 }}>Crop size</div>
          <Slider min={0.4} max={1} step={0.01} value={cropScale} onChange={setCropScale} />
        </div>
        <div style={{ marginTop: 8, fontSize: 12, color: '#888' }}>
          Final output: 1156×{OUTPUT_HEIGHT} (3:2), compressed to ≤500KB.
        </div>
      </Modal>
    </div>
  );
};

export default ProductRegistration;
