import { useContext } from 'react';

// project imports
import NavLeft from './NavLeft';
import NavRight from './NavRight';
import { ConfigContext } from 'contexts/ConfigContext';
import Breadcrumb from '../Breadcrumb';

// -----------------------|| NAV BAR ||-----------------------//

export default function NavBar() {
  const configContext = useContext(ConfigContext);
  const { headerBackColor, collapseTabMenu, collapseHeaderMenu, collapseMenu } = configContext.state;

  let headerClass = ['pc-header', headerBackColor];
  if (collapseHeaderMenu) {
    headerClass = [...headerClass, 'mob-header-active'];
  }

  let mobDrpClass = ['me-auto pc-mob-drp t'];
  if (collapseTabMenu) {
    mobDrpClass = [...mobDrpClass, 'mob-drp-active'];
  }

  // Set left 90px if sidebar is collapsed
  const headerStyle = collapseMenu ? { left: 80, position: 'fixed', width: 'calc(100% - 90px)', zIndex: 1100 } : {};

  let navBar = (
    <>
      <div className="header-wrapper">

    <div className="d-none d-sm-block w-100">
  <Breadcrumb />
</div>
        <div className={mobDrpClass.join(' ')}>

          <NavLeft />
        </div>
        <div className="ms-auto">
          <NavRight />
        </div>
      </div>
      {(collapseTabMenu || collapseHeaderMenu) && <div className="pc-md-overlay" />}
    </>
  );

  return <header className={headerClass.join(' ')} style={headerStyle}>{navBar}</header>;
}
