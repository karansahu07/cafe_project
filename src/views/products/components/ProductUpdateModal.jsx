import React from 'react';
import { Modal, Button, Form, Card, Divider, Input, Select } from 'antd';
import { Upload } from 'antd';
const BASE_URL = import.meta.env.VITE_IMAGE_BASE_URL;

const { Dragger } = Upload;

const ProductUpdateModal = ({
  open,
  onClose,
  onSave,
  formState,
  handleFormChange,
  handleImageChange,
  handleGalleryImagesChange,
  handleDeleteFeaturedImage,
  handleDeleteGalleryImage,
  previewImage,
  previewImages,
  categories,
  brands,
  subCategories,
  loading
}) => {
  console.log(formState);
  return (
    <Modal
      open={open}
      onCancel={onClose}
      title="Update Product"
      centered
      width={window.innerWidth > 1200 ? 1000 : 700}
      zIndex={2000}
      bodyStyle={{ maxHeight: 600, minHeight: 400, overflowY: 'auto', paddingBottom: 70 }}
      style={{ top: 40 }}
      footer={[
        <Button key="cancel" onClick={onClose} style={{ marginRight: 8 }}>
          Cancel
        </Button>,
        <Button key="save" type="primary" onClick={onSave} loading={loading}>
          Save Changes
        </Button>
      ]}
    >
      {formState && (
        <Card bordered={false} style={{ boxShadow: '0 2px 8px #f0f1f2', borderRadius: 12, margin: 0 }}>
          <Form layout="vertical">
            <Divider orientation="left">Basic Info</Divider>
            <div className="row">
              <div className="col-md-6">
                <Form.Item label="Name">
                  <Input type="text" name="name" value={formState.name || ''} onChange={handleFormChange} />
                </Form.Item>
                <Form.Item label="Subtitle">
                  <Input type="text" name="subtitle" value={formState.subtitle || ''} onChange={handleFormChange} />
                </Form.Item>
                <Form.Item label="Category">
                  <Select
                    name="category_id"
                    value={formState.category_id || ''}
                    onChange={value => handleFormChange({ target: { name: 'category_id', value } })}
                  >
                    <Select.Option value="">-- Select Category --</Select.Option>
                    {categories.map((cat) => (
                      <Select.Option key={cat.id} value={cat.id}>{cat.name}</Select.Option>
                    ))}
                  </Select>
                </Form.Item>
                <Form.Item label="Product Brand">
                  <Select
                    name="brand_id"
                    value={formState.brand_id || ''}
                    onChange={value => handleFormChange({ target: { name: 'brand_id', value } })}
                  >
                    <Select.Option value="">-- Select Brand --</Select.Option>
                    {brands.map((brand) => (
                      <Select.Option key={brand.id} value={brand.id}>{brand.name}</Select.Option>
                    ))}
                  </Select>
                </Form.Item>
                <Form.Item label="Sub-Category">
                  <Select
                    name="sub_category"
                    value={formState.sub_category || ''}
                    onChange={value => handleFormChange({ target: { name: 'sub_category', value } })}
                  >
                    <Select.Option value="">-- Select Sub-Category --</Select.Option>
                    {subCategories.filter(sub => String(sub.category_id) === String(formState.category_id)).map((sub) => (
                      <Select.Option key={sub.id} value={sub.id}>{sub.name}</Select.Option>
                    ))}
                  </Select>
                </Form.Item>
                <Form.Item label="Price ($)">
                  <Input type="number" name="price" value={formState.price || ''} onChange={handleFormChange} />
                </Form.Item>
                <Form.Item label="Product Size">
                  <Input type="number" name="size" value={formState.size || ''} onChange={handleFormChange} />
                </Form.Item>
                <Form.Item label="Fast Delivery">
                  <Select
                    name="fast_delivery_available"
                    value={formState.fast_delivery_available || ''}
                    onChange={value => handleFormChange({ target: { name: 'fast_delivery_available', value } })}
                  >
                    <Select.Option value="1">Yes</Select.Option>
                    <Select.Option value="0">No</Select.Option>
                  </Select>
                </Form.Item>
                <Form.Item label="Product Status">
                  <Select
                    name="product_status"
                    value={formState.product_status || 'active'}
                    onChange={value => handleFormChange({ target: { name: 'product_status', value } })}
                  >
                    <Select.Option value="active">Active</Select.Option>
                    <Select.Option value="inactive">Inactive</Select.Option>
                  </Select>
                </Form.Item>
              </div>
              <div className="col-md-6">
                <Form.Item label="Title">
                  <Input type="text" name="title" value={formState.title || ''} onChange={handleFormChange} />
                </Form.Item>
                <Form.Item label="Key Feature Title">
                  <Input type="text" name="feature_title" value={formState.feature_title || ''} onChange={handleFormChange} />
                </Form.Item>
                <Form.Item label="Description">
                  <Input.TextArea rows={2} name="description" value={formState.description || ''} onChange={handleFormChange} />
                </Form.Item>
                <Form.Item label="Key feature Description">
                  <Input.TextArea rows={2} name="feature_description" value={formState.feature_description || ''} onChange={handleFormChange} />
                </Form.Item>
                <Form.Item label="Manufacturer Details">
                  <Input.TextArea rows={2} name="manufacturer_details" value={formState.manufacturer_details || ''} onChange={handleFormChange} />
                </Form.Item>
                <Divider orientation="left">Product Images</Divider>
                <Form.Item label="Product Image">
                
                  <Dragger
                    name="file"
                    accept="image/*"
                    multiple={false}
                    showUploadList={false}
                    beforeUpload={(file) => {
                      handleImageChange({ target: { files: [file] } });
                      return false;
                    }}
                  >
                    <p className="ant-upload-drag-icon">Drag & Drop or Click to Upload</p>
                  </Dragger>
                  {(previewImage || formState.featured_image) && (
                    <div className="mb-2 mt-2 position-relative d-inline-block">
                      <img src={previewImage || BASE_URL+formState.featured_image} alt="Product Preview" className="img-thumbnail" width="60" height="60" style={{objectFit:'cover'}} />
                      <Button
                        type="text"
                        style={{ position: 'absolute', top: -5, right: -5, background: '#ff4d4f', color: 'white', borderRadius: '50%', width: 16, height: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', fontSize: '14px', border: 'none', zIndex: 1, padding: 0 }}
                        onClick={handleDeleteFeaturedImage}
                      >×</Button>
                    </div>
                  )}

                </Form.Item>
                <Form.Item label={`Gallery Images (${(formState.gallery_images || []).length}/5)`} required>
                  <Dragger
                    name="gallery"
                    accept="image/*"
                    multiple={true}
                    showUploadList={false}
                    disabled={(formState.gallery_images || []).length >= 5}
                    beforeUpload={(file) => {
                      if ((formState.gallery_images || []).length >= 5) {
                        return false;
                      }
                      handleGalleryImagesChange({ target: { files: [file] } });
                      return false;
                    }}
                  >
                    <p className="ant-upload-drag-icon">Drag & Drop or Click to Upload Gallery Images</p>
                    <p className="ant-upload-text">
                      {(formState.gallery_images || []).length >= 5
                        ? 'Maximum 5 images reached.'
                        : 'Click or drag images to upload'}
                    </p>
                    <p className="ant-upload-hint">
                      {(formState.gallery_images || []).length >= 5
                        ? 'Remove images to enable upload'
                        : 'Max 5 images, 5MB each'}
                    </p>
                  </Dragger>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, minHeight: 60, marginTop: 8 }}>
                    {(formState.gallery_images || []).map((img, index) => {
                      let imageUrl = '';
                      if (img instanceof File) {
                        imageUrl = previewImages[index];
                      } else if (typeof img === 'string') {
                        imageUrl = img;
                      } else if (img && img.image_path) {
                        imageUrl = BASE_URL+img.image_path;
                      }
                      return (
                        <div key={index} style={{ position: 'relative', display: 'inline-block' }}>
                          <img src={imageUrl} alt={`Gallery Preview ${index + 1}`} style={{ width: 60, height: 60, objectFit: 'cover', borderRadius: 4, border: '1px solid #d9d9d9' }} />
                          <Button
                            type="text"
                            style={{ position: 'absolute', top: -5, right: -5, background: '#ff4d4f', color: 'white', borderRadius: '50%', width: 16, height: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', fontSize: '14px', border: 'none', zIndex: 1, padding: 0 }}
                            onClick={() => handleDeleteGalleryImage(index)}
                          >×</Button>
                        </div>
                      );
                    })}
                  </div>
                  {(formState.gallery_images || []).length >= 5 && (
                    <div style={{ color: '#ff4d4f', fontSize: 12, marginTop: 4 }}>Maximum 5 images allowed.</div>
                  )}
                </Form.Item>
              </div>
            </div>
          </Form>
        </Card>
      )}
    </Modal>
  );
};

export default ProductUpdateModal; 