// import { useContext } from 'react';

// // project imports
// import NavContent from './NavContent';
// import { ConfigContext } from 'contexts/ConfigContext';
// import useWindowSize from 'hooks/useWindowSize';
// import navigation from 'menu-items';
// import navitemcollapse from 'menu-items-collapse';
// import * as actionType from 'store/actions';

// // assets
// import avatar2 from 'assets/images/user/avatar-2.svg';

// // -----------------------|| NAVIGATION ||-----------------------//

// export default function Navigation() {
//   const configContext = useContext(ConfigContext);
//   const { collapseMenu, collapseLayout } = configContext.state;
//   const windowSize = useWindowSize();
//   const { dispatch } = configContext;

//   const navToggleHandler = () => {
//     dispatch({ type: actionType.COLLAPSE_MENU });
//   };

//   let navClass = 'dark-sidebar';

//   let navContent = <NavContent navigation={collapseLayout ? navitemcollapse.items : navigation.items} />;
//   navClass = [...navClass, 'pc-sidebar'];
//   if (windowSize.width <= 1024 && collapseMenu) {
//     navClass = [...navClass, 'mob-sidebar-active'];
//   } else if (collapseMenu) {
//     navClass = [...navClass, 'navbar-collapsed'];
//   }

//   let navBarClass = ['navbar-wrapper'];

//   let mobileOverlay = <></>;
//   if (windowSize.width <= 1024 && collapseMenu) {
//     mobileOverlay = <div className="pc-menu-overlay" onClick={navToggleHandler} aria-hidden="true" />;
//   }

//   let navContentDOM = <div className={navBarClass.join(' ')}>{navContent}</div>;

//   return (
//     <nav className={navClass.join(' ')}>
//       {navContentDOM}
//       {mobileOverlay}
//     </nav>
//   );
// }

import React, { useContext, useState, useEffect } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
// Ant Design components
import { Menu, Layout, Avatar, Typography, Badge, Tooltip, Button } from 'antd';
import {
  HomeOutlined,
  PictureOutlined,
  UserOutlined,
  ShopOutlined,
  TagOutlined,
  AppstoreOutlined,
  ShoppingCartOutlined,
  FileTextOutlined,
  CarOutlined,
  SettingOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  BellOutlined,
  CloseOutlined
} from '@ant-design/icons';
// project imports
import { ConfigContext } from 'contexts/ConfigContext';
import useWindowSize from 'hooks/useWindowSize';
import navigation from 'menu-items';
import navitemcollapse from 'menu-items-collapse';
import * as actionType from 'store/actions';
// assets
import avatar2 from 'assets/images/user/avatar-2.svg';

const { Sider } = Layout;
const { Title, Text } = Typography;

// Icon mapping for menu items
const iconMap = {
  home: <HomeOutlined />,
  group: <UserOutlined />,
  people_alt: <UserOutlined />,
  person_add: <UserOutlined />,
  history_edu: <TagOutlined />,
  add_shopping_cart: <ShoppingCartOutlined />,
  storefront: <ShopOutlined />,
  apartment: <ShopOutlined />,
  two_wheeler: <CarOutlined />,
  default: <AppstoreOutlined />
};

// Get appropriate icon based on iconname
const getIcon = (iconname) => {
  return iconMap[iconname] || iconMap.default;
};

// Convert menu items to Ant Design format
const convertMenuItems = (items) => {
  return items.flatMap(item => {
    if (item.type === 'group') {
      // Skip group titles, just return their children
      return item.children ? convertMenuItems(item.children) : [];
    } else if (item.type === 'collapse') {
      return [{
        key: item.id,
        icon: getIcon(item.iconname),
        label: item.title,
        children: item.children ? convertMenuItems(item.children) : []
      }];
    } else if (item.type === 'item') {
      return [{
        key: item.id,
        icon: getIcon(item.iconname),
        label: item.url ? <Link to={item.url}>{item.title}</Link> : item.title,
        url: item.url
      }];
    }
    return [];
  });
};

// Get group titles based on ID
const getGroupTitle = (groupId) => {
  const groupTitles = {
    'navigation-group': 'Navigation',
    'banner-group': 'App Management',
    'users-group': 'User Management',
    'vendortype-group': 'Vendor Types',
    'brands-group': 'Brand Management',
    'category-group': 'Category Management',
    'products-group': 'Product Management',
    'orders-group': 'Order Management',
    'vendor-group': 'Vendor Management',
    'rider-group': 'Rider Management',
    'category-div-data': 'Category Data',
    'create-store-group': 'Create Store'
  };
  return groupTitles[groupId] || 'Menu';
};

