import React, { useCallback, useState } from "react";
import { Form, Input, Button, Switch, Upload, Modal, message, Slider } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { addBanner } from "../../services/apiService";
import Cropper from "react-easy-crop";
import imageCompression from "browser-image-compression";

const { Dragger } = Upload;

const AddBanner = ({ onSuccess, onCancel,fetchBanners }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);
  const [file, setFile] = useState(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [cropModalOpen, setCropModalOpen] = useState(false);
  const ASPECT_RATIO = 364/180; // desired aspect ratio (W/H)
  const [rawImageUrl, setRawImageUrl] = useState(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [cropScale, setCropScale] = useState(0.8); // resizable crop box (0.4 - 1.0 of container)
  const CROP_CONTAINER_WIDTH = 640;
  const CROP_CONTAINER_HEIGHT = 400;
  const BASE_CROP_WIDTH = Math.min(CROP_CONTAINER_WIDTH, Math.round(CROP_CONTAINER_HEIGHT * ASPECT_RATIO));
  const BASE_CROP_HEIGHT = Math.round(BASE_CROP_WIDTH / ASPECT_RATIO);

  const handleFinish = async (values) => {
    if (!file) {
      message.error("Please upload a banner image.");
      return;
    }
    setLoading(true);
    const formData = new FormData();
    formData.append("title", values.title);
    formData.append("status", values.status ? 1 : 0);
    formData.append("banner_image", file);
    try {
      const result = await addBanner(formData);
      if (result.success) {

        setShowSuccess(true);
        form.resetFields();
        setPreviewImage(null);
        setFile(null);
        if (onSuccess) onSuccess();
      } else {
        message.error(result.error?.message || "Failed to add banner.");
      }
    } catch (err) {
      message.error("Failed to add banner. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const onCropComplete = useCallback((croppedArea, croppedPixels) => {
    setCroppedAreaPixels(croppedPixels);
  }, []);

  const getCroppedBlob = (imageSrc, cropPixels) => {
    return new Promise(async (resolve, reject) => {
      const image = new Image();
      image.crossOrigin = "anonymous";
      image.onload = () => {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        if (!ctx) {
          reject(new Error("Canvas not supported"));
          return;
        }
        const { width, height, x, y } = cropPixels;
        const OUTPUT_WIDTH = 364;
        const OUTPUT_HEIGHT = 180;
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
          if (!blob) return reject(new Error("Canvas is empty"));
          resolve(blob);
        }, "image/jpeg", 0.92);
      };
      image.onerror = reject;
      image.src = imageSrc;
    });
  };

  const openCropperForFile = (pickedFile) => {
    const url = URL.createObjectURL(pickedFile);
    setRawImageUrl(url);
    setCrop({ x: 0, y: 0 });
    const isSmallScreen = typeof window !== 'undefined' && window.innerWidth < 576;
    setCropScale(isSmallScreen ? 0.4 : 0.8);
    setZoom(1);
    setCroppedAreaPixels(null);
    setCropModalOpen(true);
  };

  const handleCropConfirm = async () => {
    try {
      if (!rawImageUrl || !croppedAreaPixels) return;
      const croppedBlob = await getCroppedBlob(rawImageUrl, croppedAreaPixels);
      // compress to <= 500KB
      const compressedBlob = await imageCompression(croppedBlob, {
        maxSizeMB: 0.5,
        useWebWorker: true,
        maxWidthOrHeight: 2000,
      });
      const compressedFile = new File([compressedBlob], "banner.jpg", { type: "image/jpeg" });
      setFile(compressedFile);
      setPreviewImage(URL.createObjectURL(compressedFile));
      setCropModalOpen(false);
      // cleanup raw url
      URL.revokeObjectURL(rawImageUrl);
      setRawImageUrl(null);
    } catch (err) {
      message.error("Failed to process image. Try another file.");
    }
  };

  const handleCropCancel = () => {
    if (rawImageUrl) URL.revokeObjectURL(rawImageUrl);
    setRawImageUrl(null);
    setCropModalOpen(false);
  };

  return (
    <>
      <Form
        form={form}
        layout="vertical"
        onFinish={handleFinish}
        initialValues={{ status: true }}
      >
        <Form.Item
          label="Banner Title"
          name="title"
          rules={[{ required: true, message: "Please enter a banner title" }]}
        >
          <Input placeholder="Banner Title" />
        </Form.Item>
        <Form.Item label="Banner Image" required>
          <Dragger
            name="file"
            accept="image/*"
            multiple={false}
            showUploadList={false}
            beforeUpload={(file) => {
              const isImage = file.type.startsWith('image/');
              if (!isImage) {
                message.error('You can only upload image files!');
                return Upload.LIST_IGNORE;
              }
              // open cropper modal first; prevent auto upload
              openCropperForFile(file);
              return Upload.LIST_IGNORE;
            }}
          >
            <p className="ant-upload-drag-icon">
              <PlusOutlined style={{ fontSize: 32 }} />
            </p>
            <p className="ant-upload-text">Click or drag image to this area to upload</p>
            <p className="ant-upload-hint">Only image files are allowed.</p>
            {previewImage && (
              <div className="mt-2">
                <img src={previewImage} alt="Banner Preview" className="img-thumbnail" width="120" />
              </div>
            )}
          </Dragger>
        </Form.Item>
        <Form.Item label="Active" name="status" valuePropName="checked">
          <Switch checkedChildren="Active" unCheckedChildren="Inactive" />
        </Form.Item>
        <div style={{ textAlign: 'right' }}>
          <Button onClick={onCancel} style={{ marginRight: 8 }}>
            Cancel
          </Button>
          <Button type="primary" htmlType="submit" loading={loading}>
            Add Banner
          </Button>
        </div>
      </Form>
      <Modal
        open={showSuccess}
        onCancel={() => setShowSuccess(false)}
        footer={null}
        centered
      >
        <div style={{ textAlign: 'center' }}>
          <h4>Banner Created Successfully</h4>
          <p>The banner has been added successfully!</p>
          <Button type="primary" onClick={() => { setShowSuccess(false); if (onSuccess) onSuccess(); }}>
            OK
          </Button>
        </div>
      </Modal>

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
              aspect={ASPECT_RATIO}
              minZoom={0.4}
              maxZoom={3}
              cropSize={{
                width: Math.round(BASE_CROP_WIDTH * cropScale),
                height: Math.round(BASE_CROP_HEIGHT * cropScale)
              }}
              onCropChange={setCrop}
              onZoomChange={setZoom}
              onCropComplete={onCropComplete}
              onMediaLoaded={({ naturalWidth, naturalHeight }) => {
                const targetW = BASE_CROP_WIDTH * cropScale;
                const targetH = BASE_CROP_HEIGHT * cropScale;
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
          Final output: 364×180 (3:2.022), compressed to ≤500KB.
        </div>
      </Modal>
    </>
  );
};

export default AddBanner;
