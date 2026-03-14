import 'bootstrap/dist/css/bootstrap.min.css';
import './Navbar.css';
import React from 'react';
import { Nav, Navbar, Container } from 'react-bootstrap';
import Cookies from 'js-cookie';
import axios from 'axios';

interface NavbarProps {
  setSateButton: React.Dispatch<React.SetStateAction<boolean>>;
}

const NavbarComponent: React.FC<NavbarProps> = () => {
  const isLoggedIn = !!Cookies.get('accessToken');

  const handleLogout = async () => {
    await axios.post('/api/auth/logout', {}, { withCredentials: true });
    Cookies.remove('accessToken');
    window.location.href = '/';
  };

  return (
    <Navbar expand="lg">
      <Container fluid>
        <Navbar.Brand href="/Home">ONIGIRI</Navbar.Brand>
        <Navbar.Toggle aria-controls="navbarScroll" />
        <Navbar.Collapse id="navbarScroll">
          <Nav className="me-auto my-2 my-lg-0" style={{ maxHeight: '100px' }} navbarScroll>
            <Nav.Link href="/catalog">Anime</Nav.Link>
            <Nav.Link href="/characters">Characters</Nav.Link>
          </Nav>
          <Nav className="ms-auto my-2 my-lg-0 align-items-center gap-2">
            {isLoggedIn
              ? <Nav.Link onClick={handleLogout} style={{ cursor: 'pointer' }}>Log Out</Nav.Link>
              : <Nav.Link href="/">Login</Nav.Link>
            }
            <Nav.Link href="/profile">Profile</Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default NavbarComponent;