// -----------------------|| MODERN NAVIGATION ||-----------------------//

export default function ModernNavigation() {
  const configContext = useContext(ConfigContext);
  const { collapseMenu, collapseLayout } = configContext.state;
  const windowSize = useWindowSize();
  const { dispatch } = configContext;
  const location = useLocation();
  const navigate = useNavigate();
  
  const [selectedKeys, setSelectedKeys] = useState(['dashboard']);
  const [openKeys, setOpenKeys] = useState([]);

  useEffect(() => {
    // Find current menu item and its parent based on location
    const findCurrentItemAndParent = (items, path, parentId = null) => {
      for (const item of items) {
        // Check for exact match first
        if (item.url === path) {
          return { currentKey: item.id, parentKey: parentId };
        }
        
        // Check for dynamic route match  IF ANY ERROR ACCURED TO LINE 169 TO 181 COMMENT KR DENA 
        if (item.url && item.url.includes(':')) {
          const urlPattern = item.url.replace(/:[^/]+/g, '[^/]+');
          const regex = new RegExp(`^${urlPattern}$`);
          if (regex.test(path)) {
            return { currentKey: item.id, parentKey: parentId };
          }
        }
        
        // Check for base path match (e.g., /vendors matches /vendors/123)
        if (item.url && !item.url.includes(':') && path.startsWith(item.url + '/')) {
          return { currentKey: item.id, parentKey: parentId };
        }
        
        if (item.children) {
          const found = findCurrentItemAndParent(item.children, path, item.id);
          if (found) return found;
        }
      }
      return null;
    };

    const result = findCurrentItemAndParent(navigation.items, location.pathname);
    if (result) {
      setSelectedKeys([result.currentKey]);
      // Keep parent menu open if item is inside a collapse menu
      if (result.parentKey) {
        setOpenKeys(prev => [...new Set([...prev, result.parentKey])]);
      }
    }
  }, [location.pathname]);

  const navToggleHandler = () => {
    dispatch({ type: actionType.COLLAPSE_MENU });
  };

  const handleMenuClick = (e) => {
    const item = findMenuItem(navigation.items, e.key);
    if (item && item.url) {
      // navigate(item.url); // Use React Router navigation
    }
  };

  const findMenuItem = (items, key) => {
    for (const item of items) {
      if (item.id === key) return item;
      if (item.children) {
        const found = findMenuItem(item.children, key);
        if (found) return found;
      }
    }
    return null;
  };

  const isMobile = windowSize.width <= 1024;
  const siderWidth = isMobile ? '80vw' : (collapseMenu ? 80 : 280);

  // On mobile, always show full menu; on desktop, respect collapseLayout
  const menuItems = isMobile
    ? convertMenuItems(navigation.items)
    : convertMenuItems(collapseLayout ? navitemcollapse.items : navigation.items);

  return (
    <>
      {/* Only render Sider on mobile if collapseMenu is true, always render on desktop */}
      {(!isMobile || (isMobile && collapseMenu)) && (
        <Sider
          theme="light"
          width={siderWidth}
          collapsed={collapseMenu && !isMobile}
          collapsible
          trigger={null}
          className={`modern-sidebar${isMobile && collapseMenu ? ' mob-sidebar-active' : ''}`}
          style={{
            position: 'fixed',
            left: 0,
            top: 0,
            bottom: 0,
            zIndex: 3000,
            boxShadow: '2px 0 8px rgba(0,0,0,0.1)',
            background: '#fff',
            maxWidth: isMobile ? '80vw' : undefined,
            minWidth: isMobile ? '80vw' : undefined,
            width: isMobile ? '80vw' : undefined
          }}
        >
          {/* Mobile Close Button */}
          {isMobile && (
            <Button
              type="text"
              icon={<CloseOutlined style={{ fontSize: 20 }} />}
              onClick={navToggleHandler}
              style={{
                position: 'absolute',
                top: 16,
                right: 16,
                zIndex: 1100,
                color: '#fff',
                background: 'rgba(0,0,0,0.3)'
              }}
            />
          )}
          {/* Header */}
          {/* <div className="sidebar-header" style={{ 
            padding: '16px', 
            textAlign: 'center', 
            borderBottom: '1px solid #f0f0f0',
            background: 'linear-gradient(135deg, #1890ff 0%, #096dd9 100%)'
          }}>
            {!collapseMenu ? (
              <div>
                <Title level={4} style={{ color: 'white', margin: 0 }}>
                  Admin Panel
                </Title>
                <Text style={{ color: 'rgba(255,255,255,0.8)', fontSize: '12px' }}>
                  Management System
                </Text>
              </div>
            ) : (
              <Avatar size={40} style={{ backgroundColor: '#1890ff' }}>
                A
              </Avatar>
            )}
          </div> */}

          {/* User Profile Section */}
          <div className="user-profile bg-primary" style={{ 
            padding: '16px', 
            borderBottom: '1px solid #303030',
          
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px'}}>
              <Avatar style={{border:"1px solid white",background:"white", padding:2 }} size={collapseMenu ? 40 : 40} src={avatar2} />
              {!collapseMenu && (
                <div style={{ flex: 1 }}>
                  <Text style={{ color: 'white', fontWeight: 500, display: 'block' }}>
                    John Doe
                  </Text>
                  <Text style={{ color: 'rgba(255,255,255,0.6)', fontSize: '12px' }}>
                    Administrator
                  </Text>
                </div>
              )}
              {!collapseMenu && (
                <Badge count={5} size="small">
                  <BellOutlined style={{ color: 'rgba(255,255,255,0.6)', fontSize: '16px' }} />
                </Badge>
              )}
            </div>
          </div>



          {/* Menu */}
          <Menu
            mode="inline"
            theme="light"
            selectedKeys={selectedKeys}
            openKeys={openKeys}
            onOpenChange={setOpenKeys}
            onClick={handleMenuClick}
            items={menuItems}
            style={{ 
              border: 'none',
              background: 'transparent',
              height: 'calc(100vh - 200px)',
              overflowY: 'auto'
            }}
          />

          {/* Toggle Button */}
          <div style={{ 
            position: 'absolute', 
            bottom: '16px', 
            left: '50%', 
            transform: 'translateX(-50%)',
            width: collapseMenu ? 'auto' : '90%'
          }}>
            <Button
              type="primary"
              icon={collapseMenu ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
              onClick={navToggleHandler}
              style={{
                width: '100%',
                borderRadius: '6px',
                minWidth:"32px",
                background: 'linear-gradient(135deg, #088B46 0%,rgb(4, 143, 69) 100%)',
                border: 'none'
              }}
            >
              {!collapseMenu && 'Collapse'}
            </Button>
          </div>
        </Sider>
      )}
      {/* Mobile Overlay */}
      {isMobile && collapseMenu && (
        <div
          className="mobile-overlay"
          onClick={navToggleHandler}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0,0,0,0.5)',
            zIndex: 2999
          }}
        />
      )}
    </>
  );
}

