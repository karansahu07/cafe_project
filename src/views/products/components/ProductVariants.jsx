import React, { useRef, useState } from "react";
import { Input, Button, Form, Card, Space, Typography, Divider, Tag, Select } from "antd";
import { PlusOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { formatPrice } from "../../../services/utils/gen_utility";

const { Title, Text } = Typography;
const { Option } = Select;

// Predefined size options
// const sizeOptions = [
//   { label: 'Small', value: 'small' },
//   { label: 'Medium', value: 'medium' },
//   { label: 'Large', value: 'large' },
//   { label: 'Half', value: 'half' },
//   { label: 'Full', value: 'full' }
// ];

const sizeOptions = [
  { label: 'Small', value: 'small' },
  { label: 'Medium', value: 'medium' },
  { label: 'Large', value: 'large' },
  { label: 'Half', value: 'half' },
  { label: 'Full', value: 'full' }
];

const ProductVariants = ({
  variants,
  editingVariantIdx,
  newVariantDraft,
  setNewVariantDraft,
  startEditVariant,
  saveEditVariant,
  cancelEditVariant,
  saveNewVariant,
  removeVariant,
  productPrice,
  productDiscountPrice
}) => {
  const [showAddForm, setShowAddForm] = useState(false);
  const addFormRef = useRef();
  const editFormRef = useRef();

  const requiredRule = (label) => ({ required: true, message: `${label} is required` });

  const handleAdd = async () => {
    try {
      await addFormRef.current.validateFields();
      const formValues = addFormRef.current.getFieldsValue();
      // Map UI fields to required variant structure
      const sizeValue = formValues.size ? String(formValues.size).toLowerCase() : '';
      const sizeLabel = (sizeOptions.find(s => s.value === sizeValue)?.label) || sizeValue;
      const priceNum = Number(formValues.price || 0);
      const variant = {
        // id can be assigned by backend; using temp id locally
        id: Date.now(),
        type: sizeLabel, // e.g., 'Full', 'Half'
        value: String(formValues.price), // e.g., '250'
        price: priceNum.toFixed(2), // e.g., '250.00'
        discount_percentage: 0,
      };
      saveNewVariant(variant);
      // Debug: log variants after add
      setTimeout(() => {
        if (typeof window !== 'undefined') {
          console.log('Variants after add:', variants);
        }
      }, 100);
      addFormRef.current.resetFields();
      setShowAddForm(false);
    } catch (err) {
      console.error('Validation failed:', err);
    }
  };

  const handleEdit = async () => {
    try {
      await editFormRef.current.validateFields();
      const formValues = editFormRef.current.getFieldsValue();
      const sizeValue = formValues.size ? String(formValues.size).toLowerCase() : (newVariantDraft.size || newVariantDraft.value || '');
      const sizeLabel = (sizeOptions.find(s => s.value === sizeValue)?.label) || sizeValue;
      const priceNum = Number(formValues.price || newVariantDraft.price || 0);
      const updated = {
        id: newVariantDraft.id,
        type: sizeLabel,
        value: String(formValues.price ?? newVariantDraft.value ?? ''),
        price: priceNum.toFixed(2),
        discount_percentage: 0,
      };
      saveEditVariant(updated);
    } catch (err) {
      console.error('Validation failed:', err);
    }
  };

  return (
    <div style={{ border: '1px solid #eee', borderRadius: 8, padding: 16, marginBottom: 16 }}>
      <Title level={5} style={{ marginBottom: 16 }}>Product Variants</Title>
      
      {/* Variants List */}
      {variants.length > 0 && (
        <div style={{ marginBottom: 24 }}>
          <Space direction="vertical" size="middle" style={{ width: '100%' }}>
            {variants.map((variant, idx) => (
              <Card
                key={idx}
                size="small"
                style={{ 
                  background: editingVariantIdx === idx ? '#f6ffed' : '#fafafa',
                  border: editingVariantIdx === idx ? '1px solid #52c41a' : '1px solid #f0f0f0'
                }}
                bodyStyle={{ padding: '4px' }}
              >
                {editingVariantIdx === idx ? (
                  <Form
                    ref={editFormRef}
                    layout="vertical"
                    initialValues={newVariantDraft}
                    style={{ margin: 0 }}
                  >
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr auto', gap: 16, alignItems: 'end' }}>
                      <Form.Item
                        label="Size"
                        name="size"
                        rules={[requiredRule("Size")]}
                        style={{ margin: 0 }}
                        initialValue={newVariantDraft.value}
                      >
                        <Select
                          placeholder="Select size"
                          onChange={val => setNewVariantDraft(d => ({ ...d, size: val, value: val }))}
                        >
                          {sizeOptions.map(option => (
                            <Option key={option.value} value={option.value}>
                              {option.label}
                            </Option>
                          ))}
                        </Select>
                      </Form.Item>
                      
                      <Form.Item
                        label="Price ($)"
                        name="price"
                        rules={[requiredRule("Price")]}
                        style={{ margin: 0 }}
                      >
                        <Input
                          type="number"
                          placeholder="0.00"
                          value={newVariantDraft.price}
                          onChange={e => setNewVariantDraft(d => ({ ...d, price: e.target.value }))}
                        />
                      </Form.Item>
                      
                      <Space>
                        <Button type="primary" size="small" onClick={handleEdit}>
                          Save
                        </Button>
                        <Button size="small" onClick={cancelEditVariant}>
                          Cancel
                        </Button>
                      </Space>
                    </div>
                  </Form>
                ) : (
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Space size="large">
                      <div>
                        <Tag color="blue">{"size" || 'Type'}</Tag>
                        <Text strong style={{ marginLeft: 8 }}>{variant?.type}</Text>
                      </div>
                      <div>
                        <Text strong style={{ color: '#52c41a', fontSize: 16 }}>
                          {formatPrice(variant.price || 0)}
                        </Text>
                      </div>
                    </Space>
                    <Space>
                      <Button 
                        type="text" 
                        icon={<EditOutlined />} 
                        size="small" 
                        onClick={() => startEditVariant(idx)}
                      >
                        Edit
                      </Button>
                      <Button 
                        type="text" 
                        danger 
                        icon={<DeleteOutlined />} 
                        size="small" 
                        onClick={() => removeVariant(idx)}
                      >
                        Remove
                      </Button>
                    </Space>
                  </div>
                )}
              </Card>
            ))}
          </Space>
        </div>
      )}

      {/* Add Variant Button - Only show when form is hidden */}
      {!showAddForm && (
        <Button 
          type="dashed" 
          onClick={() => setShowAddForm(true)}
          icon={<PlusOutlined />}
          style={{ width: '100%', marginBottom: 24 }}
        >
          Add Variant
        </Button>
      )}

      {/* Add Variant Form - Only show when showAddForm is true */}
      {showAddForm && (
        <Card 
          size="small" 
          style={{ marginBottom: 24, border: '1px dashed #d9d9d9' }}
          bodyStyle={{ padding: '16px' }}
        >
          <Form
            ref={addFormRef}
            layout="vertical"
            initialValues={{
              size: newVariantDraft.size || undefined,
              price: newVariantDraft.price || productPrice || '',
              discount_price: newVariantDraft.discount_price || productDiscountPrice || ''
            }}
          >
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr auto', gap: 16, alignItems: 'end' }}>
              <Form.Item
                label="Size"
                name="size"
                rules={[requiredRule("Size")]}
                style={{ margin: 0 }}
              >
                <Select 
                  options={sizeOptions} 
                  placeholder="Select size"
                  value={newVariantDraft.size}
                  onChange={val => setNewVariantDraft(d => ({ ...d, size: val }))}
                />
              </Form.Item>
              <Form.Item
                label="Price"
                name="price"
                rules={[requiredRule("Price")]}
                style={{ margin: 0 }}
              >
                <Input type="number" placeholder="Enter price" />
              </Form.Item>
              <Form.Item style={{ margin: 0 }}>
                <Space>
                  <Button type="primary" onClick={handleAdd}>
                    Add
                  </Button>
                  <Button onClick={() => setShowAddForm(false)}>
                    Cancel
                  </Button>
                </Space>
              </Form.Item>
            </div>
          </Form>
        </Card>
      )}
    </div>
  );
};

export default ProductVariants;