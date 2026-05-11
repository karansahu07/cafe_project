import { lazy } from 'react';

import AdminLayout from 'layouts/AdminLayout';
import GuestLayout from 'layouts/GuestLayout';
import RoleBasedDashboard from '../components/RoleBasedDashboard';

//lazy import components
const DashSales2 = lazy(() => import('../views/dashboard/DashSales/index2'));
const UpdateProduct = lazy(() => import('../views/products/updateProduct/upDateProduct'));
const SingleProduct = lazy(() => import('../views/products/viewSingleProduct/singleProduct'));
const SingleVendor = lazy(() => import('../views/dashboard/VENDORS/singleVendor/SingleVendor'));


import ProtectedRoute from '../components/ProtectedRoute';


// import Orders from '../views/dashboard/ORDERS/Orders';
// import VendorTypeList from '../views/dashboard/VENDORS/vendorType/vendorTypeList';
// import VendorTable from '../views/dashboard/VENDORS/AllVendors/vendorTabel';
const Orders = lazy(() => import('../views/dashboard/ORDERS/Orders'));
const VendorTypeList = lazy(() => import('../views/dashboard/VENDORS/vendorType/vendorTypeList'));
const VendorTable = lazy(() => import('../views/dashboard/VENDORS/AllVendors/vendorTabel'));
const RiderTable = lazy(() => import('../views/dashboard/RIDER/RiderTabel'));
const SingleRider = lazy(() => import('../views/dashboard/RIDER/SingleRider'));

const DashboardSales = lazy(() => import('../views/dashboard/DashSales/index'));

const Typography = lazy(() => import('../views/ui-elements/basic/BasicTypography'));
const Color = lazy(() => import('../views/ui-elements/basic/BasicColor'));

const FeatherIcon = lazy(() => import('../views/ui-elements/icons/Feather'));
const FontAwesome = lazy(() => import('../views/ui-elements/icons/FontAwesome'));
const MaterialIcon = lazy(() => import('../views/ui-elements/icons/Material'));

const Login = lazy(() => import('../views/auth/login'));
const Register = lazy(() => import('../views/auth/register'));

const Sample = lazy(() => import('../views/sample'));
const AddUser = lazy(() => import('../views/users/addUser'));
const AllUser = lazy(() => import('../views/users/allUser'));
const AddProducts = lazy(() => import('../views/products/addProducts'));
const AddProducts2 = lazy(() => import('../views/products/addProducts_redesigned'));

const AllProducts = lazy(() => import('../views/products/allProducts'));
const ProductDiscount = lazy(() => import('../views/products/productDiscount'));
const AddCategory = lazy(() => import('../views/product-category/addCategory'));
const AllCategory = lazy(() => import('../views/product-category/allCategory'));
const AddSubCategory = lazy(() => import('../views/product-subCategory/addsubCategory'));
const AllSubCategory = lazy(() => import('../views/product-subCategory/allsubCategory'));
const AddProductBrand = lazy(() => import('../views/product-Brand/addbrands'));
const AllProductBrand = lazy(() => import('../views/product-Brand/allbrands'));
const Editcategorydata = lazy(() => import('../views/editCategory/editCategory'));
const AddAppBanner = lazy(() => import('../views/homeApp-banner/addappbanner'));
const AllAppBanner = lazy(() => import('../views/homeApp-banner/allappbanner'));
const Unverifiedusers = lazy(() => import('../views/users/unverifiedusers'));
const CreateStoreStep1 = lazy(() => import('../views/create-store/Step1BasicVendorSignup'));
const CreateStoreStep2 = lazy(() => import('../views/create-store/Step2StoreBasicDetails'));
const CreateStoreStep3 = lazy(() => import('../views/create-store/Step3BusinessDetails'));
const CreateStoreStep4 = lazy(() => import('../views/create-store/Step4AdditionalCertificates'));
const CreateStoreStep5 = lazy(() => import('../views/create-store/Step5BankDetails'));
const CreateStoreReview = lazy(() => import('../views/create-store/ApplicationReview'));
const StoreHome = lazy(() => import('../views/store/home'));
const StoreNotifications = lazy(() => import('../views/store/notifications'));
const StoreMyAccount = lazy(() => import('../views/store/myAccount'));
const EditAccount = lazy(() => import('../views/store/account/EditAccount'));
const ChangePassword = lazy(() => import('../views/store/account/ChangePassword'));
const ShopProfile = lazy(() => import('../views/store/account/ShopProfile'));
const ShopStatus = lazy(() => import('../views/store/account/ShopStatus'));
const BankInfo = lazy(() => import('../views/store/account/BankInfo'));

