import { Link } from 'react-router-dom';

// react-bootstrap
import { ListGroup, Dropdown, Form } from 'react-bootstrap';

// third party
import FeatherIcon from 'feather-icons-react';

// assets
import avatar2 from 'assets/images/user/avatar-2.svg';
import { useNavigate } from "react-router-dom"; // Import useNavigate from react-router-dom

// -----------------------|| NAV RIGHT ||-----------------------//

export default function NavRight() {
  const navigate = useNavigate(); // Initialize navigate function
  const username=localStorage.getItem("username");
  // const role=localStorage.getItem("role");
  //console.log("All Local Storage Items:");
  Object.entries(localStorage).forEach(([key, value]) => {
    //console.log(`${key}: ${value}`);
  });
  const handleLogout = () => {
    localStorage.clear();
    navigate("/login"); // Change the path if needed
  };
  
  return (
    <ListGroup as="ul" bsPrefix=" " className="list-unstyled">
      <ListGroup.Item as="li" bsPrefix=" " className="pc-h-item">
        <Dropdown>
          <Dropdown.Menu className="dropdown-menu-end pc-h-dropdown drp-search">
            <Form className="px-3">
              <div className="form-group mb-0 d-flex align-items-center">
                <FeatherIcon icon="search" />
                <Form.Control type="search" className="border-0 shadow-none" placeholder="Search here. . ." />
              </div>
            </Form>
          </Dropdown.Menu>
        </Dropdown>
      </ListGroup.Item>
      <ListGroup.Item as="li" bsPrefix=" " className="pc-h-item">
        <Dropdown className="drp-user">
          <Dropdown.Toggle as="a" variant="link" className="pc-head-link arrow-none me-0 user-name">
            <img src={avatar2} alt="userimage" className="user-avatar" />
            <span>
              <span className="user-name">{username}</span>
            </span>
          </Dropdown.Toggle>
          <Dropdown.Menu className="dropdown-menu-end pc-h-dropdown">
            <Dropdown.Header className="pro-head">
            </Dropdown.Header>
            <Link to="#" className="dropdown-item"onClick={handleLogout}>
              <i className="material-icons-two-tone">chrome_reader_mode</i> Logout
            </Link>
          </Dropdown.Menu>
        </Dropdown>
      </ListGroup.Item>
    </ListGroup>
  );
}
