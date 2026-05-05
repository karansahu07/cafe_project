import { useState, useEffect } from "react";
import { message } from "antd";
import { getAllCategories, getAllSubCategoriesbyID, productfetchBrands, addProduct, getAllVendors, updateProduct, saveOrUpdateDiscount } from "../../../../services/apiService";
import { normalizeAttributes, priceParsed } from "../../../../services/utils/gen_utility";
import axios from "axios";
import { useWatch } from "antd/es/form/Form";
// import { getAllCategories, getAllSubCategoriesbyID, productfetchBrands, addProduct } from "../../services/apiService";

export default function useUpdateProduct(form,data) {
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  // Gallery image state
  const [galleryImages, setGalleryImages] = useState([]); // File[]
  const [galleryPreviews, setGalleryPreviews] = useState([]); // string[]
  const [vendors, setVendors] = useState([]);
  const [selectedVendor, setSelectedVendor] = useState(null);
  const [hasVariants, setHasVariants] = useState(false);
  const [hasAddOns, setHasAddOns] = useState(false);  
  const [variants, setVariants] = useState([]); // [{type, value, price, discount_price}]
  const [editingVariantIdx, setEditingVariantIdx] = useState(null); // null or index
  const [newVariantDraft, setNewVariantDraft] = useState({ type: '', value: '', price: '', discount_price: '' });
  const [addons, setAddons] = useState([]); // [{name, price}]
  const [editingAddonIdx, setEditingAddonIdx] = useState(null); // null or index
  const [newAddonDraft, setNewAddonDraft] = useState({ name: '', price: '' });
  const [selectedUnit, setSelectedUnit] = useState();
  const [discountPercent, setDiscountPercent] = useState(0);

  const [productImage, setProductImage] = useState([]);


  const discount_Percent_watch = useWatch('discount_percent', form); // 👈 WATCHING THE FIELD


 useEffect(() => {
  if(data){
    




          // const {attributes,extraAttributes} = normalizeAttributes(data?.attributes);
        
          setHasVariants(data?.variants?.length > 0 );
          setHasAddOns(data?.addons?.length > 0);
          setVariants(data?.variants);
          setAddons(data?.addons);
          // setattributes(data?.attributes);
          // form.setFieldsValue({
          //   has_variants: data?.variants?.length > 0 || data?.addons?.length > 0, // or false based on your data
          //   attributes: attributes,
          //   stock:data?.stock,
          //   product_brand: data?.brand_id,
          //   vendor:data?.vendor_id,
          //   unit:extraAttributes?.unit,
          //   quantity:extraAttributes?.quantity,
          //   is_available:extraAttributes?.is_available,
          //   // price:extraAttributes?.price,
          //   discount_price:data?.discounted_value,

          //     //frpm other remove duplicate frpm below                        
          //   name: data.name,
          //   description: data.description,
          //   price: data.price,
          //   discount_price: data.discount_price,
          //   quantity: data.quantity,
          //   unit: data.unit,
          //   category: data?.category_id,
          //   sub_category: data?.sub_category,
          //   // product_brand: product?.brand_id,
          //   vendor: data?.vendor_id,
          //   product_image: data.product_image,
          //   has_variants: data.has_variants,
          //   has_addons: data.has_addons,
          //   variants: data.variants,
          //   addons: data.addons,
          //   discount_percent: data.discount_percent,

          // });


          form.setFieldsValue({
            name: data.name,
            description: data.description,
            price: data.price,
            enable_discount: data.discount_percent > 0 ? true : false,
            discount_price: data.discount_price || data.discounted_value,

            discount_percent: data.discount_percent,
          
            quantity: data.product_quantity,
            unit: data.product_unit,
            is_available: data.is_available,
          
            stock: data?.stock,
            category: data?.category_id,
            sub_category: data?.sub_category,
          
            product_brand: data?.brand_id,
            vendor: data?.vendor_id,
          
            product_image: data?.product_image,
          
            has_variants: data?.has_variants ?? (data?.variants?.length > 0 || data?.addons?.length > 0),
            has_addons: data?.has_addons,
            variants: data?.variants,
            addons: data?.addons,
          
             attributes: data?.attributes?.map(item => ({
              key: item.attribute_key ?? item.key,
              value: item.attribute_value ?? item.value
            })),
          });
          
          setSelectedUnit(data?.product_unit);

          if(data?.featured_image){
            const defaultFileList = [
              {
                uid: '-1',
                name: 'featured-image.jpg',
                status: 'done',
                url: data.featured_image,
              },
            ];
            setProductImage(defaultFileList);
          }

          
          setGalleryImages(data?.gallery_images);
          setGalleryPreviews(data?.gallery_images.map(img => img.image_path));
  }
 },[data])




  useEffect(() => {      
    getAllCategories().then((response) => {
      if (response.success) setCategories(response.data);
    });
    productfetchBrands().then((response) => {
      if (response.success) setBrands(response.data);
     
    });
    getAllVendors(true).then((response) => {
      if (response.success && Array.isArray(response.data)) {
        setVendors(response.data.map(v => ({ id: v.vendor_id, name: v.store_name })));
      }
    });
  }, []);

  // Fetch subcategories when category changes
  const handleCategoryChange = async (catId,refresh=true) => {
    if(refresh){
    form.setFieldsValue({ sub_category: undefined });
    }
    if (catId) {
      const response = await getAllSubCategoriesbyID(catId);
      if (response.success) setSubCategories(response.data);
      else setSubCategories([]);
    } else {
      setSubCategories([]);
    }
  };

  // Gallery image handlers
  const handleGalleryDraggerChange = (info) => {
    let files = info.fileList.map(f => f.originFileObj).filter(Boolean);
    const current = galleryImages;
    const total = current.length + files.length;
    let allowedFiles = files;
    if (total > 5) {
      allowedFiles = files.slice(0, 5 - current.length);
    }
    const newPreviews = allowedFiles.map(file => URL.createObjectURL(file));
    setGalleryImages([...current, ...allowedFiles].slice(0, 5));
    setGalleryPreviews([...galleryPreviews, ...newPreviews].slice(0, 5));
    // console.log("galleryImages",[...current, ...allowedFiles])
  };
  const handleRemoveGalleryImage = (idx) => {
    const newImages = [...galleryImages];
    const newPreviews = [...galleryPreviews];
    newImages.splice(idx, 1);
    newPreviews.splice(idx, 1);
    setGalleryImages(newImages);
    setGalleryPreviews(newPreviews);
  };
  // Dragger props for gallery
  const galleryDraggerProps = {
    multiple: true,
    accept: 'image/*',
    showUploadList: false,
    beforeUpload: (file) => {
      if (galleryImages.length >= 5) {
        message.warning('Maximum 5 images allowed.');
        return false;
      }
      return false; // Prevent auto upload
    },
    customRequest: () => {}, // Prevent upload
    onChange: handleGalleryDraggerChange,
    disabled: galleryImages.length >= 5,
    style: {
      opacity: galleryImages.length >= 5 ? 0.5 : 1,
      cursor: galleryImages.length >= 5 ? 'not-allowed' : 'pointer',
      minHeight: 120,
      width: '100%',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
    },
  };



  const handleImageChange = ({ fileList }) => {
  fileList.forEach(file => {
    if (file.originFileObj && !file.url) {
      file.url = URL.createObjectURL(file.originFileObj);
    }
  });
  setProductImage([...fileList]);
};

  const handleVendorChange = (value) => {
    setSelectedVendor(value);
  };

  // Handler for toggling variants
  const handleHasVariantsChange = (checked) => {
    setHasVariants(checked);
    if (!checked) {
      // setVariants([]); // Clear variants if unchecked
    }
  };
  // Handler for toggling add-ons
  const handleHasAddOnsChange = (checked) => {
    setHasAddOns(checked);
    if (!checked) {
      // setAddons([]); // Clear add-ons if unchecked
    }
  };
  // Handlers for variants
  const addVariant = () => {
    setVariants([...variants, { type: '', value: '', price: '', discount_price: '' }]);
  };
  const removeVariant = (idx) => {
    const newVariants = [...variants];
    newVariants.splice(idx, 1);
    setVariants(newVariants);
  };
  const updateVariant = (idx, field, value) => {
    const newVariants = [...variants];
    newVariants[idx][field] = value;
    setVariants(newVariants);
  };

  // Start editing an existing variant
  const startEditVariant = (idx) => {
    setEditingVariantIdx(idx);
    setNewVariantDraft({ ...variants[idx] });
  };
  // Save edited variant
  const saveEditVariant = () => {
    if (editingVariantIdx !== null) {
      const newVariants = [...variants];
      newVariants[editingVariantIdx] = { ...newVariantDraft };
      setVariants(newVariants);
      setEditingVariantIdx(null);
      setNewVariantDraft({ type: '', value: '', price: '', discount_price: '' });
    }
  };
  // Cancel editing
  const cancelEditVariant = () => {
    setEditingVariantIdx(null);
    setNewVariantDraft({ type: '', value: '', price: '', discount_price: '' });
  };
  // Add new variant
  const saveNewVariant = (formValues) => {
    const price = formValues.price || '';
    const discount_price = formValues.discount_price || '';
    setVariants([...variants, { 
      type: formValues.type || '',
      value: formValues.value || '',
      price: price,
      discount_price: discount_price
    }]);
    setNewVariantDraft({ type: '', value: '', price: '', discount_price: '' });
  };

  // Add-ons handlers
  const startEditAddon = (idx) => {
    setEditingAddonIdx(idx);
    setNewAddonDraft({ ...addons[idx] });
  };
  const saveEditAddon = () => {
    if (editingAddonIdx !== null) {
      const newAddons = [...addons];
      newAddons[editingAddonIdx] = { ...newAddonDraft };
      setAddons(newAddons);
      setEditingAddonIdx(null);
      setNewAddonDraft({ name: '', price: '' });
    }
  };
  const cancelEditAddon = () => {
    setEditingAddonIdx(null);
    setNewAddonDraft({ name: '', price: '' });
  };
  const saveNewAddon = () => {
    setAddons([...addons, { ...newAddonDraft }]);
    setNewAddonDraft({ name: '', price: '' });
  };
  const removeAddon = (idx) => {
    const newAddons = [...addons];
    newAddons.splice(idx, 1);
    setAddons(newAddons);
  };
  const updateAddon = (idx, field, value) => {
    const newAddons = [...addons];
    newAddons[idx][field] = value;
    setAddons(newAddons);
  };





  const handleUnitChange = (unitValue) => {
    form.setFieldsValue({
      unit: unitValue,
      quantity: "", // clear quantity on unit change
    });
  };
  // Upload handlers
  const normFile = (e) => {
    if (Array.isArray(e)) return e;
    return e && e.fileList;
  };


  const validateFileUpload = async () => {
    if (productImage.length > 0) {
      return Promise.resolve();
    }
    return Promise.reject(new Error("Please upload a product image"));
  };

  // Custom upload props for preview
  const uploadProps = {
    beforeUpload: (file) => {
      const isImage = file.type.startsWith('image/');
      if (!isImage) {
        message.error('You can only upload image files!');
        return false;
      }
      const isLt5M = file.size / 1024 / 1024 < 5;
      if (!isLt5M) {
        message.error('Image must be smaller than 5MB!');
        return false;
      }
      return false; // Prevent auto upload
    },
    // onChange: (info) => {
    //   console.log('Product image onChange:', info.fileList); // Debug log
    //   // Handle preview
    //   if (info.fileList) {
    //     info.fileList.forEach(file => {
    //       if (file.originFileObj && !file.url) {
    //         file.url = URL.createObjectURL(file.originFileObj);
    //       }
    //     });
    //   }
    //   // Update form field value
    //   form.setFieldsValue({ product_image: info.fileList });
    //   // Trigger form validation
    //   setTimeout(() => {
    //     form.validateFields(['product_image']);
    //   }, 100);
    // },
    onPreview: (file) => {
      if (file.url) {
        window.open(file.url);
      }
    },
    showUploadList: {
      showPreviewIcon: true,
      showRemoveIcon: true,
      showDownloadIcon: false,
    },
    itemRender: (originNode, file, fileList, actions) => {
      return (
        <div className="upload-preview-wrapper">
          <img 
            src={file.url || file.thumbUrl} 
            alt={file.name}
            className="upload-preview-image"
          />
          <div 
            className="upload-preview-close"
            onClick={() => {
              actions.remove();
              const currentFiles = form.getFieldValue('product_image') || [];
              const updatedFiles = currentFiles.filter(f => f.uid !== file.uid);
              form.setFieldsValue({ product_image: updatedFiles });
              setTimeout(() => {
                form.validateFields(['product_image']);
              }, 100);
            }}
          >
            ×
          </div>
        </div>
      );
    }
  };







  // Form submit handler
  const handleFinish = async (values) => {
    setLoading(true);
    try {
      if (galleryImages.length === 0) {
        message.error("Please upload gallery images");
        setLoading(false);
        return;
      }

      // Console log all product data before API call
      const productData = {
        formValues: values,
        variants: variants.map(variant => ({
          ...variant,
          discount_percentage: variant.price && variant.discount_price && variant.discount_price <= variant.price 
            ? Math.round(((variant.price - variant.discount_price) / variant.price) * 100) 
            : 0
        })),
        addons: addons,
        hasVariants: hasVariants,
        hasAddOns: hasAddOns,
        galleryImages: galleryImages.map(img => img.name || 'File'),
        selectedVendor: selectedVendor,
        galleryImagesCount: galleryImages.length,
        product_discount_percentage: values.price && values.discount_price && values.discount_price <= values.price
          ? Math.round(((values.price - values.discount_price) / values.price) * 100)
          : 0
      };
      
      // console.log('=== PRODUCT DATA BEFORE API CALL ===');
      // console.log('Complete Product Object:', productData);
      // console.log('Form Values:', values);
      // console.log('Product Discount Percentage:', productData.product_discount_percentage + '%');
      // console.log('Variants with Discount %:', productData.variants);
      // console.log('Add-ons:', addons);
      // console.log('Has Variants:', hasVariants);
      // console.log('Has Add-ons:', hasAddOns);
      // console.log('Gallery Images Count:', galleryImages.length);
      // console.log('Selected Vendor:', selectedVendor);
      // console.log('=====================================');

      const formData = new FormData();
      formData.append("id", data.id);
      if (values.product_brand ) formData.append("brand_id", values.product_brand);
      if (values.name) formData.append("name", values.name);
      if (values.description) formData.append("description", values.description);
      if (values.category) formData.append("category_id", values.category);
      if (values.sub_category) formData.append("sub_category", values.sub_category);
    
      //  if (productData.product_discount_percentage) formData.append("discount_percentage", productData.product_discount_percentage); 
     
    
    if (!hasVariants) {
        // if (values.unit) formData.append("unit", values.unit);
        // if (values.quantity !== undefined && values.quantity !== null && values.quantity !== "") formData.append("quantity", values.quantity);
        if (values.price !== undefined && values.price !== null && values.price !== "") formData.append("price", values.price);
        formData.append("stock", values.stock||0);

      } else {
        formData.append("is_available", values.is_available ? 1 : 0);
        
        // formData.append("price", 0);
        formData.append("price", priceParsed(variants, values.price));
        formData.append("stock", 0);

      }


     
      formData.append("fast_delivery_available", values.fast_delivery_available ? 1 : 0);
      // if (selectedVendor) {
      //   // formData.append("vendor_id", selectedVendor);
      // }
      // Product Image
      console.log("productImage",productImage )
      if (productImage && productImage[0]?.originFileObj) {
        
        formData.append("featuredImage", productImage[0].originFileObj);
      }
      // Gallery Images
      console.log(galleryImages);
      galleryImages.forEach((fileObj) => {
        if (fileObj instanceof File) {
          formData.append("galleryImages", fileObj);
        } else {
          formData.append("existingGalleryImages", fileObj.image_path); // or fileObj.name based on your structure
        }
      });
      // Attributes
      // const extraAttributes = [
      //   {key: "unit", value: values?.unit},
      //   {key: "quantity", value: values?.quantity},
      // ]
      // if (values.attributes) {
        // formData.append("attributes", JSON.stringify([...values.attributes,...extraAttributes]));      // }
        // const allAttributes = values.attributes?.length > 0
        // ? [...values.attributes, ...extraAttributes]
        // : extraAttributes;
  

     if(values.attributes?.length > 0) formData.append("attributes", JSON.stringify(values.attributes));
      // Variants
      if (variants.length > 0) {
        // Align with mobile app behavior: when variants exist, send unit/qty empty and price as smallest variant
        formData.append("product_unit", "pcs");
        formData.append("product_quantity", "1");
        formData.append("variants", JSON.stringify(variants.map(variant => ({
          ...variant,
          discount_percentage: variant.price && variant.discount_price && variant.discount_price <= variant.price 
            ? Math.round(((variant.price - variant.discount_price) / variant.price) * 100) 
            : 0
        }))));
      }else{
        formData.append("variants", JSON.stringify([]));
        formData.append("product_unit", values.unit||"unit");
        formData.append("product_quantity", values.quantity||"1");
      } 
      // Add-ons
      if (addons.length > 0 ) {
        formData.append("addons", JSON.stringify(addons));
      } else {
        formData.append("addons", JSON.stringify([]));
      }
      // const result = await addProduct(formData);
     
      const result = await updateProduct(formData);

      if (result.success) {
        console.log("discountPercent",discount_Percent_watch,result?.data?.product?.id)

        // if(!hasVariants && discount_Percent_watch && discount_Percent_watch > 0 && result?.data?.product?.id){
          console.log("discountPercent",discount_Percent_watch)
              await saveOrUpdateDiscount({
                      product_id: result?.data?.product?.id,
                      discount_percent: discount_Percent_watch||0
                     })
                    // }
        console.log(result);

        setShowModal(true);
      
      } else {
        message.error("Failed to add product. Please try again.");
      }
    } catch (err) {
      console.log(err);
      message.error("Failed to add product. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return {
    categories,
    brands,
    subCategories,
    vendors,
    selectedVendor,
    setSelectedVendor,
    handleVendorChange,
    showModal,
    setShowModal,
    loading,
    galleryImages,
    galleryPreviews,
    handleCategoryChange,
    handleGalleryDraggerChange,
    handleRemoveGalleryImage,
    galleryDraggerProps,
    handleFinish,
    // New for variants
    hasVariants,
    setHasVariants: handleHasVariantsChange,
    hasAddOns,
    setHasAddOns: handleHasAddOnsChange,
    variants,
    addVariant,
    removeVariant,
    updateVariant,
    editingVariantIdx,
    setEditingVariantIdx,
    newVariantDraft,
    setNewVariantDraft,
    startEditVariant,
    saveEditVariant,
    cancelEditVariant,
    saveNewVariant,
    // Add-ons
    addons,
    setVariants,
    setAddons,
    selectedUnit, setSelectedUnit,
    editingAddonIdx,
    setEditingAddonIdx,
    saveNewAddon,
    newAddonDraft,
    setNewAddonDraft,
    startEditAddon,
    saveEditAddon,
    cancelEditAddon,
    removeAddon,
    updateAddon,
    productImage, handleImageChange,
    normFile,
    handleUnitChange, validateFileUpload,uploadProps,
    discountPercent, setDiscountPercent,
    checkvarient:()=>{hasVariants||hasAddOns}

  };
} 