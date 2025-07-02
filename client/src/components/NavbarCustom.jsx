import React, { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import Container from "react-bootstrap/Container";
import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";
import Button from "react-bootstrap/button";
import { NavDropdown } from "react-bootstrap";

// Environment variables must use REACT_APP_ prefix
const businessName = import.meta.env.VITE_BUS_NAME || "MyBusiness"; // Fallback name

const NavbarCustom = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <Navbar bg="dark" variant="dark" expand="lg" className="mb-4">
      <Container>
        <Navbar.Brand as={Link} to="/">
          {businessName}
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto d-flex align-items-center gap-3">
            {user ? (
              <>
                <span className="text-light">Hello, {user.username}!</span>

                
                <NavDropdown title="Customers" id="basic-nav-dropdown">
                  <NavDropdown.Item as={Link} to="/Customers">View all</NavDropdown.Item>
                  <NavDropdown.Divider />
                  <NavDropdown.Item as={Link} to="/Custpomers/add">
                    Add New Client
                  </NavDropdown.Item>
                </NavDropdown>
                <Nav.Link as={Link} to="/Todo">
                  Todo
                </Nav.Link>
                <NavDropdown title="Finance" id="basic-nav-dropdown">
                  <NavDropdown.Item as={Link} to="/finance">Charts</NavDropdown.Item>
                  <NavDropdown.Item as={Link} to="/finance/30day">
                    PDF
                  </NavDropdown.Item>
                </NavDropdown>
                <NavDropdown title="Products" id="basic-nav-dropdown">
                  <NavDropdown.Item as={Link} to="/Products">
                    View all
                  </NavDropdown.Item>
                  <NavDropdown.Item as={Link} to="/Products/new">
                    Add Product
                  </NavDropdown.Item>
                </NavDropdown>
                <Button
                  variant="outline-light"
                  size="sm"
                  onClick={handleLogout}
                >
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Nav.Link as={Link} to="/login">
                  Login
                </Nav.Link>
                <Nav.Link as={Link} to="/register">
                  Register
                </Nav.Link>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default NavbarCustom;
