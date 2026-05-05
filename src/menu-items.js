const menuItems = {
  items: [
    // Navigation Group
    {
      id: 'navigation-group',
      type: 'group',
      icon: 'icon-navigation',
      children: [
        {
          id: 'dashboard',
          title: 'Dashboard',
          type: 'item',
          icon: 'material-icons-two-tone',
          iconname: 'home',
          url: '/dashboard/'
        }
      ]
    },

    // Users Management Group
    {
      id: 'banner-group',
      type: 'group',
      icon: 'icon-support',
      children: [
        {
          id: 'manage-appbanners',
          title: 'App Banners',
          type: 'collapse',
          icon: 'material-icons-two-tone',
          iconname: 'group',
          children: [
            // {
            //   id: 'add-banner',
            //   title: 'Add Banners',
            //   type: 'item',
            //   url: '/add-banner',
            //   classes: 'nav-item',
            //   icon: 'material-icons-two-tone',
            //   iconname: 'person_add'
            // },
            {
              id: 'all-banner',
              title: 'All Banners',
              type: 'item',
              url: '/all-banner',
              classes: 'nav-item',
              icon: 'material-icons-two-tone',
              iconname: 'people_alt'
            }
          ]
        }
      ]
    },

    // Users Management Group
    {
      id: 'users-group',
      type: 'group',
      icon: 'icon-support',
      children: [
        {
          id: 'manage-users',
          title: 'Varification Requests',
          type: 'collapse',
          icon: 'material-icons-two-tone',
          iconname: 'group',
          children: [
            // {
            //   id: 'add-user',
            //   title: 'Add User',
            //   type: 'item',
            //   url: '/add-users',
            //   classes: 'nav-item',
            //   icon: 'material-icons-two-tone',
            //   iconname: 'person_add'
            // },
            // {
            //   id: 'all-users',
            //   title: 'All Users',
            //   type: 'item',
            //   url: '/all-users',
            //   classes: 'nav-item',
            //   icon: 'material-icons-two-tone',
            //   iconname: 'people_alt'
            // },
            {
              id: 'unverified-vendors',
              title: 'All Unverified Vendors',
              type: 'item',
              url: '/all-unverified-vendors',
              classes: 'nav-item',
              icon: 'material-icons-two-tone',
              iconname: 'people_alt'
            },
            {
              id: 'unverified-partners',
              title: 'All Unverified Riders',
              type: 'item',
              url: '/all-unverified-rider',
              classes: 'nav-item',
              icon: 'material-icons-two-tone',
              iconname: 'people_alt'
            }
          ]
        }
      ]
    },



    {
      id: 'vendortype-group',
      type: 'group',
      icon: 'icon-navigation',
      children: [
        {
          id: 'vendortype',
          title: 'Vendor Types',
          type: 'item',
          icon: 'material-icons-two-tone',
          iconname: 'home',
          url: '/vendor-type/'
        }
      ]
    },
     // Brands Group
     {
      id: 'brands-group',
      type: 'group',
      icon: 'icon-support',
      children: [
        {
          id: 'product-brands',
          title: 'Brands',
          type: 'collapse',
          icon: 'material-icons-two-tone',
          iconname: 'history_edu',
          children: [
            {
              id: 'add-product-brand',
              title: 'Add Product Brand',
              type: 'item',
              url: '/add-product-brand',
              classes: 'nav-item',
              icon: 'material-icons-two-tone',
              iconname: 'person_add'
            },
            {
              id: 'all-product-brands',
              title: 'All Product Brands',
              type: 'item',
              url: '/all-product-brands',
              classes: 'nav-item',
              icon: 'material-icons-two-tone',
              iconname: 'people_alt'
            }
          ]
        }
      ]
    },


    // Categories Group
    {
      id: 'category-group',
      type: 'group',
      icon: 'icon-support',
      children: [
        {
          id: 'manage-category',
          title: 'Product Categories',
          type: 'collapse',
          icon: 'material-icons-two-tone',
          iconname: 'history_edu',
          children: [
            {
              id: 'add-category',
              title: 'Add Category',
              type: 'item',
              url: '/add-category',
              classes: 'nav-item',
              icon: 'material-icons-two-tone',
              iconname: 'person_add'
            },
            {
              id: 'all-category',
              title: 'All Categories',
              type: 'item',
              url: '/all-category',
              classes: 'nav-item',
              icon: 'material-icons-two-tone',
              iconname: 'people_alt'
            }
          ]
        },
        {
          id: 'manage-subcategory',
          title: 'Product Sub-Categories',
          type: 'collapse',
          icon: 'material-icons-two-tone',
          iconname: 'history_edu',
          children: [
            {
              id: 'add-subcategory',
              title: 'Add Subcategory',
              type: 'item',
              url: '/add-subcategory',
              classes: 'nav-item',
              icon: 'material-icons-two-tone',
              iconname: 'person_add'
            },
            {
              id: 'all-subcategory',
              title: 'All Subcategories',
              type: 'item',
              url: '/all-subcategory',
              classes: 'nav-item',
              icon: 'material-icons-two-tone',
              iconname: 'people_alt'
            }
          ]
        }
      ]
    },

     // Products Group
     {
      id: 'products-group',
      type: 'group',
      icon: 'icon-support',
      children: [
        {
          id: 'manage-products',
          title: 'Products',
          type: 'collapse',
          icon: 'material-icons-two-tone',
          iconname: 'add_shopping_cart',
          children: [
            {
              id: 'add-product',
              title: 'Add Product',
              type: 'item',
              url: '/add-products',
              classes: 'nav-item',
              icon: 'material-icons-two-tone',
              iconname: 'person_add'
            },
            {
              id: 'all-products',
              title: 'All Products',
              type: 'item',
              url: '/products',
              classes: 'nav-item',
              icon: 'material-icons-two-tone',
              iconname: 'people_alt'
            },
            // {
            //   id: 'product-discount',
            //   title: 'Products Discount',
            //   type: 'item',
            //   url: '/products-discount',
            //   classes: 'nav-item',
            //   icon: 'material-icons-two-tone',
            //   iconname: 'people_alt'
            // }
          ]
        }
      ]
    },
     // order Group
     {
      id: 'orders-group',
      type: 'group',
      icon: 'icon-support',
      children: [
        {
          id: 'manage-orders',
          title: 'Orders',
          type: 'collapse',
          icon: 'material-icons-two-tone',
          iconname: 'add_shopping_cart',
          children: [
         
            {
              id: 'all-orders',
              title: 'All Orders',
              type: 'item',
              url: '/all-orders',
              classes: 'nav-item',
              icon: 'material-icons-two-tone',
              iconname: 'people_alt'
            },
           
          ]
        }
      ]
    },
     // vendor Group
     {
      id: 'vendor-group',
      type: 'group',
      icon: 'icon-support',
      children: [
        {
          id: 'manage-vendor',
          title: 'Vendors',
          type: 'collapse',
          icon: 'material-icons-two-tone',
          iconname: 'storefront',
          children: [
         
            {
              id: 'all-vendors',
              title: 'All Vendors',
              type: 'item',
              url: '/vendors',
              classes: 'nav-item',
              icon: 'material-icons-two-tone',
              iconname: 'apartment'
            },
           
          ]
        }
      ]
    },


// rider Group
{
  id: 'rider-group',
  type: 'group',
  icon: 'icon-delivery', // optional custom icon
  children: [
    {
      id: 'manage-rider',
      title: 'Riders',
      type: 'collapse',
      icon: 'material-icons-two-tone',
      iconname: 'two_wheeler', // Rider/delivery icon
      children: [
        {
          id: 'all-riders',
          title: 'All Riders',
          type: 'item',
          url: '/riders',
          classes: 'nav-item',
          icon: 'material-icons-two-tone',
          iconname: 'two_wheeler' // Rider's vehicle
        }
      ]
    }
  ]
},


  

    {
      id: 'category-div-data',
      type: 'group',
      icon: 'icon-navigation',
      children: [
        {
          id: 'manage-categories',
          title: 'Manage Categories',
          type: 'item',
          icon: 'material-icons-two-tone',
          iconname: 'group',
          url: '/edit-category-data'
        }
      ]
    },
    // Manage Categories Data
    // {
    //   id: 'category-div-data',
    //   type: 'group',
    //   icon: 'icon-support',
    //   children: [
    //     {
    //       id: 'manage-categories',
    //       title: 'Manage Categories',
    //       type: 'item',
    //       url: '/edit-category-data',
    //       icon: 'material-icons-two-tone',
    //       iconname: 'group',
    //     }
    //   ]
    // }
  ]
};

export default menuItems;