// Enhanced CSS styles (add to your stylesheet)
const navigationStyles = `
.modern-sidebar {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.modern-sidebar .ant-menu-item {
  margin: 4px 8px;
  border-radius: 6px;
  transition: all 0.3s ease;
}

.modern-sidebar .ant-menu-item:hover {
  background: linear-gradient(135deg, #1890ff 0%, #096dd9 100%);
  transform: translateX(4px);
}

.modern-sidebar .ant-menu-item-selected {
  background: linear-gradient(135deg, #1890ff 0%, #096dd9 100%);
  border-radius: 6px;
  color: white;
}

.modern-sidebar .ant-menu-submenu-title {
  margin: 4px 8px;
  border-radius: 6px;
  transition: all 0.3s ease;
}

.modern-sidebar .ant-menu-submenu-title:hover {
  background: rgba(24, 144, 255, 0.1);
  color: #1890ff;
}

.modern-sidebar .ant-menu-item-group-title {
  color: rgba(255, 255, 255, 0.8);
  font-weight: 500;
  font-size: 11px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  padding: 16px 16px 8px 16px;
}

.modern-sidebar .ant-menu-submenu-arrow {
  transition: transform 0.3s ease;
}

.modern-sidebar .ant-menu-submenu-open .ant-menu-submenu-arrow {
  transform: rotate(90deg);
}

.modern-sidebar::-webkit-scrollbar {
  width: 4px;
}

.ant-menu-root::-webkit-scrollbar-track {
  background: #141414;
}

.ant-menu-root::-webkit-scrollbar-thumb {
  background: #1890ff;
  border-radius: 2px;
}

.ant-menu-root::-webkit-scrollbar-thumb:hover {
  background: #096dd9;
}

@media (max-width: 768px) {
  .ant-menu-root {
    transform: translateX(-100%);
    transition: transform 0.3s ease;
  }
  
  .ant-menu-root.mob-sidebar-active {
    transform: translateX(0);
  }
}
`;

export { navigationStyles };