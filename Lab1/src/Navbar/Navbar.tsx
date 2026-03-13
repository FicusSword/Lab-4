import 'bootstrap/dist/css/bootstrap.min.css';
import './Navbar.css';
import React from 'react';
import { Nav, Navbar, Container } from 'react-bootstrap';

interface NavbarProps {
  setSateButton: React.Dispatch<React.SetStateAction<boolean>>;
}

const NavbarComponent: React.FC<NavbarProps> = () => {
  return (
    <Navbar expand="lg">
      <Container fluid>
        <Navbar.Brand href="/Home">ONIGIRI</Navbar.Brand>
        <Navbar.Toggle aria-controls="navbarScroll" />
        <Navbar.Collapse id="navbarScroll">
          <Nav className="me-auto my-2 my-lg-0" style={{ maxHeight: '100px' }} navbarScroll>
            <Nav.Link href="/catalog">Anime</Nav.Link>
            <Nav.Link href="/characters">Characters</Nav.Link>
            <Nav.Link href="/">Login</Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default NavbarComponent;
