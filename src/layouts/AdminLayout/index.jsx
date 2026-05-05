import { useContext, useEffect, Suspense } from 'react';
import { Outlet } from 'react-router-dom';

// project imports
import MobileHeader from './MobileHeader';
import Navigation from './Navigation';
import NavBar from './NavBar';
import Breadcrumb from './Breadcrumb';
import useWindowSize from 'hooks/useWindowSize';
import { ConfigContext } from 'contexts/ConfigContext';
import * as actionType from 'store/actions';
import Loader from 'components/Loader/Loader';
import SessionManager from '../../components/SessionManager/SessionManager';
import useDashboard from './useDashboard';

// -----------------------|| ADMIN LAYOUT ||-----------------------//

export default function AdminLayout() {
  const windowSize = useWindowSize();
  const configContext = useContext(ConfigContext);
  const bodyElement = document.body;
  const { collapseLayout, collapseMenu } = configContext.state;
  const { dispatch } = configContext;
 const { notifications, addNotification, clearNotifications } = useDashboard();
  useEffect(() => {
    if (windowSize.width > 992 && windowSize.width <= 1024) {
      dispatch({ type: actionType.COLLAPSE_MENU });
    }
  }, [dispatch, windowSize]);

  if (windowSize.width > 992 && collapseLayout) {
    bodyElement.classList.add('minimenu');
  } else {
    bodyElement.classList.remove('minimenu');
  }

  let containerClass = ['pc-container'];
  // Add margin-left 80px if sidebar is collapsed
  const containerStyle = collapseMenu ? { marginLeft: 80 } : {};

  let adminlayout = (
    <>
      <SessionManager /> {/* Add SessionManager here */}
      <MobileHeader />
      <NavBar />

      <Navigation />
      <div className={containerClass.join(' ')} style={containerStyle}>
        <div className="pcoded-content">
          <>
            <div className="d-block  d-sm-none ">
            </div>
              {/* <Breadcrumb /> */}
            <Suspense fallback={<Loader />}>
              <Outlet />
            </Suspense>
          </>
        </div>
      </div>
    </>
  );

  return <>{adminlayout}</>;
}