const MainRoutes = {
  path: '/',
  children: [
    {
      path: '/',
      element: <AdminLayout />,
      children: [
        {
          path: '/dashboard',
          element: <RoleBasedDashboard><DashboardSales /></RoleBasedDashboard>
        },
        {
          path: '/new-home',
          element: <ProtectedRoute allowedRoles={["vendor"]}><StoreHome /></ProtectedRoute>
        },
        {
          path: '/dashboard2',
          element: <DashSales2 />
        },
        {
          path: '/typography',
          element: <Typography />
        },
        {
          path: '/color',
          element: <Color />
        },
        {
          path: '/icons/Feather',
          element: <FeatherIcon />
        },
        {
          path: '/icons/font-awesome-5',
          element: <FontAwesome />
        },
        {
          path: '/icons/material',
          element: <MaterialIcon />
        },

        {
          path: '/sample-page',
          element: <Sample />
        },

        {
          path: '/add-users',
          element: <AddUser />
        },

        {
          path: '/all-users',
          element: <AllUser />
        },
        {
          path: '/all-unverified-vendors',
          element: <Unverifiedusers user={"vendors"} />
        },
        {
          path: '/all-unverified-rider',
          element: <Unverifiedusers user={"delivery_partners"}  />
        },

        {
          path: '/add-Products',
          element: <AddProducts />
        },
        {
          path: '/add-products',
          element: <AddProducts />
        },
        {
          path: '/new-product',
          element: <AddProducts />
        },
        {
          path: '/products/update/:id',
          element: <UpdateProduct />
        },
        {
          path: '/update-product',
          element: <UpdateProduct />
        },

        {
          path: '/products',
          element: <AllProducts />
        },
        {
          path: '/all-products',
          element: <AllProducts />
        },
        {
          path: '/store/notifications',
          element: <ProtectedRoute allowedRoles={["vendor"]}><StoreNotifications /></ProtectedRoute>
        },
        {
          path: '/store/my-account',
          element: <ProtectedRoute allowedRoles={["vendor"]}><StoreMyAccount /></ProtectedRoute>
        },
        {
          path: '/my-account',
          element: <ProtectedRoute allowedRoles={["vendor"]}><StoreMyAccount /></ProtectedRoute>
        },
        {
          path: '/edit-account',
          element: <ProtectedRoute allowedRoles={["vendor"]}><EditAccount /></ProtectedRoute>
        },
        {
          path: '/changepassword',
          element: <ProtectedRoute allowedRoles={["vendor"]}><ChangePassword /></ProtectedRoute>
        },
        {
          path: '/change-password',
          element: <ProtectedRoute allowedRoles={["vendor"]}><ChangePassword /></ProtectedRoute>
        },
        {
          path: '/shopprofile',
          element: <ProtectedRoute allowedRoles={["vendor"]}><ShopProfile /></ProtectedRoute>
        },
        {
          path: '/shopstatus',
          element: <ProtectedRoute allowedRoles={["vendor"]}><ShopStatus /></ProtectedRoute>
        },
        {
          path: '/bankinfo',
          element: <ProtectedRoute allowedRoles={["vendor"]}><BankInfo /></ProtectedRoute>
        },
        {
          path: '/products/:id',        // 👈 Yeh pehle likha hai
          element: <SingleProduct />
        },

        {
          path: '/products-discount',
          element: <ProductDiscount />
        },

        {
          path: '/add-category',
          element: <AddCategory />
        },

        {
          path: '/all-category',
          element: <AllCategory />
        },

        {
          path: '/add-subcategory',
          element: <AddSubCategory />
        },

        {
          path: '/all-subcategory',
          element: <AllSubCategory />
        },

        {
          path: '/add-Product-Brand',
          element: <AddProductBrand />
        },

        {
          path: '/all-Product-Brands',
          element: <AllProductBrand />
        },
        
        {
          path: '/edit-category-data',
          element: <Editcategorydata />
        },
        {
          path: '/all-orders',
          element: <Orders />
        },
        {
          path: '/orders/:orderId',
          element: <Orders />
        },                                                                                                                                                                                                        
        {
          path: '/all-banner',
          element: <AllAppBanner />
        },
        
        // {
        //   path: '/vendor-type',
        //   element:<ProtectedRoute><VendorTypeList /></ProtectedRoute>
        // },
        // {
        //   path: '/vendors/',
        //   element:<ProtectedRoute allowedRoles={["admin"]}><VendorTable /></ProtectedRoute>
        // },
        {
          path: '/vendor-type',
          element: <VendorTypeList />
        },
        {
          path: '/vendors/',
          element: <VendorTable />
        },
        {
          path: '/vendors/:id',
          element: <SingleVendor/>
        },
        {
          path: '/riders/',
          element: <RiderTable />
        },
        {
          path: '/riders/:id',
          element: <SingleRider/>
        },
        {
          path: '/create-store/step-1',
          element: <CreateStoreStep1 />
        },
        {
          path: '/create-store/step-2',
          element: <CreateStoreStep2 />
        },
        {
          path: '/create-store/step-3',
          element: <CreateStoreStep3 />
        },
        {
          path: '/create-store/step-4',
          element: <CreateStoreStep4 />
        },
        {
          path: '/create-store/step-5',
          element: <CreateStoreStep5 />
        },
        {
          path: '/application-review',
          element: <CreateStoreReview />
        }
      ]
    },
    {
      path: '/',
      element: <GuestLayout />,
      children: [
        {
          path: '/login',
          element: <Login />
        },
        {
          path: '/register',
          element: <Register />
        }
      ]
    }
  ]
};

export default MainRoutes;
